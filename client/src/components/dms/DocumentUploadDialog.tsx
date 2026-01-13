import { type DragEvent, type ChangeEvent, useRef, useState } from 'react';
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
import { Textarea } from '../ui/textarea';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentUploadDialog = ({ isOpen, onClose }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const editDocument = false;
  const dragActive = true;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  function handleDrag(event: DragEvent<HTMLDivElement>): void {
    throw new Error('Function not implemented.');
  }

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    throw new Error('Function not implemented.');
  }

  function getFileIcon(): import('react').ReactNode {
    throw new Error('Function not implemented.');
  }

  function setSelectedFile(arg0: null) {
    throw new Error('Function not implemented.');
  }

  function setName(arg0: string) {
    throw new Error('Function not implemented.');
  }

  function setDescription(value: any) {
    throw new Error('Function not implemented.');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editDocument ? 'Editar Documento' : 'Subir Nuevo Documento'}
          </DialogTitle>
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
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileSelect}
              />
              <div className="flex flex-col items-center gap-2">
                {[].length > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{'File name'}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setName('');
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
              value={'name'}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del documento"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={''}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción breve del documento"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => {}}>
            {editDocument ? 'Guardar Cambios' : 'Subir Documento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
