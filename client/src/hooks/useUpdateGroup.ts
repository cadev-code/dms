import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { putter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';

interface UpdateGroupPayload {
  groupId: number;
  name: string;
}

interface UpdateGroupResponse {
  error: null;
  message: string;
}

export const useUpdateGroup = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    UpdateGroupResponse,
    AxiosError<{ message: string; error: string }>,
    UpdateGroupPayload
  >({
    mutationFn: (data) => {
      return putter(`/groups/${data.groupId}`, {
        name: data.name,
      });
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      showAlert(data.message, 'success');
    },
  });
};
