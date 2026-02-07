import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

import { useCreateUser } from '@/hooks/useCreateUser';
import { User } from '@/types/user.types';

import { Button } from '../ui/button';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useUpdateUser } from '@/hooks/useUpdateUser';

interface Props {
  editUser: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const userSchema = z.object({
  fullname: z
    .string()
    .min(8, 'Debe tener al menos 8 caracteres.')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo se permiten letras y espacios.'),
  username: z
    .string()
    .regex(
      /^[a-z0-9.@-]{4,}$/,
      'Debe tener al menos 4 caracteres y solo puede contener letras minúsculas, números, puntos, guiones o arrobas.',
    ),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*]).{8,}$/,
      'Debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales (!@#$%&*).',
    ),
  role: z.enum(['SUPER_ADMIN', 'CONTENT_ADMIN', 'USER']),
});

export const UserEditorDialog = ({ editUser, isOpen, onClose }: Props) => {
  const isEdit = !!editUser;

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const form = useForm({
    defaultValues: {
      fullname: '',
      username: '',
      password: '',
      role: 'USER' as User['role'],
    },
    validators: {
      onSubmit: userSchema,
      onChange: userSchema,
    },
    onSubmit: (values) => {
      if (isEdit) {
        updateUser.mutate(
          {
            userId: editUser.id,
            fullname: values.value.fullname,
            role: values.value.role,
          },
          {
            onSuccess: () => {
              onClose();
            },
          },
        );
      } else {
        createUser.mutate(values.value, {
          onSuccess: () => {
            onClose();
          },
        });
      }
    },
  });

  useEffect(() => {
    if (editUser) {
      form.reset({
        fullname: editUser.fullname,
        username: editUser.username,
        password: 'Password0*',
        role: editUser.role,
      });
    } else {
      form.reset();
    }
  }, [editUser, form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? (
              <>
                Modificar los datos de <strong>{editUser.fullname}</strong>
              </>
            ) : (
              'Crear un nuevo usuario en el sistema'
            )}
          </DialogDescription>
        </DialogHeader>
        <form
          id="user-editor"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="fullname"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>Nombre</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Nombre Completo"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
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
              name="username"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Usuario</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="username"
                      value={field.state.value}
                      disabled={isEdit} // no se puede editar el username
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          {!isEdit && (
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
          )}
          <FieldGroup>
            <form.Field
              name="role"
              children={(child) => (
                <Field>
                  <FieldLabel htmlFor={child.name}>Rol</FieldLabel>
                  <Select
                    value={child.state.value}
                    onValueChange={(v: User['role']) => child.handleChange(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">
                        Super Administrador
                      </SelectItem>
                      <SelectItem value="CONTENT_ADMIN">
                        Administrador de Contenido
                      </SelectItem>
                      <SelectItem value="USER">Usuario</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit]}>
            {([canSubmit]) => (
              <Button
                type="submit"
                form="user-editor"
                disabled={!canSubmit} // deshabilitado si el form NO es válido
              >
                Guardar
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
