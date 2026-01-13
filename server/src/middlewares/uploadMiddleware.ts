import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { AppError } from '../utils/AppError';
import prisma from '../prisma_client';

// Ruta del directorio de subidas
const uploadsDir = path.join(__dirname, '../../uploads');

// Crear el directorio una sola vez al cargar el servidor
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}-${sanitizedOriginalName}`);
  },
});

// Filtro de tipos MIME para un único campo de archivo
const createFileFilter =
  (allowedMimeTypes: string[]): multer.Options['fileFilter'] =>
  async (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    const user = await prisma.user.findFirst({
      where: {
        id: _req.userId,
      },
    });

    cb(
      new AppError(
        `Solo se permiten archivos en formato ${JSON.stringify(allowedMimeTypes)}"`,
        400,
        'FILE_FORMAT_INVALID',
        `Formato de archivo no permitido: ${file.mimetype} - Intentado por '${user?.username}'`,
      ),
    );
  };

// Middleware para subir un único archivo por petición
export const uploadMiddleware = (options: {
  fieldName: string;
  allowedMimeTypes: string[];
}) => {
  const { fieldName, allowedMimeTypes } = options;

  const upload = multer({
    storage,
    fileFilter: createFileFilter(allowedMimeTypes),
  });

  return upload.single(fieldName);
};
