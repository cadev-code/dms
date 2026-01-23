import { useMutation } from '@tanstack/react-query';

import type { AxiosError } from 'axios';
import { poster } from '@/api/queryHelpers';
import { useAlertStore } from '@/store/useAlertStore';
import { queryClient } from '@/config/queryClient';

interface AddGroupToFolderPayload {
  folderId: number;
  groupId: number;
}

interface AddGroupToFolderResponse {
  error: null;
  message: string;
}

export const useAddGroupToFolder = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    AddGroupToFolderResponse,
    AxiosError<{ message: string; error: string }>,
    AddGroupToFolderPayload
  >({
    mutationFn: (data) => poster('/group-folders', data),
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['folder-permissions'] });
      showAlert(data.message, 'success');
    },
  });
};
