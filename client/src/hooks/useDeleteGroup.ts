import { deleter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface DeleteGroupPayload {
  groupId: number;
}

interface DeleteGroupResponse {
  error: null;
  message: string;
}

export const useDeleteGroup = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    DeleteGroupResponse,
    AxiosError<{ message: string; error: string }>,
    DeleteGroupPayload
  >({
    mutationFn: (data) => {
      return deleter(`/groups/${data.groupId}`);
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
