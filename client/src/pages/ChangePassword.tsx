import { useState } from 'react';
import { Navigate } from 'react-router';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useResetPassword } from '@/hooks/useResetPassword';

import { Lock, Eye, EyeOff, KeyRound, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const formSchema = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*]).{8,}$/,
        'La contraseña no cumple con los requisitos.',
      ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Las contraseñas no coinciden.',
  });

export const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const resetPassword = useResetPassword();

  const form = useForm({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
    validators: {
      onSubmit: formSchema,
      onChange: formSchema,
    },
    onSubmit: (values) => {
      if (!currentUser) return;

      resetPassword.mutate(
        {
          userId: currentUser?.userId,
          password: values.value.password,
          mustChangePassword: false,
        },
        {
          onSuccess: () => {
            form.reset();
          },
        },
      );
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  if (!currentUser?.mustChangePassword) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 mb-4">
            <FolderOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">DMS</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de Gestión Documental
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              <div className="flex gap-2 justify-center items-center">
                <KeyRound className="h-5 w-5 text-primary" />
                Cambiar Contraseña
              </div>
            </CardTitle>
            <CardDescription className="text-center">
              <span className="font-semibold">{currentUser?.fullname}</span>,
              por seguridad, debes establecer una nueva contraseña para
              continuar usando el sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground mb-4">
              <p className="font-medium mb-1">Requisitos de la contraseña:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mínimo 8 caracteres</li>
                <li>Al menos una letra mayúscula</li>
                <li>Al menos una letra minúscula</li>
                <li>Al menos un número</li>
                <li>Al menos un carácter especial (!@#$%&*)</li>
              </ul>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-4"
              id="reset-password"
            >
              <FieldGroup>
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-10 pr-10"
                            id={field.name}
                            name={field.name}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
                            onClick={() => setShowPassword((v) => !v)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              <FieldGroup>
                <form.Field
                  name="passwordConfirmation"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Confirmar Contraseña
                        </FieldLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-10 pr-10"
                            id={field.name}
                            name={field.name}
                            type={showPasswordConfirm ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
                            onClick={() => setShowPasswordConfirm((v) => !v)}
                          >
                            {showPasswordConfirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-end">
              <form.Subscribe selector={(state) => [state.canSubmit]}>
                {([canSubmit]) => (
                  <Button
                    type="submit"
                    form="reset-password"
                    disabled={!canSubmit}
                  >
                    Guardar Cambios
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          © 2026 DMS. Sistema de Gestión Documental.
        </p>
      </div>
    </div>
  );
};
