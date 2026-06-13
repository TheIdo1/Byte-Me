import React from 'react';
import './CategoryNav.css';

const CategoryNav = ({ categories, hasPopular }) => {
  return (
    <div className="category-nav-container">
      <div className="category-nav-content">
        <ul className="category-list">
          {hasPopular && (
            <li className="category-item">
              <a href="#category-popular" className="category-link">Most ordered</a>
            </li>
          )}
          
          {categories.map(category => (
            <li key={category} className="category-item">
              <a href={`#category-${category.replace(/\s+/g, '-')}`} className="category-link">
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryNav;