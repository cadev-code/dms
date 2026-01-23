import { useMutation } from '@tanstack/react-query';

import type { AxiosError } from 'axios';
import { poster } from '@/api/queryHelpers';
import { useAlertStore } from '@/store/useAlertStore';
import { queryClient } from '@/config/queryClient';

interface AddGroupToFilePayload {
  fileId: number;
  groupId: number;
}

interface AddGroupToFileResponse {
  error: null;
  message: string;
}

export const useAddGroupToFile = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    AddGroupToFileResponse,
    AxiosError<{ message: string; error: string }>,
    AddGroupToFilePayload
  >({
    mutationFn: (data) => poster('/group-files', data),
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['file-permissions'] });
      showAlert(data.message, 'success');
    },
  });
};
