import { fetcher } from '@/api/queryHelpers';
import { User } from '@/types/user.types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface UsersResponse {
  error: null;
  data: User[];
}

export const useUsers = () => {
  return useQuery<
    UsersResponse,
    AxiosError<{ message: string; error: string }>
  >({
    queryKey: ['users'],
    queryFn: () => fetcher('/users'),
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 5, // 5 seconds
  });
};
