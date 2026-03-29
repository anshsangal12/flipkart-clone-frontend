import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './OrderSummary.css';

function OrderSummary() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // CRITICAL FIX: Give it a default address so it NEVER crashes to a blank screen!
  const shippingAddress = location.state?.shippingAddress || {
    name: 'Valued Customer',
    phone: 'Provided at Checkout',
    street: 'Saved Delivery Address',
    city: 'Your City',
    pincode: '------'
  };

  useEffect(() => {
    // Fetch the cart items from the database
    axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/cart')
      .then(res => {
        setCartItems(res.data);
      })
      .catch(err => console.error("Error fetching cart", err));
  }, []);

  // Safely calculate total even if quantity is missing
  const total = cartItems.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 1;
    return sum + (itemPrice * itemQty);
  }, 0);

  const placeOrder = () => {
    // 1. Tell backend to empty the cart
    axios.delete('https://flipkart-clone-backend-sm1d.onrender.com/api/cart/clear')
      .then(() => {
        // 2. Reset the cart bubble in the navbar to 0
        window.dispatchEvent(new Event('cartUpdated')); 
        
        // 3. Go to confirmation page
        const orderId = "OD" + Math.floor(Math.random() * 10000000000);
        toast.success('Order Placed Successfully!');
        navigate(`/order-confirmation/${orderId}`);
      })
      .catch(err => {
        // If it fails, we will see it in the console!
        console.error("Failed to clear cart", err);
        toast.error("Order placed, but failed to clear cart.");
        
        // Still send them to confirmation so they don't get stuck
        const orderId = "OD" + Math.floor(Math.random() * 10000000000);
        navigate(`/order-confirmation/${orderId}`);
      });
  };

  // Safely grab the first image
  const getSafeImage = (images) => {
    if (Array.isArray(images) && images.length > 0) return images[0];
    if (typeof images === 'string') {
      return images.replace(/[{}"']/g, '').split(',')[0];
    }
    return 'https://placehold.co/100x100/png?text=Item';
  };

  // If cart is empty, show a friendly message instead of a blank screen
  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h2>Loading your order details...</h2>
        <p>If this takes too long, your cart might be empty.</p>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="summary-page">
      <div className="summary-container">
        
        <div className="summary-left">
          <div className="summary-section">
            <h3>1. Delivery Address ✅</h3>
            <p><strong>{shippingAddress.name}</strong> - {shippingAddress.phone}</p>
            <p>{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.pincode}</p>
          </div>

          <div className="summary-section">
            <h3>2. Order Summary</h3>
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <img 
                  src={getSafeImage(item.images)} 
                  alt={item.name} 
                  onError={e => e.target.src='https://placehold.co/100x100/png?text=Item'} 
                />
                <div className="summary-item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">Quantity: {item.quantity || 1}</p>
                  <p className="item-price">₹{Number(item.price).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="summary-right">
          <div className="price-details-card">
            <h3>Price Details</h3>
            <hr />
            <div className="price-row">
              <span>Price ({cartItems.length} items)</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Delivery Charges</span>
              <span style={{color: '#388e3c', fontWeight: '500'}}>Free</span>
            </div>
            <hr />
            <div className="price-row final-total">
              <span>Amount Payable</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button className="btn-place-order" onClick={placeOrder}>Confirm & Place Order</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderSummary;