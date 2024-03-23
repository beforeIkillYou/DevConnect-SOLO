import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';
import { loadConfigFromFile } from 'vite';


const SearchPage = (props) => {
    const User = props.User;
    const Err = props.Err;

    const [searchedUsername, setsearchedUsername] = useState("");
    const [searchedUsers, setsearchedUsers] = useState("");

    if(Err){//if there is error in getting the current user then go to login
        return <Navigate to={'/login'} />
    }

    const handleSearch=async () =>{
        console.log("was here");
        await axios.get(`/api/v1/users/get-users-of-similar-username/${searchedUsername}`)
        .then((res) => {
            console.log(res);
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
                    <input  type='text' className='bg-zinc-900 w-3/4 p-2 mt-5 m-2 mr-4 font-thin border-s-zinc-800 border-b-2' placeholder='Search User...' autoFocus onChange={(ev)=>{setsearchedUsername(ev.target.value)}} required></input>
                    <button type='submit' className='my-2 mr-4 hover:bg-zinc-800 p-2 rounded-md'>Search</button>
                </form>     
            </div>
        </>
    );
}

export default SearchPage;
