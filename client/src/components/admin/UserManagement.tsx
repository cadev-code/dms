import { useState } from 'react';
import type { User as UserType } from '@/types/auth.types';

import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  Ban,
  KeyRound,
  Pencil,
  Plus,
  Shield,
  User,
  Users,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog } from '@radix-ui/react-dialog';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

export const UserManagement = () => {
  const [users, setUsers] = useState<UserType[]>([
    {
      id: 1,
      fullname: 'Carlos Alberto Escobedo Moreno',
      username: 'cescobedo',
      role: 'SUPER_ADMIN',
    },
  ]);

  const [changePasswordUser, setChangePasswordUser] = useState<UserType | null>(
    null,
  );
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editUserName, setEditUserName] = useState('');
  const [editRole, setEditRole] = useState<UserType['role']>('USER');
  const [editPassword, setEditPassword] = useState('');

  const [disableUser, setDisableUser] = useState<UserType | null>(null);

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

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditUser(null);
    setEditFullName('');
    setEditUserName('');
    setEditRole('USER');
  };

  const handleEdit = (user: UserType) => {
    setIsEditorOpen(true);
    setEditUser(user);
    setEditFullName(user.fullname);
    setEditRole(user.role);
  };

  const handleDisableConfirm = () => {
    console.log('Disabling user:', disableUser?.fullname);
  };

  const handleSave = async () => {
    if (!editUser) return;

    console.log('Saving user:', {
      id: editUser.id,
      fullname: editFullName,
      role: editRole,
    });

    setEditUser(null);
    setEditFullName('');
    setEditRole('USER');
  };

  const columns: ColumnDef<UserType>[] = [
    {
      accessorKey: 'fullname',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Nombre
          {column.getIsSorted() === 'asc' ? (
            <ArrowDown className="text-primary" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowUp className="text-primary" />
          ) : (
            <ArrowDownUp />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-muted">
            {row.original.role !== 'USER' ? (
              <Shield className="h-4 w-4 text-primary" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          {row.original.fullname}
        </div>
      ),
    },
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Usuario
          {column.getIsSorted() === 'asc' ? (
            <ArrowDown className="text-primary" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowUp className="text-primary" />
          ) : (
            <ArrowDownUp />
          )}
        </Button>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => (
        <Badge variant={row.original.role === 'USER' ? 'secondary' : 'default'}>
          {row.original.role === 'SUPER_ADMIN'
            ? 'Super Administrador'
            : row.original.role === 'CONTENT_ADMIN'
              ? 'Administrador de Contenido'
              : 'Usuario'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-end pr-2">Acciones</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setChangePasswordUser(row.original)}
            title="Cambiar contraseña"
          >
            <KeyRound className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            title="Editar usuario"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDisableUser(row.original)}
            title="Deshabilitar usuario"
          >
            <Ban className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Gestión de Usuarios
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Administra los usuarios del sistema y sus roles
          </p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden w-full">
        <Table className="full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No se encontraron usuarios
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditorOpen} onOpenChange={closeEditor}>
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
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
              />
            </div>
            {editUser === null && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
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
                onValueChange={(v: UserType['role']) => setEditRole(v)}
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditor}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!editFullName.trim()}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button
              variant="outline"
              onClick={() => setChangePasswordUser(null)}
            >
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

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!disableUser}
        onOpenChange={() => setDisableUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deshabilitar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción deshabilitará al usuario{' '}
              <strong>{disableUser?.fullname}</strong> y no podrá iniciar sesión
              en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisableConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Deshabilitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
