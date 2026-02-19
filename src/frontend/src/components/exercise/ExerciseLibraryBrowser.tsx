import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Dumbbell } from 'lucide-react';
import { useGetAllExercises } from '../../hooks/useQueries';
import ExerciseDetailModal from './ExerciseDetailModal';
import type { Exercise } from '../../backend';

const MUSCLE_GROUPS = [
  'All',
  'Legs',
  'Chest',
  'Shoulders',
  'Triceps',
  'Back',
  'Biceps',
  'Core',
  'Abs',
];

export default function ExerciseLibraryBrowser() {
  const { data: exercises = [], isLoading } = useGetAllExercises();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscleGroup =
      selectedMuscleGroup === 'All' ||
      exercise.targetMuscleGroups.toLowerCase().includes(selectedMuscleGroup.toLowerCase());
    return matchesSearch && matchesMuscleGroup;
  });

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {MUSCLE_GROUPS.map((group) => (
          <Button
            key={group}
            variant={selectedMuscleGroup === group ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMuscleGroup(group)}
          >
            {group}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading exercises...</p>
          </CardContent>
        </Card>
      ) : filteredExercises.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No exercises found. Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <Card
              key={Number(exercise.id)}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getDifficultyColor(exercise.difficultyLevel)}>
                    {exercise.difficultyLevel}
                  </Badge>
                  {exercise.targetMuscleGroups.split(/[,/]/).map((muscle, idx) => (
                    <Badge key={idx} variant="outline">
                      {muscle.trim()}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">Equipment:</span> {exercise.equipmentNeeded || 'None'}
                  </p>
                  <p>
                    <span className="font-medium">Volume:</span> {exercise.recommendedRepsRange}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          open={!!selectedExercise}
          onOpenChange={(open) => !open && setSelectedExercise(null)}
        />
      )}
    </div>
  );
}
