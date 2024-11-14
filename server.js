const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  
const userRoutes = require('./routes/userRoutes');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
