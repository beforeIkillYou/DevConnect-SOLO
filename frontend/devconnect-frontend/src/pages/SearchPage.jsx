import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate, Link } from 'react-router-dom';


//importing components
import Navbar from '../components/Navbar';


const SearchPage = (props) => {
    const User = props.User;
    const Err = props.Err;

    const [searchedUsername, setsearchedUsername] = useState("");
    const [searchedUsers, setsearchedUsers] = useState("");

    if(Err){//if there is error in getting the current user then go to login
        return <Navigate to={'/login'} />
    }

    const handleSearch = async (ev) =>{
        ev.preventDefault()

        axios.get(`/api/v1/users/get-users-of-similar-username/${searchedUsername}`)
        .then((res) => {
            // console.log(res.data);
            setsearchedUsers(
                
                res.data.data.map((user)=>{
                    return(
                        <div 
                        className='bg-zinc-800 mx-28  py-3 shadow-2xl shadow-inherit flex flex-row gap-5 px-5 hover:bg-transparent duration-200'>
                            <img src={user.avatar} className='w-16 h-16 rounded-full object-cover ' />
                            <div>
                                <div className='text-xl'>  
                                    <Link
                                    to={`/profile/${user.username}`}>
                                        {user.username}
                                    </Link>
                                </div>
                                <div>
                                    {user.fullname}
                                </div>
                            </div>
                        </div>
                    )
                })
            )
        })
        .catch((err)=>{
            console.log(err);
        })
    }


    return (
        <>  
            <Navbar User={User}/>
            
            <div className='bg-zinc-950 ml-64  text-white h-screen overflow-y-auto no-scrollbar'>
                <form onSubmit={handleSearch} className='flex items-center justify-center'>
                    <input name='searchedUser' type='text' className='bg-zinc-900 w-3/4 p-2 mt-5 m-2 mr-4 font-thin border-s-zinc-800 border-b-2' placeholder='Search User...' autoFocus onChange={(ev)=>{setsearchedUsername(ev.target.value)}} required></input>
                    <button type='submit' className='my-2 mr-4 hover:bg-zinc-800 p-2 rounded-md'>Search</button>
                </form>  

                <div className='flex flex-col my-1 '>
                    {searchedUsers}
                </div>

                <img src="https://i.pinimg.com/originals/c1/d1/c2/c1d1c21b450107359631600f72e0bd4a.gif" className='w-auto h-auto items-center my-20 mx-[26vw] bg-blend-multiply'></img>
            </div>
        </>
    );
}

export default SearchPage;
