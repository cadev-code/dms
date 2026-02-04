import { Worker, Viewer } from '@react-pdf-viewer/core';
import type { LoadError } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import type { ToolbarSlot } from '@react-pdf-viewer/toolbar';
import {
  selectionModePlugin,
  SelectionMode,
} from '@react-pdf-viewer/selection-mode';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/selection-mode/lib/styles/index.css';

import { Dialog } from '../ui/dialog';
import { DialogContent } from '../ui/dialog';
import { Document } from '@/types/document.types';

interface Props {
  fileName: Document['fileName'] | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfViewer = ({ fileName, isOpen, onClose }: Props) => {
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  const selectionModePluginInstance = selectionModePlugin({
    selectionMode: SelectionMode.Hand,
  });

  const renderError = (error: LoadError) => {
    let message = 'No se pudo cargar el documento.';

    if (error.name === 'MissingPDFException') {
      message = 'El documento no existe o fue eliminado.';
    } else if (error.name === 'UnexpectedResponseException') {
      message = 'Error al comunicarse con el servidor.';
    }

    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-md bg-destructive px-4 py-2 text-sm text-white">
          {message}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-4xl w-full h-[80vh] flex flex-col pr-12"
        onContextMenu={(e) => e.preventDefault()}
      >
        {fileName ? (
          <div
            className="flex-1 border rounded-md overflow-hidden"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div
              onContextMenu={(e) => e.preventDefault()}
              style={{ height: '100%' }}
            >
              <Worker workerUrl="/pdf.worker.min.js">
                <div className="border-b">
                  <Toolbar>
                    {(slots: ToolbarSlot) => {
                      const {
                        CurrentPageInput,
                        GoToNextPage,
                        GoToPreviousPage,
                        NumberOfPages,
                        ZoomIn,
                        ZoomOut,
                      } = slots;

                      // Omitimos botones de descarga (Download) e impresión (Print)
                      return (
                        <div className="flex items-center gap-2 px-2 py-1 text-sm">
                          <GoToPreviousPage />
                          <CurrentPageInput />
                          <span>/</span>
                          <NumberOfPages />
                          <GoToNextPage />
                          <div className="ml-auto flex items-center gap-2">
                            <ZoomOut />
                            <ZoomIn />
                          </div>
                        </div>
                      );
                    }}
                  </Toolbar>
                </div>
                <Viewer
                  fileUrl={
                    fileName
                      ? `${
                          import.meta.env.DEV
                            ? 'http://localhost:8080'
                            : import.meta.env.VITE_API_URL ||
                              'http://localhost:8080'
                        }/documents/${fileName}`
                      : ''
                  }
                  renderError={renderError}
                  plugins={[toolbarPluginInstance, selectionModePluginInstance]}
                />
              </Worker>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              No se ha seleccionado ningún documento PDF.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
