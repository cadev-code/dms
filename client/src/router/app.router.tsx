import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { createBrowserRouter, Navigate } from 'react-router';

export const appRouter = createBrowserRouter([
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/*',
    element: <Navigate to="/" />,
  },
]);
