import { useState, useEffect } from 'react';
import { PlusCircle, Package, Trash2, Edit, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ថែមថ្មី


function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // ១. បន្ថែម countInStock: 0 ទៅក្នុង State ដើម
const [productForm, setProductForm] = useState({ 
  name: '', price: '', image: '', category: 'general', countInStock: 0, description: '', sizes: '', colors: '' 
});
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate(); // ថែមថ្មី
  const [uploading, setUploading] = useState(false);

  // មុខងារទាញយកទិន្នន័យ
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken'); // ទាញយកសោ
      
      // បើអត់មានសោទេ បញ្ជូនទៅទំព័រ Login ភ្លាមៗ
      if (!token) {
        navigate('/login');
        return;
      }

      // ខ្ចប់សោផ្ញើទៅជាមួយ API
      const headers = { 'Authorization': `Bearer ${token}` };

      // ទាញយក Orders (ត្រូវមានសោ)
      const ordersRes = await fetch('https://v-cart-backend.onrender.com/api/orders', { headers });
      const ordersData = await ordersRes.json();
      
      if (ordersRes.ok) {
        setOrders(ordersData);
      } else {
        // បើសោខុស ឬផុតកំណត់ លុបសោចោល រួចទៅ Login វិញ
        localStorage.removeItem('adminToken');
        navigate('/login');
        return;
      }

      // ទាញយក Products ធម្មតា
      const productsRes = await fetch('https://v-cart-backend.onrender.com/api/products');
      const productsData = await productsRes.json();
      setProducts(Array.isArray(productsData) ? productsData : []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ទាញយកទិន្នន័យទំនិញ និង ប្រវត្តិបញ្ជាទិញ ព្រមគ្នា
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
        console.error("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ:", error);
      } finally {
        // បិទផ្ទាំង Loading ទោះបីជាទាញយកបានជោគជ័យ ឬបរាជ័យក៏ដោយ
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // មុខងារចាកចេញ (Logout)
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://v-cart-backend.onrender.com/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // មិនបាច់ដាក់ Content-Type ទេ ព្រោះជា FormData
        body: formData
      });
      
      const data = await response.json();
      if (response.ok) {
        // បញ្ចូល Link រូបភាពថ្មីទៅក្នុង Form
        setProductForm({ ...productForm, image: data.imageUrl });
      } else {
        alert('បរាជ័យក្នុងការ Upload រូបភាព');
      }
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('មានបញ្ហាភ្ជាប់ទៅកាន់ Server');
    }
  };

  // ... មុខងារ handleSubmitProduct និង handleDeleteProduct ចាស់ៗទុកដដែល
  // (ប៉ុន្តែពេល fetch ត្រូវចាំបន្ថែម headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' } ចូលក្នុង request ផងដែរ)

  // មុខងារបន្ថែម ឬកែប្រែទំនិញ
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `https://v-cart-backend.onrender.com/api/products/${editingId}` 
      : 'https://v-cart-backend.onrender.com/api/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('adminToken'); // ទាញយកសោ
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ភ្ជាប់សោដើម្បីទម្លុះសន្តិសុខ
        },
        body: JSON.stringify({
          name: productForm.name,
          price: parseFloat(productForm.price),
          image: productForm.image,
          category: productForm.category,
          countInStock: Number(productForm.countInStock),
          description: productForm.description,
          sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : [],
          colors: productForm.colors ? productForm.colors.split(',').map(c => c.trim()) : []
        })
      });

      if (response.ok) {
        alert(editingId ? 'កែប្រែទំនិញជោគជ័យ!' : 'បន្ថែមទំនិញជោគជ័យ!');
        setProductForm({ name: '', price: '', image: '', category: 'general', countInStock: 0 });
        setEditingId(null);
        fetchData(); 
      } else {
        alert('មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ។');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // មុខងារលុបទំនិញ
  const handleDeleteProduct = async (id) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបទំនិញនេះចេញពីស្តុកមែនទេ?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`https://v-cart-backend.onrender.com/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` } // ភ្ជាប់សោដើម្បីមានសិទ្ធិលុប
        });
        if (response.ok) {
          fetchData();
        } else {
          alert('មិនអាចលុបទំនិញបានទេ');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // ២. អាប់ដេតមុខងារពេលចុចប៊ូតុងកែប្រែ (Edit) ឱ្យទាញយកចំនួនស្តុកមកបង្ហាញ
const handleEditClick = (product) => {
  setEditingId(product._id);
  setProductForm({ 
    name: product.name, 
    price: product.price, 
    image: product.image, 
    category: product.category || 'general',
    countInStock: product.countInStock || 0,
    description: product.description || '',
    sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
    colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || '')
  });
};

  if (loading) {
    return <div className="text-center py-20 text-xl font-bold text-gray-500">កំពុងទាញយកទិន្នន័យ...</div>;
  }

  const handleStatusChange = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`https://v-cart-backend.onrender.com/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (response.ok) {
      fetchData(); // ទាញយកទិន្នន័យថ្មីមកបង្ហាញ
    } else {
      alert('បរាជ័យក្នុងការប្តូរស្ថានភាព');
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 border-l-4 border-blue-500 pl-3">
        ផ្ទាំងគ្រប់គ្រងស្តុក និងការបញ្ជាទិញ (Admin Dashboard)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* ផ្នែកឆ្វេង៖ Form បន្ថែម/កែប្រែទំនិញ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 pb-3 border-b">
            <PlusCircle size={22} className="text-blue-600" /> 
            {editingId ? 'កែប្រែព័ត៌មានទំនិញ' : 'បន្ថែមទំនិញថ្មីក្នុងស្តុក'}
          </h3>
          <form onSubmit={handleSubmitProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះទំនិញ</label>
              <input required type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="w-full border border-gray-300 px-4 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃ ($)</label>
              <input required type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="w-full border border-gray-300 px-4 py-2 rounded-lg" />
            </div>
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">ចំនួនស្តុក (Stock)</label>
  <input 
    type="number" 
    min="0"
    required
    value={productForm.countInStock} 
    onChange={(e) => setProductForm({...productForm, countInStock: e.target.value})} 
    className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white"
  />
</div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ប្រភេទផលិតផល (Category)</label>
                <select 
                    value={productForm.category} 
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})} 
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white"
                >
                    <option value="general">ទូទៅ (General)</option>
                    <option value="electronics">គ្រឿងអេឡិចត្រូនិក (Electronics)</option>
                    <option value="clothing">សម្លៀកបំពាក់ (Clothing)</option>
                    <option value="bags">កាបូប និងស្បែកជើង (Bags & Shoes)</option>
                </select>
            </div>
            <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ការពិពណ៌នាលម្អិត (Description)</label>
              <textarea 
                value={productForm.description} 
                onChange={(e) => setProductForm({...productForm, description: e.target.value})} 
                className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="សរសេរការពិពណ៌នាអំពីទំនិញនៅទីនេះ..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ទំហំ (Sizes)</label>
                <input 
                  type="text" 
                  value={productForm.sizes} 
                  onChange={(e) => setProductForm({...productForm, sizes: e.target.value})} 
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ឧ. S, M, L, XL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ពណ៌ (Colors)</label>
                <input 
                  type="text" 
                  value={productForm.colors} 
                  onChange={(e) => setProductForm({...productForm, colors: e.target.value})} 
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ឧ. Red, Blue, Black"
                />
            </div>
          </div>
  <label className="block text-sm font-medium text-gray-700 mb-1">រូបភាពទំនិញ</label>
  <input 
    type="file" 
    accept="image/*"
    onChange={uploadFileHandler} 
    className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
  />
  {uploading && <p className="text-sm text-blue-500 mt-2 font-medium">កំពុង Upload រូបភាព...</p>}
  
  {/* បង្ហាញរូបភាពគំរូ ពេល Upload រួចរាល់ */}
  {productForm.image && (
    <div className="mt-4 flex justify-center p-2 bg-gray-50 border rounded-lg relative group">
      <img src={productForm.image} alt="Preview" className="h-32 object-contain rounded" />
    </div>
  )}
</div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition">
                {editingId ? 'រក្សាទុកការកែប្រែ' : 'បន្ថែមចូលស្តុក'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setProductForm({ name: '', price: '', image: '' }); }} className="bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-400 transition">
                  បោះបង់
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ផ្នែកស្តាំ៖ បញ្ជីទំនិញទាំងអស់ក្នុងស្តុក (Inventory List) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Package size={22} className="text-blue-600" /> គ្រប់គ្រងស្តុកទំនិញ ({products.length})
            </h3>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 border-b">
                <tr className="text-gray-500 text-sm">
                  <th className="p-4">រូបភាព</th>
                  <th className="p-4">ឈ្មោះទំនិញ</th>
                  <th className="p-4">តម្លៃ</th>
                  <th className="p-4 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                      <div className="text-xs text-blue-600 mt-1 font-medium">
                      ស្តុកសល់: {item.countInStock || 0}
                      </div>
                    </td>
                    <td className="p-4 text-blue-600 font-bold text-sm">${item.price.toFixed(2)}</td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => handleEditClick(item)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteProduct(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
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

      {/* ផ្នែកខាងក្រោម៖ ប្រវត្តិការបញ្ជាទិញ (Orders Table ដូចមុន) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package size={22} className="text-green-600" /> ប្រវត្តិការបញ្ជាទិញរបស់អតិថិជន
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-500 text-sm">
                <th className="p-4">កាលបរិច្ឆេទ</th>
                <th className="p-4">អតិថិជន</th>
                <th className="p-4">ទំនិញបានបញ្ជាទិញ</th>
                <th className="p-4 text-right">សរុប</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody className="text-sm">
  {orders.length === 0 ? (
    <tr>
      <td colSpan="5" className="text-center py-4 text-gray-500">មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</td>
    </tr>
  ) : (
    orders.map((order, index) => (
      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
        <td className="py-3 px-4">
          <div className="font-medium text-gray-800">{order.customerName}</div>
          <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
        </td>
        <td className="py-3 px-4">{order.phone}</td>
        <td className="py-3 px-4">
          <div className="line-clamp-2 max-w-xs">{order.items.map(i => i.name).join(', ')}</div>
        </td>
        <td className="py-3 px-4 font-bold text-blue-600">${order.totalAmount.toFixed(2)}</td>
        <td className="py-3 px-4">
          <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'កំពុងរង់ចាំ' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            {order.status}
          </span>
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