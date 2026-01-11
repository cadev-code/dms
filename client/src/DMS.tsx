import { RouterProvider } from 'react-router';
import { appRouter } from './router/app.router';

export const DMS = () => {
  return <RouterProvider router={appRouter} />;
};
