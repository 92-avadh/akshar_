require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

// Array of premium toy data matching your React UI
const sampleProducts = [
  { 
    title: "G Patton Die-Cast Off-Road SUV Toy Car with Lights & Sounds", 
    price: "1,199.00", 
    oldPrice: "1,999.00", 
    discount: "[40% OFF]",
    clubPrice: "1,139.00",
    img: "https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tag: "Diecast",
    category: "Metal Cars",
    countInStock: 15,
    description: "Built for rough terrains and endless imagination. This 1:32 scale G Patton SUV features openable doors, realistic engine sounds, working headlights, and a powerful pull-back action mechanism."
  },
  { 
    title: "AMG G63 G Wagon Die-Cast Metal Car with Openable Doors", 
    price: "2,699.00", 
    oldPrice: "3,999.00", 
    discount: "[33% OFF]",
    clubPrice: "2,564.00",
    img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tag: "Trending",
    category: "Metal Cars",
    countInStock: 8,
    description: "Experience luxury in the palm of your hand. Highly detailed interior and exterior, perfect for collectors and kids alike."
  },
  { 
    title: "Rolls Royce Phantom Diecast Car Model | Luxury Series", 
    price: "2,599.00", 
    oldPrice: "3,999.00", 
    discount: "[35% OFF]",
    clubPrice: "2,469.00",
    img: "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tag: "Exclusive",
    category: "Metal Cars",
    countInStock: 5,
    description: "The ultimate status symbol toy. Features the iconic spirit of ecstasy ornament and suicide doors."
  },
  { 
    title: "Vintage Classic Beetle 1:32 Scale Diecast Pull Back Car", 
    price: "899.00", 
    oldPrice: "1,499.00", 
    discount: "[40% OFF]",
    clubPrice: "854.00",
    img: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tag: "Classic",
    category: "Metal Cars",
    countInStock: 25,
    description: "Take a trip down memory lane. A beautifully crafted replica of the iconic classic Beetle."
  }
];

// Function to wipe existing data and inject the new data
const importData = async () => {
  try {
    await connectDB(); // Ensure we are connected

    await Product.deleteMany(); // Clear the database so we don't duplicate
    console.log('Old products cleared...');

    await Product.insertMany(sampleProducts); // Inject the array
    console.log('✅ Magical Toys successfully added to the database!');
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

importData();