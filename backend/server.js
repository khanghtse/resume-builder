import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './src/configs/db.js';
import userRouter from './src/routes/userRoutes.js';
import resumeRouter from './src/routes/resumeRoutes.js';
import aiRouter from './src/routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// database connection
await connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});