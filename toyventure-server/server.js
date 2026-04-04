// 1. Import necessary modules
const express = require('express'); // The core web framework
const cors = require('cors');       // Allows cross-origin requests (e.g., from a frontend)

// 2. Initialize the Express application
const app = express();

// 3. Define the port (uses environment variable if available, otherwise defaults to 3000)
const PORT = process.env.PORT || 3000;

// ==========================================
// 4. MIDDLEWARE SETUP
// ==========================================
app.use(cors()); // Enables CORS so your frontend can talk to this API
app.use(express.json()); // Automatically parses incoming JSON data from requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data (like form submissions)

// ==========================================
// 5. ROUTES (API Endpoints)
// ==========================================

// Basic GET route (testing if the server is alive)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the API! The server is running successfully.' });
});

// Example GET route (fetching data)
app.get('/api/users', (req, res) => {
    // In a real app, you would fetch this from a database
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
    ];
    res.status(200).json(users);
});

// Example POST route (receiving data from the client)
app.post('/api/users', (req, res) => {
    const newUser = req.body; // The JSON data sent by the client sits here
    
    // Basic validation
    if (!newUser.name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    // In a real app, you would save this to a database
    res.status(201).json({ 
        message: 'User created successfully!', 
        data: newUser 
    });
});

// ==========================================
// 6. ERROR HANDLING
// ==========================================

// Catch-all route for requests to endpoints that don't exist
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ==========================================
// 7. START THE SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Server is up and running on http://localhost:${PORT}`);
});