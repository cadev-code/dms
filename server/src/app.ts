import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Ensure TypeScript loads the Express.Request augmentation (type-only, no runtime import)
import type {} from './types/express';

import authRoutes from './routes/auth.routes';
import filesRoutes from './routes/files.routes';
import foldersRoutes from './routes/folders.routes';
import usersRoutes from './routes/users.routes';
import groupsRoutes from './routes/groups.routes';
import userGroupsRoutes from './routes/userGroups.routes';
import groupFoldersRoutes from './routes/groupFolders.routes';
import groupFilesRoutes from './routes/groupFiles.routes';

import { errorHandler } from './middlewares/errorHandler';
import path from 'path';

const app = express();
const PORT = 8080;

dotenv.config(); // Load environment variables

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
); // CORS configuration
app.use(cookieParser()); // Middleware for parsing cookies

if (process.env.NODE_ENV === 'production') {
  app.use((req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

    if (origin !== allowedOrigin) {
      res.status(403).json({ message: 'Origen no permitido' });
      return;
    }
    next();
  });
}

app.use(express.json()); // Middleware for parsing JSON request bodies

app.use(authRoutes);
app.use(filesRoutes);
app.use(foldersRoutes);
app.use(usersRoutes);
app.use(groupsRoutes);
app.use(userGroupsRoutes);
app.use(groupFoldersRoutes);
app.use(groupFilesRoutes);

app.use(errorHandler);

const uploadsPath = path.join(__dirname, '../uploads');
app.use('/documents', express.static(uploadsPath));

app.listen(PORT, () => {});
