// Root component. Wraps the app in a BrowserRouter so all child components
// can use react-router-dom hooks (useNavigate, useParams, etc.).
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
