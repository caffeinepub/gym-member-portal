import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type Phase = 'work' | 'rest';

export default function HIITClockTimer() {
  const [workDuration, setWorkDuration] = useState(30);
  const [restDuration, setRestDuration] = useState(15);
  const [rounds, setRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<Phase>('work');
  const [timeRemaining, setTimeRemaining] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            // Phase complete
            if (currentPhase === 'work') {
              // Switch to rest
              setCurrentPhase('rest');
              return restDuration;
            } else {
              // Rest complete, move to next round
              if (currentRound < rounds) {
                setCurrentRound((r) => r + 1);
                setCurrentPhase('work');
                return workDuration;
              } else {
                // All rounds complete
                setIsActive(false);
                return 0;
              }
            }
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, currentPhase, currentRound, rounds, workDuration, restDuration]);

  const handleStart = () => {
    setIsActive(true);
    setIsConfiguring(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentRound(1);
    setCurrentPhase('work');
    setTimeRemaining(workDuration);
  };

  const handleConfigure = () => {
    setIsConfiguring(!isConfiguring);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentDuration = currentPhase === 'work' ? workDuration : restDuration;
  const progressPercentage = ((currentDuration - timeRemaining) / currentDuration) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          HIIT Clock Timer
        </CardTitle>
        <CardDescription>High-Intensity Interval Training timer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isConfiguring ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workDuration">Work Duration (seconds)</Label>
              <Input
                id="workDuration"
                type="number"
                min="5"
                max="300"
                value={workDuration}
                onChange={(e) => setWorkDuration(parseInt(e.target.value) || 30)}
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restDuration">Rest Duration (seconds)</Label>
              <Input
                id="restDuration"
                type="number"
                min="5"
                max="300"
                value={restDuration}
                onChange={(e) => setRestDuration(parseInt(e.target.value) || 15)}
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rounds">Number of Rounds</Label>
              <Input
                id="rounds"
                type="number"
                min="1"
                max="50"
                value={rounds}
                onChange={(e) => setRounds(parseInt(e.target.value) || 8)}
                className="min-h-[44px]"
              />
            </div>
            <Button onClick={handleConfigure} className="w-full min-h-[44px]">
              Done
            </Button>
          </div>
        ) : (
          <>
            {/* Timer Display */}
            <div className="text-center">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Round {currentRound} of {rounds}
              </div>
              <div
                className={`text-7xl font-bold ${
                  currentPhase === 'work' ? 'text-primary' : 'text-secondary'
                }`}
              >
                {formatTime(timeRemaining)}
              </div>
              <p className="mt-2 text-lg font-bold uppercase tracking-wide">
                {currentPhase === 'work' ? '💪 WORK' : '😮‍💨 REST'}
              </p>
            </div>

            {/* Progress Bar */}
            <Progress value={progressPercentage} className="h-2" />

            {/* Controls */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                {!isActive ? (
                  <Button size="lg" className="flex-1 min-h-[44px] px-6" onClick={handleStart}>
                    <Play className="mr-2 h-5 w-5" />
                    Start
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" className="flex-1 min-h-[44px] px-6" onClick={handlePause}>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={handleReset} className="min-h-[44px] min-w-[44px]">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="outline" onClick={handleConfigure} className="w-full min-h-[44px] gap-2">
                <Settings className="h-4 w-4" />
                Configure Timer
              </Button>
            </div>

            {/* Status */}
            {timeRemaining === 0 && currentRound === rounds && (
              <div className="rounded-md bg-primary/10 p-3 text-center">
                <p className="font-semibold text-primary">🎉 HIIT Session Complete!</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
