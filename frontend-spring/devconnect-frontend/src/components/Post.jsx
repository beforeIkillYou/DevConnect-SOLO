import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FILLED_HEART,EMPTY_HEART, DUSTBIN } from '../Constants';


const Post = (props) => {
    const postId = props.postId;
    const [Post, setPost] = useState("");
    const [commentText, setcommentText] = useState("");
    const [viewComments, setViewComments] = useState("");
    const commentBox = useRef(null);

    const User = props?.User;

    //-1. resolving some eror in brute froce way
    if(postId === "65eed2bb83389fcc0d6159be"){
        return(<></>)
    }
    //0. getting the post's data from id
    const getPost = async(localpostId) => {
        try {
            await axios
            .post(`/api/v1/posts/view-post?_id=${localpostId}`)
            .then((res) => {
                setPost(res.data.data);
            })
            .catch((err) => {
                console.log("Unable to retrieve post", err);
            })
        } catch (err) {
            console.log(err);
        }
    }

    //1. handling likes and comments
    const handleLike = async() => {
            await axios
            .post(`/api/v1/posts/like-post?_id=${postId}`)
            .then((res)=>{
                window.location.reload();
            })
            // .catch((err) => {console.log(err);})
    }
    const handleComment = async(ev) => {  
        ev.preventDefault();
        
        // console.log(`/api/v1/comments/add-comment?_id=${postId}`);
        try{
            await axios
            .post(`/api/v1/comments/add-comment?_id=${postId}`,{text:commentText})
            .then((res)=>{
                window.location.reload()
            })
            .catch((err)=>{console.log(err);})
        }catch(err){
            console.log(err);
        }
    }
    const handleCommentButton = () =>{
        commentBox.current.focus();
    }
    const visibleComments = ()=>{
        if(viewComments === ""){
            setViewComments( <>
                <h1 className='underline m-5 mt-8 text-xl '>Comments</h1>
                {
                    Post.comments?.map((comment, index) => {
                        return (
                            <div className='mx-2 my-2' key={index}>
                                <div className='flex flex-row my-3 gap-2 items-center align-middle'>
                                    <Link to={`/profile/${Post.owner?.username}`} className='flex flex-row my-3 gap-2 items-center align-middle'>
                                        <div className='w-8 h-8 bg-zinc-800 rounded-full overflow-hidden'>
                                            {/* user avatar */}
                                            <img src={comment.owner?.avatar} className='object-cover rounded-full w-8 h-8'></img>
                                        </div>
                                        <div className='text-md font-semibold'>
                                            {/* Username */}
                                            {comment.owner?.username}
                                        </div>
                                    </Link>
                
                                    <div className='mx-2'>
                                        <div className=''>
                                            {comment.text}
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        )
                    })
                }
            </>);
        }else{
            setViewComments("")
        }
    }
    const deletePost = async() => {
        await axios
        .delete(`/api/v1/posts/delete-post?_id=${postId}`)
        .then((res)=>{
            alert("Post deleted successfully!")
            window.location.reload();
        })
        .catch((err)=>{console.log(err);})
    }

    //2. deciding the type of heart based on the state if it is liked or not
    const heart = (User?.likedPosts?.includes(postId))?FILLED_HEART:EMPTY_HEART;
    
    //3. adding a delete option if the post owner is same as the current user
    const bin = (User?.posts?.includes(postId))?DUSTBIN:"";
    
    const deletePostFeature = (User?.posts?.includes(postId))?<div className='w-8 h-8 hover:cursor-pointer' onClick={deletePost}> 
                                                                    {bin}
                                                                </div>:"";
    useEffect(() => {
        getPost(postId);
    }, []); 
    // console.log(Post.comments)
    if(Post)
    return (
    <div className='w-1/2 h-auto min-h-[30rem] overflow-y-visible bg-zinc-900 shadow-xl shadow-black-950 rounded-lg mb-28'>
        
        {/* post owner data */}
        <Link 
            to={`/profile/${Post.owner?.username}`}
        >
            <div className='flex flex-row gap-5 items-center align-middle my-5 mx-5'>
                <div className='w-16 h-16 bg-zinc-800 rounded-full overflow-hidden'>
                    {/* user avatar */}
                    <img src={Post.owner?.avatar} className='object-cover rounded-full w-16 h-16'></img>
                </div>
                <div className='text-xl'>
                    {/* Username */}
                    {Post.owner?.username}
                </div>
            </div>
        </Link>
        
        {/* post media */}
        <div className='w-full bg-zinc-800'>
            <img src={Post.media} className='h-auto w-full object-cover'/>
        </div>

        {/* post like,comment vgrh */}
        <div className='flex flex-row align-middle items-center mt-4'>
            <div className='ml-1 mr-4 hover:cursor-pointer' onClick={handleLike}>
                {heart}
            </div>

            <div className=' hover:cursor-pointer' onClick={handleCommentButton}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                </svg>
            </div>
        </div>
        <div className='mx-2 font-bold text-md'>{Post.likes} likes</div>

        {/* post data */}
        <div className='mx-2'>
            <div className='font-bold font-mono'>
                {Post.title}
            </div>
            <div>
                {Post.description}
            </div>
        </div>

        {/* comments vgrh */}
        <div className='mx-2 mb-1 justify-between flex flex-wrap mt-4 font-thin'>
            <div onClick={visibleComments} className='hover:cursor-pointer'>
                View all {Post.comments?.length} comments.
            </div>
            <div>
                {Post.views} views.
            </div>
        </div>
        
        {/* comment box  and deleting post feature*/}
        <div className='flex flex-row align-middle items-center'>
            <form onSubmit={handleComment} className='flex items-center align-middle justify-center w-full'>
                <input ref={commentBox} type='text' className='bg-zinc-900 w-full m-2 mr-4 font-thin border-s-zinc-800 border-b-2' placeholder='Your thoughts here...' autoFocus onChange={(ev)=>{setcommentText(ev.target.value)}} required></input>
                <button type='submit' className='my-2 mr-4'>Post</button>
            </form> 
            {deletePostFeature}
        </div>

        {/* comments */}
        {viewComments}
    </div>
    );
    else
        return(<></>)
}

export default Post;
