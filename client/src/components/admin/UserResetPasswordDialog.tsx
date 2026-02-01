import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

import type { User } from '@/types/user.types';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';

interface Props {
  changePasswordUser: User | null;
  setChangePasswordUser: (user: User | null) => void;
}

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

export const UserResetPasswordDialog = ({
  changePasswordUser,
  setChangePasswordUser,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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
      console.log('Changing password for user:', {
        id: changePasswordUser?.id,
        newPassword: values.value.password,
        newPasswordConfirmation: values.value.passwordConfirmation,
      });

      form.reset();
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <Dialog
      open={!!changePasswordUser}
      onOpenChange={() => setChangePasswordUser(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>
            Aplicar al usuario: <strong>{changePasswordUser?.fullname}</strong>
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-2">
          La contraseña debe contener al menos 8 caracteres, incluyendo una
          letra mayúscula, una letra minúscula, un número y un carácter especial
          (!@#$%&*).
        </p>

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

        <DialogFooter>
          <Button variant="outline" onClick={() => setChangePasswordUser(null)}>
            Cancelar
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit]}>
            {([canSubmit]) => (
              <Button type="submit" form="reset-password" disabled={!canSubmit}>
                Guardar
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
