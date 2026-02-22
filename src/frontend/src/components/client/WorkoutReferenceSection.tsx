import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

export default function WorkoutReferenceSection() {
  const referenceImages = [
    {
      src: '/assets/generated/back-targeting-guide.dim_1200x800.png',
      title: 'Back Targeting Guide',
      description: 'Complete back development: upper, mid, and lower back exercises with proper form and muscle activation',
      muscleGroup: 'Back',
    },
    {
      src: '/assets/generated/bicep-variations-guide.dim_1200x800.png',
      title: 'Bicep Variations Guide',
      description: 'Master bicep training with barbell curls, dumbbell variations, and hammer curls for complete arm development',
      muscleGroup: 'Biceps',
    },
    {
      src: '/assets/generated/core-exercise-matrix.dim_1200x800.png',
      title: 'Core Exercise Matrix',
      description: 'Comprehensive core training covering upper abs, lower abs, six-pack, obliques, and complete core stability',
      muscleGroup: 'Core',
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/30 bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/20 p-3">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black uppercase tracking-tight text-primary">
                Workout Reference Guides
              </CardTitle>
              <CardDescription className="text-base font-bold">
                Visual guides for proper exercise targeting and muscle activation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {referenceImages.map((image, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-2 border-primary/20 bg-background/50 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(204,255,0,0.2)]"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-black uppercase text-primary">
                    {image.title}
                  </CardTitle>
                  <CardDescription className="text-sm font-semibold">
                    <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-extrabold uppercase text-primary">
                      {image.muscleGroup}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg border-2 border-primary/10 bg-black/20">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
                    {image.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-secondary/30 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase text-secondary">
            How to Use These Guides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm font-semibold text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-black text-primary">
                1
              </span>
              <span>
                <strong className="font-extrabold text-foreground">Study the muscle groups:</strong> Each guide highlights specific muscle regions to help you understand which exercises target which areas
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-black text-primary">
                2
              </span>
              <span>
                <strong className="font-extrabold text-foreground">Follow the exercise demonstrations:</strong> Pay attention to form, positioning, and movement patterns shown in each reference image
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-black text-primary">
                3
              </span>
              <span>
                <strong className="font-extrabold text-foreground">Apply to your training:</strong> Use these guides during your workouts to ensure proper muscle activation and maximize your gains
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
