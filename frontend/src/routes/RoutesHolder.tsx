import React, { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdminRoute } from './AdminRoute';
import { IsAuthenticate } from './IsAuthenticate';
import { ProtectedRoute } from './ProtectedRoute';
const MainLayout = lazy(() =>
  import('../layout/userLayout/MainLayout').then((module) => ({ default: module.MainLayout })),
);

const Article = lazy(() => import('../pages/Article').then((module) => ({ default: module.Article })));

const Blog = lazy(() => import('../pages/Blog').then((module) => ({ default: module.Blog })));
const AdminLayout = lazy(() =>
  import('../layout/adminLayout/AdminLayout').then((module) => ({ default: module.AdminLayout })),
);

const Login = lazy(() => import('../components/common/Login').then((module) => ({ default: module.Login })));

const User = lazy(() => import('../pages/User').then((module) => ({ default: module.User })));

const Post = lazy(() => import('../pages/Post').then((module) => ({ default: module.Post })));
const SignUp = lazy(() => import('../components/common/SignUp').then((module) => ({ default: module.SignUp })));

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
            element: <Article />,
          },
          {
            path: 'blog',
            element: <Blog />,
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
          {
            index: true,
            element: <Post />,
          },
          {
            path: 'user',
            element: <User />,
          },
        ],
      },
    ],
  },

  {
    element: <IsAuthenticate />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },

  {
    element: <IsAuthenticate />,
    children: [
      {
        path: '/signup',
        element: <SignUp />,
      },
    ],
  },
]);

export const RoutesHolder: React.FC = () => {
  return <RouterProvider router={route} />;
};
