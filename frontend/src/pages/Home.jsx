import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Truck, ShieldCheck, Clock, Gift } from 'lucide-react';

function Home() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState({ mainImage: '', sideImage: '' });
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  // +++ ចាប់យកពាក្យដែលគេស្វែងរកពី URL +++
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
    fetchBanners();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://v-cart-backend.onrender.com/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await fetch('https://v-cart-backend.onrender.com/api/banners');
      const data = await res.json();
      if (data) setBanners(data);
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    { id: 'all', name: 'ទំនិញទាំងអស់ (All)' },
    { id: 'accessories', name: 'គ្រឿងតុបតែង (Accessories)' },
    { id: 'clothing', name: 'សម្លៀកបំពាក់ (Clothing)' },
    { id: 'shoes', name: 'ស្បែកជើង (Shoes)' },
    { id: 'electronics', name: 'អេឡិចត្រូនិច (Electronics)' },
    { id: 'general', name: 'ទូទៅ (General)' }
  ];

  // +++ ចម្រាញ់ទំនិញទាំងតាមប្រភេទ និង តាមពាក្យស្វែងរក +++
  const displayedProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-6 pb-10">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* ផ្នែកខាងឆ្វេង */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-orange-500 text-white font-bold px-5 py-3">≡ ជម្រើសទំនិញ</div>
              <ul className="flex flex-col">
                {categories.map(c => (
                  <li key={c.id} className="border-b border-gray-50 last:border-0">
                    <button 
                      onClick={() => setSearchParams(c.id === 'all' ? {} : { category: c.id })}
                      className={`w-full text-left px-5 py-3 transition ${selectedCategory === c.id && !searchQuery ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-gray-50 text-gray-700 hover:text-orange-500'}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hidden lg:block">
               <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">ទំនិញពេញនិយម</h3>
               <div className="flex flex-col gap-4">
                 {products.slice(0, 3).map(p => (
                   <Link key={p._id} to={`/product/${p._id}`} className="flex gap-3 group">
                     <img src={p.image} className="w-16 h-16 object-cover rounded-md border border-gray-100" alt={p.name} />
                     <div className="flex flex-col justify-center">
                       <h4 className="text-xs font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2 leading-tight mb-1">{p.name}</h4>
                       <span className="text-orange-500 font-bold text-sm">${p.price.toFixed(2)}</span>
                     </div>
                   </Link>
                 ))}
               </div>
            </div>
          </div>

          {/* ផ្ទាំងកណ្តាល */}
          <div className="w-full lg:w-2/4 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-[250px] md:h-[300px] flex items-center justify-center relative overflow-hidden">
              {banners.mainImage ? (
                <img src={banners.mainImage} alt="Main Promo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="flex items-center justify-between w-full px-4 md:px-8">
                   <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[10px] md:border-[15px] border-orange-100 flex items-center justify-center">
                     <span className="font-bold text-gray-800 text-center text-sm md:text-base">Camera<br/>Promo</span>
                   </div>
                   <div className="text-right">
                     <h2 className="text-2xl md:text-3xl font-black text-gray-800 leading-tight">Professional<br/>Camera</h2>
                     <p className="text-gray-500 text-xs md:text-sm mb-4 mt-1">Shoot for the best</p>
                     <button className="bg-gray-900 text-white px-4 md:px-6 py-2 rounded-lg font-bold text-sm">ទិញឡូវនេះ</button>
                   </div>
                </div>
              )}
            </div>

            <div className="bg-orange-400 rounded-xl px-4 md:px-6 py-3 flex justify-between items-center text-white shadow-sm">
              <span className="font-bold text-sm md:text-base">ការផ្តល់ជូនពិសេសសម្រាប់ទំនិញថ្មីៗ</span>
              <button className="bg-white text-orange-500 px-3 md:px-4 py-1.5 rounded-md font-bold text-xs md:text-sm whitespace-nowrap ml-2">ស្វែងយល់បន្ថែម</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex-grow">
               <div className="flex justify-between items-center mb-6 border-b pb-2">
                 <h3 className="font-bold text-gray-800">
                   {/* +++ បង្ហាញចំណងជើងទៅតាមលទ្ធផលស្វែងរក +++ */}
                   {searchQuery ? `លទ្ធផលស្វែងរក: "${searchQuery}"` : (selectedCategory === 'all' ? 'ទំនិញកំពុងពេញនិយម' : 'លទ្ធផលស្វែងរក')}
                 </h3>
                 <span className="text-xs text-gray-500 cursor-pointer hover:text-orange-500 font-bold">មើលទាំងអស់ →</span>
               </div>

               {loading ? (
                 <div className="text-center py-10 text-gray-500">កំពុងទាញយក...</div>
               ) : displayedProducts.length === 0 ? (
                 <div className="text-center py-10 text-gray-500">មិនមានទំនិញដែលអ្នកស្វែងរកទេ</div>
               ) : (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                   {displayedProducts.map(product => (
                      <Link key={product._id} to={`/product/${product._id}`} className="group flex flex-col">
                        <div className="bg-gray-50 rounded-xl aspect-square overflow-hidden mb-3 relative flex items-center justify-center p-2 border border-gray-100 group-hover:border-orange-200 transition">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" />
                          {product.stock <= 0 && <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">អស់ស្តុក</div>}
                        </div>
                        <h3 className="font-bold text-gray-800 text-xs md:text-sm mb-1 group-hover:text-blue-600 transition line-clamp-2">{product.name}</h3>
                        <div className="text-orange-500 font-black text-sm md:text-base">${product.price.toFixed(2)}</div>
                      </Link>
                   ))}
                 </div>
               )}
            </div>
          </div>

          {/* ផ្នែកខាងស្តាំ */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hidden md:block">
              <ul className="flex flex-col gap-5 text-sm text-gray-700">
                <li className="flex items-start gap-3"><ShieldCheck className="text-orange-500 mt-0.5" size={20} /><div><strong className="block text-gray-800 text-xs md:text-sm">ទំនិញធានាសុទ្ធ</strong><span className="text-[10px] md:text-xs text-gray-500">គុណភាពខ្ពស់ 100%</span></div></li>
                <li className="flex items-start gap-3"><ShieldCheck className="text-orange-500 mt-0.5" size={20} /><div><strong className="block text-gray-800 text-xs md:text-sm">សុវត្ថិភាព 100%</strong><span className="text-[10px] md:text-xs text-gray-500">ការទូទាត់មានសុវត្ថិភាព</span></div></li>
                <li className="flex items-start gap-3"><Clock className="text-orange-500 mt-0.5" size={20} /><div><strong className="block text-gray-800 text-xs md:text-sm">សេវាកម្ម 24/7</strong><span className="text-[10px] md:text-xs text-gray-500">ជួយដោះស្រាយរាល់បញ្ហា</span></div></li>
                <li className="flex items-start gap-3"><Gift className="text-orange-500 mt-0.5" size={20} /><div><strong className="block text-gray-800 text-xs md:text-sm">ការផ្តល់ជូនពិសេស</strong><span className="text-[10px] md:text-xs text-gray-500">មានប្រូម៉ូសិនរាល់សប្តាហ៍</span></div></li>
                <li className="flex items-start gap-3"><Truck className="text-orange-500 mt-0.5" size={20} /><div><strong className="block text-gray-800 text-xs md:text-sm">ដឹកជញ្ជូនរហ័ស</strong><span className="text-[10px] md:text-xs text-gray-500">សេវាដឹកជញ្ជូនទូទាំងប្រទេស</span></div></li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
               <h3 className="font-bold text-gray-800 border-b pb-2 text-sm md:text-base">អំពីយើង (About Us)</h3>
               <div className="bg-gray-400 rounded-lg overflow-hidden relative flex items-center justify-center h-24 md:h-32">
                 {banners.sideImage ? <img src={banners.sideImage} alt="Shop Side" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-base md:text-lg">Shop Image</span>}
               </div>
               <p className="text-[10px] md:text-xs text-gray-500 text-center mt-2 leading-relaxed">យើងផ្តល់ជូននូវផលិតផលដែលមានគុណភាពខ្ពស់ និងសេវាកម្មដ៏ល្អឥតខ្ចោះដល់អតិថិជនគ្រប់រូប។</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;