import React from 'react';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { AppUserRole } from '../../backend';
import AccessDeniedScreen from './AccessDeniedScreen';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: AppUserRole;
}

export default function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!userProfile || userProfile.role !== requiredRole) {
    return <AccessDeniedScreen requiredRole={requiredRole} />;
  }

  return <>{children}</>;
}
