import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';
import Story from '../components/Story';



const IndexPage = (props) => {
    const User = props.User;
    const Err = props.Err;
    const [Stories  , setStories] = useState([]);
    const [Posts, setPosts] = useState([]); 

    if(Err){//if there is error in getting the current user then go to login
        return <Navigate to={'/login'} />
    }

    //1.getting current homepage data
    const getHomeData = async()=>{
        await axios.get('/api/v1/users/homepage')
        .then((res)=>{
            setStories(res.data.data.stories);
            setPosts(res.data.data.posts);
        })
        .catch((err)=>console.log("Failed to get home data",err));
    }
    useEffect(() =>{
        getHomeData();
    },[]);


    // console.log(Stories);
    return (
        <>  
            <Navbar User={User}/>
            <div className='ml-64 bg-zinc-900  text-white h-screen overflow-y-auto'>
                {/* stories here  */}
                <div className='stories h-1/6 bg-zinc-900 shadow-xl mb-28 pl-16 flex flex-row items-center justify-start overflow-x-scroll no-scrollbar' id='stories'>    
                    {/* <Story avatar={User?.avatar} story={User?.story}/> */}
                    {
                        Stories.map((story,index)=>{
                            return(
                                <Story avatar={story?.avatar} story={story?.story}/>
                            )
                        })
                    }
                </div>

                {/* posts here  */}
                <div className='flex flex-col justify-center items-center ' id='posts'>
                    <div className=' w-1/2 h-[40rem]  bg-zinc-800 shadow-2xl shadow-inherit rounded-lg mb-28'>Post1</div>
                    <div className=' w-1/2 h-[40rem]  bg-zinc-800 shadow-2xl shadow-inherit rounded-lg mb-28'>Post2</div>
                    <div className=' w-1/2 h-[40rem]  bg-zinc-800 shadow-2xl shadow-inherit rounded-lg mb-28'>Post3</div>
                </div>
            </div>
        </>
    );
}

export default IndexPage;
