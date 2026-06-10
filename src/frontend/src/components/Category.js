import React from 'react';
import './Category.css';


// Category Component (Child Component)
// This is a "dumb" or "presentational" component. It does not manage any state.
// the component job to receive data via props (emoji and name) and render it visually.
export default function Category({ name, emoji }) {
    return (
        <div className="category-item">
            <div className="category-emoji">
                {emoji}
            </div>
            <span className="category-name">
                {name}
            </span>
        </div>
    );
}