import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchQuery } from '../api/searchApi';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await searchQuery(query.trim());
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="hero">
        <h1>Find your next meal</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search restaurants or dishes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={50}
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {results && (
        <div className="search-results">
          <section>
            <h2>Restaurants ({results.restaurants.length})</h2>
            {results.restaurants.length === 0 ? (
              <p className="muted">No restaurants matched.</p>
            ) : (
              <div className="card-grid">
                {results.restaurants.map((r) => (
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
            <h2>Products ({results.products.length})</h2>
            {results.products.length === 0 ? (
              <p className="muted">No products matched.</p>
            ) : (
              <div className="card-grid">
                {results.products.map((p) => (
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
