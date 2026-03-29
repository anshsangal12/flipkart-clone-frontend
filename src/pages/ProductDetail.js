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
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    axios.get(`https://flipkart-clone-backend-sm1d.onrender.com/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));

    checkWishlistStatus();
  }, [id]);

  const checkWishlistStatus = () => {
    axios.get('https://flipkart-clone-backend-sm1d.onrender.com/api/wishlist')
      .then(res => {
        const found = res.data.some(item => item.id === parseInt(id));
        setIsInWishlist(found);
      })
      .catch(() => {});
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      axios.delete(`https://flipkart-clone-backend-sm1d.onrender.com/api/wishlist/${id}`)
        .then(() => {
          setIsInWishlist(false);
          toast.info("Removed from Wishlist");
        });
    } else {
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

  /* ✅ SPECIFICATIONS WITHOUT DB CHANGE */
  const getSpecifications = (product) => {
    switch (product.category) {
      case "Mobiles":
        return { Display: "6.1 inch", RAM: "6 GB", Storage: "128 GB", Battery: "4000 mAh" };
      case "Electronics":
        return { Warranty: "1 Year", Connectivity: "Bluetooth / USB" };
      case "Footwear":
        return { Material: "Mesh", Sole: "Rubber" };
      case "Clothing":
        return { Fabric: "Cotton", Fit: "Regular" };
      case "Appliances":
        return { Warranty: "1 Year", Type: "Smart Device" };
      case "Bags":
        return { Capacity: "30L", Material: "Polyester" };
      default:
        return {};
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  let images = [];
  if (Array.isArray(product.images)) {
    images = product.images.filter(img => img && img.trim().length > 10);
  }

  const nextImg = () => setSelectedImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setSelectedImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const discount = Math.round((1 - product.price / product.original_price) * 100);

  return (
    <div className="detail-page">
      <div className="detail-container">

        {/* LEFT */}
        <div className="detail-left">
          <div className="main-img-container">

            <div className={`btn-wishlist-circle ${isInWishlist ? 'active' : ''}`} onClick={toggleWishlist}>
              {isInWishlist ? "❤️" : "🤍"}
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
            <button className="btn-cart" onClick={addToCart} disabled={product.stock === 0}>🛒 Add to Cart</button>
            <button className="btn-buy" onClick={buyNow}>⚡ Buy Now</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="detail-right">
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            ⭐ {Number(product.rating || 0).toFixed(1)} 
            <span>({Number(product.review_count).toLocaleString()})</span>
          </div>

          <hr />

          <div className="detail-price">
            <span className="detail-current-price">₹{Number(product.price).toLocaleString()}</span>
            <span className="detail-original-price">₹{Number(product.original_price).toLocaleString()}</span>
            <span className="detail-discount">{discount}% off</span>
          </div>

          {/* ✅ STOCK ADDED */}
          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">
                ✔ In Stock {product.stock <= 5 && `(Only ${product.stock} left!)`}
              </span>
            ) : (
              <span className="out-stock">❌ Out of Stock</span>
            )}
          </div>

          <hr />

          {/* DETAILS */}
          <div className="detail-specs">
            <h3>Product Details</h3>
            <table>
              <tbody>
                <tr><td>Brand</td><td>{product.brand}</td></tr>
                <tr><td>Category</td><td>{product.category}</td></tr>
              </tbody>
            </table>
          </div>

          {/* ✅ SPECIFICATIONS ADDED */}
          <div className="detail-specs">
            <h3>Specifications</h3>
            <table>
              <tbody>
                {Object.entries(getSpecifications(product)).map(([key, value], i) => (
                  <tr key={i}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;