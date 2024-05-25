import React from 'react'
import NavBar from "./components/Navbar/Navbar"
import Products from "./components/Products/Products";
import Customers from './components/Customers/Customers';
import { Route, Routes } from 'react-router-dom'
import UserLogin from './components/User/UserLogin';
import UserRegister from './components/User/UserRegister';
import Dashboard from './components/Dashboard/Dashboard';


function App() {
  return (
    <div>
      <NavBar />
        <Routes>
          <Route path='/' element={<UserLogin />}></Route>
          <Route path='/signup' element={<UserRegister />}></Route>
          <Route path='/products' element={<Products />}></Route>
          <Route path='/customers' element={<Customers />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
        </Routes>
    </div>
  );
}

export default App;
