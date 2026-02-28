const express = require('express');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // Use express.json instead of body-parser

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('University Management API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
