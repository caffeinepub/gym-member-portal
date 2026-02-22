import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateWorkoutPlan } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

interface WorkoutPlanFormProps {
  trainerId: Principal;
  clientId: Principal;
  onSuccess?: () => void;
}

interface SetForm {
  exerciseId: string;
  reps: string;
  weight: string;
}

export default function WorkoutPlanForm({ trainerId, clientId, onSuccess }: WorkoutPlanFormProps) {
  const [planName, setPlanName] = useState('');
  const [restTime, setRestTime] = useState('60');
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState<SetForm[]>([{ exerciseId: '1', reps: '10', weight: '50' }]);

  const createPlan = useCreateWorkoutPlan();

  const addSet = () => {
    setSets([...sets, { exerciseId: '1', reps: '10', weight: '50' }]);
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const updateSet = (index: number, field: keyof SetForm, value: string) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
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

      const formattedSets = sets.map((set, idx) => ({
        id: BigInt(idx),
        exerciseId: BigInt(set.exerciseId),
        reps: BigInt(set.reps),
        weight: parseFloat(set.weight),
      }));

      await createPlan.mutateAsync({
        planId,
        trainerId,
        clientId,
        name: planName,
        sets: formattedSets,
        restTime: BigInt(restTime),
        notes,
      });

      toast.success('Workout plan created successfully!');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create workout plan');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workout Plan Details</CardTitle>
          <CardDescription>Create a personalized workout plan for your client</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              placeholder="e.g., Upper Body Strength"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              required
              className="min-h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restTime">Rest Time (seconds)</Label>
            <Input
              id="restTime"
              type="number"
              min="0"
              value={restTime}
              onChange={(e) => setRestTime(e.target.value)}
              required
              className="min-h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Special instructions or focus areas..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Sets</CardTitle>
          <CardDescription>Add exercises and their target sets, reps, and weights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sets.map((set, index) => (
            <div key={index} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Set {index + 1}</span>
                {sets.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSet(index)}
                    className="h-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Exercise ID</Label>
                  <Input
                    type="number"
                    min="1"
                    value={set.exerciseId}
                    onChange={(e) => updateSet(index, 'exerciseId', e.target.value)}
                    required
                    className="min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reps</Label>
                  <Input
                    type="number"
                    min="1"
                    value={set.reps}
                    onChange={(e) => updateSet(index, 'reps', e.target.value)}
                    required
                    className="min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    value={set.weight}
                    onChange={(e) => updateSet(index, 'weight', e.target.value)}
                    required
                    className="min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addSet} className="w-full min-h-[44px]">
            <Plus className="mr-2 h-4 w-4" />
            Add Set
          </Button>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full min-h-[44px]" disabled={createPlan.isPending}>
        {createPlan.isPending ? 'Creating...' : 'Create Workout Plan'}
      </Button>
    </form>
  );
}
