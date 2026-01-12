import { RouterProvider } from 'react-router';
import { appRouter } from './router/app.router';
import { GlobalAlert } from './components/dms/GlobalAlert';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';

export const DMS = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter} />
      <GlobalAlert />
    </QueryClientProvider>
  );
};
