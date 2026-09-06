import { useState } from 'react';
import { Search, Package, Clock, Truck, CheckCircle } from 'lucide-react';

function OrderTracking() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    try {
      const res = await fetch(`https://v-cart-backend.onrender.com/api/orders/track/${phone}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setSearched(true);
      }
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">តាមដានការបញ្ជាទិញរបស់អ្នក</h1>
        <p className="text-gray-500">សូមបញ្ចូលលេខទូរស័ព្ទដែលបានប្រើប្រាស់ពេលទូទាត់ប្រាក់</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-10">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="វាយបញ្ចូលលេខទូរស័ព្ទ (ឧ. 012345678)..." 
            required
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition">
          {loading ? 'កំពុងស្វែងរក...' : 'ពិនិត្យមើល'}
        </button>
      </form>

      {searched && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">លទ្ធផលស្វែងរក ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border text-center text-gray-500">
              រកមិនឃើញការបញ្ជាទិញសម្រាប់លេខទូរស័ព្ទនេះទេ។
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="text-xs text-gray-400 block">កាលបរិច្ឆេទបញ្ជាទិញ</span>
                    <span className="font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-xs rounded-full font-bold inline-flex items-center gap-1 ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'Shipping' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {order.status === 'Pending' && <Clock size={14} />}
                      {order.status === 'Shipping' && <Truck size={14} />}
                      {order.status === 'Delivered' && <CheckCircle size={14} />}
                      {order.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2">ទំនិញក្នុងវិក្កយបត្រ៖</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <span>{item.name} (x{item.quantity || 1})</span>
                        <span className="font-semibold">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t font-bold">
                  <span className="text-gray-700">ទឹកប្រាក់សរុប៖</span>
                  <span className="text-blue-600 text-lg">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default OrderTracking;