import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';


const NotificationsPage = (props) => {
    const User = props.User;
    const Err = props.Err;
    const [comments, setcomments] = useState([]);

    if(Err){//if there is error in getting the current user then go to login
        return <Navigate to={'/login'} />
    }
    
    const getAllCommentsofCurrentUser= async()=>{
        await axios.get('/api/v1/comments/get-comments-of-current-user')
        .then((res) => {
            setcomments(res.data.data.comments);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    useEffect(()=>{
        getAllCommentsofCurrentUser();
    },[])

    // console.log(comments);
    return (
        <>  
            <Navbar User={User}/>
            <div className='ml-64 bg-zinc-950 text-white h-screen overflow-y-auto no-scrollbar flex flex-col items-center align-middle'>
               
                {
                    comments.map((comment)=>{
                        return (
                            <div id='commentNotifcation' className=' h-1/4 w-3/4 my-8 bg-zinc-900 flex flex-row justify-around items-center hover:-translate-y-2 hover:rounded-xl duration-300'>
                                <div className='w-2/6'>
                                    <img src={comment?.post?.media} className='h-28 w-28 rounded-xl object-cover mx-4 mr-10'/>
                                </div>

                                <div className='w-3/6'>
                                {comment?.text}
                                </div>

                                <div className='text-bold font-semibold w-1/6  text-center'>
                                    Likes: {comment?.likes?.length}
                                </div>
                            </div>
                        )
                    })
                }
                {/* <div id='commentNotifcation' className=' h-1/5 w-3/4 my-8 bg-zinc-900 flex flex-row align-middle items-center hover:-translate-y-2 hover:rounded-xl duration-300'>
                    <div>
                        <img src={comments[0]?.post.media} className='h-28 w-28 rounded-xl object-cover mx-4 mr-10'/>
                    </div>

                    <div>
                       {comments[0]?.text}
                    </div>

                    <div className='text-bold font-semibold absolute right-[13vw]'>
                        Likes: {comments[0]?.likes.length}
                    </div>
                </div> */}
            </div>
        </>
    );
}

export default NotificationsPage;
