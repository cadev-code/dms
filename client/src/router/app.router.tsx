import { Login } from '@/pages/Login';
import { createBrowserRouter, Navigate } from 'react-router';

export const appRouter = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/*',
    element: <Navigate to="/*" />,
  },
]);
