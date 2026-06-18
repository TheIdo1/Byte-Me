// Central route registry.
// Receives auth state as props from App and forwards the relevant slice to each
// consumer: Header needs everything, LoginPage needs nothing (it manages its own
// session via localStorage). Add new pages here as <Route> entries.
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import RestaurantPage from './pages/RestaurantPage';
import AddRestaurantPage from './pages/AddRestaurantPage';
import OrdersPage from './pages/OrdersPage';
import ProductModal from './components/product/ProductModal';

import OwnerRestaurantsPage from './pages/OwnerRestaurantsPage';
import RestaurantAdminPage from './pages/RestaurantAdminPage';

export default function AppRouter({ token, user, isOwner, signOut }) {
  return (
    <>
      {/* Header is rendered outside <Routes> so it appears on every page */}
      <Header
        token={token}
        user={user}
        isOwner={isOwner}
        signOut={signOut}
      />

      <main>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login"    element={<LoginPage />} />

          {/* Restaurant owners only — guarded inside the page itself */}
          <Route path="/restaurants/new" element={<AddRestaurantPage token={token} user={user} isOwner={isOwner} />} />
          <Route 
            path="/manage/restaurants" 
            element={<OwnerRestaurantsPage token={token} user={user} isOwner={isOwner} />} 
          />
          <Route 
            path="/manage/restaurants/:restaurantId" 
            element={<RestaurantAdminPage token={token} user={user} isOwner={isOwner} />} 
          />

          {/* Dynamic route for individual restaurant pages */}
          <Route path="/restaurants/:restaurantId" element={<RestaurantPage token={token} />}>
            {/* Child route for the product modal — matches /restaurants/:id/products/:productId */}
            <Route path="products/:productId" element={<ProductModal />} />
          </Route>

          <Route path="/orders" element={<OrdersPage token={token} />} />
          <Route path="/" element={<HomePage user={user} />} />
        </Routes>
      </main>
    </>
  );
}
