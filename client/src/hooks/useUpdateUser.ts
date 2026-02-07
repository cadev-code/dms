import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { putter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { User } from '@/types/user.types';

interface UpdateUserPayload {
  userId: number;
  fullname: string;
  role: User['role'];
}

interface UpdateUserResponse {
  error: null;
  message: string;
}

export const useUpdateUser = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    UpdateUserResponse,
    AxiosError<{ message: string; error: string }>,
    UpdateUserPayload
  >({
    mutationFn: (data) => {
      return putter(`/users/${data.userId}/update`, {
        fullname: data.fullname,
        role: data.role,
      });
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showAlert(data.message, 'success');
    },
  });
};
