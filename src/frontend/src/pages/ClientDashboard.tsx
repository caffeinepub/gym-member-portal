import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetAllWorkoutPlansForUser, useGetAllExercises } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, TrendingUp, Calendar, Apple, Brain, Users, BookOpen, Trophy, Library, MessageSquare, QrCode } from 'lucide-react';
import WorkoutPlanView from '../components/client/WorkoutPlanView';
import TimetableView from '../components/client/TimetableView';
import DietPlanView from '../components/client/DietPlanView';
import TDEECalculator from '../components/client/TDEECalculator';
import SpotterAIInterface from '../components/client/SpotterAIInterface';
import GymBuddyLocator from '../components/client/GymBuddyLocator';
import ExerciseVideoLibrary from '../components/client/ExerciseVideoLibrary';
import PRLeaderboard from '../components/client/PRLeaderboard';
import WorkoutReferenceSection from '../components/client/WorkoutReferenceSection';
import VortexChat from '../components/vortex/VortexChat';
import QRExerciseScanner from '../components/exercise/QRExerciseScanner';
import WorkoutSessionPanel from '../components/client/WorkoutSessionPanel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ClientDashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const userId = identity?.getPrincipal();

  const { data: exercises = [], isLoading: exercisesLoading } = useGetAllExercises();
  const [qrScannerOpen, setQrScannerOpen] = useState(false);

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Please log in to access your dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            WELCOME BACK, {userProfile?.name.toUpperCase() || 'ATHLETE'}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Your fitness journey continues here 💪</p>
        </div>
        <Dialog open={qrScannerOpen} onOpenChange={setQrScannerOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 bg-gradient-to-r from-volt-green to-electric-blue text-zinc-950 hover:opacity-90">
              <QrCode className="h-5 w-5" />
              Scan Exercise QR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Scan Exercise QR Code</DialogTitle>
              <DialogDescription>
                Scan a QR code to view exercise details and your progression history
              </DialogDescription>
            </DialogHeader>
            <QRExerciseScanner />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="workout-plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-2">
          <TabsTrigger value="workout-plans" className="gap-2">
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Plans</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="timetable" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="diet" className="gap-2">
            <Apple className="h-4 w-4" />
            <span className="hidden sm:inline">Diet</span>
          </TabsTrigger>
          <TabsTrigger value="tdee" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">TDEE</span>
          </TabsTrigger>
          <TabsTrigger value="spotter" className="gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Spotter</span>
          </TabsTrigger>
          <TabsTrigger value="gym-buddy" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Buddy</span>
          </TabsTrigger>
          <TabsTrigger value="video-library" className="gap-2">
            <Library className="h-4 w-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">PRs</span>
          </TabsTrigger>
          <TabsTrigger value="vortex" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Vortex</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout-plans" className="space-y-6">
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No workout plans available. Contact your trainer to get a personalized plan.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <WorkoutSessionPanel />
        </TabsContent>

        <TabsContent value="timetable" className="space-y-6">
          <TimetableView userId={userId} />
        </TabsContent>

        <TabsContent value="diet" className="space-y-6">
          <DietPlanView userId={userId} />
        </TabsContent>

        <TabsContent value="tdee" className="space-y-6">
          <TDEECalculator />
        </TabsContent>

        <TabsContent value="spotter" className="space-y-6">
          <SpotterAIInterface />
        </TabsContent>

        <TabsContent value="gym-buddy" className="space-y-6">
          <GymBuddyLocator />
        </TabsContent>

        <TabsContent value="video-library" className="space-y-6">
          <ExerciseVideoLibrary />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <PRLeaderboard />
        </TabsContent>

        <TabsContent value="vortex" className="space-y-6">
          <Card>
            <VortexChat mode="modal" />
          </Card>
        </TabsContent>
      </Tabs>

      <WorkoutReferenceSection />
    </div>
  );
}
