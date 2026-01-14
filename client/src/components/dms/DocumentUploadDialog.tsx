import { X } from 'lucide-react';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentUploadDialog = ({ isOpen, onClose }: Props) => {
  const {
    ALLOWED_EXTENSIONS,
    dragActive,
    fileInputRef,
    name,
    selectedFile,
    getFileIcon,
    handleDrag,
    handleDrop,
    handleFileSelect,
    handleUploadFile,
    setName,
    setSelectedFile,
  } = useDocumentUpload(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Subir Nuevo Documento</DialogTitle>
          <DialogDescription>
            Selecciona un archivo para subir o arrástralo a esta área.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={ALLOWED_EXTENSIONS.join(',')}
              onChange={handleFileSelect}
            />
            <div className="flex flex-col items-center gap-2">
              {getFileIcon()}
              {selectedFile ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {selectedFile.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Arrastra un archivo aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, Word, Excel (máx. 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del documento</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del documento"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleUploadFile}
            disabled={name.trim().length < 3 || !selectedFile}
          >
            Subir Documento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
