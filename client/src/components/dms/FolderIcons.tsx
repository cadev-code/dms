import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';

interface Props {
  hasChildren: boolean;
  isExpanded: boolean;
}

export const FolderIcons = ({ hasChildren, isExpanded }: Props) => (
  <div className={cn(!hasChildren && 'pl-7', 'flex gap-3')}>
    {hasChildren ? (
      isExpanded ? (
        <>
          <ChevronDown />
          <FolderOpen className="h-4 w-4 text-blue-500" />
        </>
      ) : (
        <>
          <ChevronRight />
          <Folder className="h-4 w-4 text-blue-500" />
        </>
      )
    ) : (
      <Folder className="h-4 w-4 text-blue-500" />
    )}
  </div>
);
