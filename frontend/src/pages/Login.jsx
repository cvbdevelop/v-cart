import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('https://v-cart-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // រក្សាទុក Token ក្នុងកុំព្យូទ័រ
        localStorage.setItem('adminToken', data.token);
        navigate('/admin'); // បញ្ជូនទៅកាន់ទំព័រ Admin
      } else {
        alert(data.message || 'ឈ្មោះគណនី ឬលេខសម្ងាត់មិនត្រឹមត្រូវ');
      }
    } catch (error) {
      alert('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">គ្រប់គ្រងប្រព័ន្ធ Admin</h2>
          <p className="text-gray-500 mt-2">សូមបញ្ចូលព័ត៌មានគណនីរបស់អ្នក</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះគណនី (Username)</label>
            <input 
              required 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="វាយបញ្ចូល username..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">លេខសម្ងាត់ (Password)</label>
            <input 
              required 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            disabled={isLoading} 
            type="submit" 
            className={`w-full text-white font-bold py-3.5 rounded-xl transition ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'កំពុងពិនិត្យ...' : 'ចូលគណនី (Login)'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;