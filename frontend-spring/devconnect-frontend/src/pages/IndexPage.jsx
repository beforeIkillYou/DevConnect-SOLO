import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';
import Story from '../components/Story';
import Post from '../components/Post';


const IndexPage = (props) => {
    // const [User,setUser] = useState(props.User);
    const User = props.User;

    let Newstory = null;
    let Newstoryurl = "https://i.pinimg.com/736x/84/ab/aa/84abaabe6fff7dda10c6a1ffee2a397a.jpg"

    const [Err, setErr] = useState(null);
    const [Stories  , setStories] = useState([]);
    const [Changestoryform, setChangestoryform] = useState("");
    const [Posts, setPosts] = useState([]); 

    //1.getting current homepage data
    const getHomeData = async()=>{
        await axios.get('http://localhost:8080/posts/get-all-posts')
        .then((res)=>{
            setPosts(res.data);
        })
        .catch((err)=>{
            setErr(err);//if there is error in fethcing home data then go to login
        });

        if(User){
            await axios.get(`http://localhost:8080/users/get-stories/${User?.id}`)
            .then((res)=>{
                setStories(res.data);
            })
            .catch((err)=>{
                setErr(err);//if there is error in fethcing home data then go to login
            });
        }
    }
    useEffect(() =>{
        getHomeData();
    },[]);

    //2. handle story change
    const removeStory = async()=>{
        await axios.delete(`http://localhost:8080/users/delete-story/${User?.id}`)
        .then((res)=>{
            // alert(res.data.username)
            // console.log(res.data)
            localStorage.setItem('user', JSON.stringify(res.data));
            console.log('User data stored with deleted story in localStorage');
            // setUser(res.data);   


            window.location.reload();
        })
        .catch((err)=>{
            console.log('Cant remove the given story, ',err)
        })
    }

    const addStory = async(ev)=>{
        ev.preventDefault();
        
        try{
            if(Newstory){
                const image = new FormData();
                image.append('file', Newstory);
                image.append('upload_preset', 'devconnect');

                const response = await fetch(
                    "https://api.cloudinary.com/v1_1/ddefovwve/image/upload",
                    {
                      method: 'post',
                      body: image
                    },
                  )
                const imgData = await response.json();

                Newstoryurl = imgData.url.toString();
                console.log("story upload succedcfully");
                console.log(Newstoryurl.toString())
            }
        }catch(err){
            console.log(err);
            alert("Stroy upload failed!!")
        }

        try{
            console.log(User.id)
            await axios.post(
                `http://localhost:8080/users/set-story?storyUrl=${Newstoryurl}&userId=${User?.id}`,
            )
            .then((res) => {
                console.log(res.data)
                localStorage.setItem('user', JSON.stringify(res.data));
                console.log('User data stored with new story in localStorage');
                Newstory = null;
                //  setUser(res.data);


                window.location.reload();
            })
            .catch((err)=>{
                console.log("Cant add the given story",err);
            })

        }catch(err){
            //dont need to do anything here maybe
        }
    }       
    const handleStoryChange = () => {
        if(Changestoryform !== ""){ //if button is clicked aagin and thef rom was already there
            setChangestoryform("");
            return;
        }
        //i) if user is having any story then the form gives theoption of removing the story
        if(User?.story){
            setChangestoryform(
                <div>
                    <div >
                        <button onClick={removeStory} className='bg-red-500 saturate-50 hover:bg-red-700 text-white py-1 px-2 border border-red-500 hover:border-red-700 hover:saturate-200 rounded absolute top-[6rem] left-[18.5rem]'>Remove Story</button>
                    </div>
                </div>
            );
        }else{
            setChangestoryform(
                <div className='flex flex-col items-center justify-center absolute top-[6.5rem]'>
                    <form onSubmit={addStory}>
                        <div>
                            <input required type='file' name='story' className='' onChange={(ev) => {Newstory = (ev.target.files[0])}}/>
                        </div>
                        <button type='submit' className='mt-1 bg-green-500 saturate-50 hover:bg-green-700 text-white py-1 px-2 border border-green-500 hover:border-green-700 hover:saturate-200 rounded '>Add Story</button>
                    </form>
                </div>
            )
        }
    }

    //3.if cant get stories data then go to login
    if(Err){
        return <Navigate to={'/login'} />
    }

    
    // console.log(User?.story);
    // console.log(JSON.parse(localStorage.getItem('user')) )
    // console.log(Stories)
    return (
        <>  
            <Navbar User={User}/>
            <div className='ml-64 bg-zinc-950  text-white h-screen overflow-y-auto no-scrollbar'>
                {/* stories here  */}
                <div className='stories h-1/6 bg-zinc-950 shadow-xl mb-28 pl-16 flex flex-row items-center justify-start overflow-x-scroll no-scrollbar' id='stories'>    
                    {/* add story button */}
                    <div className='mr-14'>
                    <button className='flex flex-row' onClick={handleStoryChange}>
                        <img src={User?.avatar} className='w-16 h-16 rounded-full object-cover border-zinc-800 border-2' /> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sticky top-16 right-[72rem] ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                    </div>

                    {/* change story form here */}
                    {Changestoryform}

                    {/* all stories here */}
                    {
                        Stories?.map((story)=>{
                            return(
                                <Story avatar={story?.avatar} story={story?.story} username={story?.username}/>
                            )
                        })
                    }
                </div>

                {/* posts here  */}
                <div className='flex flex-col justify-center items-center ' id='posts'>
                    {
                        Posts.map((postData)=>{
                            return(
                                <Post User={User} postData={postData}/>
                            )
                        })
                    }
                </div>
            </div>
        </>
    );
}

export default IndexPage;
