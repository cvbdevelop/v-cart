import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

// បង្កើតកូដ SVG សម្រាប់ Social Media ដោយផ្ទាល់ ដើម្បីកុំឱ្យ Error ជាមួយ lucide-react
const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const TwitterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);
const YoutubeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>);

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
              <a href="#" className="bg-gray-800 hover:bg-orange-500 p-2.5 rounded-full transition text-white"><FacebookIcon /></a>
              <a href="#" className="bg-gray-800 hover:bg-orange-500 p-2.5 rounded-full transition text-white"><TwitterIcon /></a>
              <a href="#" className="bg-gray-800 hover:bg-orange-500 p-2.5 rounded-full transition text-white"><InstagramIcon /></a>
              <a href="#" className="bg-gray-800 hover:bg-orange-500 p-2.5 rounded-full transition text-white"><YoutubeIcon /></a>
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