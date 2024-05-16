import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';


const CreatePage = (props) => {
    const User = props.User;
    const Err = props.Err;
    const [title, settitle] = useState("");
    const [description, setdescription] = useState("");
    
    const [media, setmedia] = useState(null);
    let mediaUrl = "https://i.pinimg.com/236x/92/6d/e4/926de49fada55e29b0401ec3e705a450.jpg"
    const uploadImage = async(e) => {
        e.preventDefault();
  
        try{
          if(media){
            const image = new FormData();
            image.append('file', media);
            image.append('upload_preset', 'devconnect');
            
            const response = await fetch(
              "https://api.cloudinary.com/v1_1/ddefovwve/image/upload",
              {
                method: 'post',
                body: image
              },
            )
            const imgData = await response.json();
            // setmediaURL(imgData.url.toString());
            mediaUrl = imgData.url.toString();
            console.log("image upload succedcfully");
  
            // console.log(response);
            // console.log(imgData.url.toString())
            console.log(mediaUrl)
            // console.log(imgData);
          }
  
        }catch(err){
          console.log(err,"media image upload failed ");
        }
      }
  

     //funciton to create post
    async function createPost(ev){
        ev.preventDefault();

        try{
            // console.log(Avatar)
            await uploadImage(ev);
        }catch(e) {
            console.log(e);
            alert("Image upload failed!!")
        }

        const formData = new FormData();
        formData.append('media', mediaUrl);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('ownerId',User.id)
        const data = Object.fromEntries(formData);
        console.log(data);

        await axios.post(
            "http://localhost:8080/posts/create-post",
            data
        )
        .then((res)=>{
            console.log(res.data)
            alert("Post Created Successfully!",res.data.message);
        })
        .catch((err)=>{
            alert("Post was not created")
            console.log("Cant create the post",err);
         })
    }

    if(Err){//if there is error in getting the current user then go to login
        return <Navigate to={'/login'} />
    }

    return (
        <>  
            <Navbar User={User}/>
            <div className='ml-64 bg-zinc-950 text-white h-screen overflow-y-auto no-scrollbar'>

                <form 
                className='items-center bg-zinc-900 mx-20 py-5 my-28 hover:shadow-lg  hover:shadow-zinc-800 duration-300 rounded-lg'
                onSubmit={createPost}>
                    {/* media input */}
                    <div className='my-10 mx-10 items-center align-middle flex flex-row gap-x-16'>
                        <label className='text-xl font-semibold font-mono text-white '>Media</label>
                        <input 
                            type='file' 
                            className='border-1 mx-10  border-zinc-900 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-zinc-900' 
                            placeholder='Enter media url' 
                            name='media' 
                            onChange={(ev)=>{setmedia(ev.target.files[0])}}
                            required
                        />
                    </div>

                    {/* title input */}
                    <div className='my-10 mx-10 items-center align-middle flex flex-row text-black gap-x-20'>
                        <label className='text-xl font-semibold font-mono text-white'>Title</label>
                        <input 
                            type='text' 
                            className='border-1 mx-10  border-zinc-900 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-zinc-900' 
                            name='title' 
                            placeholder="Title your post..." 
                            onChange={(ev) => {settitle(ev.target.value)}}
                            required
                        />
                    </div>

                    {/* description input */}
                    <div className='my-10 mx-10 items-center align-middle flex flex-row text-black gap-x-4'>
                        <label className='text-xl font-semibold font-mono text-white '>Description</label>
                        <input 
                            type='text' 
                            className='border-1 mx-10  border-zinc-900 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-zinc-900' 
                            placeholder="Describe your post..." 
                            name='Description' 
                            onChange={(ev) => {setdescription(ev.target.value)}}
                            required
                        />
                    </div>

                    <button type='submit' className='mx-[32vw] font-semibold text-lg'>Create Post!</button>
                </form>
            </div>
        </>
    );
}

export default CreatePage;
