import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import type { LoginBody, Auth } from '@/types/auth.types';
import { useMutation } from '@tanstack/react-query';
import { poster } from '@/api/queryHelpers';
import { useAlertStore } from '@/store/useAlertStore';

export const useLogin = () => {
  const { showAlert } = useAlertStore();

  const navigate = useNavigate();

  return useMutation<
    Auth,
    AxiosError<{ message: string; error: string }>,
    LoginBody
  >({
    mutationFn: (body: LoginBody) => poster<Auth>('/auth/login', body),
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: () => {
      navigate('/management');
    },
  });
};
