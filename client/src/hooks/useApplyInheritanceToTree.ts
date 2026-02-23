import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { poster } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';

interface Payload {
  folderId: number;
  groupId: number;
}

interface Response {
  error: null;
  message: string;
}

export const useApplyInheritanceToTree = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    Response,
    AxiosError<{ message: string; error: string }>,
    Payload
  >({
    mutationFn: (data) =>
      poster(`/folder/${data.folderId}/group/${data.groupId}/inheritance`),
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
