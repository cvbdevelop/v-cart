import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, LogOut, Lock } from 'lucide-react';

function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for adding product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [category, setCategory] = useState('general');
  const [description, setDescription] = useState('');
  // ផ្លាស់ប្តូរ State រូបភាព
  const [imageFile, setImageFile] = useState(null);
  const [sizes, setSizes] = useState('S, M, L, XL');
  const [colors, setColors] = useState('Red, Blue, Black');

  // Form states for changing password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('https://v-cart-backend.onrender.com/api/products'),
          fetch('https://v-cart-backend.onrender.com/api/orders')
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      alert('មានបញ្ហាក្នុងการភ្ជាប់ទៅកាន់ Server');
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      let imageUrl = 'https://placehold.co/400x400?text=Product';

      // ១. បើមានការជ្រើសរើសរូបភាព ត្រូវ Upload ទៅកាន់ Server សិន
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await fetch('https://v-cart-backend.onrender.com/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
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

      // ២. បញ្ជូនទិន្នន័យទំនិញរួមជាមួយ URL រូបភាពដែលបាន Upload រួច
      const res = await fetch('https://v-cart-backend.onrender.com/api/products', {
        method: 'POST',
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
          sizes: sizes.split(',').map(s => s.trim()), // បំបែកជា Array
          colors: colors.split(',').map(c => c.trim()) // បំបែកជា Array
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert('បន្ថែមទំនិញជោគជ័យ!');
        window.location.reload();
      } else {
        alert('បរាជ័យក្នុងការបន្ថែមទំនិញ');
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
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* បន្ថែមទំនិញថ្មី */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4 text-gray-800">បន្ថែមទំនិញថ្មីក្នុងស្តុក</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">រូបភាពទំនិញ (ជ្រើសរើសពីកុំព្យូទ័រ)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0])} 
                required
                className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ទំហំ (Sizes - 1,2,3 ឬ S,M,L)</label>
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
              បន្ថែមចូលស្តុក
            </button>
          </form>

          {/* ផ្នែកប្តូរលេខសម្ងាត់ */}
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
                រក្សាទុករលេខសម្ងាត់ថ្មី
              </button>
            </form>
          </div>
        </div>

        {/* គ្រប់គ្រងស្តុកទំនិញ */}
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
                      <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ប្រវត្តិការបញ្ជាទិញ */}
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