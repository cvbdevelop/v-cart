import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, LogOut, Lock, Edit, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [existingImage, setExistingImage] = useState(''); // បន្ថែមថ្មី

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [category, setCategory] = useState('general');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [sizes, setSizes] = useState('S, M, L, XL');
  const [colors, setColors] = useState('Red, Blue, Black');
  
  // Edit & Password states
  const [editingId, setEditingId] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch('https://v-cart-backend.onrender.com/api/products');
        if (res.ok) setProducts(await res.json());
      } catch (err) { console.error(err); }
    };

    const fetchOrders = async (isInitialFetch = false) => {
      try {
        const res = await fetch('https://v-cart-backend.onrender.com/api/orders');
        if (res.ok) {
          const newOrders = await res.json();
          setOrders(prevOrders => {
            // លេងសំឡេង (Audio) ប្រសិនបើចំនួន Order ថ្មីច្រើនជាងមុន
            if (!isInitialFetch && newOrders.length > prevOrders.length && prevOrders.length > 0) {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
              audio.play().catch(e => console.log('Audio error:', e));
            }
            return newOrders;
          });
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    fetchProducts();
    fetchOrders(true); // ទាញយកទិន្នន័យលើកទី១

    // ដំណើរការទាញយកទិន្នន័យពីក្រោយ (Polling) រៀងរាល់ ១៥ វិនាទី
    const intervalId = setInterval(() => fetchOrders(false), 15000);
    return () => clearInterval(intervalId); // បិទ Polling វិញពេលចាកចេញពីផ្ទាំង Admin
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('https://v-cart-backend.onrender.com/api/change-password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert('ប្តូរលេខសម្ងាត់បានជោគជ័យ!');
        setOldPassword('');
        setNewPassword('');
      } else {
        alert(data.message || 'បរាជ័យក្នុងការប្តូរលេខសម្ងាត់');
      }
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://v-cart-backend.onrender.com/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('បរាជ័យក្នុងការកែប្រែស្ថានភាព');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបប្រវត្តិការបញ្ជាទិញនេះមែនទេ?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`https://v-cart-backend.onrender.com/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        // ដក Order ដែលលុបចេញពី State ដោយមិនបាច់ Refresh ទំព័រ
        setOrders(orders.filter(order => order._id !== orderId));
      } else {
        alert('បរាជ័យក្នុងការលុប');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price.toString());
    setCountInStock(product.countInStock.toString());
    setCategory(product.category || 'general');
    setDescription(product.description || '');
    setSizes(product.sizes ? product.sizes.join(', ') : '');
    setColors(product.colors ? product.colors.join(', ') : '');
    setExistingImage(product.image); // បន្ថែមថ្មី៖ ចងចាំរូបភាពចាស់
    setImageFile(null); // សម្អាត File ថ្មីចេញ
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      let imageUrl = editingId ? existingImage : 'https://placehold.co/400x400?text=Product';

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await fetch('https://v-cart-backend.onrender.com/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.imageUrl) {
          imageUrl = uploadData.imageUrl;
        } else {
          alert(uploadData.message || 'បរាជ័យក្នុងការ Upload រូបភាព');
          return;
        }
      }

      const url = editingId 
        ? `https://v-cart-backend.onrender.com/api/products/${editingId}`
        : 'https://v-cart-backend.onrender.com/api/products';
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name, 
          price: Number(price), 
          countInStock: Number(countInStock), 
          category, 
          description, 
          image: imageUrl,
          sizes: sizes.split(',').map(s => s.trim()),
          colors: colors.split(',').map(c => c.trim())
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(editingId ? 'កែប្រែទំនិញជោគជ័យ!' : 'បន្ថែមទំនិញជោគជ័យ!');
        window.location.reload();
      } else {
        alert('បរាជ័យក្នុងការរក្សាទុកទំនិញ');
      }
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបទំនិញនេះមែនទេ?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`https://v-cart-backend.onrender.com/api/products/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert('បានលុបទំនិញចេញពីស្តុកជោគជ័យ!');
        // លុបទំនិញនោះចេញពីតារាងភ្លាមៗដោយមិនបាច់ Refresh
        setProducts(products.filter(p => p._id !== id));
      } else {
        // លោតសារប្រាប់ប្រសិនបើលុបមិនបាន (ឧ. Token ផុតកំណត់)
        alert(data.message || 'បរាជ័យក្នុងការលុបទំនិញ');
      }
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server សូមសាកល្បងម្ដងទៀត។');
    }
  };

  // រៀបចំទិន្នន័យសម្រាប់បង្ហាញក្រាហ្វិកចំណូល
  const chartData = orders.map(o => ({
    date: new Date(o.createdAt).toLocaleDateString('en-GB'),
    amount: o.totalAmount
  })).reverse();

  if (loading) {
    return <div className="text-center py-20 text-gray-500 font-medium">កំពុងទាញយកទិន្នន័យ...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ផ្ទាំងគ្រប់គ្រងស្តុក និងការបញ្ជាទិញ (Admin Dashboard)</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-sm font-medium"
        >
          <LogOut size={18} /> ចាកចេញ (Logout)
        </button>
      </div>

      {/* ផ្នែកក្រាហ្វិកវិភាគចំណូល (Sales Analytics Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-600" /> ស្ថិតិចំណូលតាមការបញ្ជាទិញ ($)
        </h2>
        <div className="h-72 w-full">
          {orders.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">មិនទាន់មានទិន្នន័យសម្រាប់បង្ហាញក្រាហ្វិក</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            {editingId ? 'កែប្រែព័ត៌មានទំនិញ' : 'បន្ថែមទំនិញថ្មីក្នុងស្តុក'}
          </h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះទំនិញ</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="ឈ្មោះទំនិញ..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃ ($)</label>
              <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ចំនួនក្នុងស្តុក (Stock)</label>
              <input type="number" value={countInStock} onChange={e => setCountInStock(e.target.value)} required className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
            </div>
            {/* បន្ថែមកូដប្រអប់ប្រភេទទំនិញនៅត្រង់នេះ (ខាងក្រោមស្តុក) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ប្រភេទទំនិញ (Category)</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="general">ទូទៅ (General)</option>
                <option value="clothing">សម្លៀកបំពាក់ (Clothing)</option>
                <option value="shoes">ស្បែកជើង (Shoes)</option>
                <option value="electronics">អេឡិចត្រូនិច (Electronics)</option>
                <option value="accessories">គ្រឿងតុបតែង (Accessories)</option>
              </select>
            </div>
            {/* បញ្ចប់ការបន្ថែម */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">រូបភាពទំនិញ (ជ្រើសរើសពីកុំព្យូទ័រ)</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full border px-3 py-2 rounded-lg outline-none text-sm file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ទំហំ (Sizes)</label>
              <input type="text" value={sizes} onChange={e => setSizes(e.target.value)} className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="S, M, L, XL" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ពណ៌ (Colors)</label>
              <input type="text" value={colors} onChange={e => setColors(e.target.value)} className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Red, Blue, Black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">បរិយាយ</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows="2" className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="បរិយាយពីទំនិញ..."></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition">
              {editingId ? 'រក្សាទុកការកែប្រែ' : 'បន្ថែមចូលស្តុក'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setName(''); setPrice(''); setCountInStock(''); setDescription(''); }} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-xl transition mt-2">
                បោះបង់ការកែប្រែ
              </button>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <Lock size={18} /> ប្តូរលេខសម្ងាត់ Admin
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">លេខសម្ងាត់ចាស់</label>
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">លេខសម្ងាត់ថ្មី</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2.5 rounded-xl transition">
                រក្សាទុកលេខសម្ងាត់ថ្មី
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4 text-gray-800">គ្រប់គ្រងស្តុកទំនិញ ({products.length})</h2>
          <div className="overflow-x-auto max-h-[450px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="pb-3 px-2">រូបភាព</th>
                  <th className="pb-3 px-2">ឈ្មោះទំនិញ</th>
                  <th className="pb-3 px-2">តម្លៃ</th>
                  <th className="pb-3 px-2">ស្តុក</th>
                  <th className="pb-3 px-2 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.map(p => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2"><img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" /></td>
                    <td className="py-3 px-2 font-medium text-gray-800 line-clamp-1">{p.name}</td>
                    <td className="py-3 px-2">${p.price.toFixed(2)}</td>
                    <td className="py-3 px-2">{p.countInStock}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:text-blue-700 p-1">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-gray-800">ប្រវត្តិការបញ្ជាទិញរបស់អតិថិជន ({orders.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="pb-3 px-4">កាលបរិច្ឆេទ</th>
                <th className="pb-3 px-4">អតិថិជន</th>
                <th className="pb-3 px-4">ទូរស័ព្ទ</th>
                <th className="pb-3 px-4">ទំនិញ</th>
                <th className="pb-3 px-4">សរុប</th>
                <th className="pb-3 px-4">ស្ថានភាព</th>
                <th className="pb-3 px-4 text-center">សកម្មភាព</th> {/* បន្ថែមជួរនេះ */}
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{order.customerName}</td>
                    <td className="py-3 px-4">{order.phone}</td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate">
                        {order.items?.map(i => `${i.name} (x${i.quantity || 1})`).join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-600">${order.totalAmount?.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1 text-xs rounded-full border-0 font-bold cursor-pointer outline-none shadow-sm ${
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'Shipping' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}
                      >
                        <option value="Pending">Pending (រង់ចាំ)</option>
                        <option value="Shipping">Shipping (កំពុងដឹកជញ្ជូន)</option>
                        <option value="Delivered">Delivered (បានប្រគល់)</option>
                      </select>
                    </td>
                    
                    {/* បន្ថែមកូដប៊ូតុងលុបនៅត្រង់នេះ */}
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleDeleteOrder(order._id)} 
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition"
                        title="លុបការបញ្ជាទិញនេះ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                    {/* បញ្ចប់ការបន្ថែម */}
                  </tr>  
                  
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;