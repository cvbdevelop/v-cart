import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

function Cart() {
  // ទាញយកទិន្នន័យ (ហៅទាំង cartItems និង cart ដើម្បីការពារការខុសឈ្មោះអថេរក្នុង Context)
  const { cartItems, cart, removeFromCart, updateQuantity } = useCart();

  // បង្កើតទិន្នន័យបណ្តោះអាសន្ន ដើម្បីការពារកុំឱ្យ Error ផ្ទាំងសបើទិន្នន័យ undefined
  const currentCart = cartItems || cart || [];

  // គណនាតម្លៃសរុបទាំងអស់ (ប្រើ currentCart ជំនួស)
  const subtotal = currentCart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 0 ? 2.00 : 0;
  const total = subtotal + shipping;

  if (currentCart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-xl">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">កន្ត្រកទំនិញរបស់អ្នកទទេរ</h2>
        <p className="text-gray-500 mb-8">ហាក់ដូចជាអ្នកមិនទាន់បានជ្រើសរើសទំនិញណាមួយចូលក្នុងកន្ត្រកនៅឡើយទេ។</p>
        <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-sm">
          ទិញទំនិញឥឡូវនេះ
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <ShoppingBag className="text-blue-600" /> កន្ត្រកទំនិញរបស់ខ្ញុំ
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* បញ្ជីទំនិញក្នុងកន្ត្រក */}
        <div className="lg:col-span-2 space-y-4">
          {currentCart.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-contain bg-gray-50 rounded-xl p-2" />
              
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                <p className="text-blue-600 font-black text-lg mb-1">${item.price.toFixed(2)}</p>
                
                {/* បង្ហាញទំហំ និង ពណ៌ដែលបានរើស */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-xs text-gray-500 mb-3">
                  {item.selectedSize && <span className="bg-gray-100 px-2.5 py-1 rounded-md">ទំហំ: <strong className="text-gray-700">{item.selectedSize}</strong></span>}
                  {item.selectedColor && <span className="bg-gray-100 px-2.5 py-1 rounded-md">ពណ៌: <strong className="text-gray-700">{item.selectedColor}</strong></span>}
                </div>

                {/* ប៊ូតុងកែប្រែចំនួន (ការពារករណីដែលមិនទាន់មានមុខងារ updateQuantity ក្នុង Context) */}
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <button 
                    onClick={() => updateQuantity && updateQuantity(item._id || item.id, Math.max(1, (item.quantity || 1) - 1), item.selectedSize, item.selectedColor)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 transition flex items-center justify-center"
                  >-</button>
                  <span className="font-bold text-gray-800 w-6 text-center">{item.quantity || 1}</span>
                  <button 
                    onClick={() => updateQuantity && updateQuantity(item._id || item.id, (item.quantity || 1) + 1, item.selectedSize, item.selectedColor)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 transition flex items-center justify-center"
                  >+</button>
                </div>
              </div>

              {/* តម្លៃសរុបតាមមុខទំនិញ និងប៊ូតុងលុប */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                <p className="font-black text-gray-800 text-lg">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                <button 
                  onClick={() => removeFromCart && removeFromCart(item._id || item.id, item.selectedSize, item.selectedColor)}
                  className="text-red-400 hover:text-red-600 p-2 transition mt-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ផ្នែកសង្ខេបការបញ្ជាទិញ (Order Summary) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">សង្ខេបការបញ្ជាទិញ</h3>
          
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>តម្លៃទំនិញសរុប</span>
              <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>សេវាដឹកជញ្ជូន</span>
              <span className="font-semibold text-gray-800">${shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-800">
              <span>ទឹកប្រាក់ត្រូវបង់សរុប</span>
              <span className="text-blue-600 text-xl">${total.toFixed(2)}</span>
            </div>
          </div>

          <Link 
            to="/checkout" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm hover:shadow-md"
          >
            បន្តទៅកាន់ការទូទាត់ <ArrowRight size={18} />
          </Link>
          {/* ប៊ូតុងបន្តទៅកាន់ការទូទាត់ (កូដចាស់មានស្រាប់) */}
          <Link 
            to="/checkout" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm hover:shadow-md"
          >
            បន្តទៅកាន់ការទូទាត់ <ArrowRight size={18} />
          </Link>

          {/* ប៊ូតុងថ្មី សម្រាប់បន្តការទិញទំនិញ (បន្ថែមថ្មីនៅទីនេះ) */}
          <Link 
            to="/" 
            className="w-full mt-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
          >
            <ArrowLeft size={18} /> បន្តការទិញទំនិញ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;