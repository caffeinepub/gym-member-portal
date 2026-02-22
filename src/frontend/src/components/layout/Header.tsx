import React, { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useBranding } from '../../contexts/BrandingContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MessageSquare, Dumbbell, Users, TrendingUp, Pill, User, ClipboardList } from 'lucide-react';
import { AppUserRole } from '../../backend';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { branding } = useBranding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

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
            <nav className="hidden items-center gap-3 lg:flex">
              {userProfile.role === AppUserRole.client && (
                <>
                  <Button
                    variant={isActive('/client-dashboard') ? 'default' : 'ghost'}
                    onClick={() => navigate({ to: '/client-dashboard' })}
                    className="gap-2 font-extrabold min-h-[44px] px-4"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant={isActive('/workout-logs') ? 'default' : 'ghost'}
                    onClick={() => navigate({ to: '/workout-logs' })}
                    className="gap-2 font-extrabold min-h-[44px] px-4"
                  >
                    <Dumbbell className="h-4 w-4" />
                    Workout Logs
                  </Button>
                  <Button
                    variant={isActive('/flex-wall') ? 'default' : 'ghost'}
                    onClick={() => navigate({ to: '/flex-wall' })}
                    className="gap-2 font-extrabold min-h-[44px] px-4"
                  >
                    <Users className="h-4 w-4" />
                    Flex Wall
                  </Button>
                  <Button
                    variant={isActive('/analytics') ? 'default' : 'ghost'}
                    onClick={() => navigate({ to: '/analytics' })}
                    className="gap-2 font-extrabold min-h-[44px] px-4"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Analytics
                  </Button>
                  <Button
                    variant={isActive('/supplements') ? 'default' : 'ghost'}
                    onClick={() => navigate({ to: '/supplements' })}
                    className="gap-2 font-extrabold min-h-[44px] px-4"
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
                  className="font-extrabold min-h-[44px] px-4"
                >
                  Dashboard
                </Button>
              )}
              {userProfile.role === AppUserRole.admin && (
                <Button
                  variant={isActive('/admin-dashboard') ? 'default' : 'ghost'}
                  onClick={() => navigate({ to: '/admin-dashboard' })}
                  className="font-extrabold min-h-[44px] px-4"
                >
                  Admin
                </Button>
              )}
              <Button
                variant={isActive('/exercises') ? 'default' : 'ghost'}
                onClick={() => navigate({ to: '/exercises' })}
                className="gap-2 font-extrabold min-h-[44px] px-4"
              >
                <ClipboardList className="h-4 w-4" />
                Exercises
              </Button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && userProfile && (
            <Button
              variant={isActive('/vortex-ai') ? 'default' : 'ghost'}
              onClick={() => navigate({ to: '/vortex-ai' })}
              className="hidden lg:flex gap-2 font-extrabold min-h-[44px] px-4 border-secondary text-secondary hover:bg-secondary/10"
            >
              <MessageSquare className="h-4 w-4" />
              VORTEX AI
            </Button>
          )}

          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            className="font-extrabold min-h-[44px] px-6"
          >
            {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>

          {isAuthenticated && userProfile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]">
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
                        className="gap-2 font-extrabold min-h-[44px] justify-start"
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
                        className="gap-2 font-extrabold min-h-[44px] justify-start"
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
                        className="gap-2 font-extrabold min-h-[44px] justify-start"
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
                        className="gap-2 font-extrabold min-h-[44px] justify-start"
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
                        className="gap-2 font-extrabold min-h-[44px] justify-start"
                      >
                        <Pill className="h-4 w-4" />
                        Supplements
                      </Button>
                      <Button
                        variant={isActive('/vortex-ai') ? 'default' : 'ghost'}
                        onClick={() => {
                          navigate({ to: '/vortex-ai' });
                          setMobileMenuOpen(false);
                        }}
                        className="gap-2 font-extrabold min-h-[44px] justify-start border-secondary text-secondary"
                      >
                        <MessageSquare className="h-4 w-4" />
                        VORTEX AI
                      </Button>
                    </>
                  )}
                  {userProfile.role === AppUserRole.trainer && (
                    <>
                      <Button
                        variant={isActive('/trainer-dashboard') ? 'default' : 'ghost'}
                        onClick={() => {
                          navigate({ to: '/trainer-dashboard' });
                          setMobileMenuOpen(false);
                        }}
                        className="font-extrabold min-h-[44px] justify-start"
                      >
                        Trainer Dashboard
                      </Button>
                      <Button
                        variant={isActive('/vortex-ai') ? 'default' : 'ghost'}
                        onClick={() => {
                          navigate({ to: '/vortex-ai' });
                          setMobileMenuOpen(false);
                        }}
                        className="gap-2 font-extrabold min-h-[44px] justify-start border-secondary text-secondary"
                      >
                        <MessageSquare className="h-4 w-4" />
                        VORTEX AI
                      </Button>
                    </>
                  )}
                  {userProfile.role === AppUserRole.admin && (
                    <>
                      <Button
                        variant={isActive('/admin-dashboard') ? 'default' : 'ghost'}
                        onClick={() => {
                          navigate({ to: '/admin-dashboard' });
                          setMobileMenuOpen(false);
                        }}
                        className="font-extrabold min-h-[44px] justify-start"
                      >
                        Admin Dashboard
                      </Button>
                      <Button
                        variant={isActive('/vortex-ai') ? 'default' : 'ghost'}
                        onClick={() => {
                          navigate({ to: '/vortex-ai' });
                          setMobileMenuOpen(false);
                        }}
                        className="gap-2 font-extrabold min-h-[44px] justify-start border-secondary text-secondary"
                      >
                        <MessageSquare className="h-4 w-4" />
                        VORTEX AI
                      </Button>
                    </>
                  )}
                  <Button
                    variant={isActive('/exercises') ? 'default' : 'ghost'}
                    onClick={() => {
                      navigate({ to: '/exercises' });
                      setMobileMenuOpen(false);
                    }}
                    className="gap-2 font-extrabold min-h-[44px] justify-start"
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
    </header>
  );
}
