import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import mainRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API funcionando correctamente' });
});

app.use('/api', mainRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
