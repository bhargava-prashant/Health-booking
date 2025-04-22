import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.js'; // Define routes for admin service

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/admin', routes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Admin service running on Port ${PORT}`));
