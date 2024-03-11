import {Route, Routes} from 'react-router-dom'
import axios from 'axios'
import './App.css'

//importing pages
import IndexPage from './pages/IndexPage'
import CreatePage from './pages/CreatePage'
import ProfilePage from './pages/ProfilePage'
import ExplorePage from './pages/ExplorePage'
import NotificationsPage from './pages/NotificationsPage'
import SearchPage from './pages/SearchPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout' 
import { useState, useEffect } from 'react'

// axios.defaults.baseURL = 'http://localhost:3000/api/v1'
// axios.defaults.withCredentials  = true

function App() {
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

  return(
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<IndexPage User={User}/>} />

        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/> } />

        <Route path='/create' element={<CreatePage User={User} Err={Err}/>}/>
        <Route path='/explore' element={<ExplorePage User={User} Err={Err}/>}/>
        <Route path='/notifications' element={<NotificationsPage User={User} Err={Err}/>}/>
        <Route path='/search' element={<SearchPage User={User} Err={Err}/>}/>
        <Route path='/profile' element={<ProfilePage User={User} Err={Err}/>}/>
      </Route>
    </Routes>
  )
}

export default App
