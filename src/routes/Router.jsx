import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const AdminPermissionsPage = lazy(
  () => import('../pages/AdminPermissionPage.tsx')
);

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/admin',
    element: <AdminPermissionsPage />,
  },
  {
    path: '*',
    element: (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! This page doesn't exist.
        </p>
        <button
          onClick={() => (window.location.href = '/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    ),
  },
]);
