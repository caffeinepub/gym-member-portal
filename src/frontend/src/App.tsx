import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { BrandingProvider } from './contexts/BrandingContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import TrainerDashboard from './pages/TrainerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSetup from './pages/ProfileSetup';
import ExerciseLibraryPage from './pages/ExerciseLibraryPage';

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
  component: TrainerDashboard,
});

const clientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client-dashboard',
  component: ClientDashboard,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-dashboard',
  component: AdminDashboard,
});

const exercisesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exercises',
  component: ExerciseLibraryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileSetupRoute,
  trainerRoute,
  clientRoute,
  adminRoute,
  exercisesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrandingProvider>
        <RouterProvider router={router} />
        <Toaster />
      </BrandingProvider>
    </ThemeProvider>
  );
}
