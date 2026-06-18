// Header Component
// Rendered on every page (mounted once in AppRouter, outside <Routes>).
// Receives auth state as props from App so it always reflects the current session.
//
// Layout (left → right):
//   Logo | Address | Search bar | [Auth controls]
//
// Auth controls — logged out: Login + Register buttons
// Auth controls — logged in:  "+ Add Restaurant" (owners only) + avatar with initials
//   Clicking the avatar opens a dropdown with the user's name and a logout button.
//   A full-screen transparent overlay sits behind the dropdown so clicking anywhere
//   outside it closes the menu (no useRef needed).

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ token, user, isOwner, signOut }) {
  const navigate = useNavigate();

  // Controlled value for the search input
  const [searchQuery, setSearchQuery] = useState('');

  // Whether the avatar dropdown is visible
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Whether the "register to set address" hint popover is visible (logged-out only)
  const [showAddressHint, setShowAddressHint] = useState(false);

  // Navigate to the home page with the query in the URL so the search results
  // page can read it from the query string (e.g. /?q=sushi).
  function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  // Sign out and return to the home page.
  function handleLogout() {
    signOut();
    setShowUserMenu(false);
    navigate('/');
  }

  // Format the user's delivery address as a single readable line.
  // Falls back to "Set your address" when no user is logged in.
  const address = user?.address
    ? `${user.address.street} ${user.address.houseNum}, ${user.address.city}`
    : null;

  // Build the two-letter initials shown inside the avatar circle (e.g. "YH").
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '';

  return (
    <header className="site-header">
      <div className="site-header__inner">

        {/* Logo  */}
        <Link to="/" className="site-header__logo">Byte Me</Link>

        {/*  Delivery address  */}
        {token ? (
          <div className="site-header__address">
            <span>📍</span>
            <span className="site-header__address-text">
              {address ?? 'Set your address'}
            </span>
          </div>
        ) : (
          <div className="site-header__address-wrapper">
            {showAddressHint && (
              <div
                className="site-header__overlay"
                onClick={() => setShowAddressHint(false)}
              />
            )}
            <button
              className="site-header__address site-header__address--clickable"
              onClick={() => setShowAddressHint(v => !v)}
              aria-label="Set delivery address"
            >
              <span>📍</span>
              <span className="site-header__address-text">Tel Aviv, Israel</span>
            </button>
            {showAddressHint && (
              <div className="site-header__address-hint">
                <span className="site-header__address-hint-text">
                  Register or log in to set your delivery address
                </span>
                <Link to="/register" className="site-header__btn site-header__btn--primary" onClick={() => setShowAddressHint(false)}>
                  Register
                </Link>
                <Link to="/login" className="site-header__btn site-header__btn--outline" onClick={() => setShowAddressHint(false)}>
                  Login
                </Link>
              </div>
            )}
          </div>
        )}

        {/*  Search bar */}
        <form className="site-header__search" onSubmit={handleSearch}>
          <input
            type="text"
            className="site-header__search-input"
            placeholder="Search restaurants or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxLength={50}
          />
          <button type="submit" className="site-header__search-btn" aria-label="Search">
            🔍
          </button>
        </form>

        {/* Auth controls */}
        <div className="site-header__actions">

          {token ? (
            <>
              {/* Only restaurant owners see the "Add Restaurant" shortcut */}
              {isOwner && (
                <Link to="/restaurants/new" className="site-header__add-restaurant">
                  + Add Restaurant
                </Link>
              )}

              {/*
                Transparent full-screen overlay rendered behind the dropdown.
                Any click that lands on the overlay (i.e. outside the menu) closes it.
                The menu itself has a higher z-index so clicks there are unaffected.
              */}
              {showUserMenu && (
                <div
                  className="site-header__overlay"
                  onClick={() => setShowUserMenu(false)}
                />
              )}

              <div className="site-header__avatar-wrapper">
                {/* Avatar circle — toggles the dropdown */}
                <button
                  className="site-header__avatar"
                  onClick={() => setShowUserMenu(v => !v)}
                  aria-label="Open user menu"
                >
                  {initials}
                </button>

                {/* Dropdown: full name + logout */}
                {showUserMenu && (
                  <div className="site-header__user-menu">
                    <span className="site-header__user-name">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <Link
                      to="/orders"
                      className="site-header__menu-link"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>
                    <button className="site-header__logout" onClick={handleLogout}>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="site-header__btn site-header__btn--outline">Login</Link>
              <Link to="/register" className="site-header__btn site-header__btn--primary">Register</Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}
