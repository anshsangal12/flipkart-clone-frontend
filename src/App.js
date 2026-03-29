import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSummary from './pages/OrderSummary';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';

function App() {
  return (
    <Router>
      <div className="app-container">

        <Navbar />

        <ToastContainer position="top-right" autoClose={2000} />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-summary" element={<OrderSummary />} /> 
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>

        <Footer />

      </div>
    </Router>
  );
}

export default App;