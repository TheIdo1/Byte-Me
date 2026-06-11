import React, { useRef } from 'react';
import RestaurantCard from './RestaurantCard';
import './RestaurantsCarousel.css';

import { ReactComponent as LeftArrowIcon } from '../assets/left_arrow.svg';
import { ReactComponent as RightArrowIcon } from '../assets/right_arrow.svg';

// Added seeMoreLink as an optional parameter
const RestaurantsCarousel = ({ title, subtitle, restaurants, seeMoreLink }) => {
  const trackRef = useRef(null);

  // Do not render if the array is empty or undefined
  if (!restaurants || restaurants.length === 0) return null;

  const scroll = (direction) => {
    if (trackRef.current) {
      // Dynamically get the visible width of the scrolling container.
      // Since our CSS forces exactly 4 cards per view, scrolling by this 
      // width will perfectly scroll 4 cards at a time.
      const scrollAmount = trackRef.current.clientWidth; 
      
      // The browser natively prevents scrolling past the maximum width,
      // so if there are fewer than 4 cards left, it will simply scroll to the end.
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="restaurants-carousel-container">
      
      {/* Header Area */}
      <div className="carousel-header">
        <div className="carousel-titles">
          <h2 className="carousel-title">{title}</h2>
          {subtitle && <p className="carousel-subtitle">{subtitle}</p>}
        </div>
        
        {/* Navigation Controls */}
        <div className="carousel-controls">
          {/* Render an anchor tag if the link is provided, otherwise a button */}
          {seeMoreLink ? (
            <a href={seeMoreLink} className="see-all-btn">See all</a>
          ) : (
            <button className="see-all-btn">See all</button>
          )}
          
          <div className="scroll-buttons">
            <button 
              className="icon-btn" 
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <LeftArrowIcon width="20" height="20" fill="currentColor" />
            </button>
            <button 
              className="icon-btn" 
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <RightArrowIcon width="20" height="20" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Scrolling Track */}
      <div className="carousel-track" ref={trackRef}>
        {restaurants.map((restaurant, index) => (
          <div className="carousel-item" key={restaurant.id || index}>
            <RestaurantCard 
              name={restaurant.name}
              imageUrl={restaurant.imageUrl}
              deliveryTime={restaurant.deliveryTime}
              rating={restaurant.rating}
              deliveryFee={restaurant.deliveryFee}
              tags={restaurant.tags}
              isSponsored={restaurant.isSponsored}
              promotion={restaurant.promotion}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantsCarousel;