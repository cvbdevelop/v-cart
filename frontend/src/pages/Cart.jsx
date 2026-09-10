import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

function Cart() {
  const cartContext = useContext(CartContext) || {};
  const cart = cartContext.cart || [];
  const removeFromCart = cartContext.removeFromCart || (() => {});
  const updateQuantity = cartContext.updateQuantity || (() => {});
  const navigate = useNavigate();

  // គណនាចំនួនទំនិញ និងតម្លៃសរុប
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  // បង្ហាញផ្ទាំងនេះនៅពេលកន្ត្រកទទេ
  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-[1200px] text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">កន្ត្រកទំនិញរបស់អ្នកទទេ</h2>
          <p className="text-gray-500 mb-6">មិនទាន់មានទំនិញនៅក្នុងកន្ត្រកនៅឡើយទេ</p>
          <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-md">
            ត្រឡប់ទៅទិញទំនិញ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <h1 className="text-2xl font-black text-gray-800 mb-8">
          កន្ត្រកទំនិញ <span className="text-gray-500 text-lg font-medium">({totalItems} មុខ)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ================= បញ្ជីទំនិញផ្នែកខាងឆ្វេង ================= */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {cart.map((item, index) => (
              <div key={`${item._id}-${index}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-5 relative transition hover:shadow-md">
                
                <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                
                <div className="flex-grow">
                  <Link to={`/product/${item._id}`} className="font-bold text-gray-800 hover:text-blue-600 transition text-lg line-clamp-1">
                    {item.name}
                  </Link>
                  <div className="text-orange-500 font-black mt-1">${item.price.toFixed(2)}</div>
                  
                  {/* +++ ផ្នែកបង្ហាញជម្រើសដែលអតិថិជនបានជ្រើសរើស (ពណ៌ ទំហំផ្ទុក ទំហំ) +++ */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm bg-gray-50 px-3 py-1.5 rounded-md inline-flex border border-gray-100">
                    {item.selectedColor && (
                      <div className="text-gray-500">ពណ៌៖ <span className="font-bold text-gray-700">{item.selectedColor}</span></div>
                    )}
                    {item.selectedStorage && (
                      <div className="text-gray-500 border-l border-gray-300 pl-4 ml-2">ទំហំផ្ទុក៖ <span className="font-bold text-gray-700">{item.selectedStorage}</span></div>
                    )}
                    {item.selectedSize && (
                      <div className="text-gray-500 border-l border-gray-300 pl-4 ml-2">ទំហំ៖ <span className="font-bold text-gray-700">{item.selectedSize}</span></div>
                    )}
                    {/* បង្ហាញសញ្ញា - បើអតិថិជនមិនបានរើសអ្វីសោះ (ទំនិញទូទៅ) */}
                    {(!item.selectedColor && !item.selectedStorage && !item.selectedSize) && (
                      <div className="text-gray-400 italic">ទំនិញស្តង់ដារ (គ្មានជម្រើស)</div>
                    )}
                  </div>
                  {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
                </div>

                <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-800">{item.quantity || 1}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-400 hover:text-red-500 transition p-2 bg-gray-50 hover:bg-red-50 rounded-full"
                    title="លុបចេញ"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= សង្ខេបការបញ្ជាទិញផ្នែកខាងស្តាំ ================= */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">សង្ខេបការបញ្ជាទិញ</h3>
              
              <div className="flex justify-between mb-4 text-gray-600 text-sm">
                <span>ទំនិញសរុប ({totalItems})</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-6 text-gray-600 text-sm">
                <span>ថ្លៃដឹកជញ្ជូន</span>
                <span className="text-green-500 font-medium">ឥតគិតថ្លៃ</span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-4 mb-6">
                <span className="font-bold text-gray-800">សរុបប្រាក់បង់</span>
                <span className="text-2xl font-black text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-lg transition shadow-md flex items-center justify-center gap-2"
              >
                បន្តទៅទូទាត់ប្រាក់ <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;