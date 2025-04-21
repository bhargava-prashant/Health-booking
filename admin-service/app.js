import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes.js' // Update this based on actual routes for admin service

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5002; // Admin service on a different port
app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  
app.listen(PORT, () => console.log(`Admin service running on Port ${PORT}`));
