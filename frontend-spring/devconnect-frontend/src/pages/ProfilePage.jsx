import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate, useParams } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';


const ProfilePage = (props) => {
    const username = useParams();
    const [CurrUser, setCurrUser] = useState();
    const [followers, setFollowers] = useState([]);
    const User = props?.User;

    //fullfilling the choice...following, unfollowing, editing the user
    const fullfillChoice = async()=>{
        if(choice === "Edit"){
            alert("Feature under development.")//todo: make the user profile editable...bio..email..name
        }else if(choice === "Follow"){
            await axios.post(
                `/api/v1/users/start-following?username=${CurrUser.username}`
            )
            .then((res)=>{
                alert(`Started following ${CurrUser.username} successfully!`);
                window.location.reload();
            })
            .catch((err)=>{
                alert("Failed to start following the user");
                console.log(err);
            })
        }else if(choice === "Unfollow"){
            await axios.delete(
                `/api/v1/users/stop-following?username=${CurrUser.username}`
            )
            .then((res)=>{
                alert(`Stopped following ${CurrUser.username} successfully!`);
                window.location.reload();
            })
            .catch((err)=>{
                alert("Failed to stop following the user");
                console.log(err);
            })
        }
    }

    //getting the profile of user from username
    const getCurrentUser = async() =>{

        await axios.get(
            `http://localhost:8080/users/${username.username}`,
        )
        .then((res)=>{
            setCurrUser(res.data);
        })
        .catch((err) => {
            console.log(err);
        })

        await axios.get(`localhost:8080/users/${CurrUser?.id}/followers`)
        .then((res)=>{
            setFollowers(res.data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    useEffect(() =>{
        getCurrentUser();
    },[])

    //todo: make it "Edit" instead of the empty string
    const choice = (CurrUser?.id === User?.id)?"":(User?.following.includes(CurrUser))?"Unfollow":"Follow";
    ///you can either edit your details or follow a given user or unfollwo a given user

    console.log(CurrUser);
    if(CurrUser){
        return (
            <>  
                <Navbar User={User}/>

                <div className='ml-64 bg-zinc-950 h-screen text-white overflow-y-auto no-scrollbar flex flex-col items-center align-middle'>
                    {/* user data */}
                    <div className='flex flex-row bg-zinc-900 w-5/6 h-4/6 my-[5vw] rounded-md items-center align-middle hover:shadow-md hover:shadow-zinc-900 duration-300'>
                        {/* pfp */}
                        <div className='mx-8 mr-20'>
                            <img src={CurrUser.avatar} className='object-cover w-44 h-44 rounded-full'></img>
                        </div>

                        {/* user data */}
                        <div className='flex flex-col'>
                            <div className='text-2xl font-semibold font-mono mb-4'>{CurrUser.username}</div>
                            <div className='text-xl '>{CurrUser.fullname}</div>
                            {/* <div>{CurrUser.email}</div> */}
                            <div className=' font-light text-lg '>{CurrUser.bio}</div>
                        </div>

                        {/* followers and follwing */}
                        <div className='ml-[28vw] font-mono text-lg'>
                            <div>Followers: {followers?.length}</div>
                            <div>Following: {CurrUser.following?.length}</div>
                            {/* <div>Posts: {CurrUser.posts?.length}</div> */}
                            {/* <div>Comments: {CurrUser.comments?.length}</div> */}
                            {/* <div>Liked Posts: {CurrUser.likedPosts?.length}</div> */}
                        </div>

                        {/* follow, unfollow or edit button */}
                    </div>

                    <div>
                        <button
                        className='font-semibold text-lg hover:scale-105 duration-300 mb-20'
                        onClick={fullfillChoice}    
                        >
                        {choice}
                        </button>
                    </div>
                    {/* user posts data...will add it some other day//todo:show the posts data
                    <div>

                    </div> */}
                </div>
            </>
        );
    }
    else{
        return (
            <>  
                <Navbar User={User}/>

                <div className='ml-64 bg-zinc-950 text-white h-screen text-center py-[10vw] font-semibold text-xl items-center align-middle'>
                    User Does Not Exists 
                    <img src="https://freefrontend.com/assets/img/html-funny-404-pages/HTML-404-Error-Page.gif" className=' w-[40vw] h-[20vw] mx-[22vw] my-[2vw]'></img>
                </div>
            </>
        );
    }
        
}

export default ProfilePage;
