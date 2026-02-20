import React, { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Clock, CheckCircle2 } from 'lucide-react';
import { WorkoutPlan } from '../../hooks/useQueries';
import WorkoutLogForm from './WorkoutLogForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface WorkoutPlanViewProps {
  plan: WorkoutPlan;
  userId: Principal;
}

export default function WorkoutPlanView({ plan, userId }: WorkoutPlanViewProps) {
  const [logOpen, setLogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                {plan.name}
              </CardTitle>
              <CardDescription className="mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Rest: {Number(plan.restTime)}s between sets
                </span>
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setLogOpen(true)} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Log Workout
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold">Sets</h4>
            <div className="space-y-2">
              {plan.sets.map((set, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                  <Badge variant="outline">Set {index + 1}</Badge>
                  <span className="text-sm">
                    {Number(set.reps)} reps × {set.weight} lbs
                  </span>
                </div>
              ))}
            </div>
          </div>

          {plan.notes && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">Trainer Notes</h4>
              <p className="text-sm text-muted-foreground">{plan.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Workout: {plan.name}</DialogTitle>
          </DialogHeader>
          <WorkoutLogForm
            planId={plan.id}
            userId={userId}
            totalSets={plan.sets.length}
            onSuccess={() => setLogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
