const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db'); // Import database connection
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/authRoutes'); 
const addressRoutes = require('./routes/addresRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');

const orderRoutes = require('./routes/orderRoutes'); 
const path = require('path');



dotenv.config();
const app = express();

connectDB(); // Connect to MongoDB


app.use(express.urlencoded({ extended: true })); 
// add data in json format
app.use(express.json());

app.use(cors());  
app.use(cookieParser())

app.use('/quickmart', express.static(path.join(__dirname, 'quickmart')));


// Routes
app.use("/api/auth", authRoutes); 
app.use("/api/addresses", addressRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/products", productRoutes);
app.use('/api/orders', orderRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
