import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../api/restaurantsApi';
import { getRestaurantProducts } from '../api/productsApi';
import { Outlet } from 'react-router-dom';
import ProductCard from '../components/ProductCard';


const RestaurantPage = () => {
  // Extract the restaurantId from the URL parameters
  const { restaurantId } = useParams();

  // states to hold data, loading status and errors
  const [restaurant, setRestaurant] = useState(null)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(null)
  const [error, setError] = useState(null)

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

  // Render the actual page once data is successfully loaded
  return (
    <div style={{ padding: '40px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <h1>{restaurant.name}</h1>
      <p>Currently viewing details for Restaurant ID: <strong>{restaurantId}</strong></p>

      <div style={{ marginTop: '20px', marginBottom: '40px' }}>
        <p><strong>Category:</strong> {restaurant.category}</p>
        <p><strong>Rating:</strong> {restaurant.rating} ★</p>
        <p><strong>Delivery Fee:</strong> ₪{restaurant.deliveryFee}</p>
      </div>

      {/* list all prodcts */}
      <h2>Menu</h2>
      <div className="products-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map(product => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>

      {/* render Modal (pop-up), pass products argument so it has context*/}
      <Outlet context={products} />
    </div>
  );
};

export default RestaurantPage;