import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useBranding } from '../../contexts/BrandingContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MessageSquare, Dumbbell } from 'lucide-react';
import { AppUserRole } from '../../backend';
import VortexChat from '../vortex/VortexChat';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const navigate = useNavigate();
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { branding } = useBranding();
  const [vortexOpen, setVortexOpen] = useState(false);
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Auto-open VORTEX on mount
  useEffect(() => {
    setVortexOpen(true);
  }, []);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const logoUrl = branding?.logoUrl || '/assets/generated/gym-logo.dim_256x256.png';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <img src={logoUrl} alt="Gym Logo" className="h-10 w-10 rounded-lg object-cover" />
            <span className="text-xl font-bold tracking-tight">FitPortal</span>
          </button>

          {isAuthenticated && userProfile && (
            <nav className="hidden items-center gap-6 md:flex">
              {userProfile.role === AppUserRole.admin && (
                <Button variant="ghost" onClick={() => navigate({ to: '/admin-dashboard' })}>
                  Admin
                </Button>
              )}
              {userProfile.role === AppUserRole.trainer && (
                <Button variant="ghost" onClick={() => navigate({ to: '/trainer-dashboard' })}>
                  Dashboard
                </Button>
              )}
              {userProfile.role === AppUserRole.client && (
                <Button variant="ghost" onClick={() => navigate({ to: '/client-dashboard' })}>
                  My Workouts
                </Button>
              )}
              <Button variant="ghost" onClick={() => navigate({ to: '/exercises' })} className="gap-2">
                <Dumbbell className="h-4 w-4" />
                Exercises
              </Button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setVortexOpen(true)} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">VORTEX AI</span>
          </Button>

          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
          >
            {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>

          {isAuthenticated && userProfile && (
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 pt-8">
                  {userProfile.role === AppUserRole.admin && (
                    <Button variant="ghost" onClick={() => navigate({ to: '/admin-dashboard' })}>
                      Admin Dashboard
                    </Button>
                  )}
                  {userProfile.role === AppUserRole.trainer && (
                    <Button variant="ghost" onClick={() => navigate({ to: '/trainer-dashboard' })}>
                      Trainer Dashboard
                    </Button>
                  )}
                  {userProfile.role === AppUserRole.client && (
                    <Button variant="ghost" onClick={() => navigate({ to: '/client-dashboard' })}>
                      My Workouts
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => navigate({ to: '/exercises' })} className="gap-2">
                    <Dumbbell className="h-4 w-4" />
                    Exercise Library
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      <VortexChat open={vortexOpen} onOpenChange={setVortexOpen} />
    </header>
  );
}
