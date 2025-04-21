import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes.js' // Define routes for booking service

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5003; // Booking service on a different port
app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  
app.listen(PORT, () => console.log(`Booking service running on Port ${PORT}`));
