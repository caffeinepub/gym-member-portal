import React, { useState, useEffect } from 'react';
import { useGetBrandingSettings, useUpdateBrandingSettings } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function BrandingControls() {
  const { data: branding, isLoading } = useGetBrandingSettings();
  const updateBranding = useUpdateBrandingSettings();
  
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#FF6B35');
  const [secondaryColor, setSecondaryColor] = useState('#F7931E');
  const [accentColor, setAccentColor] = useState('#C1121F');

  useEffect(() => {
    if (branding) {
      setLogoUrl(branding.logoUrl || '/assets/generated/gym-logo.dim_256x256.png');
      setPrimaryColor(branding.primaryColor || '#FF6B35');
      setSecondaryColor(branding.secondaryColor || '#F7931E');
      setAccentColor(branding.accentColor || '#C1121F');
    }
  }, [branding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateBranding.mutateAsync({
        logoUrl: logoUrl || '/assets/generated/gym-logo.dim_256x256.png',
        primaryColor,
        secondaryColor,
        accentColor,
      });

      toast.success('Branding updated successfully!');
    } catch (error) {
      toast.error('Failed to update branding');
      console.error(error);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading branding settings...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            placeholder="/assets/generated/gym-logo.dim_256x256.png"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Default logo will be used if left empty
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <img
                src={logoUrl || '/assets/generated/gym-logo.dim_256x256.png'}
                alt="Logo Preview"
                className="h-20 w-20 rounded-lg border object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/assets/generated/gym-logo.dim_256x256.png';
                }}
              />
              <div>
                <p className="text-sm font-medium">Logo Preview</p>
                <p className="text-xs text-muted-foreground">This is how your logo will appear</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex gap-2">
            <Input
              id="primaryColor"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-10 w-20"
            />
            <Input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <div className="flex gap-2">
            <Input
              id="secondaryColor"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="h-10 w-20"
            />
            <Input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="flex gap-2">
            <Input
              id="accentColor"
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-20"
            />
            <Input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Color Preview</p>
            <div className="flex gap-2">
              <div className="h-12 flex-1 rounded" style={{ backgroundColor: primaryColor }} />
              <div className="h-12 flex-1 rounded" style={{ backgroundColor: secondaryColor }} />
              <div className="h-12 flex-1 rounded" style={{ backgroundColor: accentColor }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={updateBranding.isPending}>
        {updateBranding.isPending ? 'Saving...' : 'Save Branding'}
      </Button>
    </form>
  );
}
