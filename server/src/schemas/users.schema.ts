import z from 'zod';

export const createUserSchema = z.object({
  fullname: z.string().min(8),
  username: z.string().min(3),
  role: z.enum(['SUPER_ADMIN', 'CONTENT_ADMIN', 'USER']),
  password: z.string().min(8),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;

export const userIdSchema = z.object({
  userId: z.coerce
    .number({ invalid_type_error: 'userId debe ser un número' })
    .int('userId debe ser un número entero'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8),
  mustChangePassword: z.boolean().optional().default(true),
});

export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;
