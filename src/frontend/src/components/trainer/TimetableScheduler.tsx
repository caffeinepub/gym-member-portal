import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { useCreateScheduledSession, useGetAllWorkoutPlansForUser } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

interface TimetableSchedulerProps {
  trainerId: Principal;
  clients: Principal[];
  onSuccess?: () => void;
}

export default function TimetableScheduler({ trainerId, clients, onSuccess }: TimetableSchedulerProps) {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const clientPrincipal = selectedClient ? Principal.fromText(selectedClient) : undefined;
  const { data: workoutPlans = [] } = useGetAllWorkoutPlansForUser(clientPrincipal);
  const createSession = useCreateScheduledSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient || !selectedPlan || !date || !time) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const dateTime = new Date(`${date}T${time}`);
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await createSession.mutateAsync({
        id: sessionId,
        trainerId,
        clientId: Principal.fromText(selectedClient),
        workoutPlanId: selectedPlan,
        dateTime: BigInt(dateTime.getTime() * 1000000),
        clientNotes: notes,
      });

      toast.success('Workout session scheduled successfully!');
      setSelectedClient('');
      setSelectedPlan('');
      setDate('');
      setTime('');
      setNotes('');
      onSuccess?.();
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast.error('Failed to schedule session');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Workout Session</CardTitle>
        <CardDescription>Create a new scheduled workout session for your clients</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Select Client</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.toString()} value={client.toString()}>
                    {client.toString().slice(0, 10)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClient && (
            <div className="space-y-2">
              <Label htmlFor="plan">Select Workout Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Choose a workout plan" />
                </SelectTrigger>
                <SelectContent>
                  {workoutPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any special instructions or notes for this session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={createSession.isPending}>
            {createSession.isPending ? 'Scheduling...' : 'Schedule Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
