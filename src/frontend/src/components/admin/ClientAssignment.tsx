import React, { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { useGetAllUsers, useAssignClientToTrainer } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AppUserRole } from '../../backend';
import { toast } from 'sonner';

export default function ClientAssignment() {
  const { data: users = [], isLoading } = useGetAllUsers();
  const assignClient = useAssignClientToTrainer();
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  const trainers = users.filter((u) => u.role === AppUserRole.trainer);
  const clients = users.filter((u) => u.role === AppUserRole.client);

  const handleAssign = async () => {
    if (!selectedTrainer || !selectedClient) {
      toast.error('Please select both a trainer and a client');
      return;
    }

    try {
      await assignClient.mutateAsync({
        trainerId: Principal.fromText(selectedTrainer),
        clientId: Principal.fromText(selectedClient),
      });

      toast.success('Client assigned to trainer successfully');
      setSelectedTrainer('');
      setSelectedClient('');
    } catch (error) {
      toast.error('Failed to assign client');
      console.error(error);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading users...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trainer">Select Trainer</Label>
              <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                <SelectTrigger id="trainer">
                  <SelectValue placeholder="Choose a trainer..." />
                </SelectTrigger>
                <SelectContent>
                  {trainers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No trainers available
                    </SelectItem>
                  ) : (
                    trainers.map((trainer) => (
                      <SelectItem key={trainer.id.toString()} value={trainer.id.toString()}>
                        {trainer.name} ({trainer.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Select Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Choose a client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No clients available
                    </SelectItem>
                  ) : (
                    clients.map((client) => (
                      <SelectItem key={client.id.toString()} value={client.id.toString()}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAssign} disabled={assignClient.isPending} className="w-full">
              {assignClient.isPending ? 'Assigning...' : 'Assign Client to Trainer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {trainers.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No trainers available. Add trainers in the Users tab first.
        </p>
      )}
      {clients.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No clients available. Add clients in the Users tab first.
        </p>
      )}
    </div>
  );
}
