import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // 1. Create a dedicated function to fetch the count
  const fetchCartCount = () => {
    axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/cart')
      .then(res => setCartCount(res.data.length))
      .catch(() => {});
  };

  useEffect(() => {
    // 2. Fetch on initial load
    fetchCartCount();

    // 3. Listen for the custom "cartUpdated" signal
    window.addEventListener('cartUpdated', fetchCartCount);

    // 4. Cleanup the listener when component unmounts
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
        <Link to="/cart" className="cart-link">
          🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;