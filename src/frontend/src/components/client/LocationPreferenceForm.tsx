import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Save } from 'lucide-react';
import { useGetLocationPreference, useSaveLocationPreference } from '../../hooks/useQueries';

export default function LocationPreferenceForm() {
  const { data: currentPreference, isLoading } = useGetLocationPreference();
  const savePreference = useSaveLocationPreference();

  const [gymName, setGymName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [searchRadius, setSearchRadius] = useState('10');

  useEffect(() => {
    if (currentPreference) {
      setGymName(currentPreference.gymName);
      setLatitude(currentPreference.latitude.toString());
      setLongitude(currentPreference.longitude.toString());
      setSearchRadius(currentPreference.searchRadiusKm.toString());
    }
  }, [currentPreference]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await savePreference.mutateAsync({
        gymName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        searchRadiusKm: BigInt(searchRadius),
      });
    } catch (error) {
      console.error('Failed to save location preference:', error);
    }
  };

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
          <MapPin className="h-5 w-5 text-primary" />
          Location Preferences
        </CardTitle>
        <CardDescription className="font-semibold">
          Set your gym location to find nearby training partners
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gymName" className="font-bold uppercase text-sm">
              Gym Name
            </Label>
            <Input
              id="gymName"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              placeholder="e.g., Iron Temple Gym"
              className="border-2 font-semibold"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="font-bold uppercase text-sm">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 40.7128"
                className="border-2 font-semibold"
                required
              />
              <p className="text-xs text-muted-foreground font-semibold">
                Use Google Maps to find coordinates
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude" className="font-bold uppercase text-sm">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., -74.0060"
                className="border-2 font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchRadius" className="font-bold uppercase text-sm">
              Search Radius (km)
            </Label>
            <Input
              id="searchRadius"
              type="number"
              min="1"
              max="100"
              value={searchRadius}
              onChange={(e) => setSearchRadius(e.target.value)}
              className="border-2 font-semibold"
              required
            />
            <p className="text-xs text-muted-foreground font-semibold">
              How far you're willing to travel to meet training partners
            </p>
          </div>

          <Button type="submit" className="w-full font-bold" disabled={savePreference.isPending || isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {savePreference.isPending ? 'Saving...' : 'Save Location'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
