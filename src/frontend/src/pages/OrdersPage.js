import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders } from '../api/ordersApi';
import { getRestaurantById } from '../api/restaurantsApi';
import { getRestaurantProducts } from '../api/productsApi';
import './OrdersPage.css';

const formatDate = (date) => {
  const { day, month, year, hour, minute } = date;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(day)}/${pad(month)}/${year} · ${pad(hour)}:${pad(minute)}`;
};

const OrdersPage = ({ token }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [restaurantMap, setRestaurantMap] = useState({});
  const [productMap, setProductMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const myOrders = await getMyOrders();
        // Sort newest first
        myOrders.sort((a, b) => {
          const toMs = (d) => new Date(d.year, d.month - 1, d.day, d.hour, d.minute, d.second).getTime();
          return toMs(b.date) - toMs(a.date);
        });
        setOrders(myOrders);

        // Fetch restaurant + product info for each unique restaurantId
        const uniqueRestaurantIds = [...new Set(myOrders.map(o => o.restaurantId))];
        const restaurantResults = await Promise.all(
          uniqueRestaurantIds.map(id => getRestaurantById(id).catch(() => null))
        );
        const productResults = await Promise.all(
          uniqueRestaurantIds.map(id => getRestaurantProducts(id).catch(() => []))
        );

        const rMap = {};
        const pMap = {};
        uniqueRestaurantIds.forEach((id, i) => {
          if (restaurantResults[i]) rMap[id] = restaurantResults[i];
          const products = productResults[i] || [];
          products.forEach(p => { pMap[p.id || p._id] = p; });
        });

        setRestaurantMap(rMap);
        setProductMap(pMap);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (isLoading) {
    return <div className="orders-page-status">Loading your orders...</div>;
  }

  if (error) {
    return <div className="orders-page-status orders-page-status--error">{error}</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-page-inner">
        <h1 className="orders-page-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">🍽️</div>
            <p>You haven't placed any orders yet.</p>
            <Link to="/" className="orders-browse-btn">Browse restaurants</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const restaurant = restaurantMap[order.restaurantId];

              // Build a readable item list: count duplicates
              const itemCounts = {};
              order.orderedItems.forEach(productId => {
                const product = productMap[productId];
                const name = product?.name ?? productId;
                itemCounts[name] = (itemCounts[name] || 0) + 1;
              });

              return (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-restaurant-name">
                        {restaurant?.name ?? 'Restaurant'}
                      </span>
                      <span className="order-date">{formatDate(order.date)}</span>
                    </div>
                    {restaurant && (
                      <Link
                        to={`/restaurants/${order.restaurantId}`}
                        className="order-reorder-btn"
                      >
                        Order again
                      </Link>
                    )}
                  </div>

                  <ul className="order-items-list">
                    {Object.entries(itemCounts).map(([name, count]) => (
                      <li key={name} className="order-item">
                        <span className="order-item-qty">{count}×</span>
                        <span className="order-item-name">{name}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="order-item-count">
                    {order.orderedItems.length} item{order.orderedItems.length !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
