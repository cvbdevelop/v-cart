import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // បន្ថែម useNavigate សម្រាប់បញ្ជូនទៅទំព័រផ្សេង
import { Package, Trash2, Plus, Save, Edit, X, UploadCloud, Loader2, LogOut } from 'lucide-react'; // បន្ថែម Icon LogOut

function Admin() {
  const navigate = useNavigate(); // ប្រកាសប្រើប្រាស់ navigate
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', price: '', stock: '', category: 'general', image: '', description: '',
    images: [], colors: '', sizes: '', storage: '' 
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

  const uploadImageToServer = async (file) => {
    const uploadData = new FormData();
    uploadData.append('image', file);
    const token = localStorage.getItem('adminToken');
    
    try {
      const res = await fetch('https://v-cart-backend.onrender.com/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });
      const data = await res.json();
      if (data.imageUrl) return data.imageUrl;
      else { alert(data.message || 'Error Uploading'); return null; }
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាក្នុងការ Upload រូបភាព');
      return null;
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const url = await uploadImageToServer(file);
      if (url) setFormData({ ...formData, image: url });
      setUploading(false);
    }
  };

  const handleExtraImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploading(true);
      const uploadedUrls = [];
      for (let file of files) {
        const url = await uploadImageToServer(file);
        if (url) uploadedUrls.push(url);
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      setUploading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || 'general',
      image: product.image || '',
      description: product.description || '',
      images: product.images || [],
      colors: product.colors ? product.colors.join(', ') : '',
      sizes: product.sizes ? product.sizes.join(', ') : '',
      storage: product.storage ? product.storage.join(', ') : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', stock: '', category: 'general', image: '', description: '', images: [], colors: '', sizes: '', storage: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert('សូម Upload រូបភាពគោលសិន!');
    
    const token = localStorage.getItem('adminToken');
    const formattedData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      colors: formData.colors ? formData.colors.split(',').map(item => item.trim()).filter(Boolean) : [],
      sizes: formData.sizes ? formData.sizes.split(',').map(item => item.trim()).filter(Boolean) : [],
      storage: formData.storage ? formData.storage.split(',').map(item => item.trim()).filter(Boolean) : [],
    };

    const url = editingId 
      ? `https://v-cart-backend.onrender.com/api/products/${editingId}` 
      : 'https://v-cart-backend.onrender.com/api/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      const data = await res.json();
      
      if (data.success || res.ok) {
        alert(editingId ? 'បានកែប្រែទំនិញជោគជ័យ!' : 'បានបន្ថែមទំនិញជោគជ័យ!');
        handleCancelEdit();
        fetchProducts();
      } else {
        alert(data.message || 'ប្រតិបត្តិការបរាជ័យ');
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
      }
    } catch (err) { console.error(err); }
  };

  const removeExtraImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove)
    });
  };

  // មុខងារសម្រាប់ ចាកចេញ (Logout)
  const handleLogout = () => {
    if (window.confirm('តើអ្នកពិតជាចង់ចាកចេញពីគណនី Admin មែនទេ?')) {
      localStorage.removeItem('adminToken'); // លុបសោសម្ងាត់ចេញ
      navigate('/'); // បញ្ជូនត្រឡប់ទៅទំព័រដើមវិញ
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-[1200px]">
        
        {/* បន្ថែម Flexbox ដើម្បីដាក់ប៊ូតុង Logout នៅខាងស្តាំ */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <Package className="text-orange-500" /> ផ្ទាំងគ្រប់គ្រងទំនិញ
          </h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-lg font-bold transition shadow-sm"
          >
            <LogOut size={18} /> ចាកចេញ (Log Out)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-blue-600" />}
                {editingId ? 'កែប្រែទំនិញ' : 'បន្ថែមទំនិញថ្មី'}
              </h2>
              {editingId && (
                <button onClick={handleCancelEdit} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះទំនិញ</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃ ($)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ស្តុក</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ប្រភេទ</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border px-2 py-2 rounded-lg outline-none focus:border-blue-500 text-sm bg-white">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2"><UploadCloud size={16} className="text-blue-500" /> រូបភាពគោល</span>
                  {uploading && <Loader2 size={14} className="animate-spin text-orange-500" />}
                </label>
                <input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploading} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" />
                {formData.image && <img src={formData.image} alt="Main Preview" className="h-20 mt-3 rounded border shadow-sm object-cover" />}
              </div>

              <div className="p-3 bg-gray-50 border rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2"><UploadCloud size={16} className="text-orange-500" /> រូបភាពបន្ថែម</span>
                </label>
                <input type="file" accept="image/*" multiple onChange={handleExtraImagesUpload} disabled={uploading} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50" />
                {formData.images.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group flex-shrink-0">
                        <img src={img} alt="Extra Preview" className="h-14 w-14 rounded border shadow-sm object-cover" />
                        <button type="button" onClick={() => removeExtraImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow"><X size={12}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ពណ៌ (Colors - ក្បៀសពីគ្នា)</label>
                <input type="text" name="colors" value={formData.colors} onChange={handleInputChange} placeholder="Red, Blue, Black" className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
              </div>

              {(formData.category === 'clothing' || formData.category === 'shoes') && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <label className="block text-sm font-bold text-blue-800 mb-1">ទំហំ (Sizes - ក្បៀសពីគ្នា)</label>
                  <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} placeholder="S, M, L, XL" className="w-full border border-blue-200 px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm" />
                </div>
              )}

              {(formData.category === 'electronics') && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <label className="block text-sm font-bold text-orange-800 mb-1">ទំហំផ្ទុក (Storage - ក្បៀសពីគ្នា)</label>
                  <input type="text" name="storage" value={formData.storage} onChange={handleInputChange} placeholder="128GB, 256GB" className="w-full border border-orange-200 px-3 py-2 rounded-lg outline-none focus:border-orange-500 text-sm" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ការពិពណ៌នា</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full border px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm"></textarea>
              </div>

              <button type="submit" disabled={uploading} className={`w-full text-white font-bold py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2 mt-2 ${uploading ? 'bg-gray-400' : (editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700')}`}>
                <Save size={18} /> {editingId ? 'រក្សាទុកការកែប្រែ' : 'បន្ថែមទំនិញថ្មី'}
              </button>
            </form>
          </div>

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
                      <th className="p-3 text-center">ស្តុក</th>
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
                        <td className="p-3 text-center">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {product.stock || 0}
                           </span>
                        </td>
                        <td className="p-3 font-bold text-orange-500">${product.price.toFixed(2)}</td>
                        <td className="p-3 flex justify-center gap-2">
                          <button onClick={() => handleEditClick(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition"><Trash2 size={18} /></button>
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