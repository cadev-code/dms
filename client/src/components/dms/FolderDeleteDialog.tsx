import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Folder } from 'lucide-react';

interface Props {
  folderName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function FolderDeleteDialog({
  folderName,
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle>Eliminar Carpeta</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 space-y-2">
            <p>
              ¿Estás seguro de que deseas eliminar la carpeta{' '}
              <span className="font-semibold text-foreground">
                "{folderName}"
              </span>
              ?
            </p>
            <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md border border-destructive/20">
              <Folder className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm text-destructive">
                <strong>Advertencia:</strong> Todos los documentos y subcarpetas
                dentro de esta carpeta serán eliminados permanentemente. Esta
                acción no se puede deshacer.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Eliminar Carpeta
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
