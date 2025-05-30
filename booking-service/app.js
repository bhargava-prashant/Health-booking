import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.js'; // Define routes for booking service
import pool from './db.js'; // Import pool for DB connection

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ message: 'Booking service running', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ message: 'Database connection error', error: error.message });
  }
});

// Booking routes
app.use('/api/bookings', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Booking service running on Port ${PORT}`));
