require('dotenv').config(); 

const express = require('express'); 
const cors = require('cors');       

const connectDB = require('./config/db'); 
const productRoutes = require('./routes/productRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
const orderRoutes = require('./routes/orderRoutes'); // <--- NEW

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB(); 

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// API Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the ToyVenture API!' });
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes); // <--- NEW

// Error Handling
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is up and running on http://localhost:${PORT}`);
});