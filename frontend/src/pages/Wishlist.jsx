import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { Heart, Trash2 } from 'lucide-react';

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist() || { wishlist: [] };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <Heart size={64} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">បញ្ជីសំណព្វចិត្តទទេ</h2>
        <p className="text-gray-500 mb-8">អ្នកមិនទាន់បានរក្សាទុកទំនិញណាមួយនៅឡើយទេ។</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition inline-block">
          ត្រឡប់ទៅទិញទំនិញ
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <Heart className="text-red-500 fill-red-500" /> ទំនិញដែលអ្នកពេញចិត្ត ({wishlist.length})
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map(product => (
          <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm relative group overflow-hidden flex flex-col">
            <button 
              onClick={() => toggleWishlist(product)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-red-500 z-10 hover:bg-red-50 transition"
            >
              <Trash2 size={16} />
            </button>
            <Link to={`/product/${product._id}`} className="aspect-square bg-gray-50 block overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-blue-600 font-bold mb-3">${product.price.toFixed(2)}</p>
              <div className="mt-auto">
                <Link to={`/product/${product._id}`} className="block w-full text-center bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-800 transition font-medium">
                  មើលលម្អិត
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;