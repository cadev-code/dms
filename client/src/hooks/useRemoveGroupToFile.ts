import { deleter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useAlertStore } from '@/store/useAlertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface RemoveGroupToFilePayload {
  groupId: number;
  fileId: number;
}

interface RemoveGroupToFileResponse {
  error: null;
  message: string;
}

export const useRemoveGroupToFile = () => {
  const { showAlert } = useAlertStore();

  return useMutation<
    RemoveGroupToFileResponse,
    AxiosError<{ message: string; error: string }>,
    RemoveGroupToFilePayload
  >({
    mutationFn: (data) => {
      return deleter(`/group-files/${data.groupId}/${data.fileId}/`);
    },
    onError: (error) => {
      showAlert(error.response?.data.message, 'error');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['file-permissions'] });
      showAlert(data.message, 'success');
    },
  });
};
