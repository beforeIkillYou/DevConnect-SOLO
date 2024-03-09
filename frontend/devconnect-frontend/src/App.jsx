import {Route, Routes} from 'react-router-dom'
import axios from 'axios'
import './App.css'

//importing pages
import IndexPage from './pages/IndexPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout' 

// axios.defaults.baseURL = 'http://localhost:3000/api/v1'
// axios.defaults.withCredentials  = true

function App() {
  return(
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<IndexPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/> } />
      </Route>
    </Routes>
  )
}

export default App
