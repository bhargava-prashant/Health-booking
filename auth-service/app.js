import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.send('Auth service running');
});

// Auth routes
app.use('/api/auth', routes);

const PORT = process.env.PORT || 5000; // Use process.env.PORT in uppercase for consistency

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
