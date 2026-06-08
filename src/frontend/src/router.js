import { Routes, Route } from 'react-router-dom';
import RegisterPage from './components/pages/RegisterPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
