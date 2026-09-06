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
  
  // States សម្រាប់បញ្ជូន Review ថ្មី
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
      addToCart(product, 1);
      alert('បានបន្ថែមចូលកន្ត្រក!');
    }
  };

  const submitReview = async (e) => {
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
        window.location.reload(); // Refresh ដើម្បីបង្ហាញ review ថ្មី
      } else {
        alert(data.message || 'បរាជ័យក្នុងការបញ្ជូន');
      }
    } catch (err) {
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    } finally {
      setSubmittingReview(false);
    }
  };

  // មុខងារគូររូបផ្កាយ (Stars Render)
  const renderStars = (starCount) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < starCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
      />
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

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description || 'មិនមានការបរិយាយពីទំនិញនេះទេ។'}
            </p>

            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "" && (
              <div className="mb-4">
                <span className="block text-sm font-bold text-gray-700 mb-2">ទំហំ (Sizes):</span>
                <div className="flex gap-2">
                  {product.sizes.map((s, idx) => (
                    <span key={idx} className="border px-3 py-1 rounded-md text-sm">{s}</span>
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

      {/* ផ្នែក Reviews & Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare size={24} className="text-blue-600" /> មតិយោបល់អតិថិជន ({product.reviews?.length || 0})
          </h2>
          
          {(!product.reviews || product.reviews.length === 0) ? (
            <div className="bg-gray-50 p-8 rounded-2xl text-center text-gray-500 border border-gray-100">
              មិនទាន់មានអ្នកវាយតម្លៃទំនិញនេះនៅឡើយទេ។ សូមក្លាយជាអ្នកវាយតម្លៃដំបូងគេ!
            </div>
          ) : (
            product.reviews.map((rev, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{rev.name}</h4>
                  <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {renderStars(rev.rating)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4">សរសេរមតិយោបល់របស់អ្នក</h3>
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះរបស់អ្នក</label>
              <input type="text" required value={reviewerName} onChange={e => setReviewerName(e.target.value)} className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="វាយឈ្មោះទីនេះ..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ពិន្ទុវាយតម្លៃ</label>
              <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                <option value={5}>៥ ផ្កាយ (ល្អឥតខ្ចោះ)</option>
                <option value={4}>៤ ផ្កាយ (ល្អណាស់)</option>
                <option value={3}>៣ ផ្កាយ (មធ្យម)</option>
                <option value={2}>២ ផ្កាយ (អន់)</option>
                <option value={1}>១ ផ្កាយ (អន់ខ្លាំង)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">មតិយោបល់</label>
              <textarea required rows="4" value={comment} onChange={e => setComment(e.target.value)} className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="តើអ្នកយល់យ៉ាងណាដែរចំពោះទំនិញនេះ?"></textarea>
            </div>
            <button type="submit" disabled={submittingReview} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition text-sm">
              {submittingReview ? 'កំពុងបញ្ជូន...' : 'បញ្ជូនមតិយោបល់'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;