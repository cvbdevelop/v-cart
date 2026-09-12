import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart, Phone, Menu } from 'lucide-react';
import { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

function Navbar() {
  const cartContext = useContext(CartContext) || {};
  const cart = cartContext.cart || [];
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  const wishlistContext = useWishlist() || {};
  const wishlist = wishlistContext.wishlist || [];

  // +++ មុខងារស្វែងរកទំនិញ +++
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };
  // ++++++++++++++++++++++++

  return (
    <header className="w-full shadow-sm sticky top-0 z-50">
      <div className="bg-[#0b1f38] text-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="flex justify-between items-center h-20 gap-4">
            
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-orange-500 text-white font-black text-xl p-1.5 rounded-md leading-none">VC</div>
              <span className="text-2xl font-bold tracking-tight">V-Cart</span>
            </Link>

            {/* +++ ប្រអប់ស្វែងរកដែលបានកែប្រែទៅជា Form +++ */}
            <div className="hidden md:flex flex-grow max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="flex w-full bg-white rounded-md overflow-hidden h-10 shadow-inner">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ស្វែងរកទំនិញ (Search for Product)" 
                  className="w-full px-4 text-gray-700 outline-none text-sm"
                />
                <div className="bg-gray-50 border-l px-4 flex items-center text-gray-500 text-sm whitespace-nowrap">
                  គ្រប់ប្រភេទ
                </div>
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 flex items-center justify-center transition">
                  <Search size={18} className="text-white" />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
              <Link to="/wishlist" className="hidden lg:flex items-center gap-2 hover:text-orange-400 transition">
                <div className="text-right">
                  <div className="text-[11px] text-gray-300">My Favourite</div>
                  <div className="text-sm font-bold">Wishlist</div>
                </div>
                <div className="relative">
                  <Heart size={24} />
                  {wishlist.length > 0 && <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{wishlist.length}</span>}
                </div>
              </Link>

              <Link to="/admin" className="hidden lg:flex items-center gap-2 hover:text-orange-400 transition border-l border-gray-600 pl-6">
                <div className="text-right">
                  <div className="text-[11px] text-gray-300">Hello, Admin</div>
                  <div className="text-sm font-bold">My account</div>
                </div>
                <User size={24} />
              </Link>

              <Link to="/cart" className="flex items-center gap-3 hover:text-orange-400 transition ml-2 lg:border-l lg:border-gray-600 lg:pl-6">
                <div className="relative">
                  <ShoppingCart size={28} />
                  {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#0b1f38]">{cartCount}</span>}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[11px] text-gray-300">Total</div>
                  <div className="text-sm font-bold text-orange-400">${cartTotal.toFixed(2)}</div>
                </div>
              </Link>

              <button className="md:hidden text-white hover:text-orange-400"><Menu size={28} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 hidden md:block">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="flex justify-between items-center h-12">
            <nav className="flex items-center gap-5 lg:gap-6 text-sm font-bold text-gray-700 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <Link to="/" className="hover:text-orange-500 transition focus:text-orange-500 focus:border-b-2 focus:border-orange-500 pb-[13px] pt-[15px]">ទំព័រដើម</Link>
              <Link to="/?category=clothing" className="hover:text-orange-500 transition focus:text-orange-500 focus:border-b-2 focus:border-orange-500 pb-[13px] pt-[15px]">សម្លៀកបំពាក់</Link>
              <Link to="/?category=shoes" className="hover:text-orange-500 transition focus:text-orange-500 focus:border-b-2 focus:border-orange-500 pb-[13px] pt-[15px]">ស្បែកជើង</Link>
              <Link to="/?category=accessories" className="hover:text-orange-500 transition focus:text-orange-500 focus:border-b-2 focus:border-orange-500 pb-[13px] pt-[15px]">គ្រឿងតុបតែង</Link>
              <Link to="/?category=electronics" className="hover:text-orange-500 transition focus:text-orange-500 focus:border-b-2 focus:border-orange-500 pb-[13px] pt-[15px]">អេឡិចត្រូនិច</Link>
              <Link to="/?category=general" className="hover:text-orange-500 transition focus:text-orange-500 focus:border-b-2 focus:border-orange-500 pb-[13px] pt-[15px]">ទូទៅ</Link>
              <Link to="/tracking" className="hover:text-orange-500 transition focus:text-orange-500 focus:border-b-2 focus:border-orange-500 pb-[13px] pt-[15px]">តាមដានបញ្ជាទិញ</Link>
              <Link to="/contact" className="hover:text-orange-500 transition focus:text-orange-500 focus:border-b-2 focus:border-orange-500 pb-[13px] pt-[15px]">ទំនាក់ទំនងយើង</Link>
            </nav>
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <div className="bg-orange-500 p-1.5 rounded-full text-white"><Phone size={14} /></div>
              <div>
                <div className="text-[10px] text-gray-400 font-medium leading-none uppercase">Call To</div>
                <div className="text-sm font-black text-gray-800 leading-none mt-1">+855 096 924 3333</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;