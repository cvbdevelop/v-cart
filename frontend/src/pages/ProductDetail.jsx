import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { ShoppingCart, Check, ShieldCheck, Truck, ChevronLeft } from 'lucide-react';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cartContext = useContext(CartContext) || {};
  const addToCart = cartContext.addToCart || (() => {});

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedStorageObj, setSelectedStorageObj] = useState({ label: '', priceBump: 0, raw: '' });

  const parseStorageItem = (stString) => {
    if (!stString) return { label: '', priceBump: 0, raw: '' };
    const parts = stString.split(':');
    const label = parts[0].trim();
    const priceBump = parts.length > 1 ? Number(parts[1].trim()) : 0;
    return { label, priceBump, raw: stString };
  };

  useEffect(() => {
    fetch(`https://v-cart-backend.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setSelectedImage(data.image);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.storage?.length > 0) {
          setSelectedStorageObj(parseStorageItem(data.storage[0]));
        }
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  if (loading) return <div className="text-center py-20">កំពុងទាញយកទិន្នន័យ...</div>;
  if (!product) return <div className="text-center py-20">រកមិនឃើញទំនិញនេះទេ</div>;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  // +++ មុខងារផ្លាស់ប្តូររូបភាពទៅតាមពណ៌ដែលបានរើស +++
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (product.colors && product.colors.length > 0) {
      const colorIndex = product.colors.indexOf(color); // រកមើលថាពណ៌នេះនៅលេខរៀងទីប៉ុន្មាន
      // បើរូបភាពនៅលេខរៀងនោះមានពិតប្រាកដ ឱ្យវាបង្ហាញរូបនោះ
      if (colorIndex !== -1 && allImages[colorIndex]) {
        setSelectedImage(allImages[colorIndex]);
      }
    }
  };

  const currentPrice = product.price + (selectedStorageObj ? selectedStorageObj.priceBump : 0);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      price: currentPrice,
      selectedColor,
      selectedStorage: selectedStorageObj.label,
      selectedSize,
      image: selectedImage // យកលោករូបភាពពណ៌ដែលកំពុងរើសចូលទៅក្នុងកន្ត្រក
    });
    alert('បានបន្ថែមចូលកន្ត្រកជោគជ័យ!');
  };

  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="container mx-auto px-4 py-6 max-w-[1000px]">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 transition font-medium">
          <ChevronLeft size={20} /> ត្រឡប់ក្រោយ
        </button>

        <div className="flex flex-col md:flex-row gap-12">
          
          {/* ផ្នែករូបភាព */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex items-center justify-center aspect-square shadow-inner">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-opacity duration-300" />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(img)} className={`w-20 h-20 rounded-xl border-2 p-2 bg-gray-50 flex-shrink-0 transition ${selectedImage === img ? 'border-orange-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                    <img src={img} className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ផ្នែកព័ត៌មាន និងការជ្រើសរើស */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{product.category}</div>
            <h1 className="text-2xl font-black text-gray-800 mb-3 leading-tight">{product.name}</h1>
            
            <div className="text-3xl font-black text-[#0b1f38] mb-6">${currentPrice.toFixed(2)}</div>

            <p className="text-sm text-gray-500 mb-8 leading-relaxed whitespace-pre-line">
              {product.description || "ទំនិញធានាសុទ្ធ 100% គុណភាពល្អឥតខ្ចោះ។"}
            </p>

            {/* ជម្រើសពណ៌ */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-800 mb-3">ពណ៌ (Color): <span className="text-gray-500 font-normal ml-1">{selectedColor}</span></div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button 
                      key={color} 
                      onClick={() => handleColorSelect(color)} 
                      className={`px-5 py-2.5 rounded-lg text-sm font-bold border-2 flex items-center gap-2 transition ${selectedColor === color ? 'border-orange-500 text-orange-600 bg-orange-50 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      {selectedColor === color && <Check size={16} />} {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ជម្រើសទំហំផ្ទុក */}
            {product.storage && product.storage.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-800 mb-3">ទំហំផ្ទុក (Storage): <span className="text-gray-500 font-normal ml-1">{selectedStorageObj.label}</span></div>
                <div className="flex flex-wrap gap-3">
                  {product.storage.map((st) => {
                    const parsed = parseStorageItem(st);
                    const isSelected = selectedStorageObj.raw === st;
                    return (
                      <button 
                        key={st} 
                        onClick={() => setSelectedStorageObj(parsed)} 
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold border-2 flex items-center gap-2 transition ${isSelected ? 'border-orange-500 text-orange-600 bg-orange-50 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                      >
                        {isSelected && <Check size={16} />} {parsed.label}
                        {parsed.priceBump > 0 && <span className={`text-[11px] ml-1 ${isSelected ? 'text-orange-500' : 'text-gray-400'}`}>(+${parsed.priceBump})</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ជម្រើសទំហំទូទៅ */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-800 mb-3">ទំហំ (Size): <span className="text-gray-500 font-normal ml-1">{selectedSize}</span></div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`px-5 py-2.5 rounded-lg text-sm font-bold border-2 flex items-center gap-2 transition ${selectedSize === size ? 'border-orange-500 text-orange-600 bg-orange-50 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                      {selectedSize === size && <Check size={16} />} {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleAddToCart} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-200 flex items-center justify-center gap-3 mb-8 mt-2">
              <ShoppingCart size={22} /> បន្ថែមចូលកន្ត្រក
            </button>

            <div className="flex items-center justify-around md:justify-start md:gap-12 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-bold"><ShieldCheck className="text-orange-500" size={24} /> ធានាគុណភាព 100%</div>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-bold"><Truck className="text-orange-500" size={24} /> ដឹកជញ្ជូនឥតគិតថ្លៃ</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;