import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { BrandingProvider } from './contexts/BrandingContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import TrainerDashboard from './pages/TrainerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSetup from './pages/ProfileSetup';
import RoleGuard from './components/auth/RoleGuard';
import { AppUserRole } from './backend';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile-setup',
  component: ProfileSetup,
});

const trainerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trainer-dashboard',
  component: () => (
    <RoleGuard requiredRole={AppUserRole.trainer}>
      <TrainerDashboard />
    </RoleGuard>
  ),
});

const clientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client-dashboard',
  component: () => (
    <RoleGuard requiredRole={AppUserRole.client}>
      <ClientDashboard />
    </RoleGuard>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-dashboard',
  component: () => (
    <RoleGuard requiredRole={AppUserRole.admin}>
      <AdminDashboard />
    </RoleGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileSetupRoute,
  trainerRoute,
  clientRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  // Handle routing based on authentication and profile status
  React.useEffect(() => {
    if (isInitializing || profileLoading) return;

    const currentPath = window.location.pathname;

    if (!identity) {
      // Not authenticated - stay on landing page
      if (currentPath !== '/') {
        navigate({ to: '/' });
      }
      return;
    }

    // Authenticated but no profile
    if (isFetched && userProfile === null) {
      if (currentPath !== '/profile-setup') {
        navigate({ to: '/profile-setup' });
      }
      return;
    }

    // Authenticated with profile - redirect to appropriate dashboard
    if (userProfile && currentPath === '/') {
      switch (userProfile.role) {
        case AppUserRole.admin:
          navigate({ to: '/admin-dashboard' });
          break;
        case AppUserRole.trainer:
          navigate({ to: '/trainer-dashboard' });
          break;
        case AppUserRole.client:
          navigate({ to: '/client-dashboard' });
          break;
      }
    }
  }, [identity, userProfile, isInitializing, profileLoading, isFetched, navigate]);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrandingProvider>
        <AppContent />
        <Toaster />
      </BrandingProvider>
    </ThemeProvider>
  );
}

import React from 'react';
