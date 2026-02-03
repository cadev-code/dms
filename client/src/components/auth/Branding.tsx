import { FolderOpen } from 'lucide-react';

export const Branding = () => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 mb-4">
        <FolderOpen className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground">DMS</h1>
      <p className="text-muted-foreground mt-1">
        Sistema de Gestión Documental
      </p>
    </div>
  );
};
