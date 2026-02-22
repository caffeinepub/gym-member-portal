import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WORKOUT_IMAGES = [
  {
    src: '/assets/pexels-brunogobofoto-2204196.jpg',
    title: 'Bench Press with Spotter',
    description: 'Proper bench press form with safety spotter assistance for maximum gains',
  },
  {
    src: '/assets/pexels-olly-3838937.jpg',
    title: 'Cable Chest Exercise',
    description: 'Cable machine chest fly technique for targeted pec development',
  },
  {
    src: '/assets/pexels-olly-3838937-1.jpg',
    title: 'Cable Chest Variation',
    description: 'Alternative cable chest exercise angle for complete muscle activation',
  },
  {
    src: '/assets/pexels-olly-3838937-2.jpg',
    title: 'Cable Chest Form',
    description: 'Proper cable chest exercise form and positioning for optimal results',
  },
];

export default function WorkoutTechniqueGallery() {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-3xl font-black uppercase tracking-tighter text-volt-green">
          💪 WORKOUT TECHNIQUE GALLERY
        </CardTitle>
        <p className="text-zinc-400">
          Master proper form and technique with these reference images from real gym sessions
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORKOUT_IMAGES.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border-2 border-zinc-800 bg-zinc-950 transition-all hover:border-volt-green hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-lg font-black uppercase text-white">{image.title}</h3>
                <p className="text-sm text-zinc-400">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
