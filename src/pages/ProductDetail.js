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

  useEffect(() => {
    axios.get(`https://flipkart-clone-backend-sm1d.onrender.com/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const addToCart = () => {
    axios.post('https://flipkart-clone-backend-sm1d.onrender.com/api/cart', { product_id: product.id })
      .then(() => {
        toast.success('Added to cart!');
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

  // --- BUG FIX: Strict filtering for empty or broken image URLs ---
  let images = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    images = product.images.filter(img => img && img.trim().length > 10);
  } else if (typeof product.images === 'string') {
    try {
      const cleanString = product.images.replace(/^{|}$/g, '').replace(/^"|"$/g, '');
      images = cleanString.split('","').filter(img => img && img.trim().length > 10);
    } catch(e) {}
  }

  // Safety fallback if the database gives us totally empty data
  if (images.length === 0) {
    images = ['https://placehold.co/400x400/png?text=No+Image'];
  }

  // Carousel Functions
  const nextImg = () => {
    setSelectedImg((prev) => (prev + 1) % images.length);
  };

  const prevImg = () => {
    setSelectedImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const discount = Math.round((1 - product.price / product.original_price) * 100);

  return (
    <div className="detail-page">
      <div className="detail-container">

        <div className="detail-left">
          {/* CAROUSEL MAIN IMAGE */}
          <div className="main-img-container">
            {images.length > 1 && (
              <button className="carousel-btn left" onClick={prevImg}>&#10094;</button>
            )}
            
            <img 
              src={images[selectedImg]} 
              alt={product.name}
              className="main-carousel-img"
              onError={e => e.target.src='https://placehold.co/400x400/png?text=Image+Blocked'} 
            />
            
            {images.length > 1 && (
              <button className="carousel-btn right" onClick={nextImg}>&#10095;</button>
            )}
          </div>

          {/* CAROUSEL THUMBNAILS */}
          <div className="img-thumbnails">
            {images.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`Thumbnail ${i + 1}`} 
                className={selectedImg === i ? 'active-thumb' : 'thumb'}
                onClick={() => setSelectedImg(i)}
                onError={e => e.target.src='https://placehold.co/60x60/png?text=Err'} 
              />
            ))}
          </div>

          <div className="detail-actions">
            <button className="btn-cart" onClick={addToCart}>🛒 Add to Cart</button>
            <button className="btn-buy" onClick={buyNow}>⚡ Buy Now</button>
          </div>
        </div>

        <div className="detail-right">
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-rating">
            ⭐ {Number(product.rating || 0).toFixed(1)} <span>{(product.review_count || 0).toLocaleString()} ratings</span>
          </div>
          <hr />
          <div className="detail-price">
            <span className="detail-current-price">₹{Number(product.price).toLocaleString()}</span>
            {product.original_price && (
              <>
                <span className="detail-original-price">₹{Number(product.original_price).toLocaleString()}</span>
                <span className="detail-discount">{discount}% off</span>
              </>
            )}
          </div>
          <hr />
          <div className="detail-specs">
            <h3>Product Details</h3>
            <table>
              <tbody>
                <tr><td>Brand</td><td>{product.brand}</td></tr>
                <tr><td>Category</td><td>{product.category}</td></tr>
                <tr><td>Availability</td><td>{product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;