import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('khqr');

  // មុខងារពេលចុចប៊ូតុង "បញ្ជាក់ការបញ្ជាទិញ"
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ១. ប្រមូលទិន្នន័យពី Form ដែលអតិថិជនបានបំពេញ
    const orderData = {
      customerName: e.target[0].value, // ប្រអប់ឈ្មោះ
      phone: e.target[1].value,        // ប្រអប់លេខទូរស័ព្ទ
      address: e.target[2].value,      // ប្រអប់អាសយដ្ឋាន
      paymentMethod: paymentMethod,
      items: cart,
      totalAmount: cartTotal
    };

    try {
      // ២. បញ្ជូនទិន្នន័យទៅកាន់ Backend Server (Port 5001)
      const response = await fetch('https://v-cart-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      // ៣. ពិនិត្យមើលលទ្ធផល
      if (response.ok && data.success) {
        setIsSuccess(true);
        clearCart(); // លុបកន្ត្រកពេលបញ្ជូនទិន្នន័យចូល Database ជោគជ័យ
      } else {
        alert('មានបញ្ហាក្នុងការបញ្ជាទិញ សូមសាកល្បងម្តងទៀត');
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert('បរាជ័យក្នុងការភ្ជាប់ទៅកាន់ Server! សូមប្រាកដថា Backend របស់អ្នកកំពុងដំណើរការ (node server.js)');
    }
  };

  // ផ្ទាំងបង្ហាញពេលទូទាត់ជោគជ័យ
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ការបញ្ជាទិញទទួលបានជោគជ័យ!</h2>
          <p className="text-gray-600 mb-6">
            សូមអរគុណ! យើងបានទទួលព័ត៌មានរបស់អ្នកហើយ ក្រុមការងារនឹងទាក់ទងទៅអ្នកក្នុងពេលឆាប់ៗនេះ។
          </p>
          
          {paymentMethod === 'khqr' && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg inline-block border">
              <p className="font-medium text-gray-800 mb-2">សូមស្កេនដើម្បីទូទាត់ប្រាក់ (${cartTotal.toFixed(2)})</p>
              {/* QR Code សិប្បនិម្មិត */}
              <img src="https://placehold.co/200x200?text=Scan+KHQR" alt="KHQR" className="mx-auto rounded-md" />
            </div>
          )}

          <Link to="/" className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            បន្តការទិញទំនិញ
          </Link>
        </div>
      </div>
    );
  }

  // បើកន្ត្រកទទេ (ការពារករណីអតិថិជនវាយ URL ចូលផ្ទាល់)
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">មិនមានទំនិញសម្រាប់ទូទាត់ទេ</h2>
        <Link to="/" className="text-blue-600 mt-4 inline-block hover:underline">ត្រលប់ទៅទំព័រដើម</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition">
        <ArrowLeft size={20} /> ត្រលប់ទៅកន្ត្រកទំនិញ
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ទម្រង់បំពេញព័ត៌មានអតិថិជន */}
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">ព័ត៌មានដឹកជញ្ជូន</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">ឈ្មោះ​ពេញ <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ឈ្មោះរបស់អ្នក" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">លេខទូរស័ព្ទ <span className="text-red-500">*</span></label>
                <input required type="tel" className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="012 345 678" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">អាសយដ្ឋានដឹកជញ្ជូន <span className="text-red-500">*</span></label>
                <textarea required rows="3" className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់, ខណ្ឌ..."></textarea>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4 border-b pb-4">វិធីសាស្ត្រទូទាត់ប្រាក់</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="khqr" checked={paymentMethod === 'khqr'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-800">ទូទាត់តាមរយៈ KHQR (Scan to Pay)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-800">ទូទាត់សាច់ប្រាក់ពេលទទួលទំនិញ (COD)</span>
              </label>
            </div>
          </form>
        </div>

        {/* វិក្កយបត្រសង្ខេប (Order Summary) */}
        <div className="lg:w-96">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-4">សង្ខេបការបញ្ជាទិញ</h3>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate pr-4">{item.quantity}x {item.name}</span>
                  <span className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-4 mb-6">
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-gray-800">សរុបត្រូវបង់:</span>
                <span className="text-2xl font-bold text-blue-600">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* ប៊ូតុង Submit ភ្ជាប់ទៅកាន់ Form ខាងឆ្វេង */}
            <button form="checkout-form" type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition shadow-md">
              បញ្ជាក់ការបញ្ជាទិញ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;