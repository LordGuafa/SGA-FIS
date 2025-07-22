import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import adminRouter from './routes/admin.routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/culturapp/admin', adminRouter);

export default app;