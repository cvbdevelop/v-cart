import { Facebook, Send, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 pt-10 pb-6">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg">V</span>-Cart
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            ហាងទំនិញអនឡាញដែលផ្តល់ជូននូវផលិតផលមានគុណភាពខ្ពស់ តម្លៃសមរម្យ និងសេវាកម្មដឹកជញ្ជូនរហ័សទាន់ចិត្តទូទាំងប្រទេស។
          </p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-4">ទំនាក់ទំនង</h4>
          <ul className="text-gray-500 text-sm space-y-3">
            <li className="flex items-center gap-2"><Phone size={16} className="text-blue-500"/> +855 12 345 678</li>
            <li className="flex items-center gap-2"><MapPin size={16} className="text-blue-500"/> ភ្នំពេញ, កម្ពុជា</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-4">បណ្ដាញសង្គម</h4>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-blue-50 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition">
              <Send size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm border-t pt-6">
        © {new Date().getFullYear()} V-Cart Shop. រក្សាសិទ្ធិគ្រប់យ៉ាង។
      </div>
    </footer>
  );
}

export default Footer;