import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, MapPin, Target, Award, Send } from 'lucide-react';
import { useGetNearbyUsers, useSendConnectionRequest } from '../../hooks/useQueries';
import type { NearbyUser } from '../../backend';

export default function GymBuddyLocator() {
  const { data: nearbyUsers = [], isLoading } = useGetNearbyUsers();
  const sendRequest = useSendConnectionRequest();
  const [selectedUser, setSelectedUser] = useState<NearbyUser | null>(null);
  const [message, setMessage] = useState('');

  const handleSendRequest = async () => {
    if (!selectedUser) return;
    try {
      await sendRequest.mutateAsync({
        receiverId: selectedUser.userId,
        message,
      });
      setSelectedUser(null);
      setMessage('');
    } catch (error) {
      console.error('Failed to send connection request:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-secondary/30 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-secondary/20 p-3">
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black uppercase tracking-tight">GYM BUDDY LOCATOR</CardTitle>
              <CardDescription className="text-base font-semibold">
                Find training partners in your area
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="font-semibold text-muted-foreground">Searching for nearby users...</p>
            </div>
          ) : nearbyUsers.length === 0 ? (
            <div className="rounded-lg border-2 border-muted bg-muted/20 p-8 text-center">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-semibold text-muted-foreground">
                No training partners found in your area yet.
              </p>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                Make sure you've set your location preferences and check back later!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {nearbyUsers.map((user) => (
                <Card key={user.userId.toString()} className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-black uppercase">{user.name}</CardTitle>
                        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {user.distanceKm.toFixed(1)} km away
                        </div>
                      </div>
                      <Badge variant="outline" className="font-bold">
                        <Award className="mr-1 h-3 w-3" />
                        {user.experienceLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground">
                        <Target className="h-4 w-4" />
                        Fitness Goals
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.fitnessGoals.map((goal, idx) => (
                          <Badge key={idx} variant="secondary" className="font-semibold">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      className="w-full font-bold"
                      onClick={() => setSelectedUser(user)}
                      disabled={sendRequest.isPending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase">Send Connection Request</DialogTitle>
            <DialogDescription className="font-semibold">
              Send a message to {selectedUser?.name} to connect as training partners
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold uppercase text-muted-foreground">Your Message</label>
              <Textarea
                placeholder="Hey! I'd love to train together. Let's crush some workouts!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none border-2 font-semibold"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 font-bold" onClick={() => setSelectedUser(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 font-bold"
                onClick={handleSendRequest}
                disabled={sendRequest.isPending || !message.trim()}
              >
                {sendRequest.isPending ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
