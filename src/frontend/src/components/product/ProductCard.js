import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // Extract restaurant ID from the current URL
  const { restaurantId } = useParams();

  return (
    // Link to the specific product URL
    <Link to={`/restaurants/${restaurantId}/products/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-info">
          <h4 className="product-name">{product.name}</h4>
          <p className="product-description">{product.description}</p>
          <span className="product-price">₪{product.price.toFixed(2)}</span>
        </div>
        
        <div className="product-image-wrapper">
          <img src={product.image} alt={product.name} className="product-thumbnail" />
          <div className="add-button-icon">
            <span>+</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;