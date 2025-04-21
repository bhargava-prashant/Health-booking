import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes.js'

dotenv.config();

const app=express();
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());
app.use('/api',routes);

const PORT=process.env.PORT || 5000;
app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  
app.listen(PORT, ()=> console.log(`Auth service running of Port ${PORT}`));