import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

function Home() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState({ mainImage: '', sideImage: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchBanners();
  }, []);

  // ទាញយកបញ្ជីទំនិញ
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

  // ទាញយករូបភាព Banner
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
    { id: 'accessories', name: 'គ្រឿងតុបតែង (Accessories)' },
    { id: 'clothing', name: 'សម្លៀកបំពាក់ (Clothing)' },
    { id: 'shoes', name: 'ស្បែកជើង (Shoes)' },
    { id: 'electronics', name: 'អេឡិចត្រូនិច (Electronics)' },
    { id: 'general', name: 'ទូទៅ (General)' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* ផ្នែកខាងលើ៖ ម៉ឺនុយឆ្វេង កណ្តាល(Banner) និងស្តាំ */}
      <div className="container mx-auto px-4 pt-6 pb-10">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* ១. ម៉ឺនុយខាងឆ្វេង (Categories) */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-orange-500 text-white font-bold px-5 py-3">
                ≡ ជម្រើសទំនិញ
              </div>
              <ul className="flex flex-col">
                {categories.map(c => (
                  <li key={c.id} className="border-b border-gray-50 last:border-0">
                    <Link to="/" className="block px-5 py-3 hover:bg-gray-50 text-gray-700 transition hover:text-orange-500">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ២. ផ្ទាំងកណ្តាល (Main Banner) */}
          <div className="w-full lg:w-2/4 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-center justify-center relative overflow-hidden min-h-[350px]">
            {banners.mainImage ? (
              <img 
                src={banners.mainImage} 
                alt="Main Promo" 
                className="w-full h-full max-h-[400px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[20px] border-orange-100 flex items-center justify-center relative">
                 <span className="font-black text-2xl text-gray-800">Camera Promo</span>
              </div>
            )}
          </div>

          {/* ៣. ផ្នែកខាងស្តាំ (Features & Side Banner) */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <ul className="flex flex-col gap-4 text-sm text-gray-700">
                <li className="flex items-center gap-3"><ShieldCheck className="text-orange-500" size={20} /> ទំនិញធានាសុទ្ធ 100%</li>
                <li className="flex items-center gap-3"><Truck className="text-orange-500" size={20} /> ដឹកជញ្ជូនឥតគិតថ្លៃ</li>
                <li className="flex items-center gap-3"><Clock className="text-orange-500" size={20} /> សេវាកម្ម 24/7</li>
                <li className="flex items-center gap-3"><RefreshCw className="text-orange-500" size={20} /> ងាយស្រួលប្តូរវិញ</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex-grow flex flex-col">
              <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">អំពីយើង (About Us)</h3>
              <div className="bg-gray-100 rounded-lg overflow-hidden flex-grow relative flex items-center justify-center min-h-[150px]">
                {banners.sideImage ? (
                  <img 
                    src={banners.sideImage} 
                    alt="Shop Side" 
                    className="w-full h-full absolute inset-0 object-cover hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <span className="text-gray-500 font-bold">Shop Image</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ផ្នែកខាងក្រោម៖ បញ្ជីទំនិញថ្មីៗ (Products Grid) */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center bg-orange-500 text-white px-5 py-3 rounded-t-xl">
          <h2 className="font-bold text-lg">ទំនិញថ្មីៗកំពុងពេញនិយម</h2>
        </div>
        
        <div className="bg-white p-6 rounded-b-xl shadow-sm border border-gray-100 border-t-0">
          {loading ? (
            <div className="text-center py-20 text-gray-500">កំពុងទាញយកទំនិញ...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">មិនទាន់មានទំនិញនៅឡើយទេ</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {products.map(product => (
                <Link key={product._id} to={`/product/${product._id}`} className="group flex flex-col">
                  <div className="bg-gray-50 rounded-xl aspect-square overflow-hidden mb-3 relative flex items-center justify-center p-4 border border-gray-100 group-hover:border-orange-200 transition">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" 
                    />
                    {product.stock <= 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">អស់ពីស្តុក</div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="text-orange-500 font-black">${product.price.toFixed(2)}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Home;