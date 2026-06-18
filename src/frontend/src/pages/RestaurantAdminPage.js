// src/frontend/src/pages/RestaurantAdminPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantById } from '../api/restaurantsApi';
import './RestaurantAdminPage.css';
import EditRestaurantDetails from '../components/admin/EditRestaurantDetails';
import ManageProducts from '../components/admin/ManageProducts';

/*
RestaurantAdminPage
The main dashboard for managing a specific restaurant.
Includes tabs for editing the restaurant's details and managing its menu products.
*/
export default function RestaurantAdminPage({ token, user, isOwner }) {
    // Extract the restaurant ID from the URL (e.g., /manage/restaurants/1234)
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    
    const [restaurant, setRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // State to keep track of which tab is currently active
    const [activeTab, setActiveTab] = useState('details'); // 'details' | 'products'

    useEffect(() => {
        // Security check: Must be logged in and flagged as an owner globally
        if (!token || !isOwner) {
            navigate('/');
            return;
        }

        const fetchRestaurant = async () => {
            try {
                const data = await getRestaurantById(restaurantId);
                
                // Deep Security Check: Ensure the currently logged-in user 
                // is actually in the authorizedUsers list for THIS specific restaurant.
                if (!data.authorizedUsers || !data.authorizedUsers.includes(user.id)) {
                    console.error("Unauthorized access: You do not own this restaurant.");
                    navigate('/manage/restaurants');
                    return;
                }
                
                setRestaurant(data);
            } catch (error) {
                console.error("Failed to fetch restaurant details:", error);
                navigate('/manage/restaurants');
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.id) {
            fetchRestaurant();
        }
    }, [restaurantId, token, isOwner, user, navigate]);

    if (isLoading) {
        return <div className="admin-page-container"><div className="admin-loading">Loading dashboard...</div></div>;
    }

    if (!restaurant) return null;

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <h1>Manage: {restaurant.name}</h1>
                <button className="back-btn" onClick={() => navigate('/manage/restaurants')}>
                    &larr; Back to My Restaurants
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="admin-tabs">
                <button 
                    className={`admin-tab ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                >
                    Restaurant Details
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Menu & Products
                </button>
            </div>

            {/* Dynamic Tab Content Area */}
            <div className="admin-content">
                
                {/* DETAILS TAB */}
                {activeTab === 'details' && (
                    <EditRestaurantDetails 
                        restaurant={restaurant} 
                        // Callback to trigger a re-fetch of the restaurant 
                        // data so the UI updates immediately after a save
                        onUpdated={() => {
                            getRestaurantById(restaurantId).then(setRestaurant);
                        }} 
                    />
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <ManageProducts 
                        restaurantId={restaurant.id} 
                        subcategories={restaurant.subcategories}
                    />
                )}

            </div>
        </div>
    );
}