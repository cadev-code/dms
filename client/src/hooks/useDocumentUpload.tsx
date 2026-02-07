import type { Document, DocumentType } from '@/types/document.types';
import {
  File as FileIcon,
  FileSpreadsheet,
  FileText,
  Image,
  Presentation,
  Upload,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useUploadFile } from './useUploadFile';
import { useEditFile } from './useEditFile';

export const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.pptx',
  '.ppt',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.txt',
];

export const useDocumentUpload = (
  activeFilter: string,
  editDocument: Document | null,
  isOpen: boolean,
  onClose: () => void,
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [name, setName] = useState<string>(editDocument?.documentName || '');
  const [ticketNumber, setTicketNumber] = useState<string>(
    editDocument?.ticketNumber || '',
  );
  const [version, setVersion] = useState<string>('1.0');

  useEffect(() => {
    if (editDocument) {
      setName(editDocument.documentName);
      setTicketNumber(editDocument.ticketNumber);
    } else {
      setName('');
      setTicketNumber('');
      setSelectedFile(null);
    }
  }, [editDocument, isOpen]);

  const uploadFile = useUploadFile(() => {
    onClose();
  });

  const editFile = useEditFile(() => {
    onClose();
  });

  const getFileType = (fileName: string): DocumentType => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'word';
      case 'xls':
      case 'xlsx':
        return 'excel';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'image';
      case 'pptx':
      case 'ppt':
        return 'powerpoint';
      case 'txt':
        return 'text';
      default:
        return 'other';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const filename = file.name.toLowerCase();

      const isAllowed = ALLOWED_EXTENSIONS.some((ext) =>
        filename.endsWith(ext),
      );

      if (isAllowed) {
        setSelectedFile(file);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the input value to allow re-selecting the same file
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      e.target.value = ''; // Reset the input value to allow re-selecting the same file
    }
  };

  const getFileIcon = () => {
    if (!selectedFile)
      return <Upload className="h-12 w-12 text-muted-foreground" />;

    const type = getFileType(selectedFile.name);

    switch (type) {
      case 'pdf':
        return <FileText className="h-12 w-12 text-destructive" />;
      case 'word':
        return <FileText className="h-12 w-12 text-primary" />;
      case 'excel':
        return <FileSpreadsheet className="h-12 w-12 text-green-500" />;
      case 'image':
        return <Image className="h-12 w-12 text-sky-500" />;
      case 'powerpoint':
        return <Presentation className="h-12 w-12 text-orange-500" />;
      case 'text':
        return <FileText className="h-12 w-12 text-gray-500" />;
      default:
        return <FileIcon className="h-12 w-12 text-muted-foreground" />;
    }
  };

  const handleSubmit = () => {
    if (name.trim() === '') return;
    if (!editDocument && !selectedFile) return;

    if (editDocument) {
      editFile.mutate({
        documentId: editDocument.id,
        documentName: name.trim(),
        ticketNumber: ticketNumber.trim(),
      });
      return;
    }

    if (!editDocument && selectedFile) {
      const folderId = +activeFilter.split(':')[1];
      if (!folderId) return;

      uploadFile.mutate({
        file: selectedFile,
        documentName: name.trim(),
        ticketNumber: ticketNumber.trim(),
        folderId,
        version,
      });

      return;
    }
  };

  const handleCancel = () => {
    onClose();
    setName('');
    setSelectedFile(null);
  };

  return {
    ALLOWED_EXTENSIONS,
    dragActive,
    fileInputRef,
    isLoading: uploadFile.isPending,
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
  };
};
