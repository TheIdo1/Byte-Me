import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchQuery as searchApi } from '../api/searchApi';
import { getAllRestaurants } from '../api/restaurantsApi';
import RestaurantsCarousel from '../components/restaurant/RestaurantsCarousel';
import ProductsCarousel from '../components/product/ProductsCarousel';
import EmptyState from '../components/EmptyState';
import CategoryBar from '../components/CategoryBar';
import './HomePage.css';

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

function toCardProps(r, userLat, userLon) {
  // Calculate distance
  const dist = haversineDistance(userLat, userLon, r.address?.lat, r.address?.long);

  let deliveryTime;
  let deliveryFee;

  if (dist === Infinity || dist > 25) {
    // if distance is long or unknown show default state
    deliveryTime = '45-60 min';
    deliveryFee = 25;
  } else {
    // dynamic calculation
    const minTime = Math.max(20, Math.round(15 + (dist * 4)));
    const maxTime = minTime + 10;
    deliveryTime = `${minTime}-${maxTime} min`;
    const baseFee = 10;
    const distanceFee = Math.round(dist * 2);
    deliveryFee = baseFee + distanceFee;

  }



  return {
    id: r.id,
    name: r.name,
    imageUrl: r.image,
    rating: r.rating,
    isSponsored: r.isSponsored,
    promotion: r.promotionalMessage,
    tags: r.subcategories?.length ? r.subcategories : [r.category].filter(Boolean),
    deliveryTime: deliveryTime,
    deliveryFee: deliveryFee,
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
      .catch(() => { });
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

  // Fallback to 507 Building if user address is missing 32.071297203893124, 34.84464972069747
  const userLat = user?.address?.lat ?? 32.071297203893124;
  const userLon = user?.address?.long ?? 34.84464972069747;

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
    const hasRestaurants = (searchResults?.restaurants.length ?? 0) > 0;
    const hasProducts = (searchResults?.products.length ?? 0) > 0;
    const noResults = searchResults && !hasRestaurants && !hasProducts;

    return (
      <div className="page">
        {searchLoading && <p className="muted">Searching…</p>}
        {searchError && <p className="error">{searchError}</p>}
        {noResults && (
          <EmptyState
            icon="🔍"
            title={`No matches for "${q}"`}
            subtitle="Try a different search term or check the spelling."
          />
        )}
        {searchResults && !noResults && (
          <div className="search-results">
            {hasRestaurants ? (
              <RestaurantsCarousel
                title="Restaurants"
                subtitle={`${searchResults.restaurants.length} found`}
                restaurants={searchResults.restaurants.map(r => toCardProps(r, userLat, userLon))}
              />
            ) : (
              <EmptyState icon="🏠" title="No restaurants matched" subtitle="We couldn't find a restaurant for this search." />
            )}
            {hasProducts ? (
              <ProductsCarousel
                title="Products"
                subtitle={`${searchResults.products.length} found`}
                products={searchResults.products}
              />
            ) : (
              <EmptyState icon="🍽️" title="No products matched" subtitle="We couldn't find a dish for this search." />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      <CategoryBar />
      {sponsoredRestaurants.length > 0 && (
        <RestaurantsCarousel
          title="Sponsored"
          subtitle="Top picks for you"
          restaurants={sponsoredRestaurants.map(r => toCardProps(r, userLat, userLon))}
        />
      )}
      {categories.map(category => (
        <RestaurantsCarousel
          key={category}
          title={category}
          restaurants={sortedRestaurants
            .filter(r => r.category === category)
            .map(r => toCardProps(r, userLat, userLon))}
        />
      ))}
      {restaurants.length === 0 && (
        <EmptyState
          icon="🍔"
          title="No restaurants available yet"
          subtitle="Check back soon — new restaurants are added regularly."
        />
      )}
    </div>
  );
}
