import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllExercises } from '../../hooks/useQueries';
import ExerciseDetailModal from './ExerciseDetailModal';
import type { Exercise } from '../../backend';

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'];
const DIFFICULTY_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ExerciseLibraryBrowser() {
  const { data: exercises = [], isLoading } = useGetAllExercises();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMuscleGroup =
      selectedMuscleGroup === 'All' ||
      exercise.targetMuscleGroups.toLowerCase().includes(selectedMuscleGroup.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'All' || exercise.difficultyLevel === selectedDifficulty;

    return matchesSearch && matchesMuscleGroup && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-zinc-400">Loading exercises...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-white">Exercise Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises..."
              className="border-zinc-800 bg-zinc-950 pl-10 text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-bold text-zinc-400">Muscle Group:</span>
            {MUSCLE_GROUPS.map((group) => (
              <Button
                key={group}
                variant={selectedMuscleGroup === group ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMuscleGroup(group)}
                className={
                  selectedMuscleGroup === group
                    ? 'bg-volt-green text-zinc-950'
                    : 'border-zinc-700 text-zinc-400'
                }
              >
                {group}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-bold text-zinc-400">Difficulty:</span>
            {DIFFICULTY_LEVELS.map((level) => (
              <Button
                key={level}
                variant={selectedDifficulty === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(level)}
                className={
                  selectedDifficulty === level
                    ? 'bg-electric-blue text-zinc-950'
                    : 'border-zinc-700 text-zinc-400'
                }
              >
                {level}
              </Button>
            ))}
          </div>

          <p className="text-sm text-zinc-500">
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => (
          <Card
            key={exercise.id.toString()}
            className="cursor-pointer border-zinc-800 bg-zinc-900 transition-all hover:border-volt-green"
            onClick={() => setSelectedExercise(exercise)}
          >
            <CardHeader>
              <CardTitle className="text-white">{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
                  <Badge key={idx} variant="outline" className="border-zinc-700 text-zinc-400">
                    {muscle.trim()}
                  </Badge>
                ))}
              </div>
              <p className="line-clamp-2 text-sm text-zinc-500">{exercise.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
