import { fetcher } from '@/api/queryHelpers';
import type { User } from '@/types/auth.types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCurrentUser = () => {
  return useQuery<User, AxiosError<{ message: string; error: string }>>({
    queryKey: ['currentUser'],
    queryFn: () => fetcher<User>('/auth/me'),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
