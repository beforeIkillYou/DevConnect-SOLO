import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';

//importing components
import Navbar from '../components/Navbar';


const CreatePage = (props) => {
    const User = props.User;
    const Err = props.Err;

    if(Err){//if there is error in getting the current user then go to login
        return <Navigate to={'/login'} />
    }

    return (
        <>  
            <Navbar User={User}/>
            <div className='ml-64'>
            //TODO: hadnle story update and posts udoate differently
                <h1  className='bg-gray-500'>Create page here {User?.username}</h1>
            </div>
        </>
    );
}

export default CreatePage;
