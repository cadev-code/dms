import z from 'zod';

export const createUserSchema = z.object({
  fullname: z
    .string()
    .min(8, 'Debe tener al menos 8 caracteres')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo se permiten letras y espacios'),
  username: z
    .string()
    .regex(/^[a-z0-9.@-]{4,}$/, 'Nombre de usuario inválido.'),
  role: z.enum(['SUPER_ADMIN', 'CONTENT_ADMIN', 'USER']),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*]).{8,}$/,
      'Contraseña inválida o incorrecta.',
    ),
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
