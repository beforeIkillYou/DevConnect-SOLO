import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';

const IndexPage = () => {
    const [User, setUser] = useState(null);
    const [Err, setErr] = useState(null);

    // 1. get the current logged in user 
    const getCurrentUser = async() =>{
        await axios.get('/api/v1/users/current-user')
        .then((res)=>{
            setUser(res.data.data);
        })
        .catch((err)=>{
            setErr(err);
        })
    }
    // calling getCurrentUser on component mount
    useEffect(() =>{
        getCurrentUser();
    },[])

    //2. if the curretn user cant be get then rediterect to login
    if(Err){//if their is error in egtting current user then head to login
        return <Navigate to={'/login'} />
    }
    return (
        <div>
            <h1 className='bg-gray-500'>Index page here {User?.username}</h1>
        </div>
    );
}

export default IndexPage;
