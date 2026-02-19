import React, { createContext, useContext, useEffect } from 'react';
import { useGetBrandingSettings } from '../hooks/useQueries';
import type { BrandingSettings } from '../backend';

interface BrandingContextType {
  branding: BrandingSettings | null;
  isLoading: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { data: branding, isLoading } = useGetBrandingSettings();

  useEffect(() => {
    if (branding) {
      // Apply branding colors as CSS variables
      const root = document.documentElement;
      
      // Convert hex to OKLCH (simplified - using the hex as-is for now)
      // In production, you'd want proper color conversion
      if (branding.primaryColor) {
        root.style.setProperty('--brand-primary', branding.primaryColor);
      }
      if (branding.secondaryColor) {
        root.style.setProperty('--brand-secondary', branding.secondaryColor);
      }
      if (branding.accentColor) {
        root.style.setProperty('--brand-accent', branding.accentColor);
      }
    }
  }, [branding]);

  return (
    <BrandingContext.Provider value={{ branding: branding || null, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within BrandingProvider');
  }
  return context;
}
