import {
  type SortingState,
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { Document } from '@/types/document.types';

import {
  FileText,
  FileSpreadsheet,
  File,
  Eye,
  Download,
  Trash2,
  Image,
  ArrowDown,
  ArrowUp,
  ArrowDownUp,
  Presentation,
  Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface DocumentListProps {
  documents: Document[];
  isAdmin?: boolean;
  onDelete?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
  onView: (doc: Document) => void;
}

export function DocumentList({
  documents,
  isAdmin = false,
  onDelete,
  onDownload,
  onView,
}: DocumentListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-destructive" />;
      case 'word':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-sky-500" />;
      case 'powerpoint':
        return <Presentation className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'word':
        return 'Word';
      case 'excel':
        return 'Excel';
      case 'image':
        return 'Imagen';
      case 'powerpoint':
        return 'PowerPoint';
      default:
        return 'Archivo';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: 'documentName',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Documento
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
        <div className="flex items-center gap-3">
          {getDocumentIcon(row.original.type)}
          <div className="min-w-0">
            <p className="font-medium truncate">{row.original.documentName}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Tipo
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
        <Badge variant="outline">{getTypeLabel(row.original.type)}</Badge>
      ),
    },
    {
      accessorKey: 'size',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Tamaño
          {column.getIsSorted() === 'asc' ? (
            <ArrowDown className="text-primary" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowUp className="text-primary" />
          ) : (
            <ArrowDownUp />
          )}
        </Button>
      ),
      cell: ({ row }) => <>{formatFileSize(row.original.size)}</>,
    },
    {
      id: 'actions',
      header: () => <div className="text-end pr-2">Acciones</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDownload?.(row.original)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(row.original)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: documents,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (documents.length === 0) {
    return (
      <div className="text-center w-full py-20">
        <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No hay documentos disponibles</p>
      </div>
    );
  }

  return (
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
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-muted/30">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
