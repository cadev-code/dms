import { axiosClient } from '@/lib/axiosClient';
import { useMutation } from '@tanstack/react-query';

export const useReportAllDocuments = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosClient.get(`/reports/all-documents`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${`all-documents-report`}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
