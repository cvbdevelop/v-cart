import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Send } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#0b1f38] text-gray-300 pt-16 pb-8 border-t-4 border-orange-500 mt-auto">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* ជួរឈរទី១៖ អំពីវេបសាយ (About Us) */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-orange-500 text-white font-black text-xl p-1.5 rounded-md leading-none">VC</div>
              <span className="text-2xl font-bold tracking-tight text-white">V-Cart</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              វេបសាយទិញទំនិញអនឡាញដែលផ្តល់ជូននូវផលិតផលគុណភាពខ្ពស់ តម្លៃសមរម្យ និងសេវាកម្មដឹកជញ្ជូនរហ័សទាន់ចិត្តដល់គេហដ្ឋានរបស់អ្នក។
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-gray-800 hover:bg-orange-500 p-2.5 rounded-full transition text-white"><Facebook size={18} /></a>
              <a href="#" className="bg-gray-800 hover:bg-orange-500 p-2.5 rounded-full transition text-white"><Twitter size={18} /></a>
              <a href="#" className="bg-gray-800 hover:bg-orange-500 p-2.5 rounded-full transition text-white"><Instagram size={18} /></a>
              <a href="#" className="bg-gray-800 hover:bg-orange-500 p-2.5 rounded-full transition text-white"><Youtube size={18} /></a>
            </div>
          </div>

          {/* ជួរឈរទី២៖ តំណភ្ជាប់ (Quick Links) */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
              តំណភ្ជាប់សំខាន់ៗ
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-orange-500"></span>
            </h3>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><Link to="/" className="hover:text-orange-500 transition flex items-center gap-2"><span className="text-orange-500">▸</span> ទំព័រដើម</Link></li>
              <li><Link to="/?category=clothing" className="hover:text-orange-500 transition flex items-center gap-2"><span className="text-orange-500">▸</span> សម្លៀកបំពាក់</Link></li>
              <li><Link to="/?category=electronics" className="hover:text-orange-500 transition flex items-center gap-2"><span className="text-orange-500">▸</span> គ្រឿងអេឡិចត្រូនិច</Link></li>
              <li><Link to="/tracking" className="hover:text-orange-500 transition flex items-center gap-2"><span className="text-orange-500">▸</span> តាមដានការបញ្ជាទិញ</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition flex items-center gap-2"><span className="text-orange-500">▸</span> ទំនាក់ទំនងយើង</Link></li>
            </ul>
          </div>

          {/* ជួរឈរទី៣៖ ទំនាក់ទំនង (Contact Info) */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
              ព័ត៌មានទំនាក់ទំនង
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-orange-500"></span>
            </h3>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <span>Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-orange-500 flex-shrink-0" />
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-orange-500 flex-shrink-0" />
                <span>support@vcart.com</span>
              </li>
            </ul>
          </div>

          {/* ជួរឈរទី៤៖ ព្រឹត្តិបត្រព័ត៌មាន (Newsletter) */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
              ចុះឈ្មោះទទួលព័ត៌មាន
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-orange-500"></span>
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              ទទួលបានប្រូម៉ូសិន ការបញ្ចុះតម្លៃ និងព័ត៌មានទំនិញថ្មីៗមុនគេរៀងរាល់សប្តាហ៍។
            </p>
            <form className="flex bg-gray-800 rounded-lg overflow-hidden border border-gray-700" onSubmit={(e) => { e.preventDefault(); alert('អរគុណសម្រាប់ការចុះឈ្មោះ!'); }}>
              <input 
                type="email" 
                required
                placeholder="អ៊ីមែលរបស់អ្នក..." 
                className="bg-transparent w-full px-4 py-3 text-sm outline-none text-white placeholder-gray-500" 
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-4 flex items-center justify-center transition">
                <Send size={18} className="text-white" />
              </button>
            </form>
          </div>

        </div>

        {/* របារផ្នែកខាងក្រោមបង្អស់ (Copyright & Payments) */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} V-Cart. រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
          <div className="flex gap-2">
            <img src="https://placehold.co/45x28/222/white?text=Visa" alt="Visa" className="rounded-md border border-gray-700 opacity-80 hover:opacity-100 transition" />
            <img src="https://placehold.co/45x28/222/white?text=Master" alt="Mastercard" className="rounded-md border border-gray-700 opacity-80 hover:opacity-100 transition" />
            <img src="https://placehold.co/45x28/222/white?text=ABA" alt="ABA Pay" className="rounded-md border border-gray-700 opacity-80 hover:opacity-100 transition" />
            <img src="https://placehold.co/45x28/222/white?text=Cash" alt="Cash on Delivery" className="rounded-md border border-gray-700 opacity-80 hover:opacity-100 transition" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;