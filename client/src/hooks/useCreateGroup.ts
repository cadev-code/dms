import { useMutation } from '@tanstack/react-query';

import type { AxiosError } from 'axios';
import { poster } from '@/api/queryHelpers';
import { useAlertStore } from '@/store/useAlertStore';
import { queryClient } from '@/config/queryClient';

interface CreateGroupPayload {
  name: string;
}

interface CreateGroupResponse {
  error: null;
  message: string;
}

export const useCreateGroup = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    CreateGroupResponse,
    AxiosError<{ message: string; error: string }>,
    CreateGroupPayload
  >({
    mutationFn: (data) => poster('/groups', data),
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      showAlert(data.message, 'success');
    },
  });
};
