import z from 'zod';

export const uploadFileSchema = z.object({
  documentName: z.string().min(1, 'File name is required'),
  folderId: z.coerce
    .number({ invalid_type_error: 'folderId debe ser un número' })
    .int('folderId debe ser un número entero')
    .positive('folderId debe ser un entero positivo'),
});

export type UploadFileBody = z.infer<typeof uploadFileSchema>;

export const filesByTypeParamSchema = z.object({
  type: z.enum(['pdf', 'image', 'word', 'excel', 'powerpoint'], {
    errorMap: () => ({ message: 'Tipo de archivo inválido' }),
  }),
});

export const filesByFolderParamSchema = z.object({
  folderId: z.coerce
    .number({ invalid_type_error: 'folderId debe ser un número' })
    .int('folderId debe ser un número entero'),
});

export const mutateFileParamsSchema = z.object({
  fileId: z.coerce
    .number({ invalid_type_error: 'Id debe debe ser un número' })
    .int('Id debe ser un número entero'),
});

export const renameFileSchema = z.object({
  documentName: z.string().min(1, 'Nombre de carpeta es obligatorio'),
});

export type RenameFileBody = z.infer<typeof renameFileSchema>;
