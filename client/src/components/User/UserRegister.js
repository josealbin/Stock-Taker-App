import React, { useState } from 'react'
import '../User/User.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function UserRegister() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();

    const handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('http://localhost:3001/signup', {username, email, password})
        .then(res=>{ if(res.data.status){navigate('/')} })
        .catch(err=>{ console.log(err);})
    }
    return (
        <div className='user-container'>
            <div className="signup-box">
            <img src="/images/newuser.png" alt="" />
            <div className='entry-logo'>
                <img src="/images/icon.png" alt="" />
                </div>
                <h4>New user? Register here</h4>
                <form action="" onSubmit={handleSubmit}>
                    <label htmlFor="uname">User Name</label>
                    <input type="text" placeholder="" required onChange={(e)=>{setUsername(e.target.value)}} />
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="" required onChange={(e)=>{setEmail(e.target.value)}} />
                    <label htmlFor="pass">Password</label>
                    <input type="password" placeholder="************" required onChange={(e)=>{setPassword(e.target.value)}}/>
                    <button type="submit">Submit</button>
                </form>
                <p>By clicking Submit, you agree to our<br />
                    <a href="/terms-conditions">Terms and Conditions</a> and <a href="/policy-privacy">Policy and Privacy</a></p>
            </div>
            <p className="login-path">Already have an account? <Link to="/">Login here</Link></p>

        </div>
    )
}

export default UserRegister
