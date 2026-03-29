import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false); // 🚨 New State

  useEffect(() => {
    // 1. Load Product Data
    axios.get(`https://flipkart-clone-backend-sm1d.onrender.com/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));

    // 2. Check if this product is already in Wishlist
    checkWishlistStatus();
  }, [id]);

  const checkWishlistStatus = () => {
    axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/wishlist')
      .then(res => {
        const found = res.data.some(item => item.id === parseInt(id));
        setIsInWishlist(found);
      })
      .catch(err => console.log("Wishlist check failed", err));
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      // Remove if already there
      axios.delete(`https://flipkart-clone-backend-sm1d.onrender.com/api/wishlist/${id}`)
        .then(() => {
          setIsInWishlist(false);
          toast.info("Removed from Wishlist");
        });
    } else {
      // Add if not there
      axios.post('https://flipkart-clone-backend-sm1d.onrender.com/api/wishlist', { product_id: product.id })
        .then(() => {
          setIsInWishlist(true);
          toast.success('Added to Wishlist! ❤️');
        });
    }
  };

  const addToCart = () => {
    axios.post('https://flipkart-clone-backend-sm1d.onrender.com/api/cart', { product_id: product.id })
      .then(() => {
        toast.success('Added to cart!');
        // 🚨 Automatically remove from wishlist when added to cart
        if (isInWishlist) {
            axios.delete(`https://flipkart-clone-backend-sm1d.onrender.com/api/wishlist/${id}`)
                 .then(() => setIsInWishlist(false));
        }
        window.dispatchEvent(new Event('cartUpdated')); 
      });
  };

  const buyNow = () => {
    axios.post('https://flipkart-clone-backend-sm1d.onrender.com/api/cart', { product_id: product.id })
      .then(() => {
        window.dispatchEvent(new Event('cartUpdated')); 
        navigate('/cart');
      });
  };

  if (!product) return <div className="loading">Loading...</div>;

  let images = [];
  if (Array.isArray(product.images)) {
    images = product.images.filter(img => img && img.trim().length > 10);
  } else if (typeof product.images === 'string') {
    try {
      let cleanString = product.images.replace(/^{/, '').replace(/}$/, '');
      let rawArray = cleanString.split(',');
      images = rawArray.map(img => img.replace(/^"/, '').replace(/"$/, '').trim())
                       .filter(img => img.length > 10);
    } catch(e) { console.error(e); }
  }

  const nextImg = () => setSelectedImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setSelectedImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const discount = Math.round((1 - product.price / product.original_price) * 100);

  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="detail-left">
          <div className="main-img-container">
            
            {/* 🚨 UPDATED: Heart color changes based on isInWishlist state */}
            <div className={`btn-wishlist-circle ${isInWishlist ? 'active' : ''}`} onClick={toggleWishlist}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
                fill={isInWishlist ? "#ff4343" : "none"} 
                stroke={isInWishlist ? "#ff4343" : "currentColor"} 
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="heart-icon">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>

            {images.length > 1 && <button className="carousel-btn left" onClick={prevImg}>&#10094;</button>}
            <img src={images[selectedImg]} alt={product.name} className="main-carousel-img" />
            {images.length > 1 && <button className="carousel-btn right" onClick={nextImg}>&#10095;</button>}
          </div>

          <div className="img-thumbnails">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" className={selectedImg === i ? 'active-thumb' : 'thumb'} onClick={() => setSelectedImg(i)} />
            ))}
          </div>

          <div className="detail-actions">
            <button className="btn-cart" onClick={addToCart}>🛒 Add to Cart</button>
            <button className="btn-buy" onClick={buyNow}>⚡ Buy Now</button>
          </div>
        </div>

        <div className="detail-right">
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-rating">⭐ {Number(product.rating || 0).toFixed(1)} <span>({Number(product.review_count).toLocaleString()})</span></div>
          <hr />
          <div className="detail-price">
            <span className="detail-current-price">₹{Number(product.price).toLocaleString()}</span>
            <span className="detail-original-price">₹{Number(product.original_price).toLocaleString()}</span>
            <span className="detail-discount">{discount}% off</span>
          </div>
          <hr />
          <div className="detail-specs">
            <h3>Product Details</h3>
            <table>
                <tbody>
                    <tr><td>Brand</td><td>{product.brand}</td></tr>
                    <tr><td>Category</td><td>{product.category}</td></tr>
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;