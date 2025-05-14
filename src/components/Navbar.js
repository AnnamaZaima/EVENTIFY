// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { 
  FaUserCircle, 
  FaHome, 
  FaCalendarAlt, 
  FaUsers, 
  FaStar, 
  FaQuestionCircle, 
  FaInfoCircle 
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            localStorage.removeItem('user');
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard" className="brand-link">
                    <span className="brand-text">Eventifyy</span>
                </Link>
            </div>

            <div className="navbar-menu">
                <Link to="/dashboard" className="nav-link">
                    <FaHome className="nav-icon" />
                    <span>Dashboard</span>
                </Link>
                <Link to="/about" className="nav-link">
                    <FaInfoCircle className="nav-icon" />
                    <span>About Us</span>
                </Link>
                <Link to="/faq" className="nav-link">
                    <FaQuestionCircle className="nav-icon" />
                    <span>FAQ</span>
                </Link>
                <Link to="/events" className="nav-link">
                    <FaCalendarAlt className="nav-icon" />
                    <span>Events</span>
                </Link>
                <Link to="/clubs" className="nav-link">
                    <FaUsers className="nav-icon" />
                    <span>Clubs</span>
                </Link>
                <Link to="/highlights" className="nav-link">
                    <FaStar className="nav-icon" />
                    <span>Highlights</span>
                </Link>
                
                
            </div>

            <div className="navbar-end">
                <Link to="/profile" className="profile-link">
                    <FaUserCircle className="profile-icon" size={24} />
                    {user?.name && <span className="profile-name">{user.name}</span>}
                </Link>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;