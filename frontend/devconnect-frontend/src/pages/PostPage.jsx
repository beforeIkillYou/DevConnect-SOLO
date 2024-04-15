import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate, useParams } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';
import Post from '../components/Post';

const PostPage = (props) => {
    const User = props.User;
    const Err = props.Err;
    const postId = useParams()
    // console.log(postId);

    if(Err){//if there is error in getting the current user then go to login
        return <Navigate to={'/login'} />
    }
    // console.log(postId);
    return (
        <>  
            <Navbar User={User}/>
            <div className='ml-64 bg-zinc-950  text-white h-screen overflow-y-auto no-scrollbar py-[5vw]'>
                <div className='flex flex-col align-middle items-center'>
                    <Post postId={postId.postId} User={User}/>
                </div>  
            </div>
        </>
    );
}

export default PostPage;
