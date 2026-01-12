import { poster } from '@/api/queryHelpers';
import { useAlertStore } from '@/store/useAlertStore';
import type { LoginBody } from '@/types/auth.types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';

interface User {
  userId: number;
}

export const useLogin = () => {
  const { showAlert } = useAlertStore();

  const navigate = useNavigate();

  return useMutation<
    User,
    AxiosError<{ message: string; error: string }>,
    LoginBody
  >({
    mutationFn: (body: LoginBody) => poster<User>('/auth/login', body),
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: () => {
      navigate('/management');
    },
  });
};
