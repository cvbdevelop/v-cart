import { useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Tag, CheckCircle } from 'lucide-react';

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  // States សម្រាប់កូដបញ្ចុះតម្លៃ
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // គណនាតម្លៃដើម
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  // គណនាតម្លៃបញ្ចុះតម្លៃជាទឹកប្រាក់
  const discountAmount = (subtotal * discountPercent) / 100;
  // តម្លៃសរុបចុងក្រោយ
  const totalAmount = subtotal - discountAmount;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    try {
      const res = await fetch('https://v-cart-backend.onrender.com/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      if (data.success) {
        setDiscountPercent(data.discountPercent);
        setCouponApplied(true);
        alert(`បានដាក់បញ្ចូលកូដបញ្ចុះតម្លៃជោគជ័យ ${data.discountPercent}%!`);
      } else {
        alert(data.message || 'កូដមិនត្រឹមត្រូវ');
      }
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('កន្ត្រកទំនិញរបស់អ្នកទទេ។');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName,
        phone,
        address,
        paymentMethod,
        items: cart,
        totalAmount
      };

      const response = await fetch('https://v-cart-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (data.success) {
        alert('បញ្ជាទិញទំនិញបានជោគជ័យ!');
        clearCart();
        navigate('/tracking');
      } else {
        alert(data.message || 'មានបញ្ហាក្នុងការបញ្ជាទិញ');
      }
    } catch (error) {
      console.error('Order Error:', error);
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">ទូទាត់ប្រាក់ (Checkout)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ព័ត៌មានអតិថិជន */}
        <form onSubmit={handleSubmitOrder} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">ព័ត៌មានអ្នកទទួល</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះពេញ</label>
            <input 
              type="text" 
              required 
              value={customerName} 
              onChange={e => setCustomerName(e.target.value)} 
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="ឈ្មោះរបស់អ្នក..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">លេខទូរស័ព្ទ</label>
            <input 
              type="tel" 
              required 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="012345678..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">អាសយដ្ឋានដឹកជញ្ជូន</label>
            <textarea 
              required 
              rows="2" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="ផ្ទះលេខ ផ្លូវ សង្កាត់ រាជធានីភ្នំពេញ..." 
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">វិធីសាស្ត្រទូទាត់</label>
            <select 
              value={paymentMethod} 
              onChange={e => setPaymentMethod(e.target.value)} 
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="COD">ទូទាត់ពេលទទួលបានទំនិញ (Cash on Delivery)</option>
              <option value="ABA">ទូទាត់តាម ABA Pay</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition mt-4"
          >
            {loading ? 'កំពុងបញ្ជូន...' : 'បញ្ជាក់ការបញ្ជាទិញ'}
          </button>
        </form>

        {/* សង្ខេបកន្ត្រកទំនិញ និងកូដបញ្ចុះតម្លៃ */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-bold text-gray-800">សង្ខេបការបញ្ជាទិញ ({cart.length} ទំនិញ)</h2>
          
          <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
            {cart.map(item => (
              <div key={item._id || item.id} className="flex justify-between items-center text-sm border-b pb-2">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-gray-500 text-xs">ចំនួន: {item.quantity || 1}</p>
                </div>
                <span className="font-semibold">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* ប្រអប់បញ្ចូលកូដបញ្ចុះតម្លៃ */}
          <div className="border-t pt-4">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-grow">
                <Tag className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={couponCode} 
                  onChange={e => setCouponCode(e.target.value)} 
                  placeholder="កូដបញ្ចុះតម្លៃ (ឧ. DISCOUNT10)" 
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>
              <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                ប្រើប្រាស់
              </button>
            </form>
            {couponApplied && (
              <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                <CheckCircle size={14} /> បានបញ្ចុះតម្លៃ {discountPercent}% ជោគជ័យ!
              </p>
            )}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>តម្លៃសរុបកន្ត្រក៖</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between text-green-600">
                <span>បញ្ចុះតម្លៃ ({discountPercent}%)៖</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
              <span>ទឹកប្រាក់ត្រូវបង់សរុប៖</span>
              <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;