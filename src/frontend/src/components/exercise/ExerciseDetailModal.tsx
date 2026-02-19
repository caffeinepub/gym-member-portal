import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dumbbell, Target, Wrench, TrendingUp } from 'lucide-react';
import type { Exercise } from '../../backend';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExerciseDetailModal({ exercise, open, onOpenChange }: ExerciseDetailModalProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <DialogTitle className="text-2xl">{exercise.name}</DialogTitle>
          </div>
          <DialogDescription>{exercise.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(exercise.difficultyLevel)}>{exercise.difficultyLevel}</Badge>
            {exercise.targetMuscleGroups.split(/[,/]/).map((muscle, idx) => (
              <Badge key={idx} variant="outline">
                {muscle.trim()}
              </Badge>
            ))}
          </div>

          {exercise.videoUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
              <iframe
                src={exercise.videoUrl}
                title={exercise.name}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4 text-primary" />
                Target Muscles
              </div>
              <p className="text-sm text-muted-foreground">{exercise.targetMuscleGroups}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Wrench className="h-4 w-4 text-primary" />
                Equipment Needed
              </div>
              <p className="text-sm text-muted-foreground">{exercise.equipmentNeeded || 'None'}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recommended Volume
            </div>
            <div className="rounded-lg border p-4 bg-muted/30">
              <p className="text-lg font-bold text-primary">{exercise.recommendedRepsRange}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete {exercise.recommendedSetsRange} for optimal results
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
