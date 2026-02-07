import { useState } from 'react';

import { useCreateUser } from '@/hooks/useCreateUser';
import { useDisableUser } from '@/hooks/useDisableUser';
import { UserResetPasswordDialog } from './UserResetPasswordDialog';
import { useUsers } from '@/hooks/useUsers';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import type { User as UserType } from '@/types/user.types';

import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  Ban,
  CircleCheckBig,
  KeyRound,
  Pencil,
  Plus,
  Shield,
  User,
  Users,
} from 'lucide-react';
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
import { Badge } from '../ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export const UserManagement = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editUserName, setEditUserName] = useState('');
  const [editRole, setEditRole] = useState<UserType['role']>('USER');
  const [editPassword, setEditPassword] = useState('');

  const [changePasswordUser, setChangePasswordUser] = useState<UserType | null>(
    null,
  );
  const [userToDisable, setUserToDisable] = useState<UserType | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);

  const { data } = useUsers();
  const users = data?.data || [];
  const createUser = useCreateUser();
  const disableUser = useDisableUser();

  console.log(users);

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
    if (userToDisable) {
      disableUser.mutate({ userId: userToDisable.id });
    }
  };

  const handleSave = async () => {
    if (editUser === null) {
      createUser.mutate({
        fullname: editFullName,
        username: editUserName,
        role: editRole,
        password: editPassword,
      });
    } else {
      console.log('Updating user:', {
        id: editUser.id,
        fullname: editFullName,
        role: editRole,
      });
    }

    closeEditor();
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
            ) : row.original.isActive ? (
              <User className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Ban className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <p className={!row.original.isActive ? 'text-gray-500' : ''}>
            {row.original.fullname}
          </p>
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
      cell: ({ row }) => (
        <p className={!row.original.isActive ? 'text-gray-500' : ''}>
          {row.original.username}
        </p>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => (
        <Badge
          className={!row.original.isActive ? 'text-gray-500' : ''}
          variant={row.original.role === 'USER' ? 'secondary' : 'default'}
        >
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
          {row.original.role !== 'SUPER_ADMIN' && row.original.isActive && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="icon"
                    onClick={() => setChangePasswordUser(row.original)}
                  >
                    <KeyRound className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cambiar contraseña</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(row.original)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Editar usuario</TooltipContent>
              </Tooltip>
            </>
          )}
          {row.original.role !== 'SUPER_ADMIN' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    row.original.isActive
                      ? setUserToDisable(row.original)
                      : console.log('Enable user')
                  }
                >
                  {row.original.isActive ? (
                    <Ban className="h-4 w-4 text-destructive" />
                  ) : (
                    <CircleCheckBig className="h-4 w-4 text-green-500" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {row.original.isActive
                  ? 'Deshabilitar usuario'
                  : 'Habilitar usuario'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

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

      <UserResetPasswordDialog
        changePasswordUser={changePasswordUser}
        setChangePasswordUser={setChangePasswordUser}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!userToDisable}
        onOpenChange={() => setUserToDisable(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deshabilitar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción deshabilitará al usuario{' '}
              <strong>{userToDisable?.fullname}</strong> y no podrá iniciar
              sesión en el sistema.
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
