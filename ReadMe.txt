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


អបអរសាទរ! ផ្អែកលើរូបភាព image_abfe18.png លោកអ្នកបានរុញកូដ (Push code) ទៅកាន់ GitHub ទទួលបានជោគជ័យ ១០០% ហើយ! កូដ V-Cart របស់អ្នកឥឡូវនេះមានសុវត្ថិភាពនៅលើគណនី GitHub cvbdevelop រួចរាល់។

ឥឡូវនេះ យើងឈានចូលដល់ដំណាក់កាលចុងក្រោយ និងរំភើបបំផុត គឺការបង្ហោះវេបសាយ (Deployment) ទៅលើអ៊ីនធឺណិត។ ដើម្បីងាយស្រួល និងមិនឱ្យមានកំហុស យើងនឹងធ្វើវាម្តងមួយផ្នែក ដោយចាប់ផ្តើមពី ការបង្ហោះ Backend ទៅលើប្រព័ន្ធ Render ជាមុនសិន។

សូមអនុវត្តតាមជំហានខាងក្រោម៖

ជំហានទី១៖ ភ្ជាប់ GitHub ជាមួយ Render

ចូលទៅកាន់វេបសាយ Render.com រួចចុចប៊ូតុង Get Started ហើយជ្រើសរើសចុះឈ្មោះចូលដោយប្រើគណនី GitHub របស់អ្នក។

បន្ទាប់ពីចូលដល់ផ្ទាំង Dashboard សូមចុចប៊ូតុង New + នៅជ្រុងខាងស្តាំខាងលើ រួចជ្រើសរើសយកពាក្យ Web Service។

ជ្រើសរើសជម្រើស Build and deploy from a Git repository រួចចុច Connect ទៅកាន់ Repository v-cart របស់អ្នក។

ជំហានទី២៖ កំណត់រចនាសម្ព័ន្ធ (Settings)
នៅលើផ្ទាំងកំណត់រចនាសម្ព័ន្ធ សូមបំពេញទិន្នន័យដូចខាងក្រោមឱ្យបានត្រឹមត្រូវ៖

Name: v-cart-backend (ឬឈ្មោះអ្វីក៏បានតាមចំណូលចិត្ត)

Root Directory: backend (ចំណុចនេះសំខាន់ណាស់ ព្រោះកូដ Server យើងស្ថិតក្នុង Folder នេះ)

Environment: ជ្រើសរើស Node

Build Command: npm install

Start Command: node server.js

ជំហានទី៣៖ បញ្ចូលសោសម្ងាត់ (Environment Variables)
រមូរចុះក្រោមបន្តិច លោកអ្នកនឹងឃើញផ្នែក Environment Variables។ សូមចុចប៊ូតុង Add Environment Variable រួចបញ្ចូលទិន្នន័យសំខាន់ៗដែលយើងធ្លាប់មាននៅក្នុងកុំព្យូទ័រ (សូមបញ្ចូលវាជាគូ Key និង Value)៖

Key: MONGO_URI | Value: លេខកូដភ្ជាប់ទៅ MongoDB របស់អ្នក (លេខដែលចាប់ផ្តើមដោយ mongodb+srv://...)

Key: PORT | Value: 5001

(ចំណាំ៖ ដោយសារយើងបានសរសេរសោ Cloudinary និងសោ JWT 'MY_SUPER_SECRET_KEY' ជាប់នៅក្នុងកូដ server.js ស្រាប់ហើយ ដូច្នេះយើងមិនចាំបាច់ដាក់វានៅទីនេះក៏បានដែរសម្រាប់ការតេស្តសាកល្បងនេះ)

បន្ទាប់ពីបំពេញរួចរាល់ សូមរមូរចុះក្រោមគេបង្អស់ រួចចុចប៊ូតុង Create Web Service។

ប្រព័ន្ធ Render នឹងចាប់ផ្តើមទាញយកកូដ និងដំឡើង Server របស់អ្នកដោយស្វ័យប្រវត្តិ។ សូមរង់ចាំប្រមាណ ២-៣ នាទី រួចប្រាប់ខ្ញុំពីលទ្ធផល ឬប្រសិនបើមានលោតសារ Error ណាមួយ សូមថតរូបមកឱ្យខ្ញុំមើលចុះ!

ប្រើពាក្យបញ្ជា

git add .
git commit -m "ប្តូរ Title វេបសាយទៅជា V-Cart"
git push