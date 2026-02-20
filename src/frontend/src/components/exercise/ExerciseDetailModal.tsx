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
import { Dumbbell, Target, Wrench, TrendingUp, Play } from 'lucide-react';
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

  // Convert YouTube watch URLs to embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Handle youtube.com/watch?v= format
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    
    // Handle youtu.be/ format
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    
    // If already an embed URL or other format, return as is
    return url;
  };

  const embedUrl = getEmbedUrl(exercise.videoUrl);

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

          {embedUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Play className="h-4 w-4 text-primary" />
                Exercise Demonstration
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black">
                <iframe
                  src={embedUrl}
                  title={`${exercise.name} demonstration`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="eager"
                />
              </div>
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
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-primary">{exercise.recommendedSetsRange}</p>
                <span className="text-sm text-muted-foreground">sets</span>
                <span className="text-muted-foreground">×</span>
                <p className="text-2xl font-bold text-primary">{exercise.recommendedRepsRange}</p>
                <span className="text-sm text-muted-foreground">reps</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Complete the recommended volume for optimal results
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
