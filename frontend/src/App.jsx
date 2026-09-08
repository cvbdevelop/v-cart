import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import ទំព័រនិងសមាសធាតុ (Components & Pages)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';

// Import ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យ (Contexts)
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          {/* កំណត់ពណ៌ផ្ទៃខាងក្រោយ និងប្រើ min-h-screen នៅទីនេះទើបត្រឹមត្រូវ */}
          <div className="flex flex-col min-h-screen bg-gray-50"> 
            
            <Navbar />
            
            {/* flex-grow នឹងរុញ Footer ឱ្យនៅបាតក្រោមជានិច្ច ទោះទំព័រមានទំនិញតិចក៏ដោយ */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/tracking" element={<OrderTracking />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>

            <Footer />
            
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;