import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';


const ProfilePage = (props) => {
    const User = props.User;
    const Err = props.Err;

    if(Err){//if there is error in getting the current user then go to login
        return <Navigate to={'/login'} />
    }

    return (
        <>  
            <Navbar User={User}/>
            <div className='ml-64'>
                <h1  className='bg-gray-500'>Profile page here {User?.username}</h1>
            </div>
        </>
    );
}

export default ProfilePage;
