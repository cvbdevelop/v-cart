import { Mail, Phone, MapPin, Send } from 'lucide-react';

function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black text-gray-800 mb-8 text-center">ទំនាក់ទំនងមកកាន់ពួកយើង</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* ផ្នែកព័ត៌មានទំនាក់ទំនង */}
          <div className="bg-[#0b1f38] text-white p-10 md:w-1/3 flex flex-col gap-8">
            <div>
              <h2 className="text-xl font-bold mb-2">ព័ត៌មានលម្អិត</h2>
              <p className="text-gray-400 text-sm">ប្រសិនបើអ្នកមានចម្ងល់ ឬត្រូវការជំនួយ សូមកុំស្ទាក់ស្ទើរក្នុងការទាក់ទងមកកាន់ក្រុមការងាររបស់យើង។</p>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="bg-orange-500 p-3 rounded-full"><Phone size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase">ទូរស័ព្ទ (Phone)</p>
                <p className="font-bold">+855 96 924 3333</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="bg-orange-500 p-3 rounded-full"><Mail size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase">អ៊ីមែល (Email)</p>
                <p className="font-bold">support@vcart.com</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="bg-orange-500 p-3 rounded-full"><MapPin size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase">ទីតាំង (Location)</p>
                <p className="font-bold">Phnom Penh, Cambodia</p>
              </div>
            </div>
          </div>

          {/* ផ្នែកទម្រង់ផ្ញើសារ */}
          <div className="p-10 md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ផ្ញើសារមកកាន់យើង</h2>
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះរបស់អ្នក</label>
                  <input type="text" placeholder="ឧទាហរណ៍: សុខ សាន្ត" className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">លេខទូរស័ព្ទ</label>
                  <input type="text" placeholder="012 345 678" className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ប្រធានបទ</label>
                <input type="text" placeholder="តើអ្នកចង់សាកសួរអំពីអ្វី?" className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">សាររបស់អ្នក</label>
                <textarea rows="4" placeholder="វាយបញ្ចូលសារនៅទីនេះ..." className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition"></textarea>
              </div>

              <button type="button" onClick={() => alert('សារត្រូវបានផ្ញើជោគជ័យ! យើងនឹងទាក់ទងទៅអ្នកវិញក្នុងពេលឆាប់ៗ។')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 mt-2">
                <Send size={18} /> បញ្ជូនសារ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;