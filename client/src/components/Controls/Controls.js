import React from 'react'
import '../Controls/Controls.css'
import { Link, useLocation } from 'react-router-dom'

function Controls() {
  const location = useLocation();
  return (
    <div className='control-pane'>
      <nav className="nav">
        <Link to='/dashboard'>Dashboard</Link>
        <Link to='/products'>Stock</Link>
        <Link to='/dashboard'>Categories</Link>
        <Link to='/customers'>Customers</Link>
        <div className='display_path'>
        <p>{location.pathname}</p>
        </div>
      </nav>

    </div>
  )
}

export default Controls
