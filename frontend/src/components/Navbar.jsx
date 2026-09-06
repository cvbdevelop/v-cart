import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

function Navbar() {
  // កូដការពារសុវត្ថិភាព
  const context = useContext(CartContext) || {};
  const cart = context.cart || [];

  // គណនាចំនួនទំនិញសរុប (ការពារ Error)
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 max-w-7xl flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-lg">V</span>-Cart
        </Link>

        <div className="hidden md:flex flex-grow max-w-md mx-8 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input type="text" placeholder="ស្វែងរកទំនិញ..." className="w-full bg-gray-50 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition" />
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <Link to="/tracking" className="text-sm font-medium text-gray-600 hover:text-blue-600 hidden md:block">តាមដានការបញ្ជាទិញ</Link>
          
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition flex items-center gap-1 text-sm font-medium">
            <User size={20} /> <span className="hidden sm:block">Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;