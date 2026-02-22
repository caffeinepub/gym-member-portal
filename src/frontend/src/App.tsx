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
import FlexWallPage from './pages/FlexWallPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import SupplementStackPage from './pages/SupplementStackPage';
import WorkoutLogsPage from './pages/WorkoutLogsPage';
import VortexAIPage from './pages/VortexAIPage';

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <BrandingProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
        <Toaster />
      </BrandingProvider>
    </ThemeProvider>
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

const trainerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trainer-dashboard',
  component: TrainerDashboard,
});

const clientDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client-dashboard',
  component: ClientDashboard,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-dashboard',
  component: AdminDashboard,
});

const exercisesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exercises',
  component: ExerciseLibraryPage,
});

const flexWallRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/flex-wall',
  component: FlexWallPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: AnalyticsDashboardPage,
});

const supplementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/supplements',
  component: SupplementStackPage,
});

const workoutLogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workout-logs',
  component: WorkoutLogsPage,
});

const vortexAIRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vortex-ai',
  component: VortexAIPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileSetupRoute,
  trainerDashboardRoute,
  clientDashboardRoute,
  adminDashboardRoute,
  exercisesRoute,
  flexWallRoute,
  analyticsRoute,
  supplementsRoute,
  workoutLogsRoute,
  vortexAIRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
