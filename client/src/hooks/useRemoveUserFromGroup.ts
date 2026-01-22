import { deleter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface RemoveUserFromGroupPayload {
  groupId: number;
  userId: number;
}

interface RemoveUserFromGroupResponse {
  error: null;
  message: string;
}

export const useRemoveUserFromGroup = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    RemoveUserFromGroupResponse,
    AxiosError<{ message: string; error: string }>,
    RemoveUserFromGroupPayload
  >({
    mutationFn: (data) => {
      return deleter(`/user-groups/${data.groupId}/${data.userId}/`);
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
      showAlert(data.message, 'success');
    },
  });
};
