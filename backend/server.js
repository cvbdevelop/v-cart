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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log("តំណភ្ជាប់របស់ខ្ញុំគឺ:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('ភ្ជាប់ទៅកាន់មូលដ្ឋានទិន្នន័យ MongoDB បានជោគជ័យ!'))
  .catch((err) => console.error('បរាជ័យក្នុងការភ្ជាប់ទៅកាន់ MongoDB:', err));

// ==================== SCHEMAS ====================

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});
// បន្ថែម reviews: [reviewSchema] ទៅក្នុង productSchema ដើម

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String },
  countInStock: { type: Number },
  description: { type: String },
  sizes: { type: [String] },  
  colors: { type: [String] }  
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  address: String,
  paymentMethod: String,
  items: Array,
  totalAmount: Number,
  status: { type: String, default: 'Pending' }, 
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// ==================== AUTH & MIDDLEWARE ====================

app.get('/api/setup-admin', async (req, res) => {
  const adminExists = await User.findOne({ username: 'admin' });
  if (adminExists) return res.json({ message: 'មានគណនី Admin រួចហើយ' });
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const newAdmin = new User({ username: 'admin', password: hashedPassword });
  await newAdmin.save();
  res.json({ message: 'បង្កើតគណនីជោគជ័យ! Username: admin, Password: admin123' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ success: false, message: 'ឈ្មោះគណនីមិនត្រឹមត្រូវ' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ success: false, message: 'លេខសម្ងាត់មិនត្រឹមត្រូវ' });
  const token = jwt.sign({ id: user._id }, 'MY_SUPER_SECRET_KEY', { expiresIn: '1d' });
  res.json({ success: true, token });
});

const protect = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ success: false, message: 'គ្មានសិទ្ធិ (No Token)' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'MY_SUPER_SECRET_KEY');
    req.user = decoded;
    next(); 
  } catch (err) {
    res.status(401).json({ success: false, message: 'សោមិនត្រឹមត្រូវ ឬផុតកំណត់' });
  }
};

// API សម្រាប់ប្តូរលេខសម្ងាត់ Admin
app.put('/api/change-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'រកមិនឃើញគណនី' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'លេខសម្ងាត់ចាស់មិនត្រឹមត្រូវ' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'ប្តូរលេខសម្ងាត់បានជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PRODUCT APIs ====================

// Schema សម្រាប់កូដបញ្ចុះតម្លៃ
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true } // ឧទាហរណ៍៖ 10 (ស្មើនឹង 10%)
});
const Coupon = mongoose.model('Coupon', couponSchema);

// API សម្រាប់បង្កើតកូដបញ្ចុះតម្លៃដំបូង (អាចចូលតាម Browser: /api/setup-coupon ដើម្បីបង្កើតកូដ "DISCOUNT10")
app.get('/api/setup-coupon', async (req, res) => {
  const exists = await Coupon.findOne({ code: 'DISCOUNT10' });
  if (exists) return res.json({ message: 'កូដបញ្ចុះតម្លៃមានរួចហើយ' });
  const newCoupon = new Coupon({ code: 'DISCOUNT10', discountPercent: 10 });
  await newCoupon.save();
  res.json({ success: true, message: 'បង្កើតកូដ DISCOUNT10 (បញ្ចុះ 10%) ជោគជ័យ!' });
});

// API ឆែកកូដបញ្ចុះតម្លៃពេលអតិថិជនវាយបញ្ចូល
app.post('/api/coupons/verify', async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'កូដបញ្ចុះតម្លៃមិនត្រឹមត្រូវ' });
    }
    res.json({ success: true, discountPercent: coupon.discountPercent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/products', protect, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ success: true, message: 'បន្ថែមទំនិញចូល Database ជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការបន្ថែមទំនិញ' });
  }
});

app.put('/api/products/:id', protect, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'កែប្រែទំនិញជោគជ័យ', updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការកែប្រែទំនិញ' });
  }
});

app.delete('/api/products/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'លុបទំនិញជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការលុបទំនិញ' });
  }
});

// ==================== ORDER APIs ====================

app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, phone, address, paymentMethod, items, totalAmount } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'មិនមានទំនិញក្នុងកន្ត្រកទេ' });
    }

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

    for (let item of items) {
      const product = await Product.findById(item.id || item._id);
      product.countInStock -= (item.quantity || 1);
      await product.save();
    }

    const newOrder = new Order({ customerName, phone, address, paymentMethod, items, totalAmount });
    await newOrder.save();
    res.json({ success: true, message: 'បញ្ជាទិញជោគជ័យ!' });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ success: false, message: 'មានបញ្ហាទិន្នន័យ', error: error.message });
  }
});

// ចំណាំ៖ បានដក 'protect' ចេញបណ្ដោះអាសន្ន ដើម្បីឱ្យផ្ទាំង Admin ទាញយកទិន្នន័យបានដោយមិនបាច់ប្រើ Token 
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការទាញយកទិន្នន័យការបញ្ជាទិញ' });
  }
});

// កែពី app.put('/api/orders/:id/status', protect, async (req, res) => { ...
// មកជាទម្រង់ខាងក្រោមនេះវិញ៖
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'រកមិនឃើញការបញ្ជាទិញ' });
    order.status = req.body.status;
    await order.save();
    res.json({ success: true, message: 'កែប្រែស្ថានភាពជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API សម្រាប់អតិថិជនឆែកមើលការបញ្ជាទិញតាមលេខទូរស័ព្ទ
app.get('/api/orders/track/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    const orders = await Order.find({ phone: phone }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'មានបញ្ហាក្នុងការស្វែងរកទិន្នន័យ' });
  }
});

// ==================== CLOUDINARY ====================

cloudinary.config({
  cloud_name: 'diw2xuquz',
  api_key: '673149298712622',
  api_secret: 'kTXC5PO9Mn46oNWOiPtmrisgsnI'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'v-cart-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage });

app.post('/api/upload', protect, (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error("មានបញ្ហាពី Cloudinary:", err);
      return res.status(500).json({ message: 'បរាជ័យក្នុងការ Upload', error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'មិនមានរូបភាពត្រូវបានបញ្ជូនមកទេ' });
    }
    res.json({ imageUrl: req.file.path });
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server កំពុងដំណើរការនៅលើ http://localhost:${PORT}`);
});