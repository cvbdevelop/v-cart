import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { Heart } from 'lucide-react';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const wishlistContext = useWishlist() || {};
  const toggleWishlist = wishlistContext.toggleWishlist || (() => {});
  const isInWishlist = wishlistContext.isInWishlist || (() => false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://v-cart-backend.onrender.com/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">កំពុងទាញយកទិន្នន័យ...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-end mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'clothing', 'shoes', 'electronics', 'accessories', 'general'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${activeCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-3">ផលិតផលថ្មីៗ ({filteredProducts.length})</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {filteredProducts.map(product => (
          <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group flex flex-col relative">
            
            <button 
              onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md z-10 hover:scale-110 transition"
            >
              <Heart size={18} className={isInWishlist(product._id) ? "text-red-500 fill-red-500" : "text-gray-300 hover:text-red-400"} />
            </button>

            <Link to={`/product/${product._id}`} className="relative aspect-square overflow-hidden bg-gray-50 block">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </Link>
            
            <div className="p-4 flex flex-col flex-grow">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">{product.category || 'general'}</p>
              <Link to={`/product/${product._id}`}>
                <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1 line-clamp-2 hover:text-blue-600 transition">{product.name}</h3>
              </Link>
              
              <div className="mt-auto pt-3 flex flex-col gap-3">
                <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
                <Link to={`/product/${product._id}`} className="w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold py-2 rounded-lg transition text-sm text-center block">
                  មើលលម្អិត & ជ្រើសរើស
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;