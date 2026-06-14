import React from 'react';
import './RestaurantHeader.css';

const RestaurantHeader = ({ restaurant }) => {
  return (
    <div className="restaurant-header-wrapper">
      
      {/* Cover Image with Dark Gradient Overlay */}
      <div 
        className="restaurant-cover" 
        style={{ backgroundImage: `url(${restaurant.image})` }}
      >
        <div className="cover-gradient">
          <div className="header-content-container">
            <h1 className="restaurant-title-overlay">{restaurant.name}</h1>
            <p className="restaurant-subtitle-overlay">{restaurant.category} • {restaurant.description}</p>
          </div>
        </div>
      </div>
      
      {/* White Info Strip Below Image */}
      <div className="restaurant-info-strip">
        <div className="header-content-container">
          <div className="restaurant-info-bar">
            <div className="info-item delivery-time">
              <span className="info-icon">🚴</span>
              <span>Delivery 35-45 min</span>
            </div>
            <span className="info-dot">·</span>
            <div className="info-item rating">
              <span className="info-icon">😍</span>
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <span className="info-dot">·</span>
            <div className="info-item">
              <span>Min. order ₪50.00</span>
            </div>
            
            {restaurant.promotionalMessage && (
              <>
                <span className="info-dot">·</span>
                <div className="info-item promo-message">
                  <span className="info-icon">🏷️</span>
                  <span>{restaurant.promotionalMessage}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default RestaurantHeader;