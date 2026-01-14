import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlertStore } from '@/store/useAlertStore';
import { poster } from '@/api/queryHelpers';

interface UploadPayload {
  documentName: string;
  file: File;
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
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append('documentName', data.documentName);
      formData.append('file', data.file);

      return poster('/files', formData);
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['all-files'] });
      showAlert(data.message, 'success');
      onClose();
    },
  });
};
