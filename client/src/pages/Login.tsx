import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';

import { Eye, EyeOff, FolderOpen, Lock, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';

const formSchema = z.object({
  username: z
    .string()
    .regex(/^[a-z0-9.@-]{4,}$/, 'Nombre de usuario inválido.'),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*]).{8,}$/,
      'Contraseña inválida o incorrecta.',
    ),
});

export const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
      onChange: formSchema,
    },
    onSubmit: () => {
      console.log('valid form');
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 mb-4">
            <FolderOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">DMS</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de Gestión Documental
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4" id="login">
              <FieldGroup>
                <form.Field
                  name="username"
                  children={(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Usuario</FieldLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-10"
                            id={field.name}
                            name={field.name}
                            type="text"
                            placeholder="username"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              <FieldGroup>
                <form.Field
                  name="password"
                  children={(field) => {
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
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
              <form.Subscribe selector={(state) => [state.canSubmit]}>
                {([canSubmit]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit} // deshabilitado si el form NO es válido
                  >
                    {[].length > 0 ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          © 2026 DMS. Sistema de Gestión Documental.
        </p>
      </div>
    </div>
  );
};
