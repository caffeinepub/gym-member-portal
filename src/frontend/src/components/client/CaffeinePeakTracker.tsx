import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coffee, Clock, Zap } from 'lucide-react';
import { useLogCaffeineIntake, useGetOptimalWorkoutTime, useClearCaffeineIntake } from '../../hooks/useQueries';

export default function CaffeinePeakTracker() {
  const [caffeineAmount, setCaffeineAmount] = useState('');
  const logCaffeineMutation = useLogCaffeineIntake();
  const clearCaffeineMutation = useClearCaffeineIntake();
  const { data: optimalTime, refetch } = useGetOptimalWorkoutTime();

  const handleLogCaffeine = async () => {
    const amount = parseInt(caffeineAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    try {
      await logCaffeineMutation.mutateAsync(BigInt(amount));
      setCaffeineAmount('');
      refetch();
    } catch (error) {
      console.error('Failed to log caffeine:', error);
    }
  };

  const handleClearIntake = async () => {
    try {
      await clearCaffeineMutation.mutateAsync();
      refetch();
    } catch (error) {
      console.error('Failed to clear caffeine intake:', error);
    }
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="h-5 w-5" />
          Caffeine Peak Tracker
        </CardTitle>
        <CardDescription>Log your caffeine intake and find your optimal workout window</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Log Caffeine Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caffeine-amount">Caffeine Amount (mg)</Label>
            <div className="flex gap-2">
              <Input
                id="caffeine-amount"
                type="number"
                placeholder="e.g., 200"
                value={caffeineAmount}
                onChange={(e) => setCaffeineAmount(e.target.value)}
                min="0"
              />
              <Button onClick={handleLogCaffeine} disabled={logCaffeineMutation.isPending}>
                {logCaffeineMutation.isPending ? 'Logging...' : 'Log'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Typical: Coffee (95mg), Energy drink (80-150mg), Pre-workout (150-300mg)
            </p>
          </div>
        </div>

        {/* Optimal Workout Time Display */}
        {optimalTime ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-primary/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Optimal Workout Window</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Start Time</span>
                  </div>
                  <span className="text-lg font-bold">{formatTime(optimalTime.recommendedStartTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>End Time</span>
                  </div>
                  <span className="text-lg font-bold">{formatTime(optimalTime.recommendedEndTime)}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm text-muted-foreground">Window Duration</span>
                  <span className="font-semibold">{Number(optimalTime.optimalWindow)} minutes</span>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                💡 Your caffeine levels peak 15-135 minutes after intake. This is your optimal workout window for
                maximum energy and performance.
              </p>
            </div>

            <Button variant="outline" className="w-full" onClick={handleClearIntake} disabled={clearCaffeineMutation.isPending}>
              Clear Caffeine Log
            </Button>
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-6 text-center">
            <Coffee className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Log your caffeine intake to see your optimal workout window
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
