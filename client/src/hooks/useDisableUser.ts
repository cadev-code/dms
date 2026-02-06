import { AxiosError } from 'axios';

import { putter } from '@/api/queryHelpers';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';

interface DisableUserPayload {
  userId: number;
}

interface DisableUserResponse {
  error: null;
  message: string;
}

export const useDisableUser = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    DisableUserResponse,
    AxiosError<{ message: string; error: string }>,
    DisableUserPayload
  >({
    mutationFn: (data) => putter(`/users/${data.userId}/disable`),
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showAlert(data.message, 'success');
    },
  });
};
