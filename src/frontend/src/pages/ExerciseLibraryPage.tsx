import React, { useState } from 'react';
import ExerciseLibraryBrowser from '../components/exercise/ExerciseLibraryBrowser';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRExerciseScanner from '../components/exercise/QRExerciseScanner';

export default function ExerciseLibraryPage() {
  const [qrScannerOpen, setQrScannerOpen] = useState(false);

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between border-b-4 border-primary pb-4">
        <div>
          <h1 className="mb-2 text-5xl font-black uppercase tracking-tighter text-primary">EXERCISE LIBRARY</h1>
          <p className="text-xl font-bold text-muted-foreground">
            Browse our comprehensive exercise library with video demonstrations and proper form guidance
          </p>
        </div>
        <Button
          size="lg"
          className="font-bold shadow-[0_0_20px_rgba(0,212,255,0.3)]"
          onClick={() => setQrScannerOpen(true)}
        >
          <QrCode className="mr-2 h-5 w-5" />
          Scan Exercise QR
        </Button>
      </div>

      <ExerciseLibraryBrowser />

      <Dialog open={qrScannerOpen} onOpenChange={setQrScannerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase">QR Exercise Scanner</DialogTitle>
          </DialogHeader>
          <QRExerciseScanner />
        </DialogContent>
      </Dialog>
    </div>
  );
}
