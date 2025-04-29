import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.js';  // Import routes for booking service
import pool from "./db.js"
dotenv.config();  // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/bookings', routes);

// Health check route (optional)
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ message: 'Booking service running', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ message: 'Database connection error', error: error.message });
  }
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Booking service running on Port ${PORT}`));
