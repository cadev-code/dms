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
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useEffect, useState } from 'react';
import { useCreateUser } from '@/hooks/useCreateUser';

interface Props {
  editUser: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserEditorDialog = ({ editUser, isOpen, onClose }: Props) => {
  const [editFullname, setEditFullname] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState<User['role']>('USER');
  const [editPassword, setEditPassword] = useState('');

  const createUser = useCreateUser();

  const handleSave = async () => {
    if (editUser === null) {
      createUser.mutate({
        fullname: editFullname,
        username: editUsername,
        role: editRole,
        password: editPassword,
      });
    } else {
      console.log('Updating user:', {
        id: editUser.id,
        fullname: editFullname,
        role: editRole,
      });
    }

    onClose();
  };

  const resetForm = () => {
    setEditFullname('');
    setEditUsername('');
    setEditRole('USER');
    setEditPassword('');
  };

  useEffect(() => {
    if (isOpen && editUser) {
      setEditFullname(editUser.fullname);
      setEditUsername(editUser.username);
      setEditRole(editUser.role);

      return;
    }

    resetForm();
  }, [isOpen, editUser]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription>
            {editUser ? (
              <>
                Modificar los datos de <strong>{editUser.fullname}</strong>
              </>
            ) : (
              'Crear un nuevo usuario en el sistema'
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullname">Nombre</Label>
            <Input
              id="fullname"
              value={editFullname}
              onChange={(e) => setEditFullname(e.target.value)}
            />
          </div>
          {editUser === null && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={editRole}
              onValueChange={(v: User['role']) => setEditRole(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPER_ADMIN">Super Administrador</SelectItem>
                <SelectItem value="CONTENT_ADMIN">
                  Administrador de Contenido
                </SelectItem>
                <SelectItem value="USER">Usuario</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!editFullname.trim()}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
