const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./Routes/todoRoutes.js');  // Import the todo routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON data

// Database Connection
mongoose.connect('Your Database Connection String', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection failed:', err));

// Routes
app.use('/api/todos', todoRoutes);  // Use the todo routes for CRUD operations

// Listen to server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
