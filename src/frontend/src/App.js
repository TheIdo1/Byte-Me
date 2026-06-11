// Root component. Wraps the app in a BrowserRouter so all child components
// can use react-router-dom hooks (useNavigate, useParams, etc.).
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import RestaurantCard from './components/RestaurantCard';

export default function App() {
  return (
    <BrowserRouter>
      <RestaurantCard 
        name="Donkey Market" 
        imageUrl="https://cdn.britannica.com/68/143568-050-5246474F/Donkey.jpg" 
        deliveryTime="50-60" 
        rating="4.0"
        deliveryFee="15" 
        tags={["Burger", "Fast Food"]}
        isSponsored = {true}
        promotion = "New On Byte-Me"

      />      
      <RestaurantCard 
        name="aaa" 
        imageUrl="https://cdn.britannica.com/68/143568-050-5246474F/Donkey.jpg" 
        deliveryTime="50-60" 
        rating="4.0"
        deliveryFee="15" 
        tags={["Burger", "Fast Food"]} 
        promotion = "New On Byte-Me"
      />      

      <AppRouter />
    </BrowserRouter>
    
  );
}
