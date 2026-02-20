import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Plus } from 'lucide-react';
import { useGetAllExercises, useLogWeightProgress, useGetProgressionStatsForExercise, useGetWeightProgressionEntries } from '../../hooks/useQueries';
import type { ExerciseId } from '../../backend';

export default function WeightProgressionDisplay() {
  const { data: exercises = [], isLoading: exercisesLoading } = useGetAllExercises();
  const [selectedExerciseId, setSelectedExerciseId] = useState<bigint | null>(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const { data: stats } = useGetProgressionStatsForExercise(selectedExerciseId);
  const { data: entries = [] } = useGetWeightProgressionEntries(selectedExerciseId);
  const logProgress = useLogWeightProgress();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExerciseId) return;

    try {
      await logProgress.mutateAsync({
        exerciseId: selectedExerciseId,
        weight: parseFloat(weight),
        reps: BigInt(reps),
      });
      setWeight('');
      setReps('');
    } catch (error) {
      console.error('Failed to log weight progress:', error);
    }
  };

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase">
          <TrendingUp className="h-6 w-6 text-primary" />
          Weight Progression Tracker
        </CardTitle>
        <CardDescription className="font-semibold">
          Track your strength gains and progressive overload
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exercise" className="font-bold uppercase text-sm">
              Select Exercise
            </Label>
            <Select
              value={selectedExerciseId?.toString() || ''}
              onValueChange={(value) => setSelectedExerciseId(BigInt(value))}
            >
              <SelectTrigger className="border-2 border-primary/30 font-semibold">
                <SelectValue placeholder="Choose an exercise..." />
              </SelectTrigger>
              <SelectContent>
                {exercisesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading exercises...
                  </SelectItem>
                ) : (
                  exercises.map((exercise) => (
                    <SelectItem key={Number(exercise.id)} value={exercise.id.toString()}>
                      {exercise.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weight" className="font-bold uppercase text-sm">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 80"
                className="border-2 border-primary/30 font-semibold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reps" className="font-bold uppercase text-sm">
                Reps
              </Label>
              <Input
                id="reps"
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="e.g., 10"
                className="border-2 border-primary/30 font-semibold"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full font-bold"
            disabled={!selectedExerciseId || logProgress.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            {logProgress.isPending ? 'Logging...' : 'Log Progress'}
          </Button>
        </form>

        {selectedExerciseId && stats && (
          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase">Statistics</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm font-bold text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-black text-primary">{stats.totalSessions.toString()}</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm font-bold text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-black text-primary">{stats.totalVolume.toFixed(1)} kg</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm font-bold text-muted-foreground">Average Weight</p>
                  <p className="text-2xl font-black text-primary">{stats.averageWeight.toFixed(1)} kg</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm font-bold text-muted-foreground">Suggested Increment</p>
                  <p className="text-2xl font-black text-secondary">+{stats.suggestedIncrement.toFixed(1)} kg</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedExerciseId && entries.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-black uppercase">Progression History</h3>
            <div className="space-y-2">
              {entries.slice(0, 10).map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border-2 border-muted p-3">
                  <div>
                    <p className="font-bold text-foreground">
                      {entry.weight} kg × {entry.reps.toString()} reps
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {new Date(Number(entry.timestamp) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-muted-foreground">
                    {(entry.weight * Number(entry.reps)).toFixed(1)} kg volume
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedExerciseId && entries.length === 0 && (
          <div className="rounded-lg border-2 border-muted bg-muted/20 p-8 text-center">
            <p className="font-semibold text-muted-foreground">
              No progression data yet. Start logging your lifts!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
