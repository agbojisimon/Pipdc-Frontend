import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './components/layouts/PublicLayout';
import { AuthLayout } from './components/layouts/AuthLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { RequireAuth } from './components/routing/RequireAuth';
import { RedirectIfAuthenticated } from './components/routing/RedirectIfAuthenticated';
import { AdminGuard } from './components/routing/AdminGuard';
import { StaffGuard } from './components/routing/StaffGuard';
import { HomePage } from './pages/home/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentProfilePage } from './pages/AgentProfilePage';
import { BlogPage } from './pages/blog/BlogPage';
import { BlogDetailPage } from './pages/blog/BlogDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { DashboardSectionPage } from './pages/dashboard/DashboardSectionPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/properties', element: <PropertiesPage /> },
      { path: '/properties/:slug', element: <PropertyDetailsPage /> },
      { path: '/agents', element: <AgentsPage /> },
      { path: '/agents/:id', element: <AgentProfilePage /> },
      { path: '/blog', element: <BlogPage /> },
      { path: '/blog/:slug', element: <BlogDetailPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
    ],
  },
  {
    element: (
      <RedirectIfAuthenticated>
        <AuthLayout />
      </RedirectIfAuthenticated>
    ),
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'properties',
        element: (
          <StaffGuard>
            <DashboardSectionPage section="properties" />
          </StaffGuard>
        ),
      },
      {
        path: 'agents',
        element: (
          <AdminGuard>
            <DashboardSectionPage section="agents" />
          </AdminGuard>
        ),
      },
      {
        path: 'enquiries',
        element: (
          <StaffGuard>
            <DashboardSectionPage section="enquiries" />
          </StaffGuard>
        ),
      },
      {
        path: 'my-enquiries',
        element: <DashboardSectionPage section="my-enquiries" />,
      },
      {
        path: 'blog',
        element: (
          <AdminGuard>
            <DashboardSectionPage section="blog" />
          </AdminGuard>
        ),
      },
      {
        path: 'users',
        element: (
          <AdminGuard>
            <DashboardSectionPage section="users" />
          </AdminGuard>
        ),
      },
      {
        path: 'settings',
        element: <DashboardSectionPage section="settings" />,
      },
      {
        path: 'saved',
        element: <DashboardSectionPage section="saved" />,
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
