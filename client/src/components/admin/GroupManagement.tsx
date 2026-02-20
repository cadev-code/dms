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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { GroupMembersDialog } from './GroupMembersDialog';
import { useDeleteGroup } from '@/hooks/useDeleteGroup';
import { GroupEditorDialog } from './GroupEditorDialog';

export const GroupManagement = () => {
  const [membersGroup, setMembersGroup] = useState<Group | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);

  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);

  const { data } = useGroups();
  const groups = data?.data || [];
  const deleteGroup = useDeleteGroup();

  const handleEdit = (group: Group) => {
    setIsEditorOpen(true);
    setEditGroup(group);
  };

  const handleDelete = async () => {
    if (!deleteGroupId) return;

    await deleteGroup.mutate({ groupId: deleteGroupId });

    setDeleteGroupId(null);
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
        <Button onClick={() => setIsEditorOpen(true)}>
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

      <GroupEditorDialog
        isOpen={isEditorOpen}
        editGroup={editGroup}
        onClose={() => {
          setIsEditorOpen(false);
          setEditGroup(null);
        }}
      />

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
