import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>ABOUT</h3>
          <a href="#">Contact Us</a>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Flipkart Stories</a>
        </div>
        <div className="footer-column">
          <h3>HELP</h3>
          <a href="#">Payments</a>
          <a href="#">Shipping</a>
          <a href="#">Cancellation & Returns</a>
          <a href="#">FAQ</a>
        </div>
        <div className="footer-column">
          <h3>CONSUMER POLICY</h3>
          <a href="#">Return Policy</a>
          <a href="#">Terms Of Use</a>
          <a href="#">Security</a>
          <a href="#">Privacy</a>
        </div>
        <div className="footer-column border-left">
          <h3>Mail Us:</h3>
          <p>Flipkart Internet Private Limited,<br/>
             Buildings Alyssa, Begonia &<br/>
             Clove Embassy Tech Village,<br/>
             Outer Ring Road, Devarabeesanahalli Village,<br/>
             Bengaluru, 560103,<br/>
             Karnataka, India</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Become a Seller</p>
        <p>Advertise</p>
        <p>Gift Cards</p>
        <p>Help Center</p>
        <p>© 2007-2024 Flipkart.com</p>
      </div>
    </footer>
  );
}

export default Footer;