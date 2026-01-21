import { Document } from '@/types/document.types';
import { useState } from 'react';

export const useFileEditor = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editDocument, setEditDocument] = useState<Document | null>(null);

  const handleEdit = (document: Document) => {
    setEditDocument(document);
    setIsUploadOpen(true);
  };

  const handleCloseUpload = () => {
    setIsUploadOpen(false);
    setEditDocument(null);
  };

  return {
    editDocument,
    isUploadOpen,
    handleCloseUpload,
    handleEdit,
    setIsUploadOpen,
  };
};
