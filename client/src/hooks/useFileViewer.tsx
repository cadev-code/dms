import { useState } from 'react';

import type { Document } from '@/types/document.types';

export const useFileViewer = () => {
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [pdfToShow, setPdfToShow] = useState<Document['fileName'] | null>(null);

  const handleView = (document: Document) => {
    setPdfToShow(
      document.type === 'pdf' ? document.fileName : document.previewFileName,
    );
    setIsPdfViewerOpen(true);
  };

  return {
    isPdfViewerOpen,
    pdfToShow,
    handleView,
    setIsPdfViewerOpen,
    setPdfToShow,
  };
};
