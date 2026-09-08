import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { Heart, ChevronRight, ShieldCheck, HeadphonesIcon, Truck, Gift } from 'lucide-react';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  const wishlistContext = useWishlist() || {};
  const toggleWishlist = wishlistContext.toggleWishlist || (() => {});
  const isInWishlist = wishlistContext.isInWishlist || (() => false);

  const categories = [
    { id: 'all', name: 'ទាំងអស់ (All)' },
    { id: 'accessories', name: 'គ្រឿងតុបតែង (Accessories)' },
    { id: 'clothing', name: 'សម្លៀកបំពាក់ (Clothing)' },
    { id: 'shoes', name: 'ស្បែកជើង (Shoes)' },
    { id: 'electronics', name: 'អេឡិចត្រូនិច (Electronics)' },
    { id: 'general', name: 'ទូទៅ (General)' }
  ];

  // ១. មុខងារទាញយកទិន្នន័យទំនិញពី Server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://v-cart-backend.onrender.com/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); // បិទផ្ទាំង Loading ពេលទាញយកចប់
      }
    };
    fetchProducts();
  }, []);

  // ២. មុខងារចាប់យកការផ្លាស់ប្តូរប្រភេទពី URL (ពេលចុចពី Navbar)
  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  // ៣. មុខងារពេលចុចលើម៉ឺនុយចំហៀងខាងឆ្វេង
  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setSearchParams({ category: catId });
  };

  const filteredProducts = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium text-lg">កំពុងទាញយកទិន្នន័យ... សូមរង់ចាំបន្តិច</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-6 max-w-[1400px]">
        
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* ================= ផ្នែកទី១៖ ជួរឈរខាងឆ្វេង ================= */}
          <div className="w-full lg:w-1/4 xl:w-1/5 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-orange-500 text-white font-bold py-3 px-4 flex items-center justify-between">
                <span>≡ ផ្នែកទំនិញ</span>
              </div>
              <ul className="flex flex-col">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center border-b border-gray-50 transition hover:text-orange-500 ${activeCategory === cat.id ? 'text-orange-500 font-bold bg-orange-50' : 'text-gray-600'}`}
                    >
                      {cat.name} <ChevronRight size={16} className="text-gray-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hidden lg:block">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">ទំនិញពេញនិយម</h3>
              <div className="flex flex-col gap-4">
                {products.slice(0, 3).map(product => (
                  <Link key={product._id} to={`/product/${product._id}`} className="flex gap-3 items-center group">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 line-clamp-2 group-hover:text-blue-600 transition">{product.name}</h4>
                      <p className="text-orange-500 font-bold text-sm mt-1">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ================= ផ្នែកទី២៖ ជួរឈរកណ្តាល ================= */}
          <div className="w-full lg:w-2/4 xl:w-3/5 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden flex items-center justify-between p-8 md:p-12 border border-gray-100 relative h-[300px] md:h-[400px]">
              <div className="absolute top-10 left-10 w-64 h-64 border-[30px] border-orange-400 rounded-full opacity-20"></div>
              <div className="absolute top-20 right-40 w-24 h-24 border-[15px] border-orange-400 rounded-full opacity-20"></div>
              
              <div className="relative z-10 w-1/2">
                <img src="https://placehold.co/600x400/transparent/31343C?text=Camera+Promo" alt="Promo" className="w-full object-contain drop-shadow-2xl hover:scale-105 transition duration-500" />
              </div>
              <div className="relative z-10 w-1/2 text-right">
                <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-2 leading-tight">Professional<br/>Camera</h2>
                <p className="text-gray-500 mb-6 font-medium">Shoot for the best</p>
                <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-md transition shadow-lg">
                  ទិញឥឡូវនេះ
                </button>
              </div>
            </div>

            <div className="bg-orange-400 rounded-xl shadow-sm px-6 py-4 flex justify-between items-center text-white">
              <span className="font-bold text-lg">ការផ្តល់ជូនពិសេសសម្រាប់ទំនិញថ្មីៗ</span>
              <button className="bg-white text-orange-500 px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-50 transition">
                ស្វែងយល់បន្ថែម
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">ទំនិញកំពុងពេញនិយម</h2>
                <div className="hidden md:flex gap-4 text-sm font-bold text-gray-400">
                  <span className="text-gray-800 cursor-pointer">ថ្មីៗបំផុត</span>
                  <span className="cursor-pointer hover:text-gray-800 transition">កំពុងលក់បញ្ចុះតម្លៃ</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <div key={product._id} className="group relative">
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm z-10 hover:scale-110 transition opacity-0 group-hover:opacity-100"
                    >
                      <Heart size={16} className={isInWishlist(product._id) ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-400"} />
                    </button>
                    <Link to={`/product/${product._id}`} className="block border border-gray-100 rounded-lg p-3 hover:border-blue-400 transition hover:shadow-md h-full flex flex-col">
                      <div className="aspect-square mb-3 bg-gray-50 rounded-md overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      </div>
                      <div className="text-center mt-auto">
                        <h3 className="font-bold text-gray-700 text-sm mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-orange-500 font-bold">${product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  មិនមានទំនិញក្នុងប្រភេទនេះទេ។
                </div>
              )}
            </div>
          </div>

          {/* ================= ផ្នែកទី៣៖ ជួរឈរខាងស្តាំ ================= */}
          <div className="w-full lg:w-1/4 xl:w-1/5 flex flex-col gap-6 hidden xl:flex">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <ShieldCheck className="text-orange-400 flex-shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">ទិញដោយទំនុកចិត្ត</h4>
                  <p className="text-xs text-gray-500 mt-1">ធានាសងប្រាក់វិញក្នុង 30 ថ្ងៃ</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <ShieldCheck className="text-orange-400 flex-shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">សុវត្ថិភាព 100%</h4>
                  <p className="text-xs text-gray-500 mt-1">ការទូទាត់មានសុវត្ថិភាព</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <HeadphonesIcon className="text-orange-400 flex-shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">សេវាកម្ម 24/7</h4>
                  <p className="text-xs text-gray-500 mt-1">ជំនួយអនឡាញគ្រប់ពេលវេលា</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Gift className="text-orange-400 flex-shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">ការផ្តល់ជូនពិសេស</h4>
                  <p className="text-xs text-gray-500 mt-1">ទទួលបានប្រូម៉ូសិនរាល់ថ្ងៃ</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Truck className="text-orange-400 flex-shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">ដឹកជញ្ជូនរហ័ស</h4>
                  <p className="text-xs text-gray-500 mt-1">សម្រាប់គ្រប់ការបញ្ជាទិញ</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <h3 className="font-bold text-gray-800 p-4 border-b bg-gray-50 text-sm">អំពីយើង (About Us)</h3>
              <div className="p-4">
                <img src="https://placehold.co/300x200/gray/white?text=Shop+Image" alt="About Us" className="w-full rounded-md mb-3" />
                <p className="text-xs text-gray-500 leading-relaxed text-center">
                  យើងផ្តល់ជូននូវផលិតផលដែលមានគុណភាពខ្ពស់ និងសេវាកម្មដ៏ល្អឥតខ្ចោះ ដើម្បីបំពេញតម្រូវការរបស់អតិថិជនគ្រប់រូប។
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;