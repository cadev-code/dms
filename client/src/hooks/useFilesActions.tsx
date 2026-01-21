import { useState } from 'react';
import { useDeleteFile } from './useDeleteFile';
import { useDownloadFile } from './useDownloadFile';
import { Document } from '@/types/document.types';

export const useFilesActions = () => {
  // Upload / Edit File State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editDocument, setEditDocument] = useState<Document | null>(null);

  // Delete File State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null,
  );

  // PDF Viewer State
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [pdfToShow, setPdfToShow] = useState<Document['fileName'] | null>(null);

  // Mutations
  const deleteFile = useDeleteFile();
  const downloadFile = useDownloadFile();

  const handleEdit = (document: Document) => {
    setEditDocument(document);
    setIsUploadOpen(true);
  };

  const handleCloseUpload = () => {
    setIsUploadOpen(false);
    setEditDocument(null);
  };

  const handleDelete = (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteFile.mutate({ documentId: documentToDelete.id });
      setIsDeleteOpen(false);
      setDocumentToDelete(null);
    }
  };

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
    documentToDelete,
    editDocument,
    isDeleteOpen,
    isPdfViewerOpen,
    isUploadOpen,
    pdfToShow,

    handleCloseUpload,
    handleConfirmDelete,
    handleDelete,
    handleDownload,
    handleEdit,
    handleView,
    setIsDeleteOpen,
    setIsPdfViewerOpen,
    setIsUploadOpen,
    setPdfToShow,
  };
};
