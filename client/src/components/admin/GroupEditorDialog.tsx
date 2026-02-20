import { Group } from '@/types/group.types';
import { Button } from '../ui/button';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { useEffect } from 'react';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { useCreateGroup } from '@/hooks/useCreateGroup';
import { useUpdateGroup } from '@/hooks/useUpdateGroup';

interface Props {
  editGroup: Group | null;
  isOpen: boolean;
  onClose: () => void;
}

const groupSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre del grupo debe tener al menos 3 caracteres')
    .max(50, 'El nombre del grupo no puede exceder los 50 caracteres'),
});

export const GroupEditorDialog = ({ editGroup, isOpen, onClose }: Props) => {
  const isEdit = !!editGroup;

  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();

  const form = useForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onSubmit: groupSchema,
      onChange: groupSchema,
    },
    onSubmit: async (values) => {
      if (isEdit) {
        await updateGroup.mutate(
          {
            groupId: editGroup.id,
            name: values.value.name,
          },
          {
            onSuccess: () => {
              onClose();
            },
          },
        );
      } else {
        await createGroup.mutate(
          { name: values.value.name },
          {
            onSuccess: () => {
              onClose();
            },
          },
        );
      }
    },
  });

  useEffect(() => {
    form.reset({
      name: editGroup ? editGroup.name : '',
    });
  }, [isOpen, form, editGroup]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los detalles del grupo.'
              : 'Rellena el formulario para crear un nuevo grupo.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id="group-editor"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
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
                      placeholder="Nombre del Grupo"
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
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit]}>
            {([canSubmit]) => (
              <Button type="submit" form="group-editor" disabled={!canSubmit}>
                Guardar
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
