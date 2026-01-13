import { useMutation } from '@tanstack/react-query';
import { poster } from '@/api/queryHelpers';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { queryClient } from '@/config/queryClient';

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation<
    unknown,
    AxiosError<{ message: string; error: string }>,
    void
  >({
    mutationFn: () => poster('/auth/logout'),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      navigate('/login');
    },
  });
};
