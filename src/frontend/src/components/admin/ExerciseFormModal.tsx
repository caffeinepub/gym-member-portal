import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddExercise, useUpdateExercise } from '../../hooks/useQueries';
import type { Exercise } from '../../backend';
import { toast } from 'sonner';

interface ExerciseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise?: Exercise | null;
  onSuccess?: () => void;
}

export default function ExerciseFormModal({ open, onOpenChange, exercise, onSuccess }: ExerciseFormModalProps) {
  const [name, setName] = useState('');
  const [targetMuscleGroups, setTargetMuscleGroups] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');
  const [equipmentNeeded, setEquipmentNeeded] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [recommendedRepsRange, setRecommendedRepsRange] = useState('');
  const [recommendedSetsRange, setRecommendedSetsRange] = useState('');

  const addExercise = useAddExercise();
  const updateExercise = useUpdateExercise();

  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setTargetMuscleGroups(exercise.targetMuscleGroups);
      setDifficultyLevel(exercise.difficultyLevel);
      setEquipmentNeeded(exercise.equipmentNeeded);
      setVideoUrl(exercise.videoUrl);
      setDescription(exercise.description);
      setRecommendedRepsRange(exercise.recommendedRepsRange);
      setRecommendedSetsRange(exercise.recommendedSetsRange);
    } else {
      setName('');
      setTargetMuscleGroups('');
      setDifficultyLevel('Beginner');
      setEquipmentNeeded('');
      setVideoUrl('');
      setDescription('');
      setRecommendedRepsRange('');
      setRecommendedSetsRange('');
    }
  }, [exercise, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !targetMuscleGroups.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const exerciseData = {
        id: exercise?.id || BigInt(Date.now()),
        name,
        targetMuscleGroups,
        difficultyLevel,
        equipmentNeeded,
        videoUrl,
        description,
        recommendedRepsRange,
        recommendedSetsRange,
      };

      if (exercise) {
        await updateExercise.mutateAsync(exerciseData);
        toast.success('Exercise updated successfully!');
      } else {
        await addExercise.mutateAsync(exerciseData);
        toast.success('Exercise added successfully!');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving exercise:', error);
      toast.error('Failed to save exercise');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{exercise ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
          <DialogDescription>
            {exercise ? 'Update the exercise details below' : 'Fill in the details to add a new exercise to the library'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Bench Press"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe how to perform this exercise..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="muscleGroups">Target Muscle Groups *</Label>
              <Input
                id="muscleGroups"
                placeholder="e.g., Chest, Triceps, Shoulders"
                value={targetMuscleGroups}
                onChange={(e) => setTargetMuscleGroups(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Separate multiple groups with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment Needed</Label>
            <Input
              id="equipment"
              placeholder="e.g., Barbell, Bench"
              value={equipmentNeeded}
              onChange={(e) => setEquipmentNeeded(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              type="url"
              placeholder="https://youtube.com/embed/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Use YouTube embed URL for best results</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="repsRange">Recommended Reps Range</Label>
              <Input
                id="repsRange"
                placeholder="e.g., 8-12"
                value={recommendedRepsRange}
                onChange={(e) => setRecommendedRepsRange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="setsRange">Recommended Sets Range</Label>
              <Input
                id="setsRange"
                placeholder="e.g., 3-4"
                value={recommendedSetsRange}
                onChange={(e) => setRecommendedSetsRange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={addExercise.isPending || updateExercise.isPending}
            >
              {addExercise.isPending || updateExercise.isPending
                ? 'Saving...'
                : exercise
                  ? 'Update Exercise'
                  : 'Add Exercise'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
