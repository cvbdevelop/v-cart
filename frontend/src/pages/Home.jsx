import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">កំពុងទាញយកទិន្នន័យ...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      
      {/* ម៉ឺនុយជ្រើសរើសប្រភេទទំនិញ (Categories) */}
      <div className="flex justify-end mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveCategory('all')} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${activeCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>ទាំងអស់</button>
          <button onClick={() => setActiveCategory('clothing')} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${activeCategory === 'clothing' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>សម្លៀកបំពាក់</button>
          <button onClick={() => setActiveCategory('shoes')} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${activeCategory === 'shoes' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>ស្បែកជើង</button>
          <button onClick={() => setActiveCategory('electronics')} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${activeCategory === 'electronics' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>អេឡិចត្រូនិច</button>
          <button onClick={() => setActiveCategory('accessories')} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${activeCategory === 'accessories' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>គ្រឿងតុបតែង</button>
          <button onClick={() => setActiveCategory('general')} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${activeCategory === 'general' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>ទូទៅ</button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-3">
        ផលិតផលថ្មីៗ ({filteredProducts.length})
      </h2>
      
      {/* បញ្ជីទំនិញ (Product Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {filteredProducts.map(product => (
          <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group flex flex-col">
            <Link to={`/product/${product._id}`} className="relative aspect-square overflow-hidden bg-gray-50 block">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </Link>
            
            <div className="p-4 flex flex-col flex-grow">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">{product.category || 'general'}</p>
              <Link to={`/product/${product._id}`}>
                <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1 line-clamp-2 hover:text-blue-600 transition">
                  {product.name}
                </h3>
              </Link>
              
              <div className="mt-auto pt-3 flex flex-col gap-3">
                <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
                
                {/* ប៊ូតុងចូលទៅមើលទំព័រលម្អិត ដើម្បីរើសទំហំ និងពណ៌សិន */}
                <Link 
                  to={`/product/${product._id}`}
                  className="w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold py-2 rounded-lg transition text-sm text-center block"
                >
                  មើលលម្អិត & ជ្រើសរើស
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          មិនមានទំនិញក្នុងប្រភេទនេះទេ។
        </div>
      )}
    </div>
  );
}

export default Home;