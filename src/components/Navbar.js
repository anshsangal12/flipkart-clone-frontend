import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const fetchCartCount = () => {
    axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/cart')
      .then(res => setCartCount(res.data.length))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => {
      window.removeEventListener('cartUpdated', fetchCartCount);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${search}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Flipkart</span>
          <span className="logo-sub">Explore <span className="plus">Plus</span></span>
        </Link>
      </div>
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for products, brands and more"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>
      <div className="navbar-right">
        {/* 🚨 NEW: Added the Wishlist link here */}
        <Link to="/wishlist" className="cart-link" style={{ marginRight: '25px' }}>
          ❤️ Wishlist
        </Link>
        <Link to="/cart" className="cart-link">
          🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;