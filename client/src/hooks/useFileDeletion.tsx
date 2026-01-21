import { Document } from '@/types/document.types';
import { useState } from 'react';
import { useDeleteFile } from './useDeleteFile';

export const useFileDeletion = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null,
  );

  const deleteFile = useDeleteFile();

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

  return {
    documentToDelete,
    isDeleteOpen,
    handleConfirmDelete,
    handleDelete,
    setIsDeleteOpen,
  };
};
