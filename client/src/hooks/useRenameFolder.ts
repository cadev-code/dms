import { putter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface RenameFolderPayload {
  folderName: string;
  id: number;
}

interface RenameFolderResponse {
  error: null;
  message: string;
}

export const useRenameFolder = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    RenameFolderResponse,
    AxiosError<{ message: string; error: string }>,
    RenameFolderPayload
  >({
    mutationFn: (data) => {
      return putter(`/folders/${data.id}`, { folderName: data.folderName });
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
