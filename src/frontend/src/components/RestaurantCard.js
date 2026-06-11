import React from 'react';
import './RestaurantCard.css';
import { ReactComponent as SmileyIcon } from '../assets/smiley_face.svg';
import { ReactComponent as MotorcycleIcon } from '../assets/motorcycle.svg';
import { ReactComponent as LightbulbIcon } from '../assets/lightbulb.svg'

const RestaurantCard = ({ name, imageUrl, deliveryTime, rating, deliveryFee, tags, isSponsored, promotion }) => {
  return (
    <div className="restaurant-card">
      <div className="image-wrapper">
        <img src={imageUrl} alt={name} className="restaurant-image" />
        {/* Conditional rendering for the promotion badge */}
        {promotion && (
          <div className="promotion-badge">
            <span className="promotion-icon">
              <LightbulbIcon fill="currentColor" />
            </span>
            <span>{promotion}</span>
          </div>
        )}
      </div>

      <div className="card-content">
        {/* Top Section: Name, Tags, Sponsored, and Time Badge */}
        <div className="content-top">
          <div className="info-column">
            <h3 className="restaurant-name">{name}</h3>
            <div className="tags-row">
              <span className="restaurant-tags">{tags.join(' | ')}</span>
              {isSponsored && (
                <span className="sponsored-badge">Sponsored</span>
              )}
            </div>
          </div>

          <div className="delivery-time-badge">
            <span className="time-value">{deliveryTime}</span>
            <span className="time-unit">min</span>
          </div>
        </div>

        {/* Dashed Divider */}
        <div className="divider"></div>

        {/* Bottom Section: Delivery Fee, Price Level, Rating */}
        <div className="content-bottom">
          <div className="bottom-item">
            <span className="delivery-icon">
              <MotorcycleIcon />
            </span>
            <span>₪{deliveryFee}</span>
          </div>
          <span className="dot-separator">·</span>
          <div className="bottom-item price-level">
            <span className="active-price">$$</span><span className="inactive-price">$$</span>
          </div>
          <span className="dot-separator">·</span>
          <div className="bottom-item">
            <span className="rating-icon">
              <SmileyIcon fill="currentColor" />
            </span>
            <span className="rating-score">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;