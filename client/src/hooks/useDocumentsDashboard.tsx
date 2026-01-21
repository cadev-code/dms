import { useEffect, useState } from 'react';

import type { DocumentType } from '@/types/document.types';

import { useAllFiles } from './useAllFiles';
import { useFilesByFolder } from './useFilesByFolder';
import { useFilesByType } from './useFilesByType';

export const useDocumentsDashboard = () => {
  const [activeFilter, setActiveFilter] = useState(() => {
    return localStorage.getItem('dms-active-filter') || 'all';
  });

  useEffect(() => {
    localStorage.setItem('dms-active-filter', activeFilter);
  }, [activeFilter]);

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

  const documents =
    activeFilter === 'all'
      ? allDocuments?.data
      : activeFilter.startsWith('folder:')
        ? documentsByFolder?.data
        : documentsByType?.data;

  return {
    activeFilter,
    allDocuments: allDocuments?.data || [],
    documents: documents || [],
    setActiveFilter,
  };
};
