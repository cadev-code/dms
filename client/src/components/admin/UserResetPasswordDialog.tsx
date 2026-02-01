import { useState } from 'react';

import { User } from '@/types/user.types';

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
import { Label } from '../ui/label';

interface Props {
  changePasswordUser: User | null;
  setChangePasswordUser: (user: User | null) => void;
}

export const UserResetPasswordDialog = ({
  changePasswordUser,
  setChangePasswordUser,
}: Props) => {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  const handleChangePassword = () => {
    console.log('Changing password for user:', {
      id: changePasswordUser?.id,
      newPassword,
      newPasswordConfirmation,
    });

    setChangePasswordUser(null);
    setNewPassword('');
    setNewPasswordConfirmation('');
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
            Cambiar la contraseña del usuario{' '}
            <strong>{changePasswordUser?.fullname}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva Contraseña</Label>
            <Input
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password-confirmation">
              Confirmar Nueva Contraseña
            </Label>
            <Input
              id="new-password-confirmation"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setChangePasswordUser(null)}>
            Cancelar
          </Button>
          <Button
            onClick={handleChangePassword}
            disabled={
              !newPassword.trim() ||
              !newPasswordConfirmation.trim() ||
              newPassword !== newPasswordConfirmation
            }
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
