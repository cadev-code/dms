import {
  Users,
  Plus,
  Pencil,
  Trash2,
  UserPlus,
  ArrowDown,
  ArrowUp,
  ArrowDownUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Group } from '@/types/group.types';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
// import { Checkbox } from '@/components/ui/checkbox';

export const GroupManagement = () => {
  const [membersGroup, setMembersGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: 'Administradores' },
  ]);

  const [formName, setFormName] = useState('');
  const [editGroup, setEditGroup] = useState<Group | null>(null);

  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);

  const handleEdit = (group: Group) => {
    setEditGroup(group);
    setFormName(group.name);
  };

  const handleDelete = async () => {
    if (!deleteGroupId) return;

    console.log('Deleting group with id:', deleteGroupId);
    setDeleteGroupId(null);
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // // Form states
  // const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!formName.trim()) return;

    console.log('Creating group:', formName);

    setIsCreateOpen(false);
    setFormName('');
  };

  const handleUpdate = async () => {
    if (!editGroup || !formName.trim()) return;

    console.log('Updating group:', editGroup.id, formName);

    setEditGroup(null);
    setFormName('');
  };

  // const handleToggleMember = async (userId: string) => {
  //   if (!membersGroup) return;

  //   const members = getGroupMembers(membersGroup.id);
  //   const isMember = members.some((m) => m.user_id === userId);

  //   if (isMember) {
  //     await removeMember(membersGroup.id, userId);
  //   } else {
  //     await addMember(membersGroup.id, userId);
  //   }
  // };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center py-12">
  //       <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  //     </div>
  //   );
  // }

  const columns: ColumnDef<Group>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Grupo
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
      id: 'actions',
      header: () => <div className="text-end pr-2">Acciones</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMembersGroup(row.original)}
            title="Gestionar miembros"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            title="Editar grupo"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteGroupId(row.original.id)}
            title="Eliminar grupo"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: groups,
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
            Gestión de Grupos
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Crea y administra grupos de usuarios
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Grupo
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden w-full">
        <Table className="w-full">
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
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No se encontraron grupos
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

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Grupo</DialogTitle>
            <DialogDescription>
              Crea un grupo para asignar permisos a múltiples usuarios
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Grupo</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ej: Recursos Humanos"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!formName.trim()}>
              {/* {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} */}
              Crear Grupo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editGroup} onOpenChange={() => setEditGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Grupo</DialogTitle>
            <DialogDescription>
              Modifica la información del grupo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del Grupo</Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGroup(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={!formName.trim()}>
              {/* {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} */}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Members Dialog */}
      <Dialog open={!!membersGroup} onOpenChange={() => setMembersGroup(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Miembros de {membersGroup?.name}</DialogTitle>
            <DialogDescription>
              Selecciona los usuarios que pertenecen a este grupo
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            {/* <div className="space-y-2">
              {users.map((user) => {
                const isMember = membersGroup
                  ? getGroupMembers(membersGroup.id).some(
                      (m) => m.user_id === user.user_id,
                    )
                  : false;

                return (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer"
                    onClick={() => handleToggleMember(user.user_id)}
                  >
                    <Checkbox checked={isMember} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {user.role === 'admin' ? 'Admin' : 'Usuario'}
                    </Badge>
                  </div>
                );
              })}
            </div> */}
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setMembersGroup(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteGroupId}
        onOpenChange={() => setDeleteGroupId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el grupo y todos los permisos asociados. Los
              usuarios del grupo perderán acceso a las carpetas asignadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
