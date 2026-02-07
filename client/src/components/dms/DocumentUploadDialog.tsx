import type { Document } from '@/types/document.types';

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
  activeFilter: string;
  editDocument: Document | null;
}

export const DocumentUploadDialog = ({
  activeFilter,
  editDocument,
  isOpen,
  onClose,
}: Props) => {
  const {
    ALLOWED_EXTENSIONS,
    dragActive,
    fileInputRef,
    isLoading,
    name,
    selectedFile,
    ticketNumber,
    version,
    getFileIcon,
    handleCancel,
    handleDrag,
    handleDrop,
    handleFileSelect,
    handleSubmit,
    setName,
    setSelectedFile,
    setTicketNumber,
    setVersion,
  } = useDocumentUpload(activeFilter, editDocument, isOpen, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editDocument ? 'Editar Documento' : 'Subir Nuevo Documento'}
          </DialogTitle>
          <DialogDescription>
            {!editDocument
              ? 'Selecciona un archivo para subir o arrástralo a esta área.'
              : 'Modifica el nombre del documento según sea necesario.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!editDocument && (
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
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del documento</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del documento"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticketNumber">Número de Solicitud</Label>
            <Input
              id="ticketNumber"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="Número de Solicitud"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Versión</Label>
            <Input
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="Versión del documento (ej. 1.0)"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              name.trim().length < 3 ||
              (!editDocument && !selectedFile) ||
              isLoading
            }
          >
            Subir Documento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
