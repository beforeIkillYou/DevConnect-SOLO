import React, {useState, useEffect} from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';


const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [Fullname, setFullname] = useState("");
    const [Bio, setBio] = useState("");


    //the complete image upload thing here
    const [Avatar, setAvatar] = useState("");
    let AvatarURL = useState("https://i.pinimg.com/564x/f1/39/63/f13963c024d3b1e8fe55d78b0654b985.jpg");
    const uploadImage = async(e) => {
      e.preventDefault();

      try{
        if(Avatar){
          const image = new FormData();
          image.append('file', Avatar);
          image.append('upload_preset', 'devconnect');
          
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/ddefovwve/image/upload",
            {
              method: 'post',
              body: image
            },
          )
          const imgData = await response.json();
          // setAvatarURL(imgData.url.toString());
          AvatarURL = imgData.url.toString();
          console.log("image upload succedcfully");

          // console.log(response);
          console.log(imgData.url.toString())
          console.log(AvatarURL)
          // console.log(imgData);
        }

      }catch(err){
        console.log(err,"Avatar image upload failed ");
      }
    }


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



    //2. post function to handle registration
    async function registerUser(ev) {
        ev.preventDefault();

        // trying to upload at cloudinary
        try{
          // console.log(Avatar)
          await uploadImage(ev);
        }catch(e) {
          console.log(e);
          alert("Image upload failed!!")
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('email', email);
        formData.append('name', Fullname);
        formData.append('bio', Bio);
        formData.append('role', 'USER');
        formData.append('avatar', AvatarURL);
        const data = Object.fromEntries(formData);
        console.log(data);
        try{
            await axios.post(
                'http://localhost:8080/api/register',
                data
            )
            .then((res)=>{
                alert("User registered successfully!!")
                // console.log(res.data.user)
                localStorage.setItem('user', JSON.stringify(res.data.user));
                console.log('User data stored in localStorage');
                window.location.reload();
            })
            .catch((err) =>{
                alert("User registration failed!!(Try giving different username)");
            })
        }catch(e){
            alert("User Registration Failed",e)
        }
    }

    //3. if you have user then go to indexpage
    if(User){
      return <Navigate to={"/"} />
    }

    return (
    <section className="bg-gray-50 dark:bg-zinc-900">
    <div className="flex flex-row items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 overflow-y-hidden">
    <p  href="#" className="flex drop-shadow-2xl items-center mb-2 mr-40 text-6xl  font-semibold text-gray-900 dark:text-white underline font-mono">
      Hello, DevConnect!!
    </p>
    <div className="w-full bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-zinc-800 dark:border-gray-700 overflow-hidden shadow-2xl ">
      <div className="p-5 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Create your account
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={registerUser}>
        {/* username input  */}
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Username
            </label>
            <input
              required
              type="text"
              name="username"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 mb-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Username"
              onChange={(ev) => {setUsername(ev.target.value)}}
            />
          </div>
        {/* email input  */}
        <div>
        <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            Your Email
        </label>
        <input
            required
            type='email'
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 mb-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="xyz@email.com"
            onChange={(ev) => {setEmail(ev.target.value)}}
        />
        </div>
        {/* fullname input  */}
        <div>
        <label
            htmlFor="fullname"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            Your Fullname
        </label>
        <input
            required
            type='text'
            name="fullname"
            id="fullname"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 mb-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Firstname Lastname"
            onChange={(ev) => {setFullname(ev.target.value)}}
        />
        </div>
        {/* bio input  */}
        <div>
        <label
            htmlFor="bio"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            Your Bio
        </label>
        <input
            required
            type='text'
            name="bio"
            id="bio"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 mb-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your bio defines you!!"
            onChange={(ev) => {setBio(ev.target.value)}}
        />
        </div>
        {/* avatar input */}
        <div>
        <label
            htmlFor="bio"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            Your Avatar
        </label>
        <input
            required
            type='file'
            name="Avatar"
            id="Avatar"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 mb-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(ev) => {setAvatar(ev.target.files[0])}}
        />
        </div>
        {/* password input  */}
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
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 mb-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(ev) => {setPassword(ev.target.value)}}
        />
        </div>
          
          <button
            type="submit"
            className="w-full text-white bg-zinc-900 hover:bg-gray-900 hover:shadow-xl focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Register
          </button>
          <p className="text-sm font-light text-gray-500 text-center dark:text-gray-400">
            Already have an account?<Link
              to={'/login'}
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
</section>
    );
}

export default Register;
