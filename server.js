const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Conditional server start for testing
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export app for testing
module.exports = app;
