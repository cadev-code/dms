import { useQuery } from '@tanstack/react-query';
import type { Document } from '@/types/document.types';
import { fetcher } from '@/api/queryHelpers';
import { AxiosError } from 'axios';

interface AllFilesResponse {
  error: null;
  data: Document[];
}

export const useAllFiles = () => {
  return useQuery<
    AllFilesResponse,
    AxiosError<{ message: string; error: string }>
  >({
    queryKey: ['all-files'],
    queryFn: () => fetcher('/files/all'),
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 5, // 5 seconds
  });
};
