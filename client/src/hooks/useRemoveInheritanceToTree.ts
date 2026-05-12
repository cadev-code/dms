import { deleter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface Payload {
  groupId: number;
  folderId: number;
}

interface Response {
  error: null;
  message: string;
}

export const useRemoveInheritanceToTree = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    Response,
    AxiosError<{ message: string; error: string }>,
    Payload
  >({
    mutationFn: (data) => {
      return deleter(
        `/folder/${data.folderId}/group/${data.groupId}/inheritance`,
      );
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['folder-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['file-permissions'] });
      showAlert(data.message, 'success');
    },
  });
};
