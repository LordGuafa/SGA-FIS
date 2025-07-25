import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import adminRouter from './routes/admin.routes';
import tutorRouter from './routes/tutor.routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/culturapp/admin', adminRouter);
app.use('/culturapp/tutor', tutorRouter);

//TODO: Faltan los componentes de los participantes para que consulten sus notas y asistencias, revisar las vistas en el archivo db/views.sql
export default app;