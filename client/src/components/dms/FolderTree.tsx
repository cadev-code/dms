import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import type { Folder as FolderType } from '@/types/folder.types';
import { FolderIcons } from './FolderIcons';
import { useCreateFolder } from '@/hooks/useCreateFolder';
import { Folder, Plus } from 'lucide-react';
import { Input } from '../ui/input';

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

  const handleFolderClick = (folder: FolderType) => {
    onFilterChange(`folder:${folder.id}`);

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

  const renderFolders = (nodes: FolderType[], depth = 0) => {
    return nodes.map((folder) => (
      <div key={folder.id} className="w-full">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 ${
            activeFilter === `folder:${folder.id}`
              ? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-emerald-500 hover:text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
          }`}
          onClick={() => handleFolderClick(folder)}
        >
          <div
            className="flex items-center gap-3 w-full"
            style={{ paddingLeft: 6 * (depth + 1) }}
          >
            <FolderIcons
              isExpanded={expandedFolders.has(folder.id)}
              hasChildren={folder.children && folder.children.length > 0}
            />
            <span
              className="flex-1 text-left truncate"
              title={folder.folderName}
            >
              {folder.folderName}
            </span>
          </div>
        </Button>
        {folder.children &&
          folder.children.length > 0 &&
          expandedFolders.has(folder.id) &&
          renderFolders(folder.children, depth + 1)}
      </div>
    ));
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

      {renderFolders(folders)}
    </>
  );
};
