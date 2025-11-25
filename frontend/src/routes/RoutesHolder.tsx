import React, { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FacebookAuthSuccess } from '../components/common/FacebookAuthSuccess';
import SocialMediaPostForm from '../pages/Post';
import { AdminRoute } from './AdminRoute';
import { IsAuthenticate } from './IsAuthenticate';
import { ProtectedRoute } from './ProtectedRoute';
const MainLayout = lazy(() => import('../layout/userLayout/MainLayout'));
const AdminLayout = lazy(() => import('../layout/adminLayout/AdminLayout'));

const ArticlePage = lazy(() => import('../pages/Article'));
const BlogPage = lazy(() => import('../pages/Blog'));
const LoginPage = lazy(() => import('../components/common/Login'));
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
        children: [{ index: true, element: <SocialMediaPostForm /> }],
      },
    ],
  },

  {
    element: <IsAuthenticate />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },

  {
    element: <IsAuthenticate />,
    children: [
      {
        path: '/signup',
        element: <SignUpPage />,
      },
    ],
  },

  {
    path: '/facebook-auth-success',
    element: <FacebookAuthSuccess />,
  },
]);

export const RoutesHolder: React.FC = () => {
  return <RouterProvider router={route} />;
};
