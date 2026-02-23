import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          🌍 GeoGuessr
        </Link>
        <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
        {user && (
          <>
            <Link to="/lobby" className="nav-link">Multiplayer</Link>
            <Link to="/timetrial" className="nav-link">Time Trial</Link>
            <Link to="/aimode" className="nav-link">AI Mode</Link>
          </>
        )}
      </div>
      <div className="nav-right">
        {user ? (
          <div className="nav-user">
            <span className="nav-username">👤 {user.username}</span>
            <button onClick={handleLogout} className="nav-logout">Logout</button>
          </div>
        ) : (
          <>
            <Link to="/signin" className="nav-link">Sign In</Link>
            <Link to="/signup" className="nav-link nav-signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;