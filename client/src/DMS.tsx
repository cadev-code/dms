import { RouterProvider } from 'react-router';
import { appRouter } from './router/app.router';
import { GlobalAlert } from './components/dms/GlobalAlert';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';
import { TooltipProvider } from './components/ui/tooltip';

export const DMS = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={appRouter} />
      </TooltipProvider>
      <GlobalAlert />
    </QueryClientProvider>
  );
};
