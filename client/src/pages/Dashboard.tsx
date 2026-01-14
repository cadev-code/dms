import { DocumentList } from '@/components/dms/DocumentList';
import { DocumentUploadDialog } from '@/components/dms/DocumentUploadDialog';
import { Sidebar } from '@/components/dms/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Shield } from 'lucide-react';
import { useState } from 'react';

export const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleCloseUpload = () => {
    setIsUploadOpen(false);
  };

  const isAdmin = true;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        documentCounts={{ excel: 1, word: 5, pdf: 12, other: 15 }}
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
              {isAdmin && (
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
            documents={[
              {
                id: 1,
                documentName: 'Políticas de Navegación',
                fileName: 'politicas_navegacion.pdf',
                type: 'pdf',
                size: 1245760,
              },
              {
                id: 3,
                documentName: 'Asistencia de Empleados',
                fileName: 'asistencia_empleados.docx',
                type: 'word',
                size: 2245760,
              },
              {
                id: 2,
                documentName: 'Control de Accesos',
                fileName: 'control_accesos.xlsx',
                type: 'excel',
                size: 3245760,
              },
            ]}
            isAdmin={false}
            onView={() => {}}
            onDelete={() => {}}
            onDownload={() => {}}
          />
        </div>
      </main>

      <DocumentUploadDialog isOpen={isUploadOpen} onClose={handleCloseUpload} />
    </div>
  );
};
