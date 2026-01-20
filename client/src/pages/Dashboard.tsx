import { DocumentList } from '@/components/dms/DocumentList';
import { DocumentUploadDialog } from '@/components/dms/DocumentUploadDialog';
import { DeleteConfirmDialog } from '@/components/dms/FileDeleteDialog';
import { Sidebar } from '@/components/dms/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAllFiles } from '@/hooks/useAllFiles';
import { useDeleteFile } from '@/hooks/useDeleteFile';
import { useFilesByFolder } from '@/hooks/useFilesByFolder';
import { useFilesByType } from '@/hooks/useFilesByType';
import { Document, DocumentType } from '@/types/document.types';
import { FileText, Plus, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState(() => {
    return localStorage.getItem('dms-active-filter') || 'all';
  });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dms-active-filter', activeFilter);
  }, [activeFilter]);

  const deleteFile = useDeleteFile();

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleEdit = (document: Document) => {
    setEditDocument(document);
    setIsUploadOpen(true);
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

  const handleCloseUpload = () => {
    setIsUploadOpen(false);
    setEditDocument(null);
  };

  const { data: allDocuments } = useAllFiles();

  const { data: documentsByType } = useFilesByType(
    activeFilter.startsWith('folder:')
      ? ('all' as DocumentType & 'all')
      : (activeFilter as DocumentType & 'all'),
  );
  const { data: documentsByFolder } = useFilesByFolder(
    activeFilter.startsWith('folder:')
      ? (parseInt(activeFilter.split(':')[1]) as DocumentType &
          'all' &
          `folder:${number}`)
      : 0,
  );

  useEffect(() => {
    const documentsToShow =
      activeFilter === 'all'
        ? allDocuments?.data
        : activeFilter.startsWith('folder:')
          ? documentsByFolder?.data
          : documentsByType?.data;

    setDocuments(documentsToShow || []);
  }, [activeFilter, allDocuments, documentsByType, documentsByFolder]);

  const isAdmin = true;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        documentCounts={{
          all: allDocuments?.data.length || 0,
          excel:
            allDocuments?.data.filter((doc) => doc.type === 'excel').length ||
            0,
          word:
            allDocuments?.data.filter((doc) => doc.type === 'word').length || 0,
          pdf:
            allDocuments?.data.filter((doc) => doc.type === 'pdf').length || 0,
          powerpoint:
            allDocuments?.data.filter((doc) => doc.type === 'powerpoint')
              .length || 0,
          image:
            allDocuments?.data.filter((doc) => doc.type === 'image').length ||
            0,
          other: 15,
        }}
      />

      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Documentos
                {!isAdmin && (
                  <Badge variant="secondary" className="ml-2">
                    <Shield className="h-3 w-3 mr-1" />
                    Solo lectura
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isAdmin
                  ? 'Gestiona todos los documentos del sistema'
                  : 'Visualiza los documentos disponibles'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && activeFilter.startsWith('folder:') && (
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Documento
                </Button>
              )}
            </div>
          </div>
        </header>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <DocumentList
            documents={documents || []}
            isAdmin={true}
            onView={() => {}}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDownload={() => {}}
          />
        </div>
      </main>

      <DocumentUploadDialog
        isOpen={isUploadOpen}
        onClose={handleCloseUpload}
        activeFilter={activeFilter}
        editDocument={editDocument}
      />

      <DeleteConfirmDialog
        document={documentToDelete}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
