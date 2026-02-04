import { useState } from 'react';

import type { Document } from '@/types/document.types';

export const useFileViewer = () => {
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [pdfToShow, setPdfToShow] = useState<Document['fileName'] | null>(null);

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageToShow, setImageToShow] = useState<Document['fileName'] | null>(
    null,
  );

  const handleView = (document: Document) => {
    if (document.type === 'image') {
      setImageToShow(document.fileName);
      setIsImageViewerOpen(true);
    } else {
      setPdfToShow(
        document.type === 'pdf' ? document.fileName : document.previewFileName,
      );
      setIsPdfViewerOpen(true);
    }
  };

  return {
    imageToShow,
    isImageViewerOpen,
    isPdfViewerOpen,
    pdfToShow,
    handleView,
    setImageToShow,
    setIsImageViewerOpen,
    setIsPdfViewerOpen,
    setPdfToShow,
  };
};
