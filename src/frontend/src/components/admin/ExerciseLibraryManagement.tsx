import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Pencil, Trash2, Dumbbell } from 'lucide-react';
import { useGetAllExercises, useDeleteExercise } from '../../hooks/useQueries';
import ExerciseFormModal from './ExerciseFormModal';
import type { Exercise } from '../../backend';
import { toast } from 'sonner';

export default function ExerciseLibraryManagement() {
  const { data: exercises = [], isLoading } = useGetAllExercises();
  const deleteExercise = useDeleteExercise();
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    try {
      await deleteExercise.mutateAsync(id);
      toast.success('Exercise deleted successfully');
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error('Failed to delete exercise');
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingExercise(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4">
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
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Exercise
        </Button>
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
              No exercises found. Click "Add Exercise" to create your first exercise.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredExercises.map((exercise) => (
            <Card key={Number(exercise.id)}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3 flex-1">
                  <Dumbbell className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{exercise.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{exercise.difficultyLevel}</Badge>
                      {exercise.targetMuscleGroups.split(',').slice(0, 3).map((muscle, idx) => (
                        <Badge key={idx} variant="secondary">
                          {muscle.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(exercise)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(exercise.id)}
                    disabled={deleteExercise.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ExerciseFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        exercise={editingExercise}
        onSuccess={() => {
          setFormOpen(false);
          setEditingExercise(null);
        }}
      />
    </div>
  );
}
