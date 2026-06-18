// src/frontend/src/pages/OwnerRestaurantsPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllRestaurants } from '../api/restaurantsApi';
import EmptyState from '../components/EmptyState';
import './OwnerRestaurantsPage.css';

/*
OwnerRestaurantsPage - This page shows all restaurants that the current logged-in owner
is allowed to manage

Flow:
Check if the user is logged in and has owner permissions.
Fetch all restaurants from the server.
Filter only the restaurants that belong to this owner.
Display the restaurants as clickable cards.
*/
export default function OwnerRestaurantsPage({ token, user, isOwner }) {
    const navigate = useNavigate();

    // Stores the restaurants that belong to the current owner
    const [restaurants, setRestaurants] = useState([]);

    // Used to show a loading message while the data is being fetched
    const [isLoading, setIsLoading] = useState(true);


    
    useEffect(() => {
        // Security check: If not logged in or not an owner, redirect to home
        if (!token || !isOwner) {
            navigate('/');
            return;
        }

        const fetchMyRestaurants = async () => {
            try {
                // Fetch all restaurants from the server
                const allRestaurants = await getAllRestaurants();
                
                // Filter the restaurants to only include those where the current user
                // is listed in the 'authorizedUsers' array
                const myRestaurants = allRestaurants.filter(rest => 
                    rest.authorizedUsers && rest.authorizedUsers.includes(user.id)
                );
                
                setRestaurants(myRestaurants);
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch if we have a valid user object
        if (user && user.id) {
            fetchMyRestaurants();
        }
    }, [token, isOwner, user, navigate]);

    if (isLoading) {
        return <div className="owner-page-container"><div className="owner-loading">Loading your restaurants...</div></div>;
    }

    return (
        <div className="owner-page-container">
            <div className="owner-page-inner">
                <div className="owner-page-header">
                    <h1>My Restaurants</h1>
                    <Link to="/restaurants/new" className="owner-add-btn">
                        + Add Restaurant
                    </Link>
                </div>

                {restaurants.length === 0 ? (
                    <EmptyState 
                        icon="🏪" 
                        title="No restaurants found" 
                        subtitle="You haven't created or been assigned to any restaurants yet." 
                    />
                ) : (
                    <div className="owner-restaurants-grid">
                        {restaurants.map(rest => (
                            <Link 
                                to={`/manage/restaurants/${rest.id}`} 
                                key={rest.id} 
                                className="owner-restaurant-card"
                            >
                                <img src={rest.image} alt={rest.name} className="owner-restaurant-img" />
                                <div className="owner-restaurant-info">
                                    <h3>{rest.name}</h3>
                                    <p>{rest.address?.city}, {rest.address?.street}</p>
                                </div>
                                <div className="owner-restaurant-action">&rarr;</div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}