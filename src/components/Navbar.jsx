import React, {useState} from "react";
import { Link, NavLink } from "react-router-dom";
import './Navbar.css'

export const Navbar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  return (
    <nav>
      <ul className="sidebar" style={{ display: isSidebarVisible ? 'flex' : 'none' }}>
        <li onClick={() => setSidebarVisible(false)}>
          <a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></a>
        </li>
        <li>
          <NavLink to="/refugee">Refugee</NavLink>
        </li>
        <li>
          <NavLink to="/aid">Aid</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>

      <ul>
        <li>
          <Link to="/" className="title">
            <img src="/logoipsum-247.svg" alt="Logo" className="logo" /> Home
          </Link>
        </li>
        <li>
          <NavLink to="/refugee">Refugee</NavLink>
        </li>
        <li>
          <NavLink to="/aid">Aid</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
        <li className="menu-button" onClick={() => setSidebarVisible(true)}>
          <a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></a>
        </li>
      </ul>
    </nav>
  )
}