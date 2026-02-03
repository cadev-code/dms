import { putter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface ResetPasswordPayload {
  mustChangePassword?: boolean;
  password: string;
  userId: number;
}

interface ResetPasswordResponse {
  error: null;
  message: string;
}

export const useResetPassword = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    ResetPasswordResponse,
    AxiosError<{ message: string; error: string }>,
    ResetPasswordPayload
  >({
    mutationFn: (data) => {
      return putter(`/users/${data.userId}/reset-password`, {
        mustChangePassword: data.mustChangePassword,
        password: data.password,
      });
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      showAlert(data.message, 'success');
    },
  });
};
