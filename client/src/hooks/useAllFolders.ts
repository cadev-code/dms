import { fetcher } from '@/api/queryHelpers';
import { Folder } from '@/types/folder.types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface AllFoldersResponse {
  error: null;
  data: Folder[];
}

export const useAllFolders = () => {
  return useQuery<
    AllFoldersResponse,
    AxiosError<{ message: string; error: string }>
  >({
    queryKey: ['all-folders'],
    queryFn: () => fetcher('/folders/all'),
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 5, // 5 seconds
  });
};
