// Central route registry. Add all new pages here as <Route> entries.
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage'; 

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Temporary home page route to ensure the redirect works smoothly after a successful login */}
      <Route path="/" element={<h1 style={{ textAlign: 'center', marginTop: '50px' }}>Welcome to Byte Me</h1>} />
    </Routes>
  );
}