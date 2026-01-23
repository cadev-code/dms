import path from 'path';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma_client';
import { AppError } from '../utils/AppError';
import { removeUploadedFile } from '../helpers/removeUploadedFile';
import { logger } from '../helpers/logger';

import {
  EditFileBody,
  mutateFileParamsSchema,
  UploadFileBody,
} from '../schemas/files.schema';
import { convertToPdf } from '../helpers/convertToPdf';

const getType = (mimetype: string) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf') return 'pdf';
  if (
    mimetype === 'application/msword' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
    return 'word';
  if (
    mimetype === 'application/vnd.ms-excel' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
    return 'excel';
  if (
    mimetype === 'application/vnd.ms-powerpoint' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  )
    return 'powerpoint';
  return 'other';
};

export const uploadFile = async (
  req: Request<object, object, UploadFileBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
    });

    const { documentName, folderId, ticketNumber } = req.body;

    const existingFolder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!existingFolder) {
      throw new AppError(
        `La carpeta especificada no existe`,
        400,
        'FOLDER_NOT_FOUND',
        `Intento de carga de archivo fallido - La carpeta especificada no existe - folderId: ${folderId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const file = req.file;

    if (!file) {
      throw new AppError(
        `Archivo no proporcionado`,
        400,
        'FILE_NOT_PROVIDED',
        `Intento de carga de archivo fallido - No se proporciono ningún archivo (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const { filename, mimetype, size, path: filePath } = file;
    const type = getType(mimetype);

    const existingFile = await prisma.file.findFirst({
      where: {
        documentName: documentName,
        folderId,
      },
    });

    if (existingFile) {
      removeUploadedFile(filePath);

      throw new AppError(
        `El archivo ya existe`,
        400,
        'FILE_ALREADY_EXISTS',
        `Intento de carga de archivo fallido - El archivo ya existe (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const uploadsDir = path.join(__dirname, '../../uploads');

    let previewFileName: string | null = null;

    if (type === 'word' || type === 'excel' || type === 'powerpoint') {
      try {
        const pdfFileName = await convertToPdf(filePath, uploadsDir);
        previewFileName = pdfFileName;
      } catch (error) {
        logger.error(
          `Error al convertir el archivo a PDF para vista previa - ${filename} (Intentado por: ${user?.username || 'Unknown'}) - ${error}`,
        );
      }
    }

    await prisma.file.create({
      data: {
        documentName,
        fileName: filename,
        previewFileName,
        type,
        size,
        folderId,
        ticketNumber,
      },
    });

    logger.info(
      `Archivo cargado exitosamente - ${filename} (Cargado por: ${user?.username || 'Unknown'})`,
    );

    res
      .status(201)
      .json({ error: null, message: 'Archivo cargado exitosamente' });
  } catch (error) {
    removeUploadedFile(req.file?.path || '');
    next(error);
  }
};

export const getAllFiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { groups: true },
    });

    let files = [];

    if (user?.role !== 'USER') {
      // si el usuario es admin
      files = await prisma.file.findMany({
        orderBy: { fileName: 'asc' },
      });
    } else {
      // si el usuario es user
      const groupsIds = user.groups.map(({ groupId }) => groupId);

      const filePermissions = await prisma.fileGroupPermission.findMany({
        where: { groupId: { in: groupsIds } },
      });

      const foldersIds = filePermissions.map(({ fileId }) => fileId);

      files = await prisma.file.findMany({
        where: {
          id: { in: foldersIds },
        },
        orderBy: { fileName: 'asc' },
      });
    }

    logger.info(
      `Recuperación de todos los archivos realizada por el usuario: ${user?.username || 'Unknown'}`,
    );

    res.status(200).json({ error: null, data: files });
  } catch (error) {
    next(error);
  }
};

export const getFilesByType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { groups: true },
    });

    let files = [];

    if (user?.role !== 'USER') {
      // si el usuario es admin
      files = await prisma.file.findMany({
        where: {
          type: req.params.type,
        },
      });
    } else {
      // si el usuario es user
      const groupsIds = user.groups.map(({ groupId }) => groupId);

      const filePermissions = await prisma.fileGroupPermission.findMany({
        where: { groupId: { in: groupsIds } },
      });

      const foldersIds = filePermissions.map(({ fileId }) => fileId);

      files = await prisma.file.findMany({
        where: {
          AND: [{ type: req.params.type }, { id: { in: foldersIds } }],
        },
        orderBy: { fileName: 'asc' },
      });
    }

    logger.info(
      `Recuperación de archivos por tipo (${req.params.type}) realizada por el usuario: ${user?.username || 'Unknown'}`,
    );

    res.status(200).json({ error: null, data: files });
  } catch (error) {
    next(error);
  }
};

export const getFilesByFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { groups: true },
    });

    let files = [];

    if (user?.role !== 'USER') {
      // si el usuario es admin
      files = await prisma.file.findMany({
        where: {
          folderId: Number(req.params.folderId),
        },
      });
    } else {
      // si el usuario es user
      const groupsIds = user.groups.map(({ groupId }) => groupId);

      const filePermissions = await prisma.fileGroupPermission.findMany({
        where: { groupId: { in: groupsIds } },
      });

      const foldersIds = filePermissions.map(({ fileId }) => fileId);

      files = await prisma.file.findMany({
        where: {
          AND: [
            { folderId: Number(req.params.folderId) },
            { id: { in: foldersIds } },
          ],
        },
        orderBy: { fileName: 'asc' },
      });
    }

    logger.info(
      `Recuperación de archivos por folder (${req.params.folderId}) realizada por el usuario: ${user?.username || 'Unknown'}`,
    );

    res.status(200).json({ error: null, data: files });
  } catch (error) {
    next(error);
  }
};

export const editFile = async (
  req: Request<object, object, EditFileBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { documentId } = mutateFileParamsSchema.parse(req.params);
    const { documentName, ticketNumber } = req.body;

    const existingFile = await prisma.file.findUnique({
      where: { id: documentId },
    });

    if (!existingFile) {
      throw new AppError(
        `El archivo no existe.`,
        400,
        'FILE_NOT_FOUND',
        `Intento de renombrar archivo fallido - Archivo no encontrado - documentId: ${documentId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const existingFileWithName = await prisma.file.findFirst({
      where: {
        documentName,
        folderId: existingFile.folderId,
        NOT: { id: documentId },
      },
    });

    if (existingFileWithName) {
      throw new AppError(
        `Ya existe un archivo con el nombre "${documentName}" en esta ubicación.`,
        400,
        'FILE_ALREADY_EXISTS',
        `Intento de renombrar archivo fallido - Nombre de archivo duplicado (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.file.update({
      where: { id: documentId },
      data: { documentName, ticketNumber },
    });

    logger.info(
      `Archivo renombrado exitosamente - ID: ${documentId}, Nuevo Nombre: ${documentName} (Renombrado por: ${user?.username || 'Unknown'})`,
    );

    res
      .status(200)
      .json({ error: null, message: 'Archivo renombrado exitosamente' });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { documentId } = mutateFileParamsSchema.parse(req.params);

    const existingFile = await prisma.file.findUnique({
      where: { id: documentId },
    });

    if (!existingFile) {
      throw new AppError(
        `El archivo no existe.`,
        400,
        'FILE_NOT_FOUND',
        `Intento de eliminar archivo fallido - Archivo no encontrado - documentId: ${documentId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    removeUploadedFile(
      path.join(__dirname, '../../uploads', existingFile.fileName),
    );

    if (existingFile.previewFileName) {
      removeUploadedFile(
        path.join(__dirname, '../../uploads', existingFile.previewFileName),
      );
    }

    await prisma.file.delete({
      where: { id: documentId },
    });

    logger.info(
      `Archivo eliminado exitosamente - ID: ${documentId}, Nombre: ${existingFile.documentName} (Eliminado por: ${user?.username || 'Unknown'})`,
    );

    res
      .status(200)
      .json({ error: null, message: 'Archivo eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { documentId } = mutateFileParamsSchema.parse(req.params);

    const existingFile = await prisma.file.findUnique({
      where: { id: documentId },
    });

    if (!existingFile) {
      throw new AppError(
        `El archivo no existe.`,
        400,
        'FILE_NOT_FOUND',
        `Intento de descarga de archivo fallido - Archivo no encontrado - documentId: ${documentId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const uploadsDir = path.join(__dirname, '../../uploads');
    const filePath = path.join(uploadsDir, existingFile.fileName);

    if (!fs.existsSync(filePath)) {
      throw new AppError(
        `El archivo no se encuentra en el servidor.`,
        400,
        'FILE_MISSING_ON_SERVER',
        `Intento de descarga de archivo fallido - Archivo faltante en el servidor - documentId: ${documentId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    res.download(
      filePath,
      `${existingFile.documentName}.${existingFile.fileName.split('.').pop()}`,
      (err) => {
        if (err) {
          return next(err);
        }
      },
    );
  } catch (error) {
    next(error);
  }
};
