import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Header() {
  const { token, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate('/');
  }

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="logo">Byte Me</Link>
        <nav className="nav">
          <Link to="/">Search</Link>
          <Link to="/restaurants">Restaurants</Link>
          {token && <Link to="/orders">Orders</Link>}
          {token ? (
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
