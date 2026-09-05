// បន្ថែមការ Import នេះនៅខាងលើគេ
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin'; // នាំចូលទំព័រ Admin
import { CartProvider } from './contexts/CartContext';
import Login from './pages/Login'; // ថែមថ្មី

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} /> {/* បន្ថែមជួរនេះ */}
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} /> {/* កំណត់ Route សម្រាប់ Admin */}
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;