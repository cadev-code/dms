import type { Document } from '@/types/document.types';

import { useDownloadFile } from '@/hooks/useDownloadFile';
import { useFileDeletion } from '@/hooks/useFileDeletion';
import { useFileEditor } from '@/hooks/useFileEditor';
import { useFileViewer } from '@/hooks/useFileViewer';

import { FileText, FolderOpen, Plus, Shield } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/dms/FileDeleteDialog';
import { DocumentList } from '@/components/dms/DocumentList';
import { DocumentUploadDialog } from '@/components/dms/DocumentUploadDialog';
import { PdfViewer } from '@/components/dms/PdfViewer';
import { Sidebar } from '@/components/dms/Sidebar';
import { useDocumentsDashboard } from '@/hooks/useDocumentsDashboard';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAllFolders } from '@/hooks/useAllFolders';

export const Dashboard = () => {
  const { data: currentUser } = useCurrentUser();

  const { activeFilter, allDocuments, documents, setActiveFilter } =
    useDocumentsDashboard();

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const {
    editDocument,
    isUploadOpen,
    handleCloseUpload,
    handleEdit,
    setIsUploadOpen,
  } = useFileEditor();

  const {
    documentToDelete,
    isDeleteOpen,
    handleConfirmDelete,
    handleDelete,
    setIsDeleteOpen,
  } = useFileDeletion();

  const {
    isPdfViewerOpen,
    pdfToShow,
    handleView,
    setIsPdfViewerOpen,
    setPdfToShow,
  } = useFileViewer();

  const downloadFile = useDownloadFile();

  const handleDownload = (document: Document) => {
    downloadFile.mutate(document);
  };

  const { data: allFoldersData } = useAllFolders();
  const allFolders = allFoldersData?.data || [];

  const folderSelected = () => {
    const folderId = activeFilter.replace('folder:', '');

    return (
      allFolders.find((folder) => folder.id === Number(folderId))?.folderName ||
      ''
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        documentCounts={{
          all: allDocuments.length || 0,
          excel: allDocuments.filter((doc) => doc.type === 'excel').length || 0,
          word: allDocuments.filter((doc) => doc.type === 'word').length || 0,
          pdf: allDocuments.filter((doc) => doc.type === 'pdf').length || 0,
          powerpoint:
            allDocuments.filter((doc) => doc.type === 'powerpoint').length || 0,
          image: allDocuments.filter((doc) => doc.type === 'image').length || 0,
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
                {currentUser?.role === 'USER' && (
                  <Badge variant="secondary" className="ml-2">
                    <Shield className="h-3 w-3 mr-1" />
                    Solo lectura
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                {currentUser?.role !== 'USER'
                  ? 'Gestiona todos los documentos del sistema'
                  : 'Visualiza los documentos disponibles'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {currentUser?.role !== 'USER' &&
                activeFilter.startsWith('folder:') && (
                  <Button onClick={() => setIsUploadOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Subir Documento
                  </Button>
                )}
            </div>
          </div>
          {activeFilter.startsWith('folder:') && (
            <div className="flex items-center gap-2 mt-2 ">
              <FolderOpen size={16} />
              <p className="text-sm font-semibold">{folderSelected()}</p>
            </div>
          )}
        </header>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <DocumentList
            documents={documents || []}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDownload={handleDownload}
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

      <PdfViewer
        isOpen={isPdfViewerOpen}
        fileName={pdfToShow}
        onClose={() => {
          setPdfToShow(null);
          setIsPdfViewerOpen(false);
        }}
      />
    </div>
  );
};
