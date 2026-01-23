import { putter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface RenameFilePayload {
  documentId: number;
  documentName: string;
  ticketNumber: string;
}

interface RenameFileResponse {
  error: null;
  message: string;
}

export const useEditFile = (onClose: () => void) => {
  const { showAlert } = useAlertStore();

  return useMutation<
    RenameFileResponse,
    AxiosError<{ message: string; error: string }>,
    RenameFilePayload
  >({
    mutationFn: (data) => {
      return putter(`/files/${data.documentId}`, {
        documentName: data.documentName,
        ticketNumber: data.ticketNumber,
      });
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
