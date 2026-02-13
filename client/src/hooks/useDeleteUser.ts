import { deleter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface DeleteUserPayload {
  userId: number;
}

interface DeleteUserResponse {
  error: null;
  message: string;
}

export const useDeleteUser = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    DeleteUserResponse,
    AxiosError<{ message: string; error: string }>,
    DeleteUserPayload
  >({
    mutationFn: (data) => {
      return deleter(`/users/${data.userId}`);
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
