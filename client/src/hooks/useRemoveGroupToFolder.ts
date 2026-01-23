import { deleter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface RemoveGroupToFolderPayload {
  groupId: number;
  folderId: number;
}

interface RemoveGroupToFolderResponse {
  error: null;
  message: string;
}

export const useRemoveGroupToFolder = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    RemoveGroupToFolderResponse,
    AxiosError<{ message: string; error: string }>,
    RemoveGroupToFolderPayload
  >({
    mutationFn: (data) => {
      return deleter(`/group-folders/${data.groupId}/${data.folderId}/`);
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['folder-permissions'] });
      showAlert(data.message, 'success');
    },
  });
};
