import React,{useState, useEffect} from 'react';
import axios from 'axios';


const Post = (props) => {
    const postId = props.postId;
    const [Post, setPost] = useState("");
    
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
    
    useEffect(() => {
        getPost(postId);
    }, []);

    // console.log(Post.comments)
    return (
    <div className='w-1/2 h-auto overflow-y-visible bg-zinc-900 shadow-xl shadow-black-950 rounded-lg mb-28'>
        
        {/* post owner data */}
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

        {/* post media */}
        <div className='w-full bg-zinc-800'>
            <img src={Post.media} className='h-auto w-full object-cover'/>
        </div>

        {/* post like,comment vgrh */}
        <div className='flex flex-row align-middle items-center mt-4'>
            <div className='ml-1 mr-4'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            </div>
            <div>
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
        <div className='mx-2 justify-between flex flex-wrap mt-4 font-thin'>
            <div>
                View all {Post.comments?.length} comments.
            </div>
            <div>
                {Post.views} views.
            </div>
        </div>
    </div>
    );
}

export default Post;
