import { Document } from '@/types/document.types';

import { useState } from 'react';
import { useAllFolders } from '@/hooks/useAllFolders';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Folder as FolderType } from '@/types/folder.types';
import { FolderPickerItem } from './FolderPickerItem';
import { ScrollArea } from '../ui/scroll-area';
import { useMoveFile } from '@/hooks/useMoveFile';

interface Props {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MoveDocumentDialog = ({ document, isOpen, onClose }: Props) => {
  const [isSelected, setIsSelected] = useState<FolderType | null>(null);

  const { data: folders } = useAllFolders();
  const moveFile = useMoveFile(onClose);

  const handleConfirm = () => {
    if (!document || !isSelected) return;

    moveFile.mutate({
      documentId: document.id,
      newFolderId: isSelected.id,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Mover documento: <br />
            <span className="text-primary">{document?.documentName}</span>
          </DialogTitle>
          <DialogDescription>
            Selecciona la carpeta de destino para mover el documento. Esta
            acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4 border rounded-md p-2">
          <div className="space-y-2">
            {folders?.data.map((folder) => (
              <FolderPickerItem
                folder={folder}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
              />
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
