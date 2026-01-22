import { fetcher } from '@/api/queryHelpers';
import type { Auth } from '@/types/auth.types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCurrentUser = () => {
  return useQuery<Auth, AxiosError<{ message: string; error: string }>>({
    queryKey: ['currentUser'],
    queryFn: () => fetcher<Auth>('/auth/me'),
    retry: false,
    staleTime: 1000 * 30, // 5 minutes
  });
};
