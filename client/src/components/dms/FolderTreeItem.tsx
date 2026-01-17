import { Folder } from '@/types/folder.types';
import { Button } from '../ui/button';
import { FolderIcons } from './FolderIcons';

interface Props {
  activeFilter: string;
  depth: number;
  isExpanded: boolean;
  folder: Folder;
  onFolderClick: () => void;
}

export const FolderTreeItem = ({
  activeFilter,
  depth,
  isExpanded,
  folder,
  onFolderClick,
}: Props) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 ${
        activeFilter === `folder:${folder.id}`
          ? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-emerald-500 hover:text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
      }`}
      onClick={onFolderClick}
    >
      <div
        className="flex items-center gap-3 w-full"
        style={{ paddingLeft: 6 * (depth + 1) }}
      >
        <FolderIcons
          isExpanded={isExpanded}
          hasChildren={folder.children && folder.children.length > 0}
        />
        <span className="flex-1 text-left truncate" title={folder.folderName}>
          {folder.folderName}
        </span>
      </div>
    </Button>
  );
};
