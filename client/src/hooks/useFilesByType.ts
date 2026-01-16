import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import type { Document } from '@/types/document.types';
import { fetcher } from '@/api/queryHelpers';

interface FilesByTypeResponse {
  error: null;
  data: Document[];
}

export const useFilesByType = (type: DocumentType) => {
  return useQuery<
    FilesByTypeResponse,
    AxiosError<{ message: string; error: string }>
  >({
    queryKey: ['files-by-type', type],
    queryFn: () => fetcher(`/files/${type}`),
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 5, // 5 seconds
  });
};
