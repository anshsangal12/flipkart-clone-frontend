import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './OrderSummary.css';

function OrderSummary() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the address passed from Checkout.js
  const shippingAddress = location.state?.shippingAddress;

  useEffect(() => {
    // Security check: If they somehow got here without entering an address, send them back
    if (!shippingAddress) {
      toast.error("Please enter a delivery address first.");
      navigate('/checkout');
      return;
    }

    // Fetch the cart items to show the final bill
    axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/cart')
      .then(res => setCartItems(res.data))
      .catch(err => console.error("Error fetching cart for summary", err));
  }, [navigate, shippingAddress]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = () => {
    // Generate a fake order ID for the confirmation page
    const orderId = "OD" + Math.floor(Math.random() * 10000000000);
    
    // In a real app, you would POST to /api/orders here and clear the cart.
    // For now, we just show success and navigate to the confirmation page!
    toast.success('Order Placed Successfully!');
    navigate(`/order-confirmation/${orderId}`);
  };

  if (cartItems.length === 0) return <div className="loading">Loading Order Details...</div>;

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
                <img src={item.images[0]} alt={item.name} onError={e => e.target.src='/images/placeholder.png'} />
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
              <span className="free">Free</span>
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