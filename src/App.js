import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Route,Routes, Navigate,createRoutesFromChildren} from 'react-router-dom'
import Login from './pages/Login' 
import Register from './pages/Register'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddPost from './pages/AddPost';
import { Children } from 'react';
import PostDesc from './pages/PostDesc';
import SharePost from './pages/SharePost';
import Shares from './pages/Shares';
import Profile from './pages/Profile';

function App() {
  
  return (
    <div className="App">
      <ToastContainer/>
      <BrowserRouter>
         <Routes>
           <Route path='/' element={<Home/>}/>
           <Route path='/profile/:id' element={<Profile/>}/>
           <Route path='/addpost' element={<AddPost/>}/>
           <Route path='/shares' element={<Shares/>}/>
           <Route path='/sharepost/:id' element={<SharePost/>}/>
           <Route path='/post/:id' element={<PostDesc/>}/>

           <Route path='/login' element={<Login/>}/>
           <Route path='/register' element={<Register/>}/>
         </Routes>
      
      </BrowserRouter>
   
    </div>
  );
}





export default App;
