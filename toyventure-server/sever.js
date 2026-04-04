import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'; // <-- 1. Import the DB connection

// Load Environment Variables
dotenv.config();

// Connect to Database
connectDB(); // <-- 2. Call the connection function

// Initialize Express App
const app = express();

// Middlewares
app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));

// Basic Test Route
app.get('/', (req, res) => {
    res.send('ToyVenture API is running... 🚀');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});