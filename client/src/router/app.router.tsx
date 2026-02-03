import { createBrowserRouter, Navigate } from 'react-router';

import { ChangePassword } from '@/pages/ChangePassword';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Settings } from '@/pages/Settings';

import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

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
    path: '/change-password',
    element: <PrivateRoute element={<ChangePassword />} />,
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
