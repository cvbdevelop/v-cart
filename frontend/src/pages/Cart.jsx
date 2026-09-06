import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

function Cart() {
  // កូដការពារសុវត្ថិភាព
  const context = useContext(CartContext) || {};
  const cart = context.cart || [];
  const updateQuantity = context.updateQuantity || (() => {});
  const removeFromCart = context.removeFromCart || (() => {});

  // គណនាតម្លៃសរុប (ការពារ Error)
  const totalAmount = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">កន្ត្រករបស់អ្នកទទេ</h2>
        <p className="text-gray-500 mb-8">ហាក់ដូចជាអ្នកមិនទាន់បានជ្រើសរើសទំនិញណាមួយនៅឡើយទេ។</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition flex items-center justify-center gap-2">
          ទៅកាន់ទំព័រដើម <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        កន្ត្រកទំនិញ <span className="text-lg font-normal text-gray-500">({cart.length} មុខ)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id || item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center relative">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-gray-50" />
              <div className="flex-grow">
                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                <p className="text-blue-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center bg-gray-50 rounded-lg border">
                    <button onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) - 1)} className="p-2 hover:bg-gray-100 text-gray-600 transition rounded-l-lg">
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-medium text-sm">{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) + 1)} className="p-2 hover:bg-gray-100 text-gray-600 transition rounded-r-lg">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => removeFromCart(item._id || item.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition p-2 bg-gray-50 hover:bg-red-50 rounded-full">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
          <h2 className="text-lg font-bold text-gray-800 mb-4">សង្ខេបការបញ្ជាទិញ</h2>
          <div className="space-y-3 text-sm text-gray-600 mb-4 border-b pb-4">
            <div className="flex justify-between">
              <span>ទំនិញសរុប៖</span>
              <span>{totalItems} មុខ</span>
            </div>
            <div className="flex justify-between">
              <span>តម្លៃដើម៖</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
            <span>សរុបត្រូវបង់៖</span>
            <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md">
            បន្តទៅទូទាត់ប្រាក់ <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;