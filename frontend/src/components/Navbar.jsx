import { ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Logo from './Logo';

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/">
          <Logo />
        </a>

        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
            <ShoppingCart size={26} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
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