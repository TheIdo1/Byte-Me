// Central route registry. Add all new pages here as <Route> entries.
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
