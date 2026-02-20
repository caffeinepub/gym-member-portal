import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle2, AlertTriangle, Lightbulb, Play } from 'lucide-react';
import { useGetAllExercises, useGetFormAnalysisTip } from '../../hooks/useQueries';
import type { ExerciseId } from '../../backend';

function convertToEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Handle youtu.be short links
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Handle youtube.com/watch?v= links
  if (url.includes('watch?v=')) {
    const videoId = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Handle youtube.com/embed/ links (already embedded)
  if (url.includes('/embed/')) {
    return url;
  }
  
  // Return as-is if not a recognized YouTube format
  return url;
}

export default function SpotterAIInterface() {
  const { data: exercises = [], isLoading: exercisesLoading } = useGetAllExercises();
  const [selectedExerciseId, setSelectedExerciseId] = useState<ExerciseId | null>(null);
  const { data: formTip, isLoading: tipLoading } = useGetFormAnalysisTip(selectedExerciseId || BigInt(0));

  const selectedExercise = exercises.find((ex) => ex.id === selectedExerciseId);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/20 p-3">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black uppercase tracking-tight">SPOTTER AI</CardTitle>
              <CardDescription className="text-base font-semibold">
                Form analysis and posture correction guidance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase text-muted-foreground">Select Exercise</label>
            <Select
              value={selectedExerciseId?.toString() || ''}
              onValueChange={(value) => setSelectedExerciseId(BigInt(value))}
            >
              <SelectTrigger className="border-2 border-primary/30 font-semibold">
                <SelectValue placeholder="Choose an exercise to analyze..." />
              </SelectTrigger>
              <SelectContent>
                {exercisesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading exercises...
                  </SelectItem>
                ) : (
                  exercises.map((exercise) => (
                    <SelectItem key={Number(exercise.id)} value={exercise.id.toString()}>
                      {exercise.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedExerciseId && selectedExercise && (
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-primary/30 bg-muted/30 p-4">
                <h3 className="mb-2 text-xl font-black uppercase text-primary">{selectedExercise.name}</h3>
                <p className="text-sm font-semibold text-muted-foreground">{selectedExercise.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-bold">
                    {selectedExercise.difficultyLevel}
                  </Badge>
                  <Badge variant="outline" className="font-bold">
                    {selectedExercise.targetMuscleGroups}
                  </Badge>
                </div>
              </div>

              {tipLoading ? (
                <Card className="border-2 border-primary/20">
                  <CardContent className="py-8">
                    <p className="text-center font-semibold text-muted-foreground">Loading form analysis...</p>
                  </CardContent>
                </Card>
              ) : formTip ? (
                <div className="space-y-4">
                  {/* Video Demonstration */}
                  {formTip.videoUrl && (
                    <Card className="border-2 border-secondary/30 overflow-hidden">
                      <CardHeader className="bg-secondary/10">
                        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                          <Play className="h-5 w-5 text-secondary" />
                          Video Demonstration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="aspect-video w-full">
                          <iframe
                            src={convertToEmbedUrl(formTip.videoUrl)}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`${selectedExercise.name} demonstration`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Form Checkpoints */}
                  <Card className="border-2 border-primary/30">
                    <CardHeader className="bg-primary/10">
                      <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Form Checkpoints
                      </CardTitle>
                      <CardDescription className="font-semibold">Key points for perfect execution</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        {formTip.formCheckpoints.map((checkpoint, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-semibold text-foreground">{checkpoint}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Common Mistakes */}
                  <Card className="border-2 border-destructive/30">
                    <CardHeader className="bg-destructive/10">
                      <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Common Mistakes
                      </CardTitle>
                      <CardDescription className="font-semibold">Watch out for these errors</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        {formTip.commonMistakes.map((mistake, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-destructive/20">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            </div>
                            <span className="font-semibold text-foreground">{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Correction Steps */}
                  <Card className="border-2 border-secondary/30">
                    <CardHeader className="bg-secondary/10">
                      <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                        <Lightbulb className="h-5 w-5 text-secondary" />
                        Correction Steps
                      </CardTitle>
                      <CardDescription className="font-semibold">How to improve your form</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        {formTip.correctionSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary/20 font-black text-secondary">
                              {idx + 1}
                            </div>
                            <span className="font-semibold text-foreground">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="border-2 border-muted">
                  <CardContent className="py-8">
                    <p className="text-center font-semibold text-muted-foreground">
                      No form analysis available for this exercise yet. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!selectedExerciseId && (
            <Card className="border-2 border-muted">
              <CardContent className="py-12">
                <div className="text-center">
                  <Brain className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
                  <p className="text-lg font-semibold text-muted-foreground">
                    Select an exercise above to view form analysis and correction tips
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
