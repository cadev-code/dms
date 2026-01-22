import { fetcher } from '@/api/queryHelpers';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface GroupMembersResponse {
  error: null;
  data: { groupId: number; userId: number }[];
}

export const useGroupMembers = (groupId: number | null) => {
  const enabled = typeof groupId === 'number';

  return useQuery<
    GroupMembersResponse,
    AxiosError<{ message: string; error: string }>
  >({
    queryKey: ['group-members', groupId],
    queryFn: () => fetcher(`/group-members/${groupId}`),
    enabled,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 5, // 5 seconds
  });
};
