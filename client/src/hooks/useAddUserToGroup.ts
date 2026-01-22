import { useMutation } from '@tanstack/react-query';

import type { AxiosError } from 'axios';
import { poster } from '@/api/queryHelpers';
import { useAlertStore } from '@/store/useAlertStore';
import { queryClient } from '@/config/queryClient';

interface AddUserToGroupPayload {
  groupId: number;
  userId: number;
}

interface AddUserToGroupResponse {
  error: null;
  message: string;
}

export const useAddUserToGroup = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    AddUserToGroupResponse,
    AxiosError<{ message: string; error: string }>,
    AddUserToGroupPayload
  >({
    mutationFn: (data) => poster('/user-groups', data),
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
      showAlert(data.message, 'success');
    },
  });
};
