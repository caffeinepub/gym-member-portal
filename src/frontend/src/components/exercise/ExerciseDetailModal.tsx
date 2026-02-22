import React from 'react';
import { X, Dumbbell, Target, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Exercise } from '../../backend';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
}

// Utility function to convert YouTube URLs to embed format
function convertToEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Standard YouTube watch URL
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  
  // Shortened youtu.be URL
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  
  return url;
}

export default function ExerciseDetailModal({
  exercise,
  isOpen,
  onClose,
}: ExerciseDetailModalProps) {
  const embedUrl = convertToEmbedUrl(exercise.videoUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl border-zinc-800 bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-black">{exercise.name}</span>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Video Player */}
            {embedUrl && (
              <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 h-full w-full"
                    title={exercise.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Exercise Details */}
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={`border-zinc-700 ${
                    exercise.difficultyLevel === 'Beginner'
                      ? 'text-green-500'
                      : exercise.difficultyLevel === 'Intermediate'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                  }`}
                >
                  {exercise.difficultyLevel}
                </Badge>
                {exercise.targetMuscleGroups.split(',').map((muscle, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="border-zinc-700 text-zinc-400"
                  >
                    {muscle.trim()}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-black text-volt-green">
                  <Target className="h-5 w-5" />
                  Description
                </h3>
                <p className="text-zinc-300">{exercise.description}</p>
              </div>

              {/* Target Muscles */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-black text-volt-green">
                  <Dumbbell className="h-5 w-5" />
                  Target Muscles
                </h3>
                <p className="text-zinc-300">{exercise.targetMuscleGroups}</p>
              </div>

              {/* Equipment */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-black text-electric-blue">
                  <Zap className="h-5 w-5" />
                  Equipment Needed
                </h3>
                <p className="text-zinc-300">{exercise.equipmentNeeded}</p>
              </div>

              {/* Recommended Volume */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <h3 className="mb-3 text-lg font-black text-white">
                  Recommended Volume
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-zinc-500">Sets</p>
                    <p className="text-2xl font-black text-volt-green">
                      {exercise.recommendedSetsRange}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Reps</p>
                    <p className="text-2xl font-black text-electric-blue">
                      {exercise.recommendedRepsRange}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
