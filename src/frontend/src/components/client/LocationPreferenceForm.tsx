import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Save } from 'lucide-react';
import { useGetLocationPreference, useSaveLocationPreference } from '../../hooks/useQueries';

export default function LocationPreferenceForm() {
  const { data: currentPreference, isLoading } = useGetLocationPreference();
  const savePreference = useSaveLocationPreference();

  const [gymName, setGymName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [searchRadiusKm, setSearchRadiusKm] = useState('10');

  useEffect(() => {
    if (currentPreference) {
      setGymName(currentPreference.gymName);
      setSearchRadiusKm(currentPreference.searchRadiusKm.toString());
    }
  }, [currentPreference]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use placeholder coordinates since we're not using geolocation
      await savePreference.mutateAsync({
        latitude: 0,
        longitude: 0,
        searchRadiusKm: BigInt(searchRadiusKm),
        gymName,
      });
    } catch (error) {
      console.error('Failed to save location preference:', error);
    }
  };

  return (
    <Card className="border-2 border-secondary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
          <MapPin className="h-5 w-5 text-secondary" />
          Gym Location
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
              placeholder="e.g., Gold's Gym Downtown"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              className="border-2 font-semibold min-h-[44px]"
              required
            />
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
              value={searchRadiusKm}
              onChange={(e) => setSearchRadiusKm(e.target.value)}
              className="border-2 font-semibold min-h-[44px]"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full font-bold min-h-[44px]"
            disabled={savePreference.isPending || isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            {savePreference.isPending ? 'Saving...' : 'Save Location'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
