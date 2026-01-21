import { useState } from 'react';
import { useDownloadFile } from './useDownloadFile';
import { Document } from '@/types/document.types';

export const useFilesActions = () => {
  // PDF Viewer State
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [pdfToShow, setPdfToShow] = useState<Document['fileName'] | null>(null);

  // Mutations
  const downloadFile = useDownloadFile();

  const handleView = (document: Document) => {
    setPdfToShow(
      document.type === 'pdf' ? document.fileName : document.previewFileName,
    );
    setIsPdfViewerOpen(true);
  };

  const handleDownload = (document: Document) => {
    downloadFile.mutate(document);
  };

  return {
    isPdfViewerOpen,
    pdfToShow,

    handleDownload,
    handleView,
    setIsPdfViewerOpen,
    setPdfToShow,
  };
};
