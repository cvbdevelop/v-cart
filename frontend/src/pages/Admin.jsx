import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Trash2, Plus, Save, Edit, X, UploadCloud, Loader2, LogOut, ClipboardList, Image as ImageIcon } from 'lucide-react';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  // Products State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: 'general', image: '', description: '', images: [], colors: '', sizes: '', storage: '' });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Banners State
  const [bannerData, setBannerData] = useState({ mainImage: '', sideImage: '' });
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const categories = [
    { id: 'clothing', name: 'សម្លៀកបំពាក់ (Clothing)' },
    { id: 'shoes', name: 'ស្បែកជើង (Shoes)' },
    { id: 'electronics', name: 'អេឡិចត្រូនិច (Electronics)' },
    { id: 'accessories', name: 'គ្រឿងតុបតែង (Accessories)' },
    { id: 'general', name: 'ទូទៅ (General)' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/login'); return; }
    fetchProducts();
    fetchOrders();
    fetchBanners();
  }, [navigate]);

  // Data Fetching
  const fetchProducts = async () => {
    try { const res = await fetch('https://v-cart-backend.onrender.com/api/products'); setProducts(await res.json()); } 
    catch (err) { console.error(err); } finally { setLoading(false); }
  };
  const fetchOrders = async () => {
    try { const res = await fetch('https://v-cart-backend.onrender.com/api/orders'); setOrders(await res.json()); } 
    catch (err) { console.error(err); } finally { setLoadingOrders(false); }
  };
  const fetchBanners = async () => {
    try { const res = await fetch('https://v-cart-backend.onrender.com/api/banners'); setBannerData(await res.json()); } 
    catch (err) { console.error(err); }
  };

  // Upload Logic (ប្រើរួមគ្នា)
  const uploadImageToServer = async (file) => {
    const uploadData = new FormData(); uploadData.append('image', file);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('https://v-cart-backend.onrender.com/api/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: uploadData });
      const data = await res.json();
      if (data.imageUrl) return data.imageUrl; else { alert('Error Uploading'); return null; }
    } catch (err) { alert('Upload Failed'); return null; }
  };

  // មុខងារសម្រាប់ Tab ទំនិញ
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) { setUploading(true); const url = await uploadImageToServer(file); if (url) setFormData({ ...formData, image: url }); setUploading(false); }
  };
  const handleExtraImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploading(true); const uploadedUrls = [];
      for (let file of files) { const url = await uploadImageToServer(file); if (url) uploadedUrls.push(url); }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] })); setUploading(false);
    }
  };
  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({ name: product.name || '', price: product.price || '', stock: product.stock || '', category: product.category || 'general', image: product.image || '', description: product.description || '', images: product.images || [], colors: product.colors ? product.colors.join(', ') : '', sizes: product.sizes ? product.sizes.join(', ') : '', storage: product.storage ? product.storage.join(', ') : '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCancelEdit = () => { setEditingId(null); setFormData({ name: '', price: '', stock: '', category: 'general', image: '', description: '', images: [], colors: '', sizes: '', storage: '' }); };
  const handleSubmit = async (e) => {
    e.preventDefault(); if (!formData.image) return alert('សូម Upload រូបភាពគោលសិន!');
    const token = localStorage.getItem('adminToken');
    const formattedData = { ...formData, price: Number(formData.price), stock: Number(formData.stock), colors: formData.colors ? formData.colors.split(',').map(i => i.trim()).filter(Boolean) : [], sizes: formData.sizes ? formData.sizes.split(',').map(i => i.trim()).filter(Boolean) : [], storage: formData.storage ? formData.storage.split(',').map(i => i.trim()).filter(Boolean) : [] };
    const url = editingId ? `https://v-cart-backend.onrender.com/api/products/${editingId}` : 'https://v-cart-backend.onrender.com/api/products';
    try {
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formattedData) });
      const data = await res.json();
      if (data.success || res.ok) { alert(editingId ? 'កែប្រែជោគជ័យ!' : 'បន្ថែមជោគជ័យ!'); handleCancelEdit(); fetchProducts(); }
    } catch (err) { alert('Error Server'); }
  };
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('លុបទំនិញនេះ?')) return;
    try { const res = await fetch(`https://v-cart-backend.onrender.com/api/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } });
      if ((await res.json()).success) setProducts(products.filter(p => p._id !== id));
    } catch (err) { console.log(err); }
  };
  const removeExtraImage = (index) => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });

  // មុខងារសម្រាប់ Tab បញ្ជាទិញ
  const handleUpdateOrderStatus = async (orderId, status) => {
    try { const res = await fetch(`https://v-cart-backend.onrender.com/api/orders/${orderId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      if ((await res.json()).success) fetchOrders();
    } catch (err) { alert('Error Status'); }
  };
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('លុបការបញ្ជាទិញនេះ?')) return;
    try { const res = await fetch(`https://v-cart-backend.onrender.com/api/orders/${orderId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } });
      if ((await res.json()).success) setOrders(orders.filter(o => o._id !== orderId));
    } catch (err) { console.log(err); }
  };

  // មុខងារសម្រាប់ Tab Banners
  const handleBannerUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingBanner(true); const url = await uploadImageToServer(file);
      if (url) {
        const newData = { ...bannerData, [type]: url };
        setBannerData(newData);
        await fetch('https://v-cart-backend.onrender.com/api/banners', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newData) });
        alert('បានកែប្រែរូបភាព Banner ជោគជ័យ!');
      }
      setUploadingBanner(false);
    }
  };

  const handleLogout = () => { if (window.confirm('ចាកចេញពី Admin?')) { localStorage.removeItem('adminToken'); navigate('/login'); } };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-black text-gray-800">គ្រប់គ្រងប្រព័ន្ធ (Admin Panel)</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-lg font-bold"><LogOut size={18} /> ចាកចេញ</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4 overflow-x-auto">
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold whitespace-nowrap ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}><Package size={20} /> គ្រប់គ្រងទំនិញ</button>
          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold whitespace-nowrap ${activeTab === 'orders' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}><ClipboardList size={20} /> ការបញ្ជាទិញ {orders.filter(o => o.status === 'Pending').length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{orders.filter(o => o.status === 'Pending').length}</span>}</button>
          <button onClick={() => setActiveTab('banners')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold whitespace-nowrap ${activeTab === 'banners' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}><ImageIcon size={20} /> ផ្ទាំងផ្សព្វផ្សាយ (Banners)</button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
              {/* Form Add Product ដូចចាស់... (ខ្ញុំបង្រួមនៅទីនេះដើម្បីសន្សំទំហំ តែមុខងារនៅដដែល) */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">{editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-blue-600" />} {editingId ? 'កែប្រែទំនិញ' : 'បន្ថែមទំនិញថ្មី'}</h2>
                {editingId && <button onClick={handleCancelEdit} className="text-gray-400 hover:text-red-500"><X size={20} /></button>}
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះទំនិញ</label><input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="block text-sm font-medium mb-1">តម្លៃ ($)</label><input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">ស្តុក</label><input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">ប្រភេទ</label><select name="category" value={formData.category} onChange={handleInputChange} className="w-full border px-2 py-2 rounded-lg bg-white">{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                </div>
                <div className="p-3 bg-gray-50 border rounded-lg">
                  <label className="block text-sm font-medium mb-2">រូបភាពគោល {uploading && <Loader2 size={14} className="inline animate-spin" />}</label>
                  <input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploading} className="w-full text-sm" />
                  {formData.image && <img src={formData.image} alt="Preview" className="h-20 mt-3 rounded border object-cover" />}
                </div>
                <div className="p-3 bg-gray-50 border rounded-lg">
                  <label className="block text-sm font-medium mb-2">រូបភាពបន្ថែម</label>
                  <input type="file" accept="image/*" multiple onChange={handleExtraImagesUpload} disabled={uploading} className="w-full text-sm" />
                  {formData.images.length > 0 && <div className="flex gap-2 mt-3 overflow-x-auto pb-1">{formData.images.map((img, idx) => <div key={idx} className="relative"><img src={img} className="h-14 w-14 rounded border object-cover" /><button type="button" onClick={() => removeExtraImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12}/></button></div>)}</div>}
                </div>
                <div><label className="block text-sm font-medium mb-1">ពណ៌ (ក្បៀសពីគ្នា)</label><input type="text" name="colors" value={formData.colors} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-lg" /></div>
                {(formData.category === 'clothing' || formData.category === 'shoes') && <div className="p-3 bg-blue-50 rounded-lg"><label className="block text-sm font-bold text-blue-800 mb-1">ទំហំ (ក្បៀសពីគ្នា)</label><input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} className="w-full border border-blue-200 px-3 py-2 rounded-lg" /></div>}
                {(formData.category === 'electronics') && <div className="p-3 bg-orange-50 rounded-lg"><label className="block text-sm font-bold text-orange-800 mb-1">ទំហំផ្ទុក (ក្បៀសពីគ្នា)</label><input type="text" name="storage" value={formData.storage} onChange={handleInputChange} className="w-full border border-orange-200 px-3 py-2 rounded-lg" /></div>}
                <div><label className="block text-sm font-medium mb-1">ការពិពណ៌នា</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full border px-3 py-2 rounded-lg"></textarea></div>
                <button type="submit" disabled={uploading} className={`w-full text-white font-bold py-3 rounded-lg ${uploading ? 'bg-gray-400' : (editingId ? 'bg-orange-500' : 'bg-blue-600')}`}><Save size={18} className="inline" /> {editingId ? 'រក្សាទុក' : 'បន្ថែមថ្មី'}</button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b bg-gray-50 font-bold">ទំនិញក្នុងស្តុក ({products.length})</div>
              <div className="overflow-x-auto p-4">
                {loading ? <div className="text-center py-10">កំពុងទាញយក...</div> : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 font-bold"><tr><th className="p-3">រូបភាព</th><th className="p-3">ឈ្មោះ</th><th className="p-3">ស្តុក</th><th className="p-3">តម្លៃ</th><th className="p-3 text-center">សកម្មភាព</th></tr></thead>
                    <tbody>
                      {products.map(p => <tr key={p._id} className="border-b"><td className="p-3"><img src={p.image} className="w-12 h-12 rounded-md object-cover" /></td><td className="p-3 font-medium">{p.name}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.stock || 0}</span></td><td className="p-3 text-orange-500 font-bold">${p.price.toFixed(2)}</td><td className="p-3 flex justify-center gap-2"><button onClick={() => handleEditClick(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"><Edit size={18}/></button><button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={18}/></button></td></tr>)}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
             {/* ... (កូដ Orders Tab រក្សាទុកដូចដើមទាំងអស់) ... */}
             <div className="p-6 border-b bg-gray-50 font-bold">បញ្ជីការបញ្ជាទិញសរុប ({orders.length})</div>
             <div className="overflow-x-auto p-4">
               <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-100 text-gray-800 font-bold">
                    <tr><th className="p-3">ថ្ងៃខែឆ្នាំ</th><th className="p-3">អតិថិជន</th><th className="p-3">អាសយដ្ឋាន</th><th className="p-3">ការកុម្ម៉ង់</th><th className="p-3">សរុប</th><th className="p-3">ស្ថានភាព</th><th className="p-3">សកម្មភាព</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} className="border-b align-top">
                        <td className="p-3">{new Date(order.createdAt).toLocaleDateString('en-GB')} <br/><span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</span></td>
                        <td className="p-3 font-bold text-gray-800">{order.customerName}<div className="text-blue-600">{order.phone}</div></td>
                        <td className="p-3 max-w-[200px] text-xs">{order.address}</td>
                        <td className="p-3 max-w-[250px]"><ul className="list-disc pl-4 text-xs">{order.items.map((item, idx) => <li key={idx}>{item.name} <span className="text-orange-500 font-bold">x{item.quantity || 1}</span></li>)}</ul></td>
                        <td className="p-3 font-bold text-orange-500">${order.totalAmount.toFixed(2)}</td>
                        <td className="p-3"><select value={order.status} onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)} className="px-2 py-1.5 rounded border"><option value="Pending">Pending</option><option value="Processing">Processing</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></td>
                        <td className="p-3"><button onClick={() => handleDeleteOrder(order._id)} className="p-2 text-red-500"><Trash2 size={18}/></button></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}

        {/* Banners Tab ថ្មី */}
        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Banner */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><ImageIcon className="text-purple-600"/> ផ្ទាំងកណ្តាល (Main Promo)</h2>
              <div className="p-4 bg-gray-50 border rounded-lg text-center">
                {bannerData.mainImage ? (
                  <img src={bannerData.mainImage} alt="Main Banner" className="h-48 mx-auto object-contain mb-4 rounded shadow-sm bg-white p-2" />
                ) : <div className="h-48 flex items-center justify-center text-gray-400 mb-4 bg-gray-100 rounded">គ្មានរូបភាព</div>}
                
                <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white transition ${uploadingBanner ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}>
                  {uploadingBanner ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />} ប្តូររូបភាពថ្មី
                  <input type="file" className="hidden" accept="image/*" disabled={uploadingBanner} onChange={(e) => handleBannerUpload(e, 'mainImage')} />
                </label>
              </div>
            </div>

            {/* Side Banner (Shop Image) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><ImageIcon className="text-orange-500"/> ផ្ទាំងខាងស្តាំ (Shop Image)</h2>
              <div className="p-4 bg-gray-50 border rounded-lg text-center">
                {bannerData.sideImage ? (
                  <img src={bannerData.sideImage} alt="Side Banner" className="h-48 mx-auto object-cover mb-4 rounded shadow-sm w-full" />
                ) : <div className="h-48 flex items-center justify-center text-gray-400 mb-4 bg-gray-100 rounded">គ្មានរូបភាព</div>}
                
                <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white transition ${uploadingBanner ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}>
                  {uploadingBanner ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />} ប្តូររូបភាពថ្មី
                  <input type="file" className="hidden" accept="image/*" disabled={uploadingBanner} onChange={(e) => handleBannerUpload(e, 'sideImage')} />
                </label>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;