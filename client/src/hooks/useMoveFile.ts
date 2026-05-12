import { putter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface MoveFilePayload {
  documentId: number;
  newFolderId: number;
}

interface MoveFileResponse {
  error: null;
  message: string;
}

export const useMoveFile = (onClose: () => void) => {
  const { showAlert } = useAlertStore();

  return useMutation<
    MoveFileResponse,
    AxiosError<{ message: string; error: string }>,
    MoveFilePayload
  >({
    mutationFn: (data) => {
      return putter(`/files/${data.documentId}/move/${data.newFolderId}`);
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['all-files'] });
      queryClient.invalidateQueries({ queryKey: ['files-by-type'] });
      queryClient.invalidateQueries({ queryKey: ['files-by-folder'] });
      showAlert(data.message, 'success');
      onClose();
    },
  });
};
