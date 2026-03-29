import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = () => {
    axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/cart')
      .then(res => setCartItems(res.data));
  };

  useEffect(() => { fetchCart(); }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // This forces the page to start at the very top!
  }, []);

  const updateQty = (id, quantity) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    axios.put(`https://flipkart-clone-backend-sm1d.onrender.com/api/cart/${id}`, { quantity })
      .then(() => {
        fetchCart(); 
        setCartItems(prev => prev.map(item => 
          item.id === id ? { ...item, quantity: quantity } : item
        ));
      })
      .catch(err => console.error("Update failed", err));
  };

  const removeItem = (id) => {
    axios.delete(`https://flipkart-clone-backend-sm1d.onrender.com/api/cart/${id}`)
      .then(() => { 
        toast.success('Item removed!'); 
        
        // Remove item from UI instantly
        setCartItems(prev => prev.filter(item => item.id !== id));
        
        // Broadcast signal to Navbar
        window.dispatchEvent(new Event('cartUpdated')); 
      })
      .catch(err => console.error("Delete failed", err));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) return (
    <div className="cart-empty">
      <h2>Your cart is empty!</h2>
      <button onClick={() => navigate('/')}>Shop Now</button>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items">
          <h2>My Cart ({cartItems.length})</h2>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.images[0]} alt={item.name}
                onError={e => e.target.src='https://via.placeholder.com/100'} />
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">₹{Number(item.price).toLocaleString()}</p>
                <div className="cart-qty">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Price Details</h3>
          <hr />
          <div className="summary-row">
            <span>Price ({cartItems.length} items)</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span className="free">Free</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;