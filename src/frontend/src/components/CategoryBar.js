import React from 'react';
import Category from './Category'; // Importing the child component
import './CategoryBar.css';


// STATIC DATA
// Using an object with an 'id' is an industry standard because React requires 
// a unique 'key' prop when rendering lists to optimize performance.
export const CATEGORIES_DATA = [
    { id: 'cat-1', name: 'Israeli', emoji: '🧆' },
    { id: 'cat-2', name: 'Italian', emoji: '🍕' },
    { id: 'cat-3', name: 'Asian', emoji: '🍜' },
    { id: 'cat-4', name: 'Burgers', emoji: '🍔' },
    { id: 'cat-5', name: 'Mediterranean', emoji: '🥙' },
    { id: 'cat-6', name: 'Cafe', emoji: '☕' },
    { id: 'cat-7', name: 'Vegan', emoji: '🥗' },
    { id: 'cat-8', name: 'Grill', emoji: '🥩' },
    { id: 'cat-9', name: 'Street Food', emoji: '🌭' },
    { id: 'cat-10', name: 'Kosher', emoji: '🍽️' },
    { id: 'cat-11', name: 'Mexican', emoji: '🌮' },
    { id: 'cat-12', name: 'Seafood', emoji: '🦐' },
    { id: 'cat-13', name: 'Fine Dining', emoji: '🍷' },
    { id: 'cat-14', name: 'Desserts', emoji: '🍰' },
    { id: 'cat-15', name: 'Bars & Pubs', emoji: '🍻' }
];


// CategoryBar Component (Parent Component)
// This component acts as a container. It iterates over the CATEGORIES_DATA array
// and renders a <Category /> component for each item.
export default function CategoryBar() {
    return (
        <div className="category-bar-container">
            <div className="category-bar-scroll">
                {
                    // LIST RENDERING 
                    // We use the JavaScript .map() function to loop over the data array.
                    // For each item in the array, we return one <Category /> component.
                    // The key prop is mandatory in React when rendering lists.
                    // it helps React uniquely identify which items have changed, are added, or are removed.
                    CATEGORIES_DATA.map((category) => (
                        <Category 
                            key={category.id} 
                            name={category.name} 
                            emoji={category.emoji} 
                        />
                    ))
                }
            </div>
        </div>
    );
}