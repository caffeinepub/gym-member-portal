import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateScheduledSession, useGetAllWorkoutPlansForUser, type User } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

interface TimetableSchedulerProps {
  trainerId: Principal;
  clients: User[];
  onSuccess?: () => void;
}

export default function TimetableScheduler({ trainerId, clients, onSuccess }: TimetableSchedulerProps) {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [dateTime, setDateTime] = useState('');
  const [trainerNotes, setTrainerNotes] = useState('');

  const clientPrincipal = selectedClient ? Principal.fromText(selectedClient) : undefined;
  const { data: workoutPlans = [] } = useGetAllWorkoutPlansForUser();
  const createSession = useCreateScheduledSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient || !selectedPlan || !dateTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const dateTimeNanos = BigInt(new Date(dateTime).getTime() * 1000000);

      await createSession.mutateAsync({
        receiverId: Principal.fromText(selectedClient),
        message: `Scheduled workout session at ${dateTime}. Notes: ${trainerNotes}`,
      });

      toast.success('Session scheduled successfully!');
      setSelectedClient('');
      setSelectedPlan('');
      setDateTime('');
      setTrainerNotes('');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to schedule session');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Workout Session</CardTitle>
        <CardDescription>Create a new scheduled session for your client</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Select Client</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient} required>
              <SelectTrigger id="client" className="min-h-[44px]">
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id.toString()} value={client.id.toString()}>
                    {client.name} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Select Workout Plan</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan} required>
              <SelectTrigger id="plan" className="min-h-[44px]">
                <SelectValue placeholder="Choose a workout plan" />
              </SelectTrigger>
              <SelectContent>
                {workoutPlans.map((plan) => (
                  <SelectItem key={plan.id.toString()} value={plan.id.toString()}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTime">Date & Time</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              className="min-h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainerNotes">Trainer Notes (Optional)</Label>
            <Textarea
              id="trainerNotes"
              placeholder="Special instructions or focus areas..."
              value={trainerNotes}
              onChange={(e) => setTrainerNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full min-h-[44px]" disabled={createSession.isPending}>
            {createSession.isPending ? 'Scheduling...' : 'Schedule Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
