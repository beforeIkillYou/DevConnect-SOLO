import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate, Link } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';
import Post from '../components/Post';


const ExplorePage = (props) => {
    const User = props.User;
    const Err = props.Err;
    const [allPosts, setAllPost] = useState([])

    if(Err){//if there is error in getting the current user then go to login
        return <Navigate to={'/login'} />
    }


    //  getting all posts
    const getAllPosts = async () => {
        await axios.get('http://localhost:8080/posts/get-all-posts')
        .then((res)=>{
            setAllPost(res.data);
        })
        .catch((err)=>{
            setErr(err);
        });
    }
    useEffect(() =>{
        getAllPosts();
    },[]);


    
    console.log(allPosts);
    return (
        <>  
            <Navbar User={User}/>
            <div className='ml-64 px-32 bg-zinc-950  text-white h-screen overflow-y-auto no-scrollbar grid grid-cols-3 '>
                {
                    allPosts.map((post)=>{
                        return (
                            <>  
                                <div className='my-10 mx-10 items-center align-middle flex flex-col'>
                                <Link
                                to={`/posts/${post.postId}`}
                                post={{Post}}
                                >
                                    <img 
                                        className='h-64 w-64 object-cover  shadow-xl shadow-zinc-900 hover:scale-105 hover:rounded-lg hover:shadow-2xl hover:shadow-zinc-900 duration-300' 
                                        src={post.media}
                                    />
                                    {/* <p className='overflow-hidden'>{post.description}</p> */}
                                </Link>
                                </div>
                                
                                {/* <Post postId={post._id} User={User}/> */}
                            </>
                        )
                    })
                }

            </div>
        </>
    );
}

export default ExplorePage;