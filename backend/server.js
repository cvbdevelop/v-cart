import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// កំណត់ Directory សម្រាប់ ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// បង្កើត Folder ឈ្មោះ 'uploads' ដោយស្វ័យប្រវត្តិប្រសិនបើមិនទាន់មាន
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

dotenv.config();

const app = express();

// អនុញ្ញាតឱ្យ Frontend អាចទាក់ទងមក Backend បាន
app.use(cors());
// អនុញ្ញាតឱ្យ Server អាចអានទិន្នន័យប្រភេទ JSON
app.use(express.json());

// អនុញ្ញាតឱ្យ Frontend អាចចូលទាញយករូបភាពពី Folder 'uploads' បាន
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// បន្ថែមជួរនេះ ដើម្បីបង្ហាញតំណភ្ជាប់នៅក្នុង Terminal
console.log("តំណភ្ជាប់របស់ខ្ញុំគឺ:", process.env.MONGO_URI);

// ភ្ជាប់ទៅកាន់ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('ភ្ជាប់ទៅកាន់មូលដ្ឋានទិន្នន័យ MongoDB បានជោគជ័យ!'))
  .catch((err) => console.error('បរាជ័យក្នុងការភ្ជាប់ទៅកាន់ MongoDB:', err));

// ២. កែប្រែ ឬបង្កើត Order Schema បន្ថែម status
const orderSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  address: String,
  items: Array, // <--- ប្តូរពី cartItems មក items វិញទើបវាស្គាល់គ្នា
  totalAmount: Number,
  status: { type: String, default: 'Pending' }, // <-- បន្ថែមថ្មី (Pending, Shipping, Delivered)
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ... (កូដចាស់ៗពីមុន)

// ១. បង្កើតរចនាសម្ព័ន្ធសម្រាប់ Product
// កែប្រែ Product Schema ឱ្យមាន category (ឧ. 'electronics', 'clothing', 'bags', 'others')
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String },
  countInStock: { type: Number },
  description: { type: String },
  sizes: { type: [String] },  // <-- បន្ថែមវាលសម្រាប់ទំហំ (ឧទាហរណ៍: ['S', 'M', 'L', 'XL'])
  colors: { type: [String] }  // <-- បន្ថែមវាលសម្រាប់ពណ៌ (ឧទាហរណ៍: ['Red', 'Blue', 'Black'])
});
const Product = mongoose.model('Product', productSchema);

// ប្រព័ន្ធផ្ទុកទិន្នន័យការបញ្ជាទិញ (Order Schema)
const orderSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  address: String,
  paymentMethod: String,
  items: Array,
  totalAmount: Number,
  status: { type: String, default: 'កំពុងរង់ចាំ' }, // Pending
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// API សម្រាប់បង្កើតការបញ្ជាទិញថ្មី
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'បរាជ័យក្នុងការបង្កើតការបញ្ជាទិញ' });
  }
});

// API សម្រាប់ទាញយកប្រវត្តិបញ្ជាទិញមកបង្ហាញក្នុង Admin
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // បង្ហាញថ្មីជាងគេមុន
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'បរាជ័យក្នុងការទាញយកការបញ្ជាទិញ' });
  }
});

// ==================== ផ្នែកគណនី (USER & AUTH) ====================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// ដូរពី app.post ទៅជា app.get វិញ
app.get('/api/setup-admin', async (req, res) => {
  const adminExists = await User.findOne({ username: 'admin' });
  if (adminExists) return res.json({ message: 'មានគណនី Admin រួចហើយ' });

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const newAdmin = new User({ username: 'admin', password: hashedPassword });
  await newAdmin.save();
  res.json({ message: 'បង្កើតគណនីជោគជ័យ! Username: admin, Password: admin123' });
});

// API ២: សម្រាប់ Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ success: false, message: 'ឈ្មោះគណនីមិនត្រឹមត្រូវ' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ success: false, message: 'លេខសម្ងាត់មិនត្រឹមត្រូវ' });

  // បង្កើតសោ Token សុពលភាព ១ថ្ងៃ
  const token = jwt.sign({ id: user._id }, 'MY_SUPER_SECRET_KEY', { expiresIn: '1d' });
  res.json({ success: true, token });
});

// មន្ត្រីសន្តិសុខ (Middleware) សម្រាប់យាមទ្វារ API មិនឱ្យអ្នកគ្មានកូនសោចូលបាន
const protect = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ success: false, message: 'គ្មានសិទ្ធិ (No Token)' });
  
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'MY_SUPER_SECRET_KEY');
    req.user = decoded;
    next(); // អនុញ្ញាតឱ្យឆ្លងកាត់បាន
  } catch (err) {
    res.status(401).json({ success: false, message: 'សោមិនត្រឹមត្រូវ ឬផុតកំណត់' });
  }
};

// ២. បង្កើត API សម្រាប់ទាញយកទំនិញទាំងអស់មកបង្ហាញ
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// ៣. បង្កើត API បណ្តោះអាសន្ន ដើម្បីបញ្ចូនទិន្នន័យគំរូចូល Database ងាយស្រួល
app.get('/api/seed-products', async (req, res) => {
  try {
    const mockProducts = [
      { name: "កាបូបស្ពាយបុរសសេរីថ្មី", price: 15.00, image: "https://placehold.co/400x400?text=Bag" },
      { name: "នាឡិកាដៃ Smartwatch", price: 45.50, image: "https://placehold.co/400x400?text=Watch" },
      { name: "ស្បែកជើងកីឡា", price: 30.00, image: "https://placehold.co/400x400?text=Shoes" },
      { name: "អាវយឺត Cotton 100%", price: 10.00, image: "https://placehold.co/400x400?text=T-Shirt" },
      { name: "កាសស្តាប់ត្រចៀក Bluetooth", price: 25.00, image: "https://placehold.co/400x400?text=Earbuds" },
      { name: "ដបទឹករក្សាកម្ដៅ", price: 12.00, image: "https://placehold.co/400x400?text=Bottle" }
    ];
    // លុបទិន្នន័យចាស់ចោលសិន (បើមាន) ហើយបញ្ចូលថ្មី
    await Product.deleteMany({});
    await Product.insertMany(mockProducts);
    res.json({ message: 'បញ្ចូលទិន្នន័យទំនិញគំរូចូល MongoDB ជោគជ័យ!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: អតិថិជនបញ្ជាទិញ (មិនមាន protect ទេ)
app.post('/api/orders', async (req, res) => {
  try {
    // ប្រើឈ្មោះ items ឱ្យត្រូវនឹង Frontend
    const { customerName, phone, address, items, totalAmount } = req.body;

    // ការពារករណីបញ្ជូនកន្ត្រកទទេ
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'មិនមានទំនិញក្នុងកន្ត្រកទេ' });
    }

    // ១. ឆែកមើលចំនួនស្តុកសិន
    for (let item of items) {
      const product = await Product.findById(item.id || item._id);
      if (!product) return res.status(404).json({ success: false, message: `រកមិនឃើញទំនិញ ${item.name}` });
      
      if (product.countInStock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `សុំទោស! ទំនិញ "${item.name}" សល់ត្រឹមតែ ${product.countInStock} ប៉ុណ្ណោះ ក្នុងស្តុក។` 
        });
      }
    }

    // ២. កាត់ស្តុកចេញពី Database
    for (let item of items) {
      const product = await Product.findById(item.id || item._id);
      product.countInStock -= item.quantity;
      await product.save();
    }

    // ៣. បង្កើតវិក្កយបត្រថ្មី
    const newOrder = new Order({ 
      customerName, phone, address, items, totalAmount, status: 'Pending' 
    });
    await newOrder.save();

    res.json({ success: true, message: 'បញ្ជាទិញជោគជ័យ!' });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ success: false, message: 'មានបញ្ហាទិន្នន័យ', error: error.message });
  }
});

// API សម្រាប់ទាញយកបញ្ជីការបញ្ជាទិញទាំងអស់មកបង្ហាញនៅលើ Admin Dashboard
app.get('/api/orders', protect, async (req, res) => {
  try {
    // ប្រើ .sort({ createdAt: -1 }) ដើម្បីបង្ហាញអ្នកទិញថ្មីៗនៅខាងលើគេ
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការទាញយកទិន្នន័យការបញ្ជាទិញ' });
  }
});

// API: Admin កែប្រែស្ថានភាពបញ្ជាទិញ
app.put('/api/orders/:id/status', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'រកមិនឃើញការបញ្ជាទិញ' });

    order.status = req.body.status; // ឧ. ប្តូរទៅ 'Shipping' ឬ 'Delivered'
    await order.save();
    
    res.json({ success: true, message: 'កែប្រែស្ថានភាពជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API សម្រាប់បន្ថែមទំនិញថ្មី (Create Product)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ success: true, message: 'បន្ថែមទំនិញចូល Database ជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការបន្ថែមទំនិញ' });
  }
});

// API សម្រាប់កែប្រែព័ត៌មានទំនិញ (Update Product)
app.put('/api/products/:id', protect, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'កែប្រែទំនិញជោគជ័យ', updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការកែប្រែទំនិញ' });
  }
});

// API សម្រាប់លុបទំនិញออกจากស្តុក (Delete Product)
app.delete('/api/products/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'លុបទំនិញជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការលុបទំនិញ' });
  }
});

// ការកំណត់សោ Cloudinary (សូមយកទិន្នន័យពីជំហានទី១ មកជំនួសត្រង់នេះ)
cloudinary.config({
  cloud_name: 'diw2xuquz',
  api_key: '673149298712622',
  api_secret: 'kTXC5PO9Mn46oNWOiPtmrisgsnI'
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

// API សម្រាប់ Upload (ជំនួសកូដនេះ ដើម្បីចាប់ Error ឱ្យបានច្បាស់)
app.post('/api/upload', protect, (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error("មានបញ្ហាពី Cloudinary:", err); // វានឹងបង្ហាញ Error ពិតប្រាកដក្នុង Terminal
      return res.status(500).json({ message: 'បរាជ័យក្នុងការ Upload', error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'មិនមានរូបភាពត្រូវបានបញ្ជូនមកទេ' });
    }
    
    // បើជោគជ័យ វានឹងបញ្ជូន URL រូបភាពទៅឱ្យ Frontend
    res.json({ imageUrl: req.file.path });
  });
});


// =================================================================

// ចាប់ផ្តើមដំណើរការ Server
// app.listen(PORT, ...

// សូមប្តូរលេខ 5000 នោះទៅជា 5001 វិញ៖
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server កំពុងដំណើរការនៅលើ http://localhost:${PORT}`);
});