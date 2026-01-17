import { useLogout } from '@/hooks/useLogout';
import { useAllFolders } from '@/hooks/useAllFolders';
import { FolderTree } from '@/components/dms/FolderTree';

import {
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Settings,
  LogOut,
  Shield,
  User,
  Presentation,
  Image,
  Plus,
  Folder,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '../ui/input';
import React, { useState } from 'react';
import { useCreateFolder } from '@/hooks/useCreateFolder';

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  documentCounts: Record<string, number>;
}

const user = { name: 'Administrador' };
const isAdmin = true;

export const Sidebar = ({
  activeFilter,
  onFilterChange,
  documentCounts,
}: Props) => {
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isAddingRoot, setIsAddingRoot] = useState<boolean>(false);

  const filters = [
    {
      id: 'all',
      label: 'Todos',
      icon: FolderOpen,
      count: documentCounts.all || 0,
    },
    { id: 'pdf', label: 'PDF', icon: FileText, count: documentCounts.pdf || 0 },
    {
      id: 'word',
      label: 'Word',
      icon: FileText,
      count: documentCounts.word || 0,
    },
    {
      id: 'excel',
      label: 'Excel',
      icon: FileSpreadsheet,
      count: documentCounts.excel || 0,
    },
    {
      id: 'powerpoint',
      label: 'PowerPoint',
      icon: Presentation,
      count: documentCounts.powerpoint || 0,
    },
    {
      id: 'image',
      label: 'Imágenes',
      icon: Image,
      count: documentCounts.image || 0,
    },
  ];

  const logout = useLogout();
  const { data: folders } = useAllFolders();
  const createFolder = useCreateFolder();

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (newFolderName.trim() === '') return;

      createFolder.mutate({
        folderName: newFolderName.trim(),
        parentId: null,
      });

      setIsAddingRoot(false);
      setNewFolderName('');
    }
  };

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sidebar-primary">
            <FolderOpen className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">DMS</h1>
            <p className="text-xs text-sidebar-foreground/60">
              Sistema de Gestión Documental
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* User info */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
          <div className="p-2 rounded-full bg-sidebar-primary/20">
            {isAdmin ? (
              <Shield className="h-4 w-4 text-sidebar-primary" />
            ) : (
              <User className="h-4 w-4 text-sidebar-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <Badge
              variant="outline"
              className={`text-xs ${
                isAdmin
                  ? 'border-sidebar-primary text-sidebar-primary'
                  : 'border-sidebar-foreground/40 text-sidebar-foreground/60'
              }`}
            >
              {isAdmin ? 'Administrador' : 'Usuario'}
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Filters */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
          Tipos de archivo
        </p>
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant="ghost"
            className={`w-full justify-start gap-3 ${
              activeFilter === filter.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-emerald-500 hover:text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
            onClick={() => onFilterChange(filter.id)}
          >
            <filter.icon className="h-4 w-4" />
            <span className="flex-1 text-left">{filter.label}</span>
            <Badge
              variant="secondary"
              className="bg-sidebar-accent text-sidebar-foreground/70 text-xs"
            >
              {filter.count}
            </Badge>
          </Button>
        ))}

        <Separator className="my-4 bg-sidebar-border" />

        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
            Repositorio
          </p>
          {isAdmin && !isAddingRoot && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-green-500"
              onClick={() => setIsAddingRoot(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isAddingRoot && (
          <div className="flex items-center gap-2 py-1.5 px-2">
            <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nueva carpeta..."
              className="h-7 text-sm flex-1 bg-sidebar-accent border-sidebar-border"
              autoFocus
              onBlur={() => {
                setIsAddingRoot(false);
                setNewFolderName('');
              }}
              onKeyDown={handleInputKeyDown}
            />
          </div>
        )}

        {folders?.data && (
          <FolderTree
            folders={folders.data}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        )}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Footer actions */}
      <div className="p-4 space-y-1">
        {isAdmin && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <Settings className="h-4 w-4" />
            Configuración
          </Button>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-red-400 hover:bg-destructive/10"
          onClick={() => logout.mutate()}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
};
