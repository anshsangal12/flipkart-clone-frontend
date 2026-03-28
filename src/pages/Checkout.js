import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    full_name: '', phone: '', address: '', city: '', state: '', pincode: ''
  });

  useEffect(() => {
    axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/cart').then(res => setCartItems(res.data));
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('https://flipkart-clone-backend-sm1d.onrender.com/api/orders', {
      ...form,
      total_amount: total,
      items: cartItems
    }).then(res => navigate(`/order-confirmation/${res.data.order_id}`));
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form-section">
          <h2>Delivery Address</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <input name="full_name" placeholder="Full Name" required value={form.full_name} onChange={handleChange} />
            <input name="phone" placeholder="Phone Number" required value={form.phone} onChange={handleChange} />
            <input name="address" placeholder="Address (House No, Street, Area)" required value={form.address} onChange={handleChange} />
            <div className="form-row">
              <input name="city" placeholder="City" required value={form.city} onChange={handleChange} />
              <input name="state" placeholder="State" required value={form.state} onChange={handleChange} />
            </div>
            <input name="pincode" placeholder="Pincode" required value={form.pincode} onChange={handleChange} />

            <div className="order-summary-box">
              <h3>Order Summary</h3>
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <hr />
              <div className="summary-item total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button type="submit" className="place-order-btn">Place Order</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;