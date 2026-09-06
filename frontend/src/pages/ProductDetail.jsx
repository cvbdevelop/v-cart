import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Star, ShoppingCart, ArrowLeft, MessageSquare } from 'lucide-react';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useCart() || {};
  const addToCart = context.addToCart || (() => {});
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // States សម្រាប់ទំហំ និង ពណ៌ដែលអតិថិជនបានជ្រើសរើស
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://v-cart-backend.onrender.com/api/products`);
        const data = await res.json();
        const foundProduct = data.find(p => p._id === id);
        setProduct(foundProduct);
        
        // ជ្រើសរើសទំហំ និងពណ៌ទី១ ដោយស្វ័យប្រវត្តិពេលលោតចេញមក
        if (foundProduct?.sizes?.length > 0 && foundProduct.sizes[0] !== '') setSelectedSize(foundProduct.sizes[0]);
        if (foundProduct?.colors?.length > 0 && foundProduct.colors[0] !== '') setSelectedColor(foundProduct.colors[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      if (product.sizes?.length > 0 && product.sizes[0] !== '' && !selectedSize) return alert('សូមជ្រើសរើសទំហំ!');
      if (product.colors?.length > 0 && product.colors[0] !== '' && !selectedColor) return alert('សូមជ្រើសរើសពណ៌!');

      // បន្ថែមទំហំ និងពណ៌ដែលបានរើសទៅកាន់ទំនិញក្នុងកន្ត្រក
      const cartItem = {
        ...product,
        name: `${product.name} ${selectedSize ? `(${selectedSize})` : ''} ${selectedColor ? `- ${selectedColor}` : ''}`,
        selectedSize,
        selectedColor
      };
      
      addToCart(cartItem, 1);
      alert('បានបន្ថែមចូលកន្ត្រក!');
    }
  };

  const submitReview = async (e) => {
    // ... (រក្សាមុខងារ submitReview ដូចដើម) ...
    e.preventDefault();
    if (!reviewerName || !comment) return alert('សូមបំពេញឈ្មោះ និងមតិយោបល់របស់អ្នក');
    setSubmittingReview(true);
    try {
      const res = await fetch(`https://v-cart-backend.onrender.com/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: reviewerName, rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        alert('អរគុណសម្រាប់ការវាយតម្លៃរបស់អ្នក!');
        window.location.reload();
      } else {
        alert(data.message || 'បរាជ័យក្នុងការបញ្ជូន');
      }
    } catch (err) {
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (starCount) => {
    return [...Array(5)].map((_, index) => (
      <Star key={index} size={16} className={index < starCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
    ));
  };

  if (loading) return <div className="text-center py-20">កំពុងទាញយកទិន្នន័យ...</div>;
  if (!product) return <div className="text-center py-20">រកមិនឃើញទំនិញនេះទេ</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft size={20} /> ត្រឡប់ក្រោយ
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                <span className="font-bold text-yellow-600 text-sm">{product.rating ? product.rating.toFixed(1) : '0'}</span>
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="text-gray-500 text-xs ml-1">({product.numReviews || 0} reviews)</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {/* កន្លែងជ្រើសរើសទំហំ (Sizes) */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "" && (
              <div className="mb-4">
                <span className="block text-sm font-bold text-gray-700 mb-2">ទំហំ (Sizes):</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedSize(s)}
                      className={`border px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedSize === s ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* កន្លែងជ្រើសរើសពណ៌ (Colors) */}
            {product.colors && product.colors.length > 0 && product.colors[0] !== "" && (
              <div className="mb-6">
                <span className="block text-sm font-bold text-gray-700 mb-2">ពណ៌ (Colors):</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedColor(c)}
                      className={`border px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedColor === c ? 'bg-gray-800 text-white border-gray-800 shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <span className="text-sm text-gray-500">
                ស្ថានភាពស្តុក៖ {product.countInStock > 0 ? <span className="text-green-600 font-bold">មានស្តុក ({product.countInStock})</span> : <span className="text-red-500 font-bold">អស់ពីស្តុក</span>}
              </span>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition ${
                product.countInStock > 0 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={22} />
              {product.countInStock > 0 ? 'បន្ថែមចូលកន្ត្រក' : 'អស់ពីស្តុក'}
            </button>
          </div>
        </div>
      </div>

      {/* ... (រក្សាផ្នែក Reviews & Ratings នៅខាងក្រោមដូចដើម ឬអាច copy ពីកូដចាស់មកដាក់) ... */}
    </div>
  );
}

export default ProductDetail;