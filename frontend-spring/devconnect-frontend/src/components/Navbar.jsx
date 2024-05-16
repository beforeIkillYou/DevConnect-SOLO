import React,{useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';


const Navbar = (props) => {
    const User = props.User; 
    const [Loggedout, setLoggedout] = useState(false);

    const logout = async()=>{
      try{
        await axios.get('http://localhost:8080/users/logout');
        setLoggedout(true);
        alert("User logged out!");

        localStorage.removeItem('user');
        console.log('User data removed from localStorage');
      }catch(e){
        alert("Cant logout user",e); 
      }
    }
    if(Loggedout){
      return <Navigate to="/login" />
    }

    //setting pfp to normal icon if the user avatar is not defined
    const pfp = <img src={User?.avatar} className="w-8 h-8 rounded-full object-cover" /> || <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>;

    return (
    <>
  <aside
    id="default-sidebar"
    className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-slate-500 border-r"
    aria-label="Sidebar"
  > 
    <div className="h-full px-3 py-4 overflow-y-auto bg-zinc-950">
        <h1 className='p-0.5 text-white font-mono underline text-4xl mb-5'>DevConnect</h1>
      <ul className="space-y-2 font-medium">
        {/* home page  */}
        <li>
          <Link
            to={'/'}
            className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="ms-3">Home</span>
          </Link>
        </li>

        {/* search page */}
        <li>
          <Link
            to={'/search'}
            className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span className="ms-3">Search</span>
          </Link>
        </li>

        {/* explore page  */}
        <li>
          <Link
            to={'/explore'}
            className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
            <span className="ms-3">Explore</span>
          </Link>
        </li>

        {/* notificaitons page  */}
        <li>
          <Link
            to={'/notifications'}
            className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <span className="ms-3">Notifications</span>
          </Link>
        </li>

        {/* create  */}
        <li>
          <Link
            to={'/create'}
            className="flex items-center p-2 text-gray-950 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span className="ms-3">Create</span>
          </Link>
        </li>

        {/* profile */}
        <li>
          <Link
            onClick={window.location.reload}
            to={`/profile/${User?.username}`}
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            {/* here i want the pfp  */}
            {/* <img src={User.avatar} className="w-8 h-8 rounded-full object-cover" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg> */}
            {pfp}
            <span className="ms-3">Profile</span>
          </Link>
        </li>

        {/* logout  */}
        <li>
          <button
            onClick={logout}
            className="flex items-center p-2 pr-32 text-gray-950 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
            <span className="ms-3">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
</>

    );
}

export default Navbar;
