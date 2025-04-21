import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes.js' // Make sure to update routes accordingly

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5001; // Ensure each service has a unique port
app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  
app.listen(PORT, () => console.log(`Doctor service running on Port ${PORT}`));
