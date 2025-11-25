import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './src/configs/db.js';
import userRouter from './src/routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// database connection
await connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});