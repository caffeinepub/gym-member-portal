import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AutoRestTimerProps {
  restTime: number; // in seconds
}

export default function AutoRestTimer({ restTime }: AutoRestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(restTime);
  const [isActive, setIsActive] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsActive(false);
            setHasCompleted(true);
            // Play completion sound (optional)
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const handleStart = () => {
    setIsActive(true);
    setHasCompleted(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeRemaining(restTime);
    setHasCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((restTime - timeRemaining) / restTime) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Rest Timer
        </CardTitle>
        <CardDescription>Track your rest time between sets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div
            className={`text-7xl font-bold ${
              hasCompleted ? 'text-primary' : timeRemaining <= 10 && isActive ? 'text-destructive' : ''
            }`}
          >
            {formatTime(timeRemaining)}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasCompleted ? 'Rest complete! Ready for next set' : `Rest time: ${restTime}s`}
          </p>
        </div>

        {/* Progress Bar */}
        <Progress value={progressPercentage} className="h-2" />

        {/* Controls */}
        <div className="flex gap-2">
          {!isActive ? (
            <Button size="lg" className="flex-1" onClick={handleStart}>
              <Play className="mr-2 h-5 w-5" />
              Start
            </Button>
          ) : (
            <Button size="lg" variant="outline" className="flex-1" onClick={handlePause}>
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Status Message */}
        {hasCompleted && (
          <div className="rounded-md bg-primary/10 p-3 text-center">
            <p className="font-semibold text-primary">✓ Rest period complete!</p>
          </div>
        )}

        {isActive && timeRemaining <= 10 && (
          <div className="rounded-md bg-destructive/10 p-3 text-center">
            <p className="font-semibold text-destructive">⏰ Final countdown!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
