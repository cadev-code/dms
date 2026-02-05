import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma_client';
import { logger } from '../helpers/logger';
import ExcelJS from 'exceljs';

interface DocumentReport {
  documentName: string;
  ticketNumber: string | null;
  date: string;
  hour: string;
  folderPath: string;
}
const TIME_ZONE = 'America/Mexico_City';

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('es-MX', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const formatDate = (datetime: Date): string => {
  return dateFormatter.format(datetime);
};

const formatTime = (datetime: Date): string => {
  return timeFormatter.format(datetime);
};

const getFolderPath = async (documentId: number): Promise<string> => {
  const file = await prisma.file.findUnique({
    where: { id: documentId },
    include: { folder: true },
  });

  if (!file) {
    throw new Error('Documento no encontrado');
  }

  let folderPath = '';
  let currentFolder = file.folder;

  while (currentFolder) {
    folderPath = `/${currentFolder.folderName}${folderPath}`;
    if (currentFolder.parentId) {
      currentFolder = await prisma.folder.findUnique({
        where: { id: currentFolder.parentId },
      });
    } else {
      currentFolder = null;
    }
  }

  return folderPath;
};

const buildDocumentsReport = async (): Promise<DocumentReport[]> => {
  const files = await prisma.file.findMany();

  const documents: DocumentReport[] = await Promise.all(
    files.map(async (doc) => {
      const folderPath = await getFolderPath(doc.id);

      return {
        documentName: doc.documentName,
        ticketNumber: doc.ticketNumber,
        date: formatDate(doc.createdAt),
        hour: formatTime(doc.createdAt),
        folderPath,
      };
    }),
  );

  return documents;
};

export const getReportAllDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const documents = await buildDocumentsReport();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Documentos');

    worksheet.columns = [
      { header: 'Documento', key: 'documentName', width: 40 },
      { header: 'Número de Ticket', key: 'ticketNumber', width: 20 },
      { header: 'Fecha', key: 'date', width: 15 },
      { header: 'Hora', key: 'hour', width: 10 },
      { header: 'Ruta de Carpeta', key: 'folderPath', width: 60 },
    ];

    documents.forEach((doc) => {
      worksheet.addRow(doc);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = `reporte_documentos_${new Date()
      .toISOString()
      .replace(/[:.]/g, '-')}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    logger.info(
      `Reporte de todos los documentos exportado a XLSX (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.send(Buffer.from(buffer));
  } catch (error) {
    next(error);
  }
};
