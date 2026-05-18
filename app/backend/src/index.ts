import express, { type NextFunction, type Request, type Response } from 'express';
import { env } from './config/env';
import authRoutes from './modules/auth/auth.routes';
import { AppError } from './shared/errors/app-error';

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, 'Route not found.'));
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal Server Error';

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
});

const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
