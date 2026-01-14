import z from 'zod';

export const uploadFileSchema = z.object({
  documentName: z.string().min(1, 'File name is required'),
});

export type UploadFileBody = z.infer<typeof uploadFileSchema>;
