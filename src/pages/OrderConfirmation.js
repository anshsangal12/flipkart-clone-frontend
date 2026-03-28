import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className="confirm-page">
      <div className={`confirm-box ${show ? 'show' : ''}`}>
        <div className="confirm-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p>Your order ID is <strong>#{id}</strong></p>
        <p>Thank you for shopping with Flipkart!</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    </div>
  );
}

export default OrderConfirmation;