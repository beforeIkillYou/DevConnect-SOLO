import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate, useParams } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';


const ProfilePage = (props) => {
    const username = useParams();
    //TODO: use this username to get the required user and display him

    const User = props?.User;

    // console.log(username);
    return (
        <>  
            <Navbar User={User}/>
            <div className='ml-64'>
                <h1  className='bg-gray-500'>Profile page here {username.username}</h1>
            </div>
        </>
    );
}

export default ProfilePage;
