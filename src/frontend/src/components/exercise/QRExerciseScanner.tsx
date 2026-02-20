import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, CameraOff, SwitchCamera, Play, TrendingUp, AlertCircle } from 'lucide-react';
import { useQRScanner } from '../../qr-code/useQRScanner';
import { useGetExerciseWithHistory } from '../../hooks/useQueries';

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

function parseExerciseId(qrData: string): bigint | null {
  try {
    // Handle "exercise:123" format
    if (qrData.startsWith('exercise:')) {
      const id = qrData.replace('exercise:', '').trim();
      return BigInt(id);
    }
    
    // Handle URL format like "https://example.com/exercise/123"
    if (qrData.includes('/exercise/')) {
      const parts = qrData.split('/exercise/');
      const id = parts[1]?.split(/[/?#]/)[0];
      if (id) return BigInt(id);
    }
    
    // Handle JSON format like {"exerciseId": 123}
    if (qrData.startsWith('{')) {
      const parsed = JSON.parse(qrData);
      if (parsed.exerciseId) return BigInt(parsed.exerciseId);
      if (parsed.id) return BigInt(parsed.id);
    }
    
    // Try parsing as plain number
    const parsed = BigInt(qrData.trim());
    return parsed;
  } catch (error) {
    console.error('Failed to parse exercise ID from QR data:', qrData, error);
    return null;
  }
}

export default function QRExerciseScanner() {
  const {
    qrResults,
    isScanning,
    isActive,
    isSupported,
    error,
    isLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    switchCamera,
    clearResults,
    videoRef,
    canvasRef,
  } = useQRScanner({
    facingMode: 'environment',
    scanInterval: 100,
    maxResults: 1,
  });

  const latestResult = qrResults[0];
  const exerciseId = latestResult ? parseExerciseId(latestResult.data) : null;
  const { data: exerciseData, isLoading: exerciseLoading } = useGetExerciseWithHistory(
    exerciseId && exerciseId > BigInt(0) ? exerciseId : BigInt(0)
  );

  // Stop scanning when we successfully parse an exercise ID
  useEffect(() => {
    if (latestResult && exerciseId && exerciseId > BigInt(0)) {
      stopScanning();
    }
  }, [latestResult, exerciseId, stopScanning]);

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isSupported === false) {
    return (
      <Card className="border-2 border-destructive/30">
        <CardContent className="py-8">
          <div className="text-center">
            <CameraOff className="mx-auto mb-4 h-16 w-16 text-destructive" />
            <p className="text-lg font-bold text-destructive">Camera not supported</p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              Your browser or device doesn't support camera access
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasValidExercise = exerciseData && exerciseData.exercise;
  const hasInvalidQR = latestResult && !exerciseId;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/20 p-3">
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black uppercase tracking-tight">QR EXERCISE SCANNER</CardTitle>
              <CardDescription className="text-base font-semibold">
                Scan QR codes to view exercise details and your history
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasValidExercise && (
            <>
              <div
                className="relative overflow-hidden rounded-lg border-2 border-primary/30 bg-black"
                style={{ minHeight: '400px', aspectRatio: '16/9' }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                  style={{ display: isActive ? 'block' : 'none' }}
                />
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <div className="text-center">
                      <QrCode className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                      <p className="font-bold text-muted-foreground">Camera preview will appear here</p>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>

              {error && (
                <Card className="border-2 border-destructive/30 bg-destructive/10">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-destructive">Camera Error: {error.message}</p>
                        {error.type === 'permission' && (
                          <p className="mt-2 text-sm font-semibold text-muted-foreground">
                            Please allow camera access in your browser settings and refresh the page
                          </p>
                        )}
                        {error.type === 'not-found' && (
                          <p className="mt-2 text-sm font-semibold text-muted-foreground">
                            No camera detected on your device
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {hasInvalidQR && (
                <Card className="border-2 border-destructive/30 bg-destructive/10">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-destructive">Invalid QR Code</p>
                        <p className="mt-1 text-sm font-semibold text-muted-foreground">
                          The scanned QR code doesn't contain a valid exercise ID
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Scanned data: {latestResult.data}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                {!isActive ? (
                  <Button
                    size="lg"
                    className="flex-1 font-bold"
                    onClick={startScanning}
                    disabled={!canStartScanning || isLoading}
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    {isLoading ? 'Initializing...' : 'Start Scanning'}
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" className="flex-1 font-bold" onClick={stopScanning} disabled={isLoading}>
                    <CameraOff className="mr-2 h-5 w-5" />
                    Stop Scanning
                  </Button>
                )}
                {isMobile && isActive && (
                  <Button size="lg" variant="outline" onClick={switchCamera} disabled={isLoading}>
                    <SwitchCamera className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {isScanning && !hasInvalidQR && (
                <Card className="border-2 border-primary/30 bg-primary/10">
                  <CardContent className="py-4">
                    <p className="text-center font-bold text-primary">
                      📷 Scanning... Position QR code in view
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {exerciseLoading && exerciseId && (
            <Card className="border-2 border-primary/20">
              <CardContent className="py-8">
                <p className="text-center font-semibold text-muted-foreground">Loading exercise details...</p>
              </CardContent>
            </Card>
          )}

          {hasValidExercise && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase text-primary">Scan Result</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearResults();
                    startScanning();
                  }}
                  className="font-bold"
                >
                  Scan Another
                </Button>
              </div>

              <Card className="border-2 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-black uppercase">{exerciseData.exercise.name}</CardTitle>
                  <CardDescription className="font-semibold">{exerciseData.exercise.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="font-bold">
                      {exerciseData.exercise.difficultyLevel}
                    </Badge>
                    <Badge variant="outline" className="font-bold">
                      {exerciseData.exercise.targetMuscleGroups}
                    </Badge>
                    <Badge variant="outline" className="font-bold">
                      {exerciseData.exercise.equipmentNeeded}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {exerciseData.exercise.videoUrl && (
                    <div className="overflow-hidden rounded-lg border-2 border-secondary/30">
                      <div className="aspect-video w-full">
                        <iframe
                          src={convertToEmbedUrl(exerciseData.exercise.videoUrl)}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`${exerciseData.exercise.name} demonstration`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border-2 border-muted bg-muted/20 p-4">
                    <p className="text-sm font-bold uppercase text-muted-foreground">Recommended Volume</p>
                    <p className="mt-1 text-lg font-black">
                      {exerciseData.exercise.recommendedSetsRange} sets × {exerciseData.exercise.recommendedRepsRange} reps
                    </p>
                  </div>

                  {exerciseData.userHistory && exerciseData.userHistory.length > 0 && (
                    <Card className="border-2 border-primary/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Your Progress History
                        </CardTitle>
                        <CardDescription className="font-semibold">
                          {exerciseData.userHistory.length} session{exerciseData.userHistory.length !== 1 ? 's' : ''} logged
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {exerciseData.userHistory.slice(0, 5).map((entry, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-lg border border-muted bg-muted/20 p-3"
                            >
                              <div>
                                <p className="font-bold">
                                  {entry.weight}kg × {Number(entry.reps)} reps
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(Number(entry.timestamp) / 1000000).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="outline" className="font-bold">
                                {(entry.weight * Number(entry.reps)).toFixed(1)}kg volume
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {(!exerciseData.userHistory || exerciseData.userHistory.length === 0) && (
                    <Card className="border-2 border-muted">
                      <CardContent className="py-6">
                        <p className="text-center text-sm font-semibold text-muted-foreground">
                          No workout history for this exercise yet. Start logging your progress!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
