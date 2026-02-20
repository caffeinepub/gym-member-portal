import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell } from 'lucide-react';

interface ExerciseDetail {
  name: string;
  muscleGroups: string;
  sets: number;
  reps: string;
  description: string;
}

const exercises: ExerciseDetail[] = [
  {
    name: 'Squats',
    muscleGroups: 'Legs',
    sets: 3,
    reps: '12 reps',
    description: 'Puri body ka foundation hai. Start with proper form.',
  },
  {
    name: 'Push-ups',
    muscleGroups: 'Chest/Shoulders/Triceps',
    sets: 3,
    reps: 'max reps',
    description: 'Har gym session mein ise zaroor rakho.',
  },
  {
    name: 'Bench Press',
    muscleGroups: 'Chest',
    sets: 3,
    reps: '10 reps',
    description: 'Chest broad karne ke liye sabse best.',
  },
  {
    name: 'Deadlift',
    muscleGroups: 'Back/Overall Strength',
    sets: 3,
    reps: '8 reps',
    description: 'Ye poori body ko power deta hai. Form par dhyan dena.',
  },
  {
    name: 'Pull-ups / Lat Pulldown',
    muscleGroups: 'Back/Biceps',
    sets: 3,
    reps: '8-10 reps',
    description: 'V-shape body ke liye zaruri hai.',
  },
  {
    name: 'Overhead Press',
    muscleGroups: 'Shoulders',
    sets: 3,
    reps: '10 reps',
    description: 'Kandhe chaudhe karne ke liye.',
  },
  {
    name: 'Plank',
    muscleGroups: 'Core/Abs',
    sets: 3,
    reps: '1 minute',
    description: 'Workout ke end mein core strength ke liye.',
  },
];

export default function ExerciseScheduleSection() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Essential Exercise Schedule
          </CardTitle>
          <CardDescription>
            Complete guide to fundamental exercises with recommended sets and reps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {exercise.muscleGroups}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm font-medium">Sets</span>
                    <span className="text-lg font-bold text-primary">{exercise.sets}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm font-medium">Reps</span>
                    <span className="text-lg font-bold text-primary">{exercise.reps}</span>
                  </div>
                  <p className="pt-2 text-sm text-muted-foreground">{exercise.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
