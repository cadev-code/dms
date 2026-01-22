import { useMutation } from '@tanstack/react-query';

import type { AxiosError } from 'axios';
import type { User } from '@/types/user.types';
import { poster } from '@/api/queryHelpers';
import { useAlertStore } from '@/store/useAlertStore';
import { queryClient } from '@/config/queryClient';

interface CreateUserPayload {
  fullname: string;
  username: string;
  password: string;
  role: User['role'];
}

interface CreateUserResponse {
  error: null;
  message: string;
}

export const useCreateUser = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    CreateUserResponse,
    AxiosError<{ message: string; error: string }>,
    CreateUserPayload
  >({
    mutationFn: (data) => poster('/users', data),
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showAlert(data.message, 'success');
    },
  });
};
