import Checkout from './pages/Checkout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Admin from './pages/Admin';
import OrderTracking from './pages/OrderTracking'; // <--- បន្ថែម Import ទំព័រតាមដាន
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'react-hot-toast';
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer';
// ផ្នែកខាងលើ៖ បន្ថែមការ Import ទាំង២នេះ
import { WishlistProvider } from './contexts/WishlistContext';
import Wishlist from './pages/Wishlist';

// នៅក្នុងមុខងារ return () សូមរុំ WishlistProvider ពីក្រៅ និងបន្ថែម Route:
function App() {
  return (
    <CartProvider>
      <WishlistProvider> {/* រុំពីក្រៅ Navbar និង Routes */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/tracking" element={<OrderTracking />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/wishlist" element={<Wishlist />} /> {/* បន្ថែម Route នេះ */}
        </Routes>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;