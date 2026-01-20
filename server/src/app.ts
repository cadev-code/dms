import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Ensure TypeScript loads the Express.Request augmentation (type-only, no runtime import)
import type {} from './types/express';

import authRoutes from './routes/auth.routes';
import filesRoutes from './routes/files.routes';
import foldersRoutes from './routes/folders.routes';

import { errorHandler } from './middlewares/errorHandler';
import path from 'path';

const app = express();
const PORT = 8080;

dotenv.config(); // Load environment variables

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // CORS configuration
app.use(cookieParser()); // Middleware for parsing cookies

app.use(express.json()); // Middleware for parsing JSON request bodies

app.use(authRoutes);
app.use(filesRoutes);
app.use(foldersRoutes);

app.use(errorHandler);

const uploadsPath = path.join(__dirname, '../uploads');
app.use('/documents', express.static(uploadsPath));

app.listen(PORT, () => {});
