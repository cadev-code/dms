import z from 'zod';

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre del grupo debe tener al menos 3 caracteres')
    .max(50, 'El nombre del grupo no puede exceder los 50 caracteres'),
});

export type CreateGroupBody = z.infer<typeof createGroupSchema>;
