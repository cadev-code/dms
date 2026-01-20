import { deleter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface DeleteFolderPayload {
  folderId: number;
}

interface DeleteFolderResponse {
  error: null;
  message: string;
}

export const useDeleteFolder = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    DeleteFolderResponse,
    AxiosError<{ message: string; error: string }>,
    DeleteFolderPayload
  >({
    mutationFn: (data) => {
      return deleter(`/folders/${data.folderId}`);
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['all-folders'] });
      showAlert(data.message, 'success');
    },
  });
};
