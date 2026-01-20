import { deleter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface DeleteFilePayload {
  documentId: number;
}

interface DeleteFileResponse {
  error: null;
  message: string;
}

export const useDeleteFile = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    DeleteFileResponse,
    AxiosError<{ message: string; error: string }>,
    DeleteFilePayload
  >({
    mutationFn: (data) => {
      return deleter(`/files/${data.documentId}`);
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['all-files'] });
      queryClient.invalidateQueries({ queryKey: ['files-by-type'] });
      queryClient.invalidateQueries({ queryKey: ['files-by-folder'] });
      showAlert(data.message, 'success');
    },
  });
};
