import { poster } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface CreateFolderPayload {
  folderName: string;
  parentId: number | null;
}

interface CreateFolderResponse {
  error: null;
  message: string;
}

export const useCreateFolder = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    CreateFolderResponse,
    AxiosError<{ message: string; error: string }>,
    CreateFolderPayload
  >({
    mutationFn: (data) => {
      return poster('/folders', data);
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
