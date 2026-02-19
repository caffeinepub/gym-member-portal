import React, { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { useCreateWorkoutPlan } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Set_ } from '../../backend';

interface WorkoutPlanFormProps {
  clientId: string;
  trainerId: string;
  onSuccess: () => void;
}

interface ExerciseSet {
  id: number;
  exerciseId: number;
  reps: number;
  weight: number;
}

export default function WorkoutPlanForm({ clientId, trainerId, onSuccess }: WorkoutPlanFormProps) {
  const createPlan = useCreateWorkoutPlan();
  const [planName, setPlanName] = useState('');
  const [restTime, setRestTime] = useState(60);
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState<ExerciseSet[]>([{ id: 0, exerciseId: 1, reps: 10, weight: 0 }]);

  const addSet = () => {
    setSets([...sets, { id: sets.length, exerciseId: 1, reps: 10, weight: 0 }]);
  };

  const removeSet = (id: number) => {
    setSets(sets.filter((s) => s.id !== id));
  };

  const updateSet = (id: number, field: 'exerciseId' | 'reps' | 'weight', value: number) => {
    setSets(sets.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!planName.trim()) {
      toast.error('Please enter a plan name');
      return;
    }

    if (sets.length === 0) {
      toast.error('Please add at least one set');
      return;
    }

    try {
      const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const backendSets: Set_[] = sets.map((s) => ({
        id: BigInt(s.id),
        exerciseId: BigInt(s.exerciseId),
        reps: BigInt(s.reps),
        weight: s.weight,
      }));

      await createPlan.mutateAsync({
        planId,
        trainerId: Principal.fromText(trainerId),
        clientId: Principal.fromText(clientId),
        name: planName,
        sets: backendSets,
        restTime: BigInt(restTime),
        notes,
      });

      toast.success('Workout plan created successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create workout plan');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="planName">Plan Name</Label>
        <Input
          id="planName"
          placeholder="e.g., Upper Body Strength"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="restTime">Rest Time (seconds)</Label>
        <Input
          id="restTime"
          type="number"
          min="0"
          value={restTime}
          onChange={(e) => setRestTime(parseInt(e.target.value) || 0)}
          required
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Sets</Label>
          <Button type="button" size="sm" variant="outline" onClick={addSet} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Set
          </Button>
        </div>

        {sets.map((set, index) => (
          <div key={set.id} className="flex items-center gap-3 rounded-lg border p-3">
            <span className="text-sm font-medium text-muted-foreground">Set {index + 1}</span>
            <Input
              type="number"
              placeholder="Exercise ID"
              min="1"
              value={set.exerciseId}
              onChange={(e) => updateSet(set.id, 'exerciseId', parseInt(e.target.value) || 1)}
              className="w-28"
            />
            <Input
              type="number"
              placeholder="Reps"
              min="1"
              value={set.reps}
              onChange={(e) => updateSet(set.id, 'reps', parseInt(e.target.value) || 0)}
              className="w-24"
            />
            <Input
              type="number"
              placeholder="Weight (lbs)"
              min="0"
              step="0.5"
              value={set.weight}
              onChange={(e) => updateSet(set.id, 'weight', parseFloat(e.target.value) || 0)}
              className="w-32"
            />
            {sets.length > 1 && (
              <Button type="button" size="icon" variant="ghost" onClick={() => removeSet(set.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any special instructions or notes for the client..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={createPlan.isPending}>
        {createPlan.isPending ? 'Creating Plan...' : 'Create Workout Plan'}
      </Button>
    </form>
  );
}
