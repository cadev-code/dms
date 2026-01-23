import { fetcher } from '@/api/queryHelpers';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface FilePermissionsResponse {
  error: null;
  data: { fileId: number; groupId: number }[];
}

export const useFilePermissions = (fileId: number | null) => {
  const enabled = typeof fileId === 'number';

  return useQuery<
    FilePermissionsResponse,
    AxiosError<{ message: string; error: string }>
  >({
    queryKey: ['file-permissions', fileId],
    queryFn: () => fetcher(`/file-permissions/${fileId}`),
    enabled,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 5, // 5 seconds
  });
};
