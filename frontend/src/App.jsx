import Checkout from './pages/Checkout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'react-hot-toast';
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer';
// 1. បន្ថែម Import នៅផ្នែកខាងលើ
import OrderTracking from './pages/OrderTracking';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />           
              <Route path="/product/:id" element={<ProductDetail />} />
              // 2. បន្ថែម Route ខាងក្នុង <Routes>
              <Route path="/tracking" element={<OrderTracking />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;