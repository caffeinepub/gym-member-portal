import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Plus, Minus, Check, Timer, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AutoRestTimer from './AutoRestTimer';
import HIITClockTimer from './HIITClockTimer';

export default function WorkoutSessionPanel() {
  const [currentSet, setCurrentSet] = useState(1);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [setsCompleted, setSetsCompleted] = useState(0);
  const totalSets = 4;
  const targetReps = 12;

  const incrementReps = () => {
    if (repsCompleted < 50) {
      setRepsCompleted(repsCompleted + 1);
    }
  };

  const decrementReps = () => {
    if (repsCompleted > 0) {
      setRepsCompleted(repsCompleted - 1);
    }
  };

  const completeSet = () => {
    if (currentSet < totalSets) {
      setSetsCompleted(setsCompleted + 1);
      setCurrentSet(currentSet + 1);
      setRepsCompleted(0);
    } else {
      setSetsCompleted(totalSets);
    }
  };

  const progressPercentage = (setsCompleted / totalSets) * 100;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
            <Dumbbell className="h-6 w-6 text-primary" />
            Workout Session
          </CardTitle>
          <CardDescription className="font-semibold">
            Track your sets and reps in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Set Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase">Set Progress</span>
              <span className="text-sm font-bold text-primary">
                {setsCompleted} / {totalSets} Sets
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* Current Set */}
          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Current Set
            </p>
            <p className="text-6xl font-black text-primary">{currentSet}</p>
          </div>

          {/* Rep Counter */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Reps Completed
              </p>
              <p className="text-5xl font-black">{repsCompleted}</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                Target: {targetReps} reps
              </p>
            </div>

            {/* Rep Controls */}
            <div className="flex gap-3">
              <Button
                size="lg"
                variant="outline"
                onClick={decrementReps}
                disabled={repsCompleted === 0}
                className="flex-1 min-h-[44px] px-6"
              >
                <Minus className="mr-2 h-5 w-5" />
                Decrease
              </Button>
              <Button
                size="lg"
                onClick={incrementReps}
                className="flex-1 min-h-[44px] px-6"
              >
                <Plus className="mr-2 h-5 w-5" />
                Increase
              </Button>
            </div>
          </div>

          {/* Complete Set Button */}
          <Button
            size="lg"
            className="w-full font-bold min-h-[44px] px-6"
            onClick={completeSet}
            disabled={setsCompleted >= totalSets}
          >
            <Check className="mr-2 h-5 w-5" />
            {setsCompleted >= totalSets ? 'Exercise Complete!' : 'Complete Set'}
          </Button>

          {/* Completion Message */}
          {setsCompleted >= totalSets && (
            <div className="rounded-md bg-primary/10 p-4 text-center">
              <p className="font-bold text-primary text-lg">
                🎉 All sets completed! Great work!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timer Modes */}
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 min-h-[44px]">
          <TabsTrigger value="standard" className="gap-2 font-bold min-h-[40px]">
            <Timer className="h-4 w-4" />
            Standard Timer
          </TabsTrigger>
          <TabsTrigger value="hiit" className="gap-2 font-bold min-h-[40px]">
            <Zap className="h-4 w-4" />
            HIIT Clock
          </TabsTrigger>
        </TabsList>
        <TabsContent value="standard" className="mt-4">
          <AutoRestTimer restTime={90} />
        </TabsContent>
        <TabsContent value="hiit" className="mt-4">
          <HIITClockTimer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
