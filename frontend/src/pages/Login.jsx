import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // ប្រើប្រាស់ Render URL ផ្ទាល់ មិនមែន localhost ទេ
      const res = await fetch('https://v-cart-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        alert(data.message || 'ព័ត៌មានមិនត្រឹមត្រូវទេ');
      }
    } catch (err) {
      console.error(err);
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server (សូមពិនិត្យមើល URL របស់ Backend)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <Lock size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-800">គ្រប់គ្រងប្រព័ន្ធ Admin</h2>
          <p className="text-gray-500 text-sm mt-1">សូមបញ្ចូលព័ត៌មានគណនីរបស់អ្នក</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះគណនី (Username)</label>
            <input 
              required 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full border px-4 py-3 rounded-lg outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">លេខសម្ងាត់ (Password)</label>
            <input 
              required 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border px-4 py-3 rounded-lg outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition"
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3.5 rounded-lg transition mt-2 disabled:bg-gray-400">
            {isLoading ? 'កំពុងពិនិត្យ...' : 'ចូលប្រព័ន្ធ (Login)'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;