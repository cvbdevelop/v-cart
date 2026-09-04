ប្រើសម្រាប់ផ្ទុករូបភាព

ជំហានទី១៖ ចុះឈ្មោះ និងយកសោពី Cloudinary (ឥតគិតថ្លៃ)
សូមចូលទៅកាន់វេបសាយ cloudinary.com រួចចុច Sign Up For Free។

បន្ទាប់ពីចុះឈ្មោះ និង Login ចូលដល់ផ្ទាំង Dashboard សូមរកមើលពាក្យ API Keys ឬ Programmable Media។

លោកអ្នកនឹងឃើញទិន្នន័យសំខាន់ ៣ យ៉ាង (សូមចម្លងវាទុក)៖

Cloud Name

API Key		673149298712622

API Secret	kTXC5PO9Mn46oNWOiPtmrisgsnI

https://console.cloudinary.com/app/c-0e05885efda716ea85be66f563d0db/home/dashboard

ជំហានទី២៖ ដំឡើង Package ថ្មី (នៅខាង Backend)
សូមបើក Terminal របស់ Backend (កន្លែង Run node server.js) រួចចុច Ctrl + C ដើម្បីបញ្ឈប់ Server។ បន្ទាប់មកវាយបញ្ជាខាងក្រោម៖

npm install cloudinary multer-storage-cloudinary

ជំហានទី៣៖ កែប្រែកូដ backend/server.js
សូមបើកឯកសារ backend/server.js ធ្វើការ Import Package ថ្មី និងជំនួសកូដ Multer ចាស់ចេញទាំងស្រុង។

១. បន្ថែមការ Import នៅខាងលើគេ (ក្រោម Import ចាស់ៗ)៖

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

២. ជំនួសកូដ Multer ចាស់៖
សូមស្វែងរកកូដ const storage = multer.diskStorage({...}) រហូតដល់ API app.post('/api/upload', ...) ហើយ លុបវាចោល រួចជំនួសដោយកូដថ្មីនេះវិញ៖

// ការកំណត់សោ Cloudinary (សូមយកទិន្នន័យពីជំហានទី១ មកជំនួសត្រង់នេះ)
cloudinary.config({
  cloud_name: 'ឈ្មោះ_CLOUD_NAME_របស់អ្នក',
  api_key: 'លេខ_API_KEY_របស់អ្នក',
  api_secret: 'លេខ_API_SECRET_របស់អ្នក'
});

// ការកំណត់កន្លែងរក្សាទុករូបភាពទៅកាន់ Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'v-cart-products', // រូបភាពនឹងត្រូវបានរក្សាទុកក្នុង Folder នេះនៅលើ Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage });

// API សម្រាប់ Upload (កែប្រែការទាញយក Link ថ្មី)
app.post('/api/upload', protect, upload.single('image'), (req, res) => {
  // Cloudinary នឹងផ្តល់ Link រូបភាពត្រលប់មកវិញតាមរយៈ req.file.path
  res.json({ imageUrl: req.file.path }); 
});

ចំណុចដ៏អស្ចារ្យនៃការប្រើប្រាស់វិធីនេះ គឺលោកអ្នក មិនចាំបាច់កែប្រែកូដនៅខាង Frontend (Admin.jsx) សូម្បីតែមួយបន្ទាត់!

បន្ទាប់ពីលោកអ្នកបានជំនួសកូដ និងដាក់សោ Cloudinary រួចរាល់ សូមវាយ node server.js ដើម្បីបើក Backend វិញ រួចសាកល្បង Upload រូបភាពទំនិញថ្មីមួយនៅលើទំព័រ Admin។ ប្រសិនបើវាដំណើរការ នោះប្រព័ន្ធរបស់អ្នកបានត្រៀមខ្លួនរួចរាល់ជាស្ថាពរសម្រាប់ការបង្ហោះ (Deploy) ទៅកាន់ពិភពលោកហើយ!

ដើម្បីយកទិន្នន័យ ២ ទៀត (API Key និង API Secret) សូមលោកអ្នកចុចលើប៊ូតុងពណ៌ខៀវតូចមួយ "Go to API Keys" ដែលនៅខាងស្តាំប្រអប់ Product Environment នោះ។ ពេលចុចចូលទៅ លោកអ្នកនឹងឃើញលេខកូដទាំងពីរនោះជាមិនខាន។

បន្ទាប់ពីទទួលបានលេខទាំងនោះហើយ សូមកុំភ្លេចចូលទៅកាន់ Terminal របស់ Backend ដើម្បីដំឡើង Package (ដោយវាយបញ្ជា npm install cloudinary multer-storage-cloudinary) បើសិនជាមិនទាន់បានដំឡើង។ រួចយកទិន្នន័យទាំង ៣ នោះមកជំនួសនៅក្នុងឯកសារ backend/server.js ដូចខាងក្រោម៖

cloudinary.config({
  cloud_name: 'dlw2uxquz', // ខ្ញុំបានបំពេញជូនរួចរាល់
  api_key: 'យកលេខដែលបានពីការចុចប៊ូតុងមកដាក់ទីនេះ',
  api_secret: 'យកលេខដែលបានពីការចុចប៊ូតុងមកដាក់ទីនេះ'
});

តើលោកអ្នករកឃើញ API Key និង API Secret ហើយឬនៅ? ប្រសិនបើរៀបចំកូដ និងជំនួសកូដ Multer ចាស់រួចរាល់ហើយ សូម Restart Backend (node server.js) រួចសាកល្បង Upload រូបភាពថ្មីមួយនៅលើទំព័រ Admin ដើម្បីមើលថាតើវាដំណើរការចូលទៅក្នុង Cloudinary បានជោគជ័យដែរឬទេ។