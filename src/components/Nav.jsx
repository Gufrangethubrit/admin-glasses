import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoSearchOutline, IoPersonOutline, IoMenuOutline, IoCloseOutline, IoLogOutOutline } from 'react-icons/io5'
import '../styles/Nav.css'

export default function Nav() {
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    setProfileOpen(false)
    console.log('Logout clicked')
  }

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__container">
        
        {/* Logo */}
        <Link to="/admin" className="admin-navbar__logo">
          <span className="admin-navbar__logo-text">Admin</span>
        </Link>

        {/* Empty Space for Desktop Nav Links */}
        <div className="admin-navbar__spacer"></div>

        {/* Right Actions */}
        <div className="admin-navbar__actions">
          
          {/* Search Icon */}
          <button 
            className="icon-btn" 
            aria-label="Search"
            title="Search"
          >
            <IoSearchOutline size={20} />
          </button>

          {/* Profile Dropdown */}
          <div className="profile-popup-wrapper">
            <button 
              className="icon-btn" 
              aria-label="Profile"
              onClick={() => setProfileOpen(v => !v)}
              title="Profile Menu"
            >
              <IoPersonOutline size={20} />
            </button>
            
            {profileOpen && (
              <div className="profile-popup">
                <div className="profile-popup__header">
                  <p className="profile-popup__name">Admin User</p>
                  <p className="profile-popup__email">admin@glassesshop.com</p>
                </div>
                
                <div className="profile-popup__divider"></div>
                
                <button className="profile-popup__item profile-popup__item--logout" onClick={handleLogout}>
                  <IoLogOutOutline size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
