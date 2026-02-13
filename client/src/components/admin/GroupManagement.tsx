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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useGroups } from '@/hooks/useGroups';
import { useCreateGroup } from '@/hooks/useCreateGroup';
import { GroupMembersDialog } from './GroupMembersDialog';
import { useUpdateGroup } from '@/hooks/useUpdateGroup';
// import { Checkbox } from '@/components/ui/checkbox';

export const GroupManagement = () => {
  const [membersGroup, setMembersGroup] = useState<Group | null>(null);

  const [formName, setFormName] = useState('');
  const [editGroup, setEditGroup] = useState<Group | null>(null);

  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);

  const createGroup = useCreateGroup();
  const { data } = useGroups();
  const groups = data?.data || [];
  const updateGroup = useUpdateGroup();

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

  const handleCreate = async () => {
    if (!formName.trim()) return;

    await createGroup.mutate({ name: formName });

    setIsCreateOpen(false);
    setFormName('');
  };

  const handleUpdate = async () => {
    if (!editGroup || !formName.trim()) return;

    if (editGroup.name === formName.trim()) {
      setEditGroup(null);
      setFormName('');
      return;
    }

    await updateGroup.mutate({ groupId: editGroup.id, name: formName });

    setEditGroup(null);
    setFormName('');
  };

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

      <GroupMembersDialog
        isOpen={!!membersGroup}
        group={membersGroup}
        onClose={() => setMembersGroup(null)}
      />

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
