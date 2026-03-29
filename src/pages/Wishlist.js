import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Cart.css'; // Reusing your cart styles!

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
    window.scrollTo(0, 0); 
  }, []);

  const fetchWishlist = () => {
    axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/wishlist')
      .then(res => setWishlistItems(res.data))
      .catch(err => console.error("Error fetching wishlist", err));
  };

  const removeFromWishlist = (productId) => {
    axios.delete(`https://flipkart-clone-backend-sm1d.onrender.com/api/wishlist/${productId}`)
      .then(() => {
        toast.info("Removed from Wishlist");
        fetchWishlist(); // Refresh the screen
      })
      .catch(err => console.error("Error removing item", err));
  };

  // Bonus Feature: Easily move items directly to the cart!
  const moveToCart = (product) => {
    axios.post('https://flipkart-clone-backend-sm1d.onrender.com/api/cart', { product_id: product.id })
      .then(() => {
        toast.success("Moved to Cart! 🛒");
        removeFromWishlist(product.id); // Remove it from wishlist once it's in the cart
        window.dispatchEvent(new Event('cartUpdated')); // Update navbar bubble
      });
  };

  const getSafeImage = (images) => {
    if (Array.isArray(images) && images.length > 0) return images[0];
    if (typeof images === 'string') return images.replace(/[{}"']/g, '').split(',')[0];
    return '/images/placeholder.png'; // Fallback image
  };

  if (wishlistItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h2>My Wishlist</h2>
        <p style={{ color: '#878787', marginTop: '10px' }}>Empty Wishlist! You have no items in your wishlist. Start adding!</p>
        <button onClick={() => window.location.href='/'} style={{ backgroundColor: '#2874f0', color: 'white', border: 'none', padding: '10px 20px', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container" style={{ maxWidth: '800px', margin: '0 auto', display: 'block' }}>
        <div className="cart-left" style={{ width: '100%' }}>
          <div className="cart-header">
            <h3>My Wishlist ({wishlistItems.length})</h3>
          </div>
          
          {wishlistItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={getSafeImage(item.images)} alt={item.name} onError={e => e.target.src='/images/placeholder.png'} />
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                <p className="item-price">₹{Number(item.price).toLocaleString()}</p>
                
                <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                  <button onClick={() => removeFromWishlist(item.id)} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                    Remove
                  </button>
                  <button onClick={() => moveToCart(item)} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ff9f00', color: 'white', border: 'none', fontWeight: 'bold' }}>
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Wishlist;