import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { createBrowserRouter, Navigate } from 'react-router';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import Settings from '@/pages/Settings';

export const appRouter = createBrowserRouter([
  {
    index: true,
    element: <PrivateRoute element={<Dashboard />} />,
  },
  {
    path: '/login',
    element: <PublicRoute element={<Login />} />,
  },
  {
    path: '/settings',
    element: <PrivateRoute element={<Settings />} />,
  },
  {
    path: '/*',
    element: <Navigate to="/" />,
  },
]);
