import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer, Play, Pause, RotateCcw, Square } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function HIITClockTimer() {
  const [workDuration, setWorkDuration] = useState(30);
  const [restDuration, setRestDuration] = useState(15);
  const [rounds, setRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isConfiguring) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            playBeep();
            if (isWorkPhase) {
              setIsWorkPhase(false);
              return restDuration;
            } else {
              if (currentRound < rounds) {
                setCurrentRound((r) => r + 1);
                setIsWorkPhase(true);
                return workDuration;
              } else {
                setIsActive(false);
                setIsConfiguring(true);
                return 0;
              }
            }
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isWorkPhase, currentRound, rounds, workDuration, restDuration, isConfiguring]);

  const playBeep = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleStart = () => {
    if (isConfiguring) {
      setIsConfiguring(false);
      setCurrentRound(1);
      setIsWorkPhase(true);
      setTimeRemaining(workDuration);
    }
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsConfiguring(true);
    setCurrentRound(1);
    setIsWorkPhase(true);
    setTimeRemaining(workDuration);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsConfiguring(true);
    setCurrentRound(1);
    setIsWorkPhase(true);
    setTimeRemaining(workDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPhaseDuration = isWorkPhase ? workDuration : restDuration;
  const progressPercentage = ((currentPhaseDuration - timeRemaining) / currentPhaseDuration) * 100;

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
          <Timer className="h-5 w-5 text-primary" />
          HIIT Clock
        </CardTitle>
        <CardDescription className="font-semibold">
          High-Intensity Interval Training timer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isConfiguring ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="workDuration" className="font-bold uppercase text-sm">
                  Work (seconds)
                </Label>
                <Input
                  id="workDuration"
                  type="number"
                  min="5"
                  max="300"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(parseInt(e.target.value) || 30)}
                  className="border-2 font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restDuration" className="font-bold uppercase text-sm">
                  Rest (seconds)
                </Label>
                <Input
                  id="restDuration"
                  type="number"
                  min="5"
                  max="300"
                  value={restDuration}
                  onChange={(e) => setRestDuration(parseInt(e.target.value) || 15)}
                  className="border-2 font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rounds" className="font-bold uppercase text-sm">
                  Rounds
                </Label>
                <Input
                  id="rounds"
                  type="number"
                  min="1"
                  max="50"
                  value={rounds}
                  onChange={(e) => setRounds(parseInt(e.target.value) || 8)}
                  className="border-2 font-semibold"
                />
              </div>
            </div>
            <Button size="lg" className="w-full font-bold" onClick={handleStart}>
              <Play className="mr-2 h-5 w-5" />
              Start HIIT Session
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div
                className={`mb-4 rounded-lg border-4 p-6 transition-all ${
                  isWorkPhase
                    ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(204,255,0,0.3)]'
                    : 'border-secondary bg-secondary/10 shadow-[0_0_30px_rgba(0,212,255,0.3)]'
                }`}
              >
                <div className={`text-8xl font-black ${isWorkPhase ? 'text-primary' : 'text-secondary'}`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className={`mt-4 text-3xl font-black uppercase ${isWorkPhase ? 'text-primary' : 'text-secondary'}`}>
                  {isWorkPhase ? 'WORK' : 'REST'}
                </div>
              </div>
              <div className="text-xl font-bold text-muted-foreground">
                Round {currentRound} of {rounds}
              </div>
            </div>

            <Progress value={progressPercentage} className="h-3" />

            <div className="grid grid-cols-2 gap-3">
              {!isActive ? (
                <Button size="lg" className="font-bold" onClick={handleStart}>
                  <Play className="mr-2 h-5 w-5" />
                  Resume
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="font-bold" onClick={handlePause}>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </Button>
              )}
              <Button size="lg" variant="outline" className="font-bold" onClick={handleReset}>
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </div>

            <Button size="lg" variant="destructive" className="w-full font-bold" onClick={handleStop}>
              <Square className="mr-2 h-5 w-5" />
              Stop Session
            </Button>

            {timeRemaining <= 3 && isActive && (
              <div
                className={`animate-pulse rounded-md p-4 text-center ${
                  isWorkPhase ? 'bg-primary/20' : 'bg-secondary/20'
                }`}
              >
                <p className={`text-lg font-black uppercase ${isWorkPhase ? 'text-primary' : 'text-secondary'}`}>
                  {isWorkPhase ? '⚡ PUSH HARDER!' : '💨 BREATHE!'}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
