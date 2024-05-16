import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';
import Post from '../components/Post';

const PostPage = (props) => {
    const User = props.User;
    const Err = props.Err;
    const postId = useParams();

    const [PostData, setPostData] = useState("");
    const getPostFromId = async()=>{
        await axios.get(`http://localhost:8080/posts/view-post/${postId.postId}`)
        .then((res)=>{
            console.log(res.data)
            setPostData(res.data)
        })
        .catch((err)=>{console.log(err);})
    }

    if(Err){//if there is error in getting the current user then go to login
        return <Navigate to={'/login'} />
    }
    // console.log(Post);

    useEffect(() => {
        getPostFromId();
    }, [postId]);

    if(Post)
    return (
        <>  
            <Navbar User={User}/>
            <div className='ml-64 bg-zinc-950  text-white h-screen overflow-y-auto no-scrollbar py-[5vw]'>
                <div className='flex flex-col align-middle items-center'>
                    <Post User={User} postData={PostData} />
                </div>  
            </div>
        </>
    );
    else
    return<></>
}

export default PostPage;
