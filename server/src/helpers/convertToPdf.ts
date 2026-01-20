import { execFile } from 'child_process';
import path from 'path';

const getLibreOfficePath = () => {
  // Producción (Windows): usarás LIBREOFFICE_PATH con la ruta completa a soffice.exe
  // Desarrollo (Linux): si no se define, usa 'soffice' del PATH
  return process.env.LIBREOFFICE_PATH || 'soffice';
};

export const convertToPdf = (
  inputPath: string,
  outputDir: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const sofficePath = getLibreOfficePath();

    execFile(
      sofficePath,
      ['--headless', '--convert-to', 'pdf', '--outdir', outputDir, inputPath],
      (error) => {
        if (error) {
          return reject(error);
        }

        const inputFileName = path.basename(inputPath);
        const baseName = inputFileName.replace(/\.[^/.]+$/, '');
        const outputFileName = `${baseName}.pdf`;
        resolve(outputFileName);
      },
    );
  });
};
