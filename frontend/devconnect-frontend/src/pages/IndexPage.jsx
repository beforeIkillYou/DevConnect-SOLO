import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';
import Story from '../components/Story';
import Post from '../components/Post';


const IndexPage = (props) => {
    const User = props.User;
    let Newstory = null;

    const [Err, setErr] = useState(null);
    const [Stories  , setStories] = useState([]);
    const [Changestoryform, setChangestoryform] = useState("");
    const [Posts, setPosts] = useState([]); 

    //1.getting current homepage data
    const getHomeData = async()=>{
        await axios.get('/api/v1/users/homepage')
        .then((res)=>{
            setStories(res.data.data.stories);
            setPosts(res.data.data.posts);
        })
        .catch((err)=>{
            setErr(err);//if there is error in fethcing home data then go to login
        });
    }
    useEffect(() =>{
        getHomeData();
    },[]);

    //2. handle story change
    const removeStory = async()=>{
        await axios.delete('/api/v1/users/remove-story')
        .then((res)=>{})
        .catch((err)=>{
            console.log('Cant remove the given story, ',err)
        })
    }
    const addStory = async(ev)=>{
        ev.preventDefault();
        
        // console.log(Newstory)
        const formData = new FormData();
        formData.append('story',Newstory);

        try{
            await axios.post(
                '/api/v1/users/add-story',
                formData
            )
            .then((res) => {})
            .catch((err)=>{
                console.log("Cant add the given story",err);
            })
            Newstory=null; //after adding the newStory the varabile becomes null again
            window.location.reload();
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
                    <form onSubmit={removeStory}>
                        <button type='submit' className='bg-red-500 saturate-50 hover:bg-red-700 text-white py-1 px-2 border border-red-500 hover:border-red-700 hover:saturate-200 rounded absolute top-[6rem] left-[18.5rem]'>Remove Story</button>
                    </form>
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


    // console.log(Posts);
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
                        Stories.map((story)=>{
                            return(
                                <Story avatar={story?.avatar} story={story?.story} username={story?.username}/>
                            )
                        })
                    }
                </div>

                {/* posts here  */}
                <div className='flex flex-col justify-center items-center ' id='posts'>
                    {
                        Posts.map((postId)=>{
                            return(
                                <Post postId={postId} User={User}/>
                            )
                        })
                    }
                </div>
            </div>
        </>
    );
}

export default IndexPage;
