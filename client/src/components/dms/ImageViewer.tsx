import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Document } from '@/types/document.types';
import { axiosClient } from '@/lib/axiosClient';

interface Props {
  fileName: Document['fileName'] | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageViewer = ({ fileName, isOpen, onClose }: Props) => {
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const panStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    startX: number;
    startY: number;
  } | null>(null);

  useEffect(() => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
  }, [isOpen]);

  // Cargar la imagen como blob (similar a cómo PdfViewer carga el PDF)
  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    const loadImage = async () => {
      if (!fileName || !isOpen) {
        setImageUrl(null);
        setLoadError(null);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await axiosClient.get(`/documents/${fileName}`, {
          responseType: 'blob',
        });

        if (cancelled) return;

        objectUrl = URL.createObjectURL(response.data);
        setImageUrl(objectUrl);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        if (!cancelled) {
          setLoadError('No se pudo cargar la imagen.');
          setImageUrl(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileName, isOpen]);

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!fileName) return;
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;

    setScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 1), 2.5);

      if (next === 1) {
        setOffsetX(0);
        setOffsetY(0);
      }

      return next;
    });
  };

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!fileName || scale === 1) return;
    e.preventDefault();

    setIsPanning(true);
    panStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: offsetX,
      startY: offsetY,
    };
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isPanning || !panStartRef.current) return;
    e.preventDefault();

    const dx = e.clientX - panStartRef.current.mouseX;
    const dy = e.clientY - panStartRef.current.mouseY;

    setOffsetX(panStartRef.current.startX + dx);
    setOffsetY(panStartRef.current.startY + dy);
  };

  const handleMouseUpOrLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    setIsPanning(false);
  };

  const handleResetZoom = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-4xl w-full h-[80vh] flex flex-col pr-12 select-none"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {fileName ? (
          <div className="relative h-full w-full flex flex-col gap-2">
            <div
              className="flex-1 flex justify-center items-center overflow-hidden bg-background"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              style={{
                cursor:
                  scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
              }}
            >
              {isLoading && !imageUrl && !loadError && (
                <p className="text-muted-foreground text-sm">
                  Cargando imagen...
                </p>
              )}

              {loadError && (
                <p className="text-destructive text-sm">{loadError}</p>
              )}

              {!isLoading && !loadError && imageUrl && (
                <img
                  className="max-h-full max-w-full object-contain rounded-md border-2"
                  src={imageUrl}
                  alt="Imagen del documento"
                  style={{
                    transform: `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`,
                    transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                  }}
                  draggable={false}
                />
              )}
            </div>

            <div className="flex justify-end gap-2 text-xs text-muted-foreground">
              <span>Zoom: {(scale * 100).toFixed(0)}%</span>
              <button
                type="button"
                className="px-2 py-1 border rounded-md hover:bg-muted"
                onClick={handleResetZoom}
              >
                Restablecer zoom
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              No se ha seleccionado ninguna documento tipo Imagen.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
