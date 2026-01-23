import type { Folder } from '@/types/folder.types';
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
import { useGroups } from '@/hooks/useGroups';
import { Checkbox } from '../ui/checkbox';

interface Props {
  isOpen: boolean;
  folder: Folder | null;
  onClose: () => void;
}

export const FolderPermissionDialog = ({ isOpen, folder, onClose }: Props) => {
  // const { data: membersData } = useGroupMembers(group?.id || null);
  // const membersGroup = membersData?.data || [];

  const { data: groupsData } = useGroups();
  const groups = groupsData?.data || [];

  // const addUserToGroup = useAddUserToGroup();
  // const removeUserFromGroupMutation = useRemoveUserFromGroup();

  const handleToggleAllow = (group: Group) => {
    if (!folder) return;

    console.log('Toggle allow for group:', group, 'on folder:', folder);
    // const isAllowed = membersGroup.some((member) => member.userId === user.id);

    // if (isMember && group) {
    //   removeUserFromGroupMutation.mutate({
    //     groupId: group.id,
    //     userId: user.id,
    //   });
    // } else {
    //   addUserToGroup.mutate({
    //     groupId: group.id,
    //     userId: user.id,
    //   });
    // }
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
              // const isMember = membersGroup.some(
              //   (member) => member.userId === user.id,
              // );

              return (
                <div
                  key={group.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleToggleAllow(group)}
                >
                  <Checkbox checked={false} />
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
