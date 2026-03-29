import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    pincode: ''
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const proceedToSummary = (e) => {
    e.preventDefault();
    // Pass the address data forward to the Order Summary page!
    navigate('/order-summary', { state: { shippingAddress: address } });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h2>Delivery Address</h2>
        <form onSubmit={proceedToSummary} className="checkout-form">
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
          <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} />
          <input type="text" name="street" placeholder="Street Address / Locality" required onChange={handleChange} />
          <div className="row">
            <input type="text" name="city" placeholder="City" required onChange={handleChange} />
            <input type="text" name="pincode" placeholder="Pincode" required onChange={handleChange} />
          </div>
          <button type="submit" className="btn-continue">Deliver Here</button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;