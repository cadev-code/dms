import { useState } from 'react';

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useEnableUser } from '@/hooks/useEnableUser';
import { UserEditorDialog } from './UserEditorDialog';

export const UserManagement = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserType | null>(null);

  const [changePasswordUser, setChangePasswordUser] = useState<UserType | null>(
    null,
  );
  const [userToDisable, setUserToDisable] = useState<UserType | null>(null);
  const [userToEnable, setUserToEnable] = useState<UserType | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);

  const { data } = useUsers();
  const users = data?.data || [];
  const disableUser = useDisableUser();
  const enableUser = useEnableUser();
  console.log(users);

  const handleEdit = (user: UserType) => {
    setIsEditorOpen(true);
    setEditUser(user);
  };

  const handleDisableConfirm = () => {
    if (userToDisable) {
      disableUser.mutate({ userId: userToDisable.id });
    }
  };

  const handleEnableConfirm = () => {
    if (userToEnable) {
      enableUser.mutate({ userId: userToEnable.id });
    }
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
                      : setUserToEnable(row.original)
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

      <UserEditorDialog
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditUser(null);
        }}
        editUser={editUser}
      />

      <UserResetPasswordDialog
        changePasswordUser={changePasswordUser}
        setChangePasswordUser={setChangePasswordUser}
      />

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

      <AlertDialog
        open={!!userToEnable}
        onOpenChange={() => setUserToEnable(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Habilitar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción habilitará al usuario{' '}
              <strong>{userToEnable?.fullname}</strong> y podrá iniciar sesión
              en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEnableConfirm}
              className="bg-green-500 text-white hover:bg-green-500/90"
            >
              Habilitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
