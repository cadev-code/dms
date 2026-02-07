import { AxiosError } from 'axios';

import { putter } from '@/api/queryHelpers';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';

interface EnableUserPayload {
  userId: number;
}

interface EnableUserResponse {
  error: null;
  message: string;
}

export const useEnableUser = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    EnableUserResponse,
    AxiosError<{ message: string; error: string }>,
    EnableUserPayload
  >({
    mutationFn: (data) => putter(`/users/${data.userId}/enable`),
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showAlert(data.message, 'success');
    },
  });
};
