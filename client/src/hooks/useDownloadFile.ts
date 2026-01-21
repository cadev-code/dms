import { axiosClient } from '@/lib/axiosClient';
import { Document } from '@/types/document.types';
import { useMutation } from '@tanstack/react-query';

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: async (file: Document) => {
      const response = await axiosClient.get(`/files/${file.id}/download`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.documentName}.${file.fileName.split('.').pop() || 'bin'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
