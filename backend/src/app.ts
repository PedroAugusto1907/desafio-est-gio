import express from 'express';
import accountRoutes from './routes/accountRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use('/api', accountRoutes);
app.use(errorHandler);

export default app;
