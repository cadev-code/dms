import { RouterProvider } from 'react-router';
import { appRouter } from './router/app.router';
import { GlobalAlert } from './components/dms/GlobalAlert';

export const DMS = () => {
  return (
    <>
      <RouterProvider router={appRouter} />
      <GlobalAlert />
    </>
  );
};
