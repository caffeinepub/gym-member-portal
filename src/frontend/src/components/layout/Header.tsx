import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useBranding } from '../../contexts/BrandingContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MessageSquare, Dumbbell, Users, TrendingUp, Pill, User, ClipboardList } from 'lucide-react';
import { AppUserRole } from '../../backend';
import VortexChat from '../vortex/VortexChat';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { branding } = useBranding();
  const [vortexOpen, setVortexOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const isActive = (path: string) => location.pathname === path;

  const logoUrl = branding?.logoUrl || '/assets/generated/gym-logo.dim_256x256.png';

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <img src={logoUrl} alt="Iron Temple Logo" className="h-12 w-12 rounded-lg object-cover" />
            <span className="text-2xl font-black tracking-tighter text-primary">IRON TEMPLE</span>
          </button>

          {isAuthenticated && userProfile && (
            <nav className="hidden items-center gap-2 lg:flex">
              {userProfile.role === AppUserRole.client && (
                <>
                  <Button
                    variant={isActive('/client-dashboard') ? 'default' : 'ghost'}
                    onClick={() => navigate({ to: '/client-dashboard' })}
                    className="gap-2 font-extrabold"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant={isActive('/workout-logs') ? 'default' : 'ghost'}
                    onClick={() => navigate({ to: '/workout-logs' })}
                    className="gap-2 font-extrabold"
                  >
                    <Dumbbell className="h-4 w-4" />
                    Workout Logs
                  </Button>
                  <Button
                    variant={isActive('/flex-wall') ? 'default' : 'ghost'}
                    onClick={() => navigate({ to: '/flex-wall' })}
                    className="gap-2 font-extrabold"
                  >
                    <Users className="h-4 w-4" />
                    Flex Wall
                  </Button>
                  <Button
                    variant={isActive('/analytics') ? 'default' : 'ghost'}
                    onClick={() => navigate({ to: '/analytics' })}
                    className="gap-2 font-extrabold"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Analytics
                  </Button>
                  <Button
                    variant={isActive('/supplements') ? 'default' : 'ghost'}
                    onClick={() => navigate({ to: '/supplements' })}
                    className="gap-2 font-extrabold"
                  >
                    <Pill className="h-4 w-4" />
                    Supplements
                  </Button>
                </>
              )}
              {userProfile.role === AppUserRole.trainer && (
                <Button
                  variant={isActive('/trainer-dashboard') ? 'default' : 'ghost'}
                  onClick={() => navigate({ to: '/trainer-dashboard' })}
                  className="font-extrabold"
                >
                  Dashboard
                </Button>
              )}
              {userProfile.role === AppUserRole.admin && (
                <Button
                  variant={isActive('/admin-dashboard') ? 'default' : 'ghost'}
                  onClick={() => navigate({ to: '/admin-dashboard' })}
                  className="font-extrabold"
                >
                  Admin
                </Button>
              )}
              <Button
                variant={isActive('/exercises') ? 'default' : 'ghost'}
                onClick={() => navigate({ to: '/exercises' })}
                className="gap-2 font-extrabold"
              >
                <ClipboardList className="h-4 w-4" />
                Exercises
              </Button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVortexOpen(true)}
            className="gap-2 border-secondary font-extrabold text-secondary hover:bg-secondary/10 hover:text-secondary"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">VORTEX AI</span>
          </Button>

          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            className="font-extrabold"
          >
            {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>

          {isAuthenticated && userProfile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-card">
                <nav className="flex flex-col gap-4 pt-8">
                  {userProfile.role === AppUserRole.client && (
                    <>
                      <Button
                        variant={isActive('/client-dashboard') ? 'default' : 'ghost'}
                        onClick={() => {
                          navigate({ to: '/client-dashboard' });
                          setMobileMenuOpen(false);
                        }}
                        className="gap-2 font-extrabold"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Button>
                      <Button
                        variant={isActive('/workout-logs') ? 'default' : 'ghost'}
                        onClick={() => {
                          navigate({ to: '/workout-logs' });
                          setMobileMenuOpen(false);
                        }}
                        className="gap-2 font-extrabold"
                      >
                        <Dumbbell className="h-4 w-4" />
                        Workout Logs
                      </Button>
                      <Button
                        variant={isActive('/flex-wall') ? 'default' : 'ghost'}
                        onClick={() => {
                          navigate({ to: '/flex-wall' });
                          setMobileMenuOpen(false);
                        }}
                        className="gap-2 font-extrabold"
                      >
                        <Users className="h-4 w-4" />
                        Flex Wall
                      </Button>
                      <Button
                        variant={isActive('/analytics') ? 'default' : 'ghost'}
                        onClick={() => {
                          navigate({ to: '/analytics' });
                          setMobileMenuOpen(false);
                        }}
                        className="gap-2 font-extrabold"
                      >
                        <TrendingUp className="h-4 w-4" />
                        Analytics
                      </Button>
                      <Button
                        variant={isActive('/supplements') ? 'default' : 'ghost'}
                        onClick={() => {
                          navigate({ to: '/supplements' });
                          setMobileMenuOpen(false);
                        }}
                        className="gap-2 font-extrabold"
                      >
                        <Pill className="h-4 w-4" />
                        Supplements
                      </Button>
                    </>
                  )}
                  {userProfile.role === AppUserRole.trainer && (
                    <Button
                      variant={isActive('/trainer-dashboard') ? 'default' : 'ghost'}
                      onClick={() => {
                        navigate({ to: '/trainer-dashboard' });
                        setMobileMenuOpen(false);
                      }}
                      className="font-extrabold"
                    >
                      Trainer Dashboard
                    </Button>
                  )}
                  {userProfile.role === AppUserRole.admin && (
                    <Button
                      variant={isActive('/admin-dashboard') ? 'default' : 'ghost'}
                      onClick={() => {
                        navigate({ to: '/admin-dashboard' });
                        setMobileMenuOpen(false);
                      }}
                      className="font-extrabold"
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    variant={isActive('/exercises') ? 'default' : 'ghost'}
                    onClick={() => {
                      navigate({ to: '/exercises' });
                      setMobileMenuOpen(false);
                    }}
                    className="gap-2 font-extrabold"
                  >
                    <ClipboardList className="h-4 w-4" />
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
