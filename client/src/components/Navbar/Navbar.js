import React from 'react'
import '../Navbar/Navbar.css'
import { Link } from 'react-router-dom'


function Navbar() {
    return (
        <div className='header'>
            <div className="container">
                <div className='logo_block'>
                <Link to="/"><img src="/images/form.png" alt="" /></Link>
                <Link to="/" className="logo-header">Stock Taker</Link>
                </div>
                <nav className='user_block'>
                    <p>Welcome User</p>
                    <Link to="/" className="btn-home"><img src="/images/home.png" alt="" /></Link>
                    <Link to="/" className="btn-admin"><img src="/images/admin.png" alt="" /></Link>
                </nav>
            </div>
        </div>
    )
}
export default Navbar
