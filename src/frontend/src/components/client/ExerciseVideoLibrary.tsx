import React, { useState, useMemo } from 'react';
import { Play, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAllExercises } from '../../hooks/useQueries';
import ExerciseDetailModal from '../exercise/ExerciseDetailModal';
import type { Exercise } from '../../backend';

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

export default function ExerciseVideoLibrary() {
  const { data: exercises = [], isLoading } = useGetAllExercises();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    exercises.forEach((ex) => {
      ex.targetMuscleGroups.split(',').forEach((group) => {
        groups.add(group.trim());
      });
    });
    return ['All', ...Array.from(groups).sort()];
  }, [exercises]);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMuscleGroup =
        selectedMuscleGroup === 'All' ||
        exercise.targetMuscleGroups.includes(selectedMuscleGroup);

      const matchesDifficulty =
        selectedDifficulty === 'All' ||
        exercise.difficultyLevel === selectedDifficulty;

      const hasVideo = exercise.videoUrl && exercise.videoUrl.trim() !== '';

      return matchesSearch && matchesMuscleGroup && matchesDifficulty && hasVideo;
    });
  }, [exercises, searchTerm, selectedMuscleGroup, selectedDifficulty]);

  const videoCount = filteredExercises.length;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-volt-green border-t-transparent"></div>
          <p className="text-zinc-400">Loading exercise videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Exercise Video Library</h2>
          <p className="text-sm text-zinc-400">
            {videoCount} video{videoCount !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises..."
            className="h-12 border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-bold text-zinc-400">Muscle Group:</span>
          </div>
          {muscleGroups.map((group) => (
            <Button
              key={group}
              variant={selectedMuscleGroup === group ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMuscleGroup(group)}
              className={
                selectedMuscleGroup === group
                  ? 'bg-volt-green text-zinc-950 hover:bg-volt-green/90'
                  : 'border-zinc-700 text-zinc-400 hover:border-volt-green hover:text-volt-green'
              }
            >
              {group}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-bold text-zinc-400">Difficulty:</span>
          </div>
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
              className={
                selectedDifficulty === difficulty
                  ? 'bg-electric-blue text-zinc-950 hover:bg-electric-blue/90'
                  : 'border-zinc-700 text-zinc-400 hover:border-electric-blue hover:text-electric-blue'
              }
            >
              {difficulty}
            </Button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50">
          <p className="text-zinc-500">No exercises found with videos</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <Card
              key={exercise.id.toString()}
              className="group cursor-pointer overflow-hidden border-zinc-800 bg-zinc-900 transition-all hover:border-volt-green hover:shadow-lg hover:shadow-volt-green/20"
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardContent className="p-0">
                {/* Video Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-zinc-950">
                  <iframe
                    src={convertToEmbedUrl(exercise.videoUrl)}
                    className="h-full w-full pointer-events-none"
                    title={exercise.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-volt-green">
                      <Play className="h-8 w-8 text-zinc-950" />
                    </div>
                  </div>
                </div>

                {/* Exercise Info */}
                <div className="space-y-3 p-4">
                  <h3 className="font-black text-white group-hover:text-volt-green">
                    {exercise.name}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={`border-zinc-700 text-xs ${
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
                        className="border-zinc-700 text-xs text-zinc-400"
                      >
                        {muscle.trim()}
                      </Badge>
                    ))}
                  </div>

                  <p className="line-clamp-2 text-sm text-zinc-500">
                    {exercise.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{exercise.equipmentNeeded}</span>
                    <span>
                      {exercise.recommendedSetsRange} sets × {exercise.recommendedRepsRange} reps
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}
