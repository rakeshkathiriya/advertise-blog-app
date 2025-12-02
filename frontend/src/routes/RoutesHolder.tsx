import React, { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FacebookAuthSuccess } from '../components/common/FacebookAuthSuccess';
import { AdminRoute } from './AdminRoute';
import { IsAuthenticate } from './IsAuthenticate';
import { ProtectedRoute } from './ProtectedRoute';

const MainLayout = lazy(() => import('../layout/userLayout/MainLayout'));
const AdminLayout = lazy(() => import('../layout/adminLayout/AdminLayout'));

const ArticlePage = lazy(() => import('../pages/Article'));
const PricingPlanPage = lazy(() => import('../components/PricingCard'));
const BlogPage = lazy(() => import('../pages/Blog/Blog'));
const FullBlog = lazy(() => import('../pages/Blog/FullBlog'));
const LoginPage = lazy(() => import('../components/common/Login'));
const SignUpPage = lazy(() => import('../components/common/SignUp'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('../pages/AdminPages/Dashboard'));

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
          {
            path: 'pricingPlan',
            element: <PricingPlanPage />,
          },
          {
            path: 'blog/:id',
            element: <FullBlog />,
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
        children: [{ index: true, element: <AdminDashboardPage /> }],
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
  {
    path: '*',
    element: <PageNotFound />,
  },
]);

export const RoutesHolder: React.FC = () => {
  return <RouterProvider router={route} />;
};
