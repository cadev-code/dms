import type { Group } from '@/types/group.types';
import type { AxiosError } from 'axios';
import { fetcher } from '@/api/queryHelpers';
import { useQuery } from '@tanstack/react-query';

interface GroupsResponse {
  error: null;
  data: Group[];
}

export const useGroups = () => {
  return useQuery<
    GroupsResponse,
    AxiosError<{ message: string; error: string }>
  >({
    queryKey: ['groups'],
    queryFn: () => fetcher('/groups'),
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 5, // 5 seconds
  });
};
