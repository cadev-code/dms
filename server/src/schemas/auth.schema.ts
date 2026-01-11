import { z } from 'zod';

const username = z
  .string()
  .min(4)
  .regex(/^[a-z.@]+$/, 'Solo se permiten letras minúsculas, puntos y @');

const password = z
  .string()
  .min(8)
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial');

export const loginSchema = z.object({
  username,
  password,
});

export type LoginBody = z.infer<typeof loginSchema>;
