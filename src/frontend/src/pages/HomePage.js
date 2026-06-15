import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchQuery as searchApi } from '../api/searchApi';
import { getAllRestaurants } from '../api/restaurantsApi';
import RestaurantsCarousel from '../components/restaurant/RestaurantsCarousel';

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toCardProps(r) {
  return {
    id: r.id,
    name: r.name,
    imageUrl: r.image,
    rating: r.rating,
    isSponsored: r.isSponsored,
    promotion: r.promotionalMessage,
    tags: r.subcategories?.length ? r.subcategories : [r.category].filter(Boolean),
    deliveryTime: null,
    deliveryFee: 0,
  };
}

export default function HomePage({ user }) {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');

  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getAllRestaurants()
      .then(setRestaurants)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!q) {
      setSearchResults(null);
      setSearchError('');
      return;
    }
    setSearchLoading(true);
    setSearchError('');
    searchApi(q)
      .then(data => setSearchResults(data))
      .catch(err => {
        setSearchError(err.message);
        setSearchResults(null);
      })
      .finally(() => setSearchLoading(false));
  }, [q]);

  const userLat = user?.address?.lat;
  const userLon = user?.address?.long;

  const sortedRestaurants = useMemo(() => {
    return [...restaurants].sort((a, b) => {
      // Sponsored (promoted) first
      if (a.isSponsored !== b.isSponsored) return b.isSponsored ? 1 : -1;
      // Then by distance
      const distA = haversineDistance(userLat, userLon, a.address?.lat, a.address?.long);
      const distB = haversineDistance(userLat, userLon, b.address?.lat, b.address?.long);
      if (distA !== distB) return distA - distB;
      // Then by category
      return (a.category || '').localeCompare(b.category || '');
    });
  }, [restaurants, userLat, userLon]);

  const sponsoredRestaurants = sortedRestaurants.filter(r => r.isSponsored);
  const categories = [...new Set(sortedRestaurants.map(r => r.category).filter(Boolean))];

  if (q) {
    return (
      <div className="page">
        <h2>Results for &ldquo;{q}&rdquo;</h2>
        {searchLoading && <p>Searching…</p>}
        {searchError && <p className="error">{searchError}</p>}
        {searchResults && (
          <div className="search-results">
            <section>
              <h2>Restaurants ({searchResults.restaurants.length})</h2>
              {searchResults.restaurants.length === 0 ? (
                <p className="muted">No restaurants matched.</p>
              ) : (
                <div className="card-grid">
                  {searchResults.restaurants.map(r => (
                    <Link key={r.id} to={`/restaurants/${r.id}`} className="card">
                      <h3>{r.name}</h3>
                      <span className="badge">{r.category}</span>
                      {r.description && <p>{r.description}</p>}
                      <p className="muted">{r.address.city}, {r.address.street} {r.address.houseNum}</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
            <section>
              <h2>Products ({searchResults.products.length})</h2>
              {searchResults.products.length === 0 ? (
                <p className="muted">No products matched.</p>
              ) : (
                <div className="card-grid">
                  {searchResults.products.map(p => (
                    <Link key={p.id} to={`/restaurants/${p.restaurantId}`} className="card">
                      <h3>{p.name}</h3>
                      <span className="badge">{p.category}</span>
                      {p.description && <p>{p.description}</p>}
                      <p className="price">₪{p.price.toFixed(2)}</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      {sponsoredRestaurants.length > 0 && (
        <RestaurantsCarousel
          title="Sponsored"
          subtitle="Top picks for you"
          restaurants={sponsoredRestaurants.map(toCardProps)}
        />
      )}
      {categories.map(category => (
        <RestaurantsCarousel
          key={category}
          title={category}
          restaurants={sortedRestaurants
            .filter(r => r.category === category)
            .map(toCardProps)}
        />
      ))}
      {restaurants.length === 0 && (
        <p className="muted" style={{ padding: '2rem' }}>No restaurants available yet.</p>
      )}
    </div>
  );
}
