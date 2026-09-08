import { useState, useEffect } from 'react';
import { Package, Trash2, Plus, Image as ImageIcon, Save } from 'lucide-react';

function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // បន្ថែម State ថ្មីសម្រាប់ផ្ទុកទិន្នន័យ (images, colors, sizes, storage)
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'general', image: '', description: '',
    images: '', colors: '', sizes: '', storage: ''
  });

  const categories = [
    { id: 'clothing', name: 'សម្លៀកបំពាក់ (Clothing)' },
    { id: 'shoes', name: 'ស្បែកជើង (Shoes)' },
    { id: 'electronics', name: 'អេឡិចត្រូនិច (Electronics)' },
    { id: 'accessories', name: 'គ្រឿងតុបតែង (Accessories)' },
    { id: 'general', name: 'ទូទៅ (General)' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://v-cart-backend.onrender.com/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    // បំប្លែងអត្ថបទដែលខណ្ឌដោយសញ្ញាក្បៀស (,) ទៅជា Array មុនពេលបញ្ជូនទៅ Backend
    const formattedData = {
      ...formData,
      price: Number(formData.price),
      images: formData.images ? formData.images.split(',').map(item => item.trim()) : [],
      colors: formData.colors ? formData.colors.split(',').map(item => item.trim()) : [],
      sizes: formData.sizes ? formData.sizes.split(',').map(item => item.trim()) : [],
      storage: formData.storage ? formData.storage.split(',').map(item => item.trim()) : [],
    };

    try {
      const res = await fetch('https://v-cart-backend.onrender.com/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      const data = await res.json();
      if (data.success) {
        alert('បានបន្ថែមទំនិញជោគជ័យ!');
        setFormData({ name: '', price: '', category: 'general', image: '', description: '', images: '', colors: '', sizes: '', storage: '' });
        fetchProducts();
      } else {
        alert(data.message || 'បរាជ័យក្នុងការបន្ថែមទំនិញ');
      }
    } catch (err) { console.error(err); alert('មានបញ្ហាភ្ជាប់ទៅកាន់ Server'); }
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
      } else {
        alert(data.message || 'បរាជ័យក្នុងការលុបទំនិញ');
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <h1 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
          <Package className="text-orange-500" /> ផ្ទាំងគ្រប់គ្រងទំនិញ (Admin Dashboard)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ================= ផ្នែកខាងឆ្វេង៖ ហ្វមបញ្ចូលទំនិញថ្មី ================= */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-blue-600" /> បន្ថែមទំនិញថ្មី
            </h2>
            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះទំនិញ</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃ ($)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ប្រភេទទំនិញ</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm bg-white">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">រូបភាពគោល (Image URL)</label>
                <input required type="text" name="image" value={formData.image} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">រូបភាពបន្ថែម (ក្បៀសពីគ្នា)</label>
                <input type="text" name="images" value={formData.images} onChange={handleInputChange} placeholder="URL1, URL2, URL3" className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ពណ៌ (Colors - ក្បៀសពីគ្នា)</label>
                <input type="text" name="colors" value={formData.colors} onChange={handleInputChange} placeholder="Red, Blue, Black" className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
              </div>

              {/* បង្ហាញជម្រើស "ទំហំ (Size)" តែពេលរើសប្រភេទ សម្លៀកបំពាក់ ឬ ស្បែកជើង */}
              {(formData.category === 'clothing' || formData.category === 'shoes') && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <label className="block text-sm font-bold text-blue-800 mb-1">ទំហំ (Sizes - ក្បៀសពីគ្នា)</label>
                  <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} placeholder="S, M, L, XL ឬ 41, 42" className="w-full border border-blue-200 px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
                </div>
              )}

              {/* បង្ហាញជម្រើស "ទំហំផ្ទុក (Storage)" តែពេលរើសប្រភេទ អេឡិចត្រូនិច */}
              {(formData.category === 'electronics') && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <label className="block text-sm font-bold text-orange-800 mb-1">ទំហំផ្ទុក (Storage - ក្បៀសពីគ្នា)</label>
                  <input type="text" name="storage" value={formData.storage} onChange={handleInputChange} placeholder="128GB, 256GB, 1TB" className="w-full border border-orange-200 px-3 py-2 rounded-lg outline-none focus:border-orange-500 text-sm" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ការពិពណ៌នា</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm"></textarea>
              </div>

              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2 mt-2">
                <Save size={18} /> រក្សាទុកទំនិញ
              </button>
            </form>
          </div>

          {/* ================= ផ្នែកខាងស្តាំ៖ តារាងទំនិញ ================= */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">ទំនិញក្នុងស្តុក ({products.length})</h2>
            </div>
            
            <div className="overflow-x-auto p-4 flex-grow">
              {loading ? (
                <div className="text-center py-10 text-gray-500">កំពុងទាញយក...</div>
              ) : (
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-100 text-gray-800 font-bold">
                    <tr>
                      <th className="p-3 rounded-l-lg">រូបភាព</th>
                      <th className="p-3">ឈ្មោះទំនិញ</th>
                      <th className="p-3">ប្រភេទ</th>
                      <th className="p-3">តម្លៃ</th>
                      <th className="p-3 rounded-r-lg text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="p-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md border" />
                        </td>
                        <td className="p-3 font-medium text-gray-800 max-w-[200px] truncate">{product.name}</td>
                        <td className="p-3 uppercase text-xs tracking-wider">{product.category}</td>
                        <td className="p-3 font-bold text-orange-500">${product.price.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => handleDeleteProduct(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Admin;