import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">កន្ត្រកទំនិញរបស់អ្នកទទេស្អាត</h2>
        <p className="text-gray-500 mb-8">សូមស្វែងរកផលិតផលដែលអ្នកពេញចិត្ត រួចបន្ថែមវាចូលទីនេះ។</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          <ArrowLeft size={20} /> ត្រលប់ទៅទិញទំនិញវិញ
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
        កន្ត្រកទំនិញរបស់ខ្ញុំ
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* បញ្ជីទំនិញ */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-blue-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md transition text-gray-600">
                    <Minus size={18} />
                  </button>
                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md transition text-gray-600">
                    <Plus size={18} />
                  </button>
                </div>

                <div className="text-right w-24">
                  <p className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition ml-2">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* សរុបទឹកប្រាក់ */}
        <div className="lg:w-80">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">សរុបការបញ្ជាទិញ</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>តម្លៃទំនិញសរុប:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>សេវាដឹកជញ្ជូន:</span>
                <span className="text-green-600">ឥតគិតថ្លៃ</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t">
              <span className="font-bold text-gray-800">សរុបត្រូវបង់:</span>
              <span className="text-2xl font-bold text-blue-600">${cartTotal.toFixed(2)}</span>
            </div>

            // ដូរទៅជាកូដនេះវិញ:
            <Link to="/checkout" className="block text-center w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
              បន្តទៅការទូទាត់ប្រាក់
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;