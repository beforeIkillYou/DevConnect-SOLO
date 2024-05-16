import React, {useState, useEffect} from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [User, setUser] = useState(null);

    //1. if the user is already logged in then get him
    const getCurrentUser = () =>{
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }else{
        setUser(null);
      }
    }
    useEffect(() =>{
        getCurrentUser();
    },[])

    //2. post function to handle login
    async function loginSubmit(ev) {
        ev.preventDefault();
        // console.log(username,password);
        try{
            await axios.post(
              'http://localhost:8080/api/login',
              {username,password}
            )
            .then((res)=>{
              alert("User Logged In Successfully!");
              // setUser(res.data.data.user);
              console.log(res.data.user)
              localStorage.setItem('user', JSON.stringify(res.data.user));
              console.log('User data stored in localStorage');
              window.location.reload();
            });
        }catch(e){
            alert("User Login Failed",e)
        }
    }

    //3. if you have user then go to indexpage
    if(User){
      return <Navigate to={"/"} User={User} />
    }

    return (
    <section className="bg-gray-50 dark:bg-zinc-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <p  href="#" className="flex items-center mb-6 text-3xl  font-semibold text-gray-900 dark:text-white underline font-mono">
      Welcome Back To DevConnect
    </p>
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-zinc-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Sign in to your account
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={loginSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Username
            </label>
            <input
              required
              type="text"
              name="username"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Username"
              onChange={(ev) => {setUsername(ev.target.value)}}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
            >
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(ev) => {setPassword(ev.target.value)}}
            />
          </div>
          
          <button
            type="submit"
            className="w-full text-white bg-zinc-900 hover:bg-gray-900 hover:shadow-xl focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Sign in
          </button>
          <p className="text-sm font-light text-gray-500 text-center dark:text-gray-400">
            Dont have an account yet?{" "}
            <Link
              to={'/register'}
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
</section>
    );
}

export default Login;
