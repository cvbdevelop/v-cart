import { ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Logo from './Logo';

function Navbar() {
  const { cartItems } = useCart();
  
  // គណនាចំនួនទំនិញសរុបនៅក្នុងកន្ត្រក
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  <Link to="/tracking" className="text-gray-700 hover:text-blue-600 font-medium transition">
  តាមដានការបញ្ជាទិញ
  </Link>

  // ... កូដផ្សេងៗទៀតរបស់ Navbar
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/">
          <Logo />
        </a>

        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-blue-600 transition">
            {/* រូបតំណាងកន្ត្រករបស់អ្នក */}
            <ShoppingCart size={24} /> 
  
            {/* លក្ខខណ្ឌ៖ បង្ហាញរង្វង់ក្រហម តែពេលមានទំនិញធំជាង ០ */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
          
          <Link to="/admin" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <User size={26} />
            <span className="hidden sm:block font-medium">Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;