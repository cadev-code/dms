import { MouseEvent } from 'react';

import type { Folder } from '@/types/folder.types';
import type { Group } from '@/types/group.types';

import { CopyPlus, SquaresSubtract } from 'lucide-react';

import { useGroups } from '@/hooks/useGroups';
import { useFolderPermissions } from '@/hooks/useFolderPermissions';
import { useAddGroupToFolder } from '@/hooks/useAddGroupToFolder';
import { useApplyInheritanceToTree } from '@/hooks/useApplyInheritanceToTree';
import { useRemoveGroupToFolder } from '@/hooks/useRemoveGroupToFolder';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Checkbox } from '../ui/checkbox';

interface Props {
  isOpen: boolean;
  folder: Folder | null;
  onClose: () => void;
}

export const FolderPermissionDialog = ({ isOpen, folder, onClose }: Props) => {
  const { data: permissionsData } = useFolderPermissions(folder?.id || null);
  const folderPermissions = permissionsData?.data || [];

  const { data: groupsData } = useGroups();
  const groups = groupsData?.data || [];

  const addGroupToFolder = useAddGroupToFolder();
  const removeGroupToFolder = useRemoveGroupToFolder();
  const applyInheritanceToTree = useApplyInheritanceToTree();

  const handleToggleAllow = (group: Group) => {
    if (!folder) return;

    const isAllowed = folderPermissions.some(
      (permission) => permission.groupId === group.id,
    );

    if (isAllowed && folder) {
      removeGroupToFolder.mutate({
        groupId: group.id,
        folderId: folder.id,
      });
    } else {
      addGroupToFolder.mutate({
        groupId: group.id,
        folderId: folder.id,
      });
    }
  };

  const handleApplyInheritance = (
    e: MouseEvent<HTMLButtonElement>,
    group: Group,
  ) => {
    e.stopPropagation();

    if (folder) {
      applyInheritanceToTree.mutate({
        folderId: folder.id,
        groupId: group.id,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Grupos con acceso a la carpeta{' '}
            <span className="text-primary">{folder?.folderName}</span>
          </DialogTitle>

          <DialogDescription>
            Selecciona los grupos que tendrán acceso a esta carpeta.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {groups.map((group) => {
              const isAllowed = folderPermissions.some(
                (permission) => permission.groupId === group.id,
              );

              return (
                <div
                  key={group.id}
                  className="flex items-center p-3 justify-between rounded-lg border hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleToggleAllow(group)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isAllowed} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{group.name}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <SquaresSubtract />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Remover herencia
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => handleApplyInheritance(e, group)}
                        >
                          <CopyPlus />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Aplicar herencia
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
