import { fetcher } from '@/api/queryHelpers';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface FolderPermissionsResponse {
  error: null;
  data: { folderId: number; groupId: number }[];
}

export const useFolderPermissions = (folderId: number | null) => {
  const enabled = typeof folderId === 'number';

  return useQuery<
    FolderPermissionsResponse,
    AxiosError<{ message: string; error: string }>
  >({
    queryKey: ['folder-permissions', folderId],
    queryFn: () => fetcher(`/folder-permissions/${folderId}`),
    enabled,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 5, // 5 seconds
  });
};
