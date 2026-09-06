import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

function Checkout() {
  const { cartItems, cart } = useCart();
  const navigate = useNavigate();
  
  const currentCart = cartItems || cart || [];
  const subtotal = currentCart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 0 ? 2.00 : 0;
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cod' // cod = Cash on Delivery, aba = ABA Pay
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // កន្លែងនេះយើងនឹងភ្ជាប់ទៅកាន់ Backend នៅពេលក្រោយ
    // សម្រាប់ពេលនេះ យើងធ្វើការក្លែងបន្លំថាការបញ្ជាទិញជោគជ័យ
    setTimeout(() => {
      alert(`អបអរសាទរ ${formData.name}! ការបញ្ជាទិញរបស់អ្នកទទួលបានជោគជ័យ។`);
      // លុបទិន្នន័យកន្ត្រក (អាចបន្ថែមមុខងារ clearCart ក្នុង Context ពេលក្រោយ)
      localStorage.removeItem('v-cart-items'); 
      window.location.href = "/"; // ត្រឡប់ទៅទំព័រដើមវិញ
    }, 1500);
  };

  if (currentCart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">កន្ត្រកទទេរ មិនអាចទូទាត់បានទេ</h2>
        <Link to="/" className="text-blue-600 hover:underline">ត្រឡប់ទៅទិញទំនិញវិញ</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-2 mb-8">
        <Link to="/cart" className="text-gray-500 hover:text-blue-600 transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">ការទូទាត់ប្រាក់</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ផ្នែកបំពេញព័ត៌មាន */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">ព័ត៌មានដឹកជញ្ជូន</h2>
          
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះអ្នកទទួល *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ឧ. ចាន់ វិបុល" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">លេខទូរស័ព្ទ *</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ឧ. 012 345 678" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">អាសយដ្ឋានដឹកជញ្ជូន *</label>
              <textarea required name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="លេខផ្ទះ ផ្លូវ សង្កាត់ ខណ្ឌ..."></textarea>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4 border-b pb-3">វិធីសាស្ត្រទូទាត់ប្រាក់</h2>
            
            <div className="space-y-3">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="mr-3 w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-800">ទូទាត់សាច់ប្រាក់ពេលទទួលទំនិញ (COD)</span>
              </label>

              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${formData.paymentMethod === 'aba' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <input type="radio" name="paymentMethod" value="aba" checked={formData.paymentMethod === 'aba'} onChange={handleChange} className="mr-3 w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-800">ផ្ទេរប្រាក់តាមគណនី ABA Bank</span>
              </label>
            </div>

            <button disabled={isSubmitting} type="submit" className={`w-full mt-8 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isSubmitting ? 'កំពុងដំណើរការ...' : 'បញ្ជាក់ការបញ្ជាទិញ'} <CheckCircle size={20} />
            </button>
          </form>
        </div>

        {/* ផ្នែកសង្ខេបការបញ្ជាទិញ */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4">ទំនិញរបស់អ្នក ({currentCart.length})</h3>
          
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {currentCart.map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-100">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.selectedSize && <span className="mr-2">ទំហំ: {item.selectedSize}</span>}
                    {item.selectedColor && <span>ពណ៌: {item.selectedColor}</span>}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm font-medium text-gray-600">x{item.quantity || 1}</span>
                    <span className="text-sm font-bold text-blue-600">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>តម្លៃសរុប</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>សេវាដឹកជញ្ជូន</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-800">
              <span>សរុបត្រូវបង់</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;