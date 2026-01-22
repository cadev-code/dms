import { useUsers } from '@/hooks/useUsers';
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
import { Group } from '@/types/group.types';
import { User } from '@/types/user.types';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { useGroupMembers } from '@/hooks/useGroupMembers';
import { useRemoveUserFromGroup } from '@/hooks/useRemoveUserFromGroup';
import { useAddUserToGroup } from '@/hooks/useAddUserToGroup';

interface Props {
  isOpen: boolean;
  group: Group | null;
  onClose: () => void;
}

export const GroupMembersDialog = ({ isOpen, group, onClose }: Props) => {
  const { data: membersData } = useGroupMembers(group?.id || null);
  const membersGroup = membersData?.data || [];

  const { data: usersData } = useUsers();
  const users = usersData?.data || [];

  const addUserToGroup = useAddUserToGroup();
  const removeUserFromGroupMutation = useRemoveUserFromGroup();

  const handleToggleMember = (user: User) => {
    if (!group) return;
    const isMember = membersGroup.some((member) => member.userId === user.id);

    if (isMember && group) {
      removeUserFromGroupMutation.mutate({
        groupId: group.id,
        userId: user.id,
      });
    } else {
      addUserToGroup.mutate({
        groupId: group.id,
        userId: user.id,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Miembros de <span className="text-primary">{group?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Selecciona los usuarios que pertenecen a este grupo
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {users.map((user) => {
              const isMember = membersGroup.some(
                (member) => member.userId === user.id,
              );

              return (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleToggleMember(user)}
                >
                  <Checkbox checked={isMember} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.fullname}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.role === 'SUPER_ADMIN'
                      ? 'Super Administrador'
                      : user.role === 'CONTENT_ADMIN'
                        ? 'Administrador de Contenido'
                        : 'Usuario'}
                  </Badge>
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
