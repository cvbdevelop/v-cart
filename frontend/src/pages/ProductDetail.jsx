import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, Check } from 'lucide-react';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cartContext = useContext(CartContext) || {};
  const addToCart = cartContext.addToCart || (() => {});
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // States សម្រាប់ផ្ទុកជម្រើសដែលអតិថិជនបានចុចជ្រើសរើស
  const [mainImage, setMainImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://v-cart-backend.onrender.com/api/products/${id}`);
        const data = await res.json();
        
        // --- ទិន្នន័យសាកល្បងបណ្តោះអាសន្ន (Mock Data) ដើម្បីតេស្ត UI មុនពេលកែ Backend ---
        const productData = { ...data };
        if (!productData.images || productData.images.length === 0) {
          productData.images = [
            productData.image,
            'https://placehold.co/600x600/f8fafc/333?text=View+2',
            'https://placehold.co/600x600/f8fafc/333?text=View+3'
          ];
        }
        if (!productData.colors) productData.colors = ['Orange', 'Deep Blue', 'Silver', 'Black'];
        
        // បើជាគ្រឿងអេឡិចត្រូនិច ឱ្យលោតជម្រើស Storage
        if (['electronics', 'phones'].includes(productData.category) && !productData.storage) {
          productData.storage = ['128GB', '256GB', '512GB', '1TB'];
        }
        // បើជាសម្លៀកបំពាក់ ឬស្បែកជើង ឱ្យលោតជម្រើស Size
        if (['clothing', 'shoes'].includes(productData.category) && !productData.sizes) {
          productData.sizes = ['S', 'M', 'L', 'XL'];
        }
        // -----------------------------------------------------------------------

        setProduct(productData);
        setMainImage(productData.images[0]);
        
        // កំណត់ជម្រើសដើម (Default Selections)
        if (productData.colors?.length > 0) setSelectedColor(productData.colors[0]);
        if (productData.sizes?.length > 0) setSelectedSize(productData.sizes[0]);
        if (productData.storage?.length > 0) setSelectedStorage(productData.storage[0]);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    // ភ្ជាប់ជម្រើសដែលបានរើស ចូលទៅក្នុងកន្ត្រក
    const itemToAdd = {
      ...product,
      selectedColor,
      selectedSize,
      selectedStorage
    };
    addToCart(itemToAdd);
    navigate('/cart');
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium text-lg min-h-screen">កំពុងទាញយកទិន្នន័យ...</div>;
  if (!product) return <div className="text-center py-20 text-red-500 min-h-screen">រកមិនឃើញទំនិញនេះទេ!</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-6 max-w-[1200px]">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition mb-6 font-medium">
          <ChevronLeft size={20} /> ត្រឡប់ក្រោយ
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row p-6 md:p-10 gap-10">
          
          {/* ================= ផ្នែកខាងឆ្វេង៖ វិចិត្រសាលរូបភាព (Image Gallery) ================= */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* រូបភាពធំ */}
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
              <img src={mainImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-4" />
            </div>
            {/* រូបភាពតូចៗខាងក្រោម (Thumbnails) */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images?.map((img, index) => (
                <button 
                  key={index} 
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${mainImage === img ? 'border-orange-500' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ================= ផ្នែកខាងស្តាំ៖ ព័ត៌មាន និងជម្រើសទំនិញ (Product Info & Options) ================= */}
          <div className="w-full md:w-1/2 flex flex-col">
            <p className="text-sm text-orange-500 font-bold uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl font-black text-gray-800 mb-4">{product.name}</h1>
            
            <div className="text-3xl font-bold text-blue-900 mb-6 border-b pb-6">
              ${product.price.toFixed(2)}
            </div>

            <div className="text-gray-600 leading-relaxed mb-8 text-sm">
              {product.description || 'មិនមានការពិពណ៌នាសម្រាប់ទំនិញនេះទេ។'}
            </div>

            <div className="flex flex-col gap-6 mb-8">
              
              {/* ជម្រើសពណ៌ (Color) */}
              {product.colors?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-3">ពណ៌ (Colors): <span className="text-gray-500 font-normal">{selectedColor}</span></h4>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map(color => (
                      <button 
                        key={color} 
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition flex items-center gap-2 ${selectedColor === color ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {selectedColor === color && <Check size={16} />} {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ជម្រើសទំហំផ្ទុក (Storage) - បង្ហាញតែពេលទំនិញជាគ្រឿងអេឡិចត្រូនិច */}
              {product.storage?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-3">ទំហំផ្ទុក (Storage): <span className="text-gray-500 font-normal">{selectedStorage}</span></h4>
                  <div className="flex gap-3 flex-wrap">
                    {product.storage.map(storage => (
                      <button 
                        key={storage} 
                        onClick={() => setSelectedStorage(storage)}
                        className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition flex items-center gap-2 ${selectedStorage === storage ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                         {selectedStorage === storage && <Check size={16} />} {storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ជម្រើសទំហំ (Size) - បង្ហាញតែពេលទំនិញជាសម្លៀកបំពាក់/ស្បែកជើង */}
              {product.sizes?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-3">ទំហំ (Sizes): <span className="text-gray-500 font-normal">{selectedSize}</span></h4>
                  <div className="flex gap-3 flex-wrap">
                    {product.sizes.map(size => (
                      <button 
                        key={size} 
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-md text-sm font-bold border-2 transition flex items-center justify-center ${selectedSize === size ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-3 text-lg mt-auto"
            >
              <ShoppingCart size={24} /> បន្ថែមចូលកន្ត្រក
            </button>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheck className="text-orange-500" size={24} />
                <span>ធានាគុណភាព ១០០%</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="text-orange-500" size={24} />
                <span>ដឹកជញ្ជូនរហ័សទាន់ចិត្ត</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;