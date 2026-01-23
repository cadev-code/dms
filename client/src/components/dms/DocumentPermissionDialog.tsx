import type { Document } from '@/types/document.types';
import type { Group } from '@/types/group.types';

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
import { Checkbox } from '../ui/checkbox';
import { useGroups } from '@/hooks/useGroups';
import { useFilePermissions } from '@/hooks/useFilePermissions';
import { useAddGroupToFile } from '@/hooks/useAddGroupToFile';
import { useRemoveGroupToFile } from '@/hooks/useRemoveGroupToFile';

interface Props {
  isOpen: boolean;
  document: Document | null;
  onClose: () => void;
}

export const DocumentPermissionDialog = ({
  isOpen,
  document,
  onClose,
}: Props) => {
  const { data: permissionsData } = useFilePermissions(document?.id || null);
  const filePermissions = permissionsData?.data || [];

  const { data: groupsData } = useGroups();
  const groups = groupsData?.data || [];

  const addGroupToFile = useAddGroupToFile();
  const removeGroupToFile = useRemoveGroupToFile();

  const handleToggleAllow = (group: Group) => {
    if (!document) return;

    const isAllowed = filePermissions.some(
      (permission) => permission.groupId === group.id,
    );

    if (isAllowed && document) {
      removeGroupToFile.mutate({
        groupId: group.id,
        fileId: document.id,
      });
    } else {
      addGroupToFile.mutate({
        groupId: group.id,
        fileId: document.id,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Grupos con visualización del documento{' '}
            <span className="text-primary">{document?.documentName}</span>
          </DialogTitle>
          <DialogDescription>
            Selecciona los grupos que tendrán visualización de este documento.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {groups.map((group) => {
              const isAllowed = filePermissions.some(
                (permission) => permission.groupId === group.id,
              );

              return (
                <div
                  key={group.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleToggleAllow(group)}
                >
                  <Checkbox checked={isAllowed} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{group.name}</p>
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
