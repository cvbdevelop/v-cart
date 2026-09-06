import Checkout from './pages/Checkout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'react-hot-toast';

// ១. Import ឯកសារថ្មីទាំង២
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer';

function App() {
  return (
    <CartProvider>
      <Router>
        {/* បន្ថែម flex និង flex-col ដើម្បីរុញ Footer ទៅបាតក្រោមជានិច្ច */}
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />
          
          {/* រុំ Routes ជាមួយ main និង flex-grow */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              
              {/* ២. បន្ថែម Route សម្រាប់ទំព័រលម្អិតទំនិញ */}
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </main>
          
          {/* ៣. ដាក់ Footer នៅខាងក្រោមគេបង្អស់ */}
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;