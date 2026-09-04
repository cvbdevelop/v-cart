import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Search } from 'lucide-react';

function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States សម្រាប់ Search និង Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://v-cart-backend.onrender.com/api/products');
        const data = await response.json();
        const formattedData = data.map(item => ({ ...item, id: item._id }));
        setProducts(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('បរាជ័យក្នុងការទាញយកទំនិញ:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ត្រងទំនិញតាម Category និង Keyword ស្វែងរក
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="text-center py-20 text-xl font-bold text-gray-500">កំពុងទាញយកទិន្នន័យ...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ផ្នែកស្វែងរក និង តម្រងប្រភេទ (Search & Filter Bar) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="ស្វែងរកទំនិញ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['all', 'electronics', 'clothing', 'bags', 'general'].map((cat) => {
            const labels = {
              all: 'ទាំងអស់',
              electronics: 'អេឡិចត្រូនិក',
              clothing: 'សម្លៀកបំពាក់',
              bags: 'កាបូប & ស្បែកជើង',
              general: 'ទូទៅ'
            };
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {labels[cat] || cat}
              </button>
            );
          })}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
        ផលិតផលថ្មីៗ ({filteredProducts.length})
      </h2>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-100">
          រកមិនឃើញផលិតផលដែលអ្នកចង់បានទេ
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 group">
              <div className="overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                  {product.category || 'general'}
                </span>
                <h3 className="text-lg font-medium text-gray-800 line-clamp-2 min-h-[56px] mt-2">{product.name}</h3>
                <p className="text-xl text-blue-600 font-bold mt-2">${product.price.toFixed(2)}</p>
                
                <button 
                  onClick={() => addToCart(product)} 
                  className="mt-4 w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2.5 rounded-lg transition-colors duration-300"
                >
                  បន្ថែមចូលកន្ត្រក
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;