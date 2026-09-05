import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ១. ទាញយកទំនិញទាំងអស់ពី Server
        const response = await fetch('https://v-cart-backend.onrender.com/api/products');
        const data = await response.json();
        
        // ២. ស្វែងរកទំនិញដែលមាន ID ដូចគ្នាទៅនឹង URL
        const foundProduct = data.find((item) => item._id === id || item.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          if (foundProduct.sizes && foundProduct.sizes.length > 0) setSelectedSize(foundProduct.sizes[0]);
          if (foundProduct.colors && foundProduct.colors.length > 0) setSelectedColor(foundProduct.colors[0]);
        }
        
        // ៣. បញ្ចូលទិន្នន័យទៅក្នុង State
        setProduct(foundProduct || null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
  // បញ្ជូន product រួមទាំងទំហំ និងពណ៌ដែលបានរើស
  addToCart({ ...product, selectedSize, selectedColor });
  toast.success(`បានបន្ថែម ${product.name} (ទំហំ: ${selectedSize || 'N/A'}, ពណ៌: ${selectedColor || 'N/A'}) ចូលកន្ត្រក!`);
};

  if (loading) return <div className="text-center py-20 font-bold text-gray-500">កំពុងទាញយកទិន្នន័យ...</div>;
  if (!product) return <div className="text-center py-20 font-bold text-red-500">រកមិនឃើញទំនិញនេះទេ</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft size={20} /> ត្រលប់ក្រោយ
      </button>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
          <img src={product.image} alt={product.name} className="max-h-[400px] object-contain hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full w-max mb-4">
            {product.category || 'ទូទៅ'}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-3xl font-black text-blue-600 mb-6">${product.price.toFixed(2)}</p>
          <div className="mb-8">
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description || 'មិនទាន់មានការពិពណ៌នាលម្អិតសម្រាប់ផលិតផលនេះទេនៅឡើយទេ...'}
            </p>
            <p className="mt-4 text-sm font-medium text-gray-700">ស្តុកសល់: <span className="text-green-600">{product.countInStock || 0}</span></p>
          </div>
          
          {/* ផ្នែកជ្រើសរើសទំហំ */}
{product.sizes && product.sizes.length > 0 && (
  <div className="mb-4">
    ា<label className="block text-sm font-medium text-gray-700 mb-2">ជ្រើសរើសទំហំ:</label>
    <div className="flex gap-2">
      {product.sizes.map((size, index) => (
        <button
          key={index}
          onClick={() => setSelectedSize(size)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
            selectedSize === size 
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
)}

{/* ផ្នែកជ្រើសរើសពណ៌ */}
{product.colors && product.colors.length > 0 && (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">ជ្រើសរើសពណ៌:</label>
    <div className="flex gap-2">
      {product.colors.map((color, index) => (
        <button
          key={index}
          onClick={() => setSelectedColor(color)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
            selectedColor === color 
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
          }`}
        >
          {color}
        </button>
      ))}
    </div>
  </div>
)}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 hover:shadow-lg"
          >
            <ShoppingCart size={20} /> បន្ថែមចូលកន្ត្រក
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;