import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import type { Folder as FolderType } from '@/types/folder.types';
import { useCreateFolder } from '@/hooks/useCreateFolder';
import { Folder, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { FolderTreeItem } from './FolderTreeItem';

interface FolderTreeProps {
  activeFilter: string;
  folders: FolderType[];
  isAdmin: boolean;
  onFilterChange: (filter: string) => void;
}

export const FolderTree = ({
  activeFilter,
  folders,
  isAdmin,
  onFilterChange,
}: FolderTreeProps) => {
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isAddingRoot, setIsAddingRoot] = useState<boolean>(false);

  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(() => {
    const stored = localStorage.getItem('dms-expanded-folders');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const createFolder = useCreateFolder();

  const isExpanded = (folderId: number) => {
    return expandedFolders.has(folderId);
  };

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

  const handleExpandedFolder = (folder: FolderType) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folder.id)) {
        next.delete(folder.id);
      } else {
        next.add(folder.id);
      }
      return next;
    });
  };

  useEffect(() => {
    localStorage.setItem(
      'dms-expanded-folders',
      JSON.stringify([...expandedFolders]),
    );
  }, [expandedFolders]);

  return (
    <>
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

      <div className="space-y-0.5">
        {folders.map((folder) => (
          <FolderTreeItem
            activeFilter={activeFilter}
            folder={folder}
            isExpanded={isExpanded}
            key={folder.id}
            level={0}
            onFolderClick={onFilterChange}
            onFolderExpanded={handleExpandedFolder}
          />
        ))}
      </div>
    </>
  );
};
