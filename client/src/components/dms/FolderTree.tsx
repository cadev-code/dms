import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Folder, ChevronRight, ChevronDown } from 'lucide-react';

import type { Folder as FolderType } from '@/types/folder.types';

interface FolderTreeProps {
  folders: FolderType[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FolderTree = ({
  folders,
  activeFilter,
  onFilterChange,
}: FolderTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(() => {
    const stored = localStorage.getItem('dms-expanded-folders');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(
      'dms-expanded-folders',
      JSON.stringify([...expandedFolders]),
    );
  }, [expandedFolders]);

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
            {folder.children && folder.children.length > 0 ? (
              expandedFolders.has(folder.id) ? (
                <ChevronDown />
              ) : (
                <ChevronRight />
              )
            ) : (
              <div className="pl-4"></div>
            )}
            <Folder className="h-4 w-4" />
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

  return <>{renderFolders(folders)}</>;
};
