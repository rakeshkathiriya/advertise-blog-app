import React, { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FacebookAuthSuccess } from '../components/common/FacebookAuthSuccess';
import { AdminRoute } from './AdminRoute';
import { IsAuthenticate } from './IsAuthenticate';
import { ProtectedRoute } from './ProtectedRoute';

const MainLayout = lazy(() => import('../layout/userLayout/MainLayout').then((m) => ({ default: m.MainLayout })));

const Article = lazy(() => import('../pages/Article').then((m) => ({ default: m.Article })));

const Blog = lazy(() => import('../pages/Blog').then((m) => ({ default: m.Blog })));

const AdminLayout = lazy(() => import('../layout/adminLayout/AdminLayout').then((m) => ({ default: m.AdminLayout })));

const Login = lazy(() => import('../components/common/Login').then((m) => ({ default: m.Login })));

const User = lazy(() => import('../pages/User').then((m) => ({ default: m.User })));

const Post = lazy(() => import('../pages/Post').then((m) => ({ default: m.Post })));

const SignUp = lazy(() => import('../components/common/SignUp').then((m) => ({ default: m.SignUp })));

// ⭐ ADD THIS

const route = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <Article /> },
          { path: 'blog', element: <Blog /> },
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
    element: <IsAuthenticate />,
    children: [{ path: '/login', element: <Login /> }],
  },

  {
    element: <IsAuthenticate />,
    children: [{ path: '/signup', element: <SignUp /> }],
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
