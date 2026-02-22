import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Search, Users, Target, Dumbbell } from 'lucide-react';
import { useGetNearbyUsers, useSendConnectionRequest } from '../../hooks/useQueries';
import { toast } from 'sonner';
import LocationPreferenceForm from './LocationPreferenceForm';
import TrainingPartnerPreferenceForm from './TrainingPartnerPreferenceForm';
import ConnectionRequestManager from './ConnectionRequestManager';

export default function GymBuddyLocator() {
  const [zipCode, setZipCode] = useState('');
  const [searchRadius, setSearchRadius] = useState('10');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data: nearbyUsers = [] } = useGetNearbyUsers();
  const sendRequest = useSendConnectionRequest();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zipCode.trim()) {
      toast.error('Please enter a zip code or city name');
      return;
    }

    setIsSearching(true);
    
    // Simulate search - in a real app, this would call a backend method
    // For now, we'll use the existing nearby users data
    setTimeout(() => {
      setSearchResults(nearbyUsers);
      setIsSearching(false);
      toast.success(`Found ${nearbyUsers.length} training partners in your area`);
    }, 500);
  };

  const handleConnect = async (userId: any, userName: string) => {
    try {
      await sendRequest.mutateAsync({
        receiverId: userId,
        message: `Hi ${userName}, I'd like to connect as training partners!`,
      });
      toast.success('Connection request sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send connection request');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-zinc-950 to-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase">
            <Users className="h-6 w-6 text-primary" />
            Gym Buddy Finder
          </CardTitle>
          <CardDescription className="font-semibold">
            Find training partners in your area by zip code or city
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="zipCode" className="font-bold uppercase text-sm">
                  Zip Code or City
                </Label>
                <Input
                  id="zipCode"
                  placeholder="e.g., 90210 or Los Angeles"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="border-2 font-semibold min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="radius" className="font-bold uppercase text-sm">
                  Radius (km)
                </Label>
                <Input
                  id="radius"
                  type="number"
                  min="1"
                  max="100"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(e.target.value)}
                  className="border-2 font-semibold min-h-[44px]"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full font-bold min-h-[44px] bg-gradient-to-r from-volt-green to-electric-blue text-zinc-950 hover:opacity-90"
              disabled={isSearching}
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search Training Partners'}
            </Button>
          </form>

          <Separator className="bg-zinc-800" />

          {/* Search Results */}
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase text-volt-green">
                {searchResults.length} Training Partners Found
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {searchResults.map((user) => (
                  <Card key={user.userId.toString()} className="border-2 border-secondary/30">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-black text-lg">{user.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-secondary" />
                            <span className="font-semibold">{user.distanceKm.toFixed(1)} km away</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-bold">
                          {user.experienceLevel}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm font-bold">Goals:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {user.fitnessGoals.map((goal: string) => (
                            <Badge key={goal} variant="secondary" className="text-xs">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleConnect(user.userId, user.name)}
                        disabled={sendRequest.isPending}
                        className="w-full font-bold min-h-[44px]"
                      >
                        <Dumbbell className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-semibold">
                Enter your location to find training partners nearby
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <TrainingPartnerPreferenceForm />
        <ConnectionRequestManager />
      </div>
    </div>
  );
}
