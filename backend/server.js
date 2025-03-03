const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRoutes = require("./Routes/todoRoutes.js");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://nitishshyoran:nitish@cluster0.chdxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection failed:", err));
app.get("/test", (req, res) => {
  app.use("/api/todos", todoRoutes);
  res.send("server running");
});
// Routes
app.use("/api/todos", todoRoutes); // Use the todo routes for CRUD operations

// Listen to server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
