import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const CATEGORIES = ['All', 'Mobiles', 'Electronics', 'Footwear', 'Clothing', 'Appliances', 'Bags'];

function ProductList() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const location = useLocation();
  const search = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    
    axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/products', { params })
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, [search, category]);

  const getImageUrl = (imageField) => {
    const fallback = 'https://placehold.co/200x200/png?text=No+Image';
    if (!imageField) return fallback;
    
    if (Array.isArray(imageField) && imageField.length > 0) return imageField[0];
    
    if (typeof imageField === 'string') {
        try {
             const cleanString = imageField.replace(/^{|}$/g, '').replace(/^"|"$/g, '');
             const urls = cleanString.split('","');
             return urls[0] || fallback;
        } catch (e) {
            return fallback;
        }
    }
    return fallback;
  };

  return (
    <div className="product-list-page">
      <div className="category-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-btn ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {search && <p className="search-info">Results for: <strong>"{search}"</strong></p>}

      <div className="product-grid">
        {products.map(product => {
          if (!product || !product.name) return null; 

          return (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="product-img-wrap">
                <img 
                  src={getImageUrl(product.images)} 
                  alt={product.name} 
                  onError={e => e.target.src='https://placehold.co/200x200/png?text=Image+Blocked'} 
                />
              </div>
              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <div className="product-rating">
                  ⭐ {Number(product.rating || 0).toFixed(1)} <span>({Number(product.review_count || 0).toLocaleString()})</span>
                </div>
                <div className="product-price">
                  <span className="price">₹{Number(product.price || 0).toLocaleString()}</span>
                  {product.original_price && (
                    <>
                      <span className="original-price">₹{Number(product.original_price).toLocaleString()}</span>
                      <span className="discount">
                        {Math.round((1 - product.price / product.original_price) * 100)}% off
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ProductList;