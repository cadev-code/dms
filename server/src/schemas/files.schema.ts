import z from 'zod';

export const uploadFileSchema = z.object({
  documentName: z.string().min(1, 'File name is required'),
});

export type UploadFileBody = z.infer<typeof uploadFileSchema>;

export const filesParamSchema = z.object({
  type: z.enum(['pdf', 'image', 'word', 'excel', 'powerpoint'], {
    errorMap: () => ({ message: 'Tipo de archivo inválido' }),
  }),
});

export type FilesParam = z.infer<typeof filesParamSchema>;
