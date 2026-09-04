import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* ផ្ទៃខាងក្រោយរាងកោង (Gradient Background) */}
        <defs>
          <linearGradient id="v-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" /> {/* ពណ៌ខៀវ */}
            <stop offset="100%" stopColor="#3B82F6" /> {/* ពណ៌ខៀវស្រាល */}
          </linearGradient>
          <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" /> {/* ពណ៌លឿងទឹកក្រូច */}
            <stop offset="100%" stopColor="#EA580C" /> {/* ពណ៌ទឹកក្រូចចាស់ */}
          </linearGradient>
        </defs>

        {/* រូបរាងកន្ត្រកទំនិញ និងអក្សរ V */}
        <rect x="4" y="10" width="32" height="26" rx="6" fill="url(#v-gradient)" />
        <path d="M12 14V8C12 5.79086 13.7909 4 16 4H24C26.2091 4 28 5.79086 28 8V14" stroke="url(#accent-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 18L20 28L26 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      
      {/* ឈ្មោះហាង */}
      <span className="text-xl font-black tracking-tight text-gray-800">
        V<span className="text-blue-600">-Cart</span>
      </span>
    </div>
  );
};

export default Logo;