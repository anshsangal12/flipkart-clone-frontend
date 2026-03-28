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
      .then(res => setProduct(res.data));
  }, [id]);

  const addToCart = () => {
    axios.post('https://flipkart-clone-backend-sm1d.onrender.com/api/cart', { product_id: product.id })
      .then(() => toast.success('Added to cart!'));
  };

  const buyNow = () => {
    axios.post('https://flipkart-clone-backend-sm1d.onrender.com/api/cart', { product_id: product.id })
      .then(() => navigate('/cart'));
  };

  if (!product) return <div className="loading">Loading...</div>;

  const discount = Math.round((1 - product.price / product.original_price) * 100);

  return (
    <div className="detail-page">
      <div className="detail-container">

        <div className="detail-left">
          <div className="main-img">
            <img src={product.images[selectedImg]} alt={product.name}
              onError={e => e.target.src='https://via.placeholder.com/400'} />
          </div>
          <div className="img-thumbnails">
            {product.images.map((img, i) => (
              <img key={i} src={img} alt="" className={selectedImg === i ? 'active' : ''}
                onClick={() => setSelectedImg(i)}
                onError={e => e.target.src='https://via.placeholder.com/60'} />
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
            ⭐ {product.rating} <span>{product.review_count.toLocaleString()} ratings</span>
          </div>
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