// React
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Outlet } from 'react-router-dom';
// APIs
import { getRestaurantById } from '../api/restaurantsApi';
import { getRestaurantProducts } from '../api/productsApi';

//import css
import './RestaurantPage.css';

// Componnets
import ProductCard from '../components/product/ProductCard';
import RestaurantHeader from '../components/restaurantPage/RestaurantHeader';
import CategoryNav from '../components/restaurantPage/CategoryNav';
import CartSidebar from '../components/restaurantPage/CartSidebar';


const RestaurantPage = ({ token }) => {
  // Extract the restaurantId from the URL parameters
  const { restaurantId } = useParams();

  // states to hold data, loading status and errors
  const [restaurant, setRestaurant] = useState(null)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(null)
  const [error, setError] = useState(null)
  const [cartItems, setCartItems] = useState([])

  const addToCart = useCallback((product, quantity, selectedExtras) => {
    setCartItems(prev => [...prev, { product, quantity, selectedExtras }]);
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  useEffect(() => {
    // check if restaurant exists, if no, return 404

    //define async method to use 
    const fetchRestaurantData = async () => {
      setIsLoading(true);
      setError(null)

      try {
        // wait to fetch all data
        const [restaurantData, productsData] = await Promise.all([
          getRestaurantById(restaurantId),
          getRestaurantProducts(restaurantId)
        ]);

        //save to state
        setRestaurant(restaurantData);
        setProducts(productsData);
      }
      catch (err) {
        console.error("Error fetching restaurant:", err);
        setError("Failed to load restaurant details. Please try again")
      }
      finally {
        setIsLoading(false)
      }
    };

    fetchRestaurantData();

  }, [restaurantId])



  // Render different UI based on the current state
  if (isLoading) {
    return <div style={{ padding: '40px' }}>Loading restaurant details...</div>;
  }

  if (error) {
    return <div style={{ padding: '40px', color: 'red' }}>{error}</div>;
  }

  if (!restaurant) {
    return <div style={{ padding: '40px' }}>404 - Restaurant not found</div>;
  }

  // prep stuff for the page and then render it .
  const popularProducts = products.filter(p => p.isPopular);

  const activeCategories = restaurant.subcategories.filter(cat => cat !== 'extras' && products.some(p => p.category === cat))

  // Render the actual page once data is successfully loaded
  return (
    <div className="restaurant-page-root">

      <RestaurantHeader restaurant={restaurant} />
      <CategoryNav categories={activeCategories} hasPopular={popularProducts.length > 0} />

      <div className="restaurant-body">
        <div className="restaurant-menu-container">

          {/* Popular Section */}
          {popularProducts.length > 0 && (
            <section id="category-popular" className="menu-section">
              <h2 className="section-title">Most ordered</h2>
              <div className="products-grid">
                {popularProducts.map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Categories Section */}
          {activeCategories.map(category => {
            const categoryProducts = products.filter(p => p.category === category);
            return (
              <section id={`category-${category.replace(/\s+/g, '-')}`} key={category} className="menu-section">
                <h2 className="section-title">{category}</h2>
                <div className="products-grid">
                  {categoryProducts.map(product => (
                    <ProductCard key={product.id || product._id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}

        </div>

        <div className="restaurant-sidebar-column">
          <CartSidebar
            cartItems={cartItems}
            restaurantId={restaurantId}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            products={products}
            isLoggedIn={!!token}
          />
        </div>
      </div>

      {/* Render Modal */}
      <Outlet context={{ products, addToCart }} />
    </div>
  );
};

export default RestaurantPage;