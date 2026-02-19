import React, { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { useLogWorkoutCompletion } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface WorkoutLogFormProps {
  planId: string;
  userId: Principal;
  totalSets: number;
  onSuccess: () => void;
}

export default function WorkoutLogForm({ planId, userId, totalSets, onSuccess }: WorkoutLogFormProps) {
  const logWorkout = useLogWorkoutCompletion();
  const [completedSets, setCompletedSets] = useState(totalSets);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (completedSets < 0 || completedSets > totalSets) {
      toast.error(`Completed sets must be between 0 and ${totalSets}`);
      return;
    }

    try {
      const recordId = `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await logWorkout.mutateAsync({
        recordId,
        planId,
        userId,
        completedSets: BigInt(completedSets),
        personalNotes: notes,
      });

      toast.success('Workout logged successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to log workout');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="completedSets">Completed Sets</Label>
        <Input
          id="completedSets"
          type="number"
          min="0"
          max={totalSets}
          value={completedSets}
          onChange={(e) => setCompletedSets(parseInt(e.target.value) || 0)}
          required
        />
        <p className="text-xs text-muted-foreground">Total sets in plan: {totalSets}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Personal Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="How did it feel? Any challenges?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={logWorkout.isPending}>
        {logWorkout.isPending ? 'Logging...' : 'Log Workout'}
      </Button>
    </form>
  );
}
