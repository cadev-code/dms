import { Folder } from '@/types/folder.types';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  ChevronDown,
  ChevronRight,
  Folder as FolderIcon,
  FolderOpen,
} from 'lucide-react';

interface Props {
  folder: Folder;
  isSelected: Folder | null;
  setIsSelected: (folder: Folder) => void;
}

export const FolderPickerItem = ({
  folder,
  isSelected,
  setIsSelected,
}: Props) => {
  const [expandedFolders, setExpandedFolders] = useState<number[]>([]);
  const isExpanded = (folderId: number) => expandedFolders.includes(folderId);

  const handleCollapsibleToggle = (folderId: number) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId],
    );
  };

  return (
    <Collapsible open={isExpanded(folder.id)}>
      <div
        className={cn(
          'rounded-md hover:bg-primary/5 cursor-pointer flex items-center px-2 py-2 space-x-1',
          isSelected?.id === folder.id && 'bg-primary/15',
        )}
        onClick={() => {
          setIsSelected(folder);
        }}
      >
        <CollapsibleTrigger
          asChild
          onClick={(e) => {
            e.stopPropagation();
            if (folder.children.length > 0) {
              handleCollapsibleToggle(folder.id);
            }
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-5 w-5 p-0 hover:text-primar cursor-pointer hover:bg-gray-200',
              folder.children.length === 0 && 'invisible',
            )}
          >
            {isExpanded(folder.id) ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </Button>
        </CollapsibleTrigger>

        {isExpanded(folder.id) ? (
          <FolderOpen className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <FolderIcon className="h-4 w-4 text-primary shrink-0" />
        )}

        <span
          className={cn(
            'ml-1 text-sm',
            isSelected?.id === folder.id && 'text-blue-700 font-medium',
          )}
        >
          {folder.folderName}
        </span>
      </div>

      <CollapsibleContent className="pl-4">
        {folder.children.map((child) => (
          <FolderPickerItem
            key={child.id}
            folder={child}
            isSelected={isSelected}
            setIsSelected={setIsSelected}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
