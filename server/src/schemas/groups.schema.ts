import z from 'zod';

export const groupSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre del grupo debe tener al menos 3 caracteres')
    .max(50, 'El nombre del grupo no puede exceder los 50 caracteres'),
});

export type GroupBody = z.infer<typeof groupSchema>;

export const groupIdSchema = z.object({
  groupId: z.coerce
    .number({ invalid_type_error: 'groupId debe ser un número' })
    .int('groupId debe ser un número entero'),
});
