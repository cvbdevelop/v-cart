import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// បន្ថែមការ Import នៅផ្នែកខាងលើ
import Contact from './pages/Contact';
// Import ទំព័រនិងសមាសធាតុ (Components & Pages)
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ១. បន្ថែមការ Import Footer នៅទីនេះ
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';

// Import ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យ (Contexts)
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          {/* ប្រើ flex និង min-h-screen ដើម្បីរុញ Footer ឱ្យនៅបាតក្រោមជានិច្ច ទោះទំព័រខ្លីក៏ដោយ */}
          <div className="flex flex-col min-h-screen"> 
            <Navbar />
            
            {/* ផ្នែកកណ្តាល (បង្ហាញទំព័រផ្សេងៗ) */}
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
                // បន្ថែម Route នេះនៅខាងក្រោម Route ផ្សេងៗទៀត
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>

            {/* ២. ដាក់ Footer នៅផ្នែកខាងក្រោមគេ */}
            <Footer />
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;