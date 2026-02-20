import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Check, RotateCcw, Dumbbell, Timer as TimerIcon } from 'lucide-react';
import { useWorkoutSession } from '../../hooks/useWorkoutSession';
import { WorkoutPlan } from '../../hooks/useQueries';
import { Progress } from '@/components/ui/progress';
import AutoRestTimer from './AutoRestTimer';
import HIITClockTimer from './HIITClockTimer';

interface WorkoutSessionPanelProps {
  plan: WorkoutPlan;
}

export default function WorkoutSessionPanel({ plan }: WorkoutSessionPanelProps) {
  const {
    currentSetIndex,
    currentSet,
    setProgress,
    completedSetsCount,
    remainingSetsCount,
    incrementReps,
    decrementReps,
    completeSet,
    resetSession,
  } = useWorkoutSession(plan.sets);

  const [timerMode, setTimerMode] = useState<'standard' | 'hiit'>('standard');
  const [showRestTimer, setShowRestTimer] = useState(false);

  const progressPercentage = (completedSetsCount / plan.sets.length) * 100;

  const handleCompleteSet = () => {
    completeSet();
    if (timerMode === 'standard') {
      setShowRestTimer(true);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase">
                <Dumbbell className="h-6 w-6 text-primary" />
                {plan.name}
              </CardTitle>
              <CardDescription className="font-semibold">Track your reps and sets during your workout</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={resetSession} className="font-bold">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant={timerMode === 'standard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimerMode('standard')}
              className="flex-1 font-bold"
            >
              <TimerIcon className="mr-2 h-4 w-4" />
              Standard Timer
            </Button>
            <Button
              variant={timerMode === 'hiit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimerMode('hiit')}
              className="flex-1 font-bold"
            >
              <TimerIcon className="mr-2 h-4 w-4" />
              HIIT Clock
            </Button>
          </div>

          {timerMode === 'standard' ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-muted-foreground">Session Progress</span>
                  <span className="font-bold">
                    {completedSetsCount} / {plan.sets.length} sets completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {currentSet && (
                <div className="rounded-lg border-2 border-primary/30 bg-muted/50 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-black uppercase">
                      Set {currentSetIndex + 1} of {plan.sets.length}
                    </h3>
                    {currentSet.completed && (
                      <Badge variant="default" className="gap-1 font-bold">
                        <Check className="h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="rounded-md border-2 border-primary/30 bg-background p-3">
                      <p className="text-sm font-bold text-muted-foreground">Target Weight</p>
                      <p className="text-2xl font-black text-primary">{currentSet.targetWeight} kg</p>
                    </div>
                    <div className="rounded-md border-2 border-primary/30 bg-background p-3">
                      <p className="text-sm font-bold text-muted-foreground">Target Reps</p>
                      <p className="text-2xl font-black text-primary">{currentSet.targetReps}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="mb-2 text-sm font-bold uppercase text-muted-foreground">Current Reps</p>
                      <div className="text-6xl font-black text-primary">{currentSet.currentReps}</div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 font-bold"
                        onClick={decrementReps}
                        disabled={currentSet.currentReps === 0 || currentSet.completed}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 font-bold"
                        onClick={incrementReps}
                        disabled={currentSet.currentReps >= currentSet.targetReps || currentSet.completed}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    <Button
                      size="lg"
                      className="w-full font-bold"
                      onClick={handleCompleteSet}
                      disabled={currentSet.completed}
                    >
                      <Check className="mr-2 h-5 w-5" />
                      Complete Set
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-black uppercase">All Sets</h4>
                <div className="grid gap-2">
                  {setProgress.map((set, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between rounded-md border-2 p-3 ${
                        index === currentSetIndex ? 'border-primary bg-primary/5' : 'border-muted'
                      } ${set.completed ? 'bg-muted/50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                            set.completed
                              ? 'bg-primary text-primary-foreground'
                              : index === currentSetIndex
                                ? 'border-2 border-primary bg-background'
                                : 'bg-muted'
                          }`}
                        >
                          {set.completed ? <Check className="h-4 w-4" /> : index + 1}
                        </div>
                        <div>
                          <p className="font-bold">Set {index + 1}</p>
                          <p className="text-sm font-semibold text-muted-foreground">
                            {set.targetWeight} kg × {set.targetReps} reps
                          </p>
                        </div>
                      </div>
                      {set.completed && (
                        <Badge variant="outline" className="gap-1 font-bold">
                          {set.currentReps} reps
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {remainingSetsCount > 0 && (
                <div className="rounded-md bg-muted p-4 text-center">
                  <p className="text-sm font-bold text-muted-foreground">
                    {remainingSetsCount} {remainingSetsCount === 1 ? 'set' : 'sets'} remaining
                  </p>
                </div>
              )}

              {completedSetsCount === plan.sets.length && (
                <div className="rounded-md border-2 border-primary bg-primary/10 p-4 text-center">
                  <p className="text-lg font-black text-primary">🎉 Workout Complete!</p>
                  <p className="text-sm font-semibold text-muted-foreground">Great job finishing all sets!</p>
                </div>
              )}
            </>
          ) : (
            <HIITClockTimer />
          )}
        </CardContent>
      </Card>

      {timerMode === 'standard' && showRestTimer && (
        <AutoRestTimer restTime={Number(plan.restTime)} />
      )}
    </div>
  );
}
