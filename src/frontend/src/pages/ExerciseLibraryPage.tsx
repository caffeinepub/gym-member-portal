import React from 'react';
import ExerciseLibraryBrowser from '../components/exercise/ExerciseLibraryBrowser';

export default function ExerciseLibraryPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Exercise Library</h1>
        <p className="text-muted-foreground">
          Browse our comprehensive exercise library with video demonstrations and proper form guidance
        </p>
      </div>

      <ExerciseLibraryBrowser />
    </div>
  );
}
