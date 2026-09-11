import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { QrCode, ShieldCheck } from 'lucide-react';

function Checkout() {
  const cartContext = useContext(CartContext) || {};
  const cart = cartContext.cart || [];
  const clearCart = cartContext.clearCart || (() => {});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash on Delivery' // លំនាំដើម
  });

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const subTotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  const discountAmount = (subTotal * discount) / 100;
  const finalTotal = subTotal - discountAmount;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await fetch('https://v-cart-backend.onrender.com/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.discountPercent);
        alert(`ទទួលបានការបញ្ចុះតម្លៃ ${data.discountPercent}%!`);
      } else {
        alert(data.message || 'កូដមិនត្រឹមត្រូវទេ');
        setDiscount(0);
      }
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាក្នុងការផ្ទៀងផ្ទាត់កូដបញ្ចុះតម្លៃ');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('មិនមានទំនិញក្នុងកន្ត្រកទេ!');
    setIsSubmitting(true);

    const orderData = {
      ...formData,
      items: cart,
      totalAmount: finalTotal
    };

    try {
      const res = await fetch('https://v-cart-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      
      if (data.success) {
        alert('ការបញ្ជាទិញទទួលបានជោគជ័យ! សូមអរគុណ។');
        clearCart();
        navigate('/');
      } else {
        alert(data.message || 'បរាជ័យក្នុងការបញ្ជាទិញ');
      }
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាភ្ជាប់ទៅកាន់ Server');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">មិនមានទំនិញសម្រាប់ទូទាត់ទេ</h2>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">ទៅទិញទំនិញ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-[1000px]">
        <h1 className="text-2xl font-black text-gray-800 mb-8 text-center">ទូទាត់ប្រាក់ (Checkout)</h1>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* ================= ផ្នែកខាងឆ្វេង៖ ព័ត៌មានអ្នកទទួល ================= */}
          <div className="w-full md:w-1/2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-3">ព័ត៌មានអ្នកទទួល</h3>
              <form onSubmit={handleSubmitOrder} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះពេញ</label>
                  <input required type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full border px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 text-sm bg-gray-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">លេខទូរស័ព្ទ</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 text-sm bg-gray-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">អាសយដ្ឋានដឹកជញ្ជូន</label>
                  <textarea required name="address" value={formData.address} onChange={handleInputChange} rows="3" placeholder="ផ្ទះលេខ ផ្លូវ សង្កាត់ ខណ្ឌ..." className="w-full border px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 text-sm bg-gray-50 focus:bg-white"></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">វិធីទូទាត់ប្រាក់</label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full border px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 text-sm font-bold text-gray-700 bg-gray-50">
                    <option value="Cash on Delivery">ទូទាត់ពេលទទួលបានទំនិញ (Cash on Delivery)</option>
                    <option value="Acleda Pay">ទូទាត់តាមអេស៊ីលីដា (Acleda Pay)</option>
                  </select>
                </div>

                {/* +++ ផ្នែកបង្ហាញ QR Code ពេលជ្រើសរើស Acleda Pay +++ */}
                {formData.paymentMethod === 'Acleda Pay' && (
                  <div className="mt-2 p-5 bg-[#00529c]/5 border border-[#00529c]/20 rounded-xl text-center flex flex-col items-center">
                    <div className="bg-[#00529c] text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4 flex items-center gap-2">
                      <ShieldCheck size={16} /> ធានាសុវត្ថិភាពទូទាត់ ១០០%
                    </div>
                    
                    <h4 className="font-black text-[#00529c] mb-1">ស្កេនដើម្បីទូទាត់ប្រាក់</h4>
                    <p className="text-xs text-gray-500 mb-4">សូមប្រើប្រាស់កម្មវិធី Acleda Mobile ដើម្បីស្កេន</p>
                    
                    {/* រូបភាព QR Code - លោកអ្នកអាចដូរ URL រូបភាពពិតប្រាកដនៅទីនេះ */}
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-3 relative">
                      <QrCode className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-100/50" size={150} />
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AcledaPay_${finalTotal}`} 
                        alt="Acleda QR Code" 
                        className="w-40 h-40 object-contain relative z-10" 
                      />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      ទឹកប្រាក់ត្រូវបង់៖ <span className="font-black text-[#00529c] text-lg">${finalTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-orange-500 mt-2 font-medium">
                      *សូមចុច "បញ្ជាក់ការបញ្ជាទិញ" បន្ទាប់ពីលោកអ្នកបានធ្វើការវេរប្រាក់រួចរាល់។
                    </p>
                  </div>
                )}
                {/* ++++++++++++++++++++++++++++++++++++++++++++++ */}

                <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-3.5 rounded-lg transition shadow-md mt-4 ${formData.paymentMethod === 'Acleda Pay' ? 'bg-[#00529c] hover:bg-[#003d75]' : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-gray-400`}>
                  {isSubmitting ? 'កំពុងដំណើរការ...' : (formData.paymentMethod === 'Acleda Pay' ? 'បញ្ជាក់ថាបានទូទាត់រួចរាល់' : 'បញ្ជាក់ការបញ្ជាទិញ')}
                </button>
              </form>
            </div>
          </div>

          {/* ================= ផ្នែកខាងស្តាំ៖ សង្ខេបការបញ្ជាទិញ ================= */}
          <div className="w-full md:w-1/2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-3">សង្ខេបការបញ្ជាទិញ ({totalItems} ទំនិញ)</h3>
              
              <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-start text-sm border-b border-gray-50 pb-4 last:border-0">
                    <div className="flex flex-col gap-1.5 flex-grow pr-4">
                      <span className="font-bold text-gray-700 leading-tight">
                        {item.name} <span className="text-orange-500 text-xs font-bold ml-1">x{item.quantity || 1}</span>
                      </span>
                      
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500 mt-0.5">
                        {item.selectedColor && <span>ពណ៌៖ <span className="text-gray-800 font-medium">{item.selectedColor}</span></span>}
                        {item.selectedStorage && <span className={`${item.selectedColor ? 'border-l pl-3' : ''}`}>ទំហំផ្ទុក៖ <span className="text-gray-800 font-medium">{item.selectedStorage}</span></span>}
                        {item.selectedSize && <span className={`${(item.selectedColor || item.selectedStorage) ? 'border-l pl-3' : ''}`}>ទំហំ៖ <span className="text-gray-800 font-medium">{item.selectedSize}</span></span>}
                      </div>
                    </div>
                    <span className="font-bold text-gray-800 mt-0.5">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="បញ្ចូលកូដបញ្ចុះតម្លៃ..." 
                  className="w-full border px-4 py-2 rounded-lg outline-none focus:border-gray-400 text-sm bg-gray-50"
                />
                <button onClick={handleApplyCoupon} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap">
                  ប្រើប្រាស់
                </button>
              </div>

              <div className="flex flex-col gap-3 text-sm text-gray-600 border-t pt-4">
                <div className="flex justify-between">
                  <span>តម្លៃសរុប</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>បញ្ចុះតម្លៃ ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>ថ្លៃដឹកជញ្ជូន</span>
                  <span className="text-green-500 font-medium">ឥតគិតថ្លៃ</span>
                </div>
                <div className="flex justify-between items-center border-t mt-2 pt-4">
                  <span className="font-bold text-gray-800 text-base">ទឹកប្រាក់ត្រូវបង់សរុប</span>
                  <span className="text-2xl font-black text-[#00529c]">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;