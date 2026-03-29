import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './OrderSummary.css';

function OrderSummary() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  const shippingAddress = location.state?.shippingAddress;

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/checkout');
    } else {
      axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/cart')
        .then(res => setCartItems(res.data))
        .catch(err => console.error("Error fetching cart", err));
    }
  }, [navigate, shippingAddress]);

  if (!shippingAddress) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = () => {
    const orderId = "OD" + Math.floor(Math.random() * 10000000000);
    toast.success('Order Placed Successfully!');
    navigate(`/order-confirmation/${orderId}`);
  };

  // CRITICAL FIX: Safe image parser to prevent the White Screen of Death
  const getSafeImage = (images) => {
    if (Array.isArray(images) && images.length > 0) return images[0];
    if (typeof images === 'string') {
      return images.replace(/[{}"']/g, '').split(',')[0];
    }
    return 'https://placehold.co/400x400/png?text=No+Image';
  };

  if (cartItems.length === 0) return <div className="loading" style={{textAlign: 'center', marginTop: '50px'}}>Loading Order Details...</div>;

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
                  onError={e => e.target.src='https://placehold.co/400x400/png?text=No+Image'} 
                />
                <div className="summary-item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">Quantity: {item.quantity}</p>
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