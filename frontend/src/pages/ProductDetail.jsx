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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://v-cart-backend.onrender.com/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`បានបន្ថែម ${product.name} ចូលកន្ត្រក!`);
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
            <p className="text-gray-600 text-sm leading-relaxed">
              ផលិតផលនេះមានគុណភាពខ្ពស់ សាកសមបំផុតសម្រាប់ការប្រើប្រាស់ប្រចាំថ្ងៃ។ យើងធានាជូននូវគុណភាព និងតម្លៃសមរម្យ។
            </p>
            <p className="mt-3 text-sm font-medium text-gray-700">ស្តុកសល់: <span className="text-green-600">{product.countInStock || 0}</span></p>
          </div>
          
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