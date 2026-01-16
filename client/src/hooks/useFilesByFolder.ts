import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import type { Document } from '@/types/document.types';
import { fetcher } from '@/api/queryHelpers';

interface FilesByFolderResponse {
  error: null;
  data: Document[];
}

export const useFilesByFolder = (folderId: number) => {
  return useQuery<
    FilesByFolderResponse,
    AxiosError<{ message: string; error: string }>
  >({
    queryKey: ['files-by-folder', folderId],
    queryFn: () => fetcher(`/files/folder/${folderId}`),
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 5, // 5 seconds
  });
};
