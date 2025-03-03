const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./Routes/todoRoutes.js');  
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(
  {
    origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
));

app.use(express.json()); 
mongoose.connect("mongodb+srv://nitishshyoran:nitish@cluster0.chdxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection failed:', err));

app.use('/api/todos', todoRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
