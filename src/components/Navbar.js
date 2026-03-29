import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Fetch cart count
  const fetchCartCount = () => {
    axios
      .get('https://flipkart-clone-backend-sm1d.onrender.com/api/cart')
      .then((res) => setCartCount(res.data.length))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', fetchCartCount);

    return () => {
      window.removeEventListener('cartUpdated', fetchCartCount);
    };
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      navigate(`/?search=${search}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* 🔹 TOP ROW (Logo + Icons) */}
        <div className="nav-container-top">
          
          {/* LOGO */}
          <Link to="/" className="navbar-logo">
            <div>
              <span className="logo-text">Flipkart</span>
              <div className="logo-sub">
                Explore <span className="plus">Plus</span>
              </div>
            </div>
          </Link>

          {/* RIGHT ICONS */}
          <div className="navbar-right">
            <Link to="/wishlist" className="nav-link">
              ❤️ Wishlist
            </Link>

            <Link to="/cart" className="nav-link">
              🛒 Cart
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* 🔹 SEARCH BAR (Below on Mobile, Center on Desktop via CSS) */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

      </div>
    </nav>
  );
}

export default Navbar;