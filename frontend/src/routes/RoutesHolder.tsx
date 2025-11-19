import React, { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FacebookAuthSuccess } from '../components/common/FacebookAuthSuccess';
import { AdminRoute } from './AdminRoute';
import { ProtectedRoute } from './ProtectedRoute';

const MainLayout = lazy(() => import('../layout/userLayout/MainLayout'));
const AdminLayout = lazy(() => import('../layout/adminLayout/AdminLayout'));

const ArticlePage = lazy(() => import('../pages/Article'));
const BlogPage = lazy(() => import('../pages/Blog'));
const LoginPage = lazy(() => import('../components/common/Login'));
const User = lazy(() => import('../pages/User'));
const Post = lazy(() => import('../pages/Post'));
const SignUpPage = lazy(() => import('../components/common/SignUp'));

const route = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <ArticlePage />,
          },
          {
            path: 'blog',
            element: <BlogPage />,
          },
        ],
      },
    ],
  },

  {
    element: <AdminRoute />,
    children: [
      {
        path: '/aba-admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Post /> },
          { path: 'user', element: <User /> },
        ],
      },
    ],
  },

  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/signup',
    element: <SignUpPage />,
  },
  // ⭐ ADD THIS PUBLIC ROUTE — IMPORTANT!
  {
    path: '/facebook-auth-success',
    element: <FacebookAuthSuccess />,
  },
]);

export const RoutesHolder: React.FC = () => {
  return <RouterProvider router={route} />;
};
