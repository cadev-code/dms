import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlertStore } from '@/store/useAlertStore';
import { poster } from '@/api/queryHelpers';

interface UploadPayload {
  documentName: string;
  file: File;
  folderId: number;
  ticketNumber: string;
  version: string;
}

interface UploadResponse {
  error: null;
  message: string;
}

export const useUploadFile = (onClose: () => void) => {
  const { showAlert } = useAlertStore();

  const queryClient = useQueryClient();

  return useMutation<
    UploadResponse,
    AxiosError<{ message: string; error: string }>,
    UploadPayload
  >({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append('documentName', data.documentName);
      formData.append('ticketNumber', data.ticketNumber);
      formData.append('file', data.file);
      formData.append('folderId', data.folderId.toString());
      formData.append('version', data.version);

      return poster('/files', formData);
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
