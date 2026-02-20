import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllWorkoutPlansForUser, useGetWorkoutRecordsForUser } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dumbbell,
  TrendingUp,
  Calendar,
  CalendarDays,
  Utensils,
  Activity,
  Music,
  Coffee,
  ClipboardList,
  UtensilsCrossed,
  User,
  Brain,
  Users,
  QrCode,
  Calculator,
} from 'lucide-react';
import WorkoutPlanView from '../components/client/WorkoutPlanView';
import ProgressCharts from '../components/client/ProgressCharts';
import TimetableView from '../components/client/TimetableView';
import DietPlanView from '../components/client/DietPlanView';
import WorkoutSessionPanel from '../components/client/WorkoutSessionPanel';
import MusicPlaylistWidget from '../components/client/MusicPlaylistWidget';
import CaffeinePeakTracker from '../components/client/CaffeinePeakTracker';
import WeightProgressionDisplay from '../components/client/WeightProgressionDisplay';
import ExerciseScheduleSection from '../components/client/ExerciseScheduleSection';
import GeneralDietPlanSection from '../components/client/GeneralDietPlanSection';
import PersonalizedTracker from '../components/client/PersonalizedTracker';
import SpotterAIInterface from '../components/client/SpotterAIInterface';
import GymBuddyLocator from '../components/client/GymBuddyLocator';
import LocationPreferenceForm from '../components/client/LocationPreferenceForm';
import TrainingPartnerPreferenceForm from '../components/client/TrainingPartnerPreferenceForm';
import ConnectionRequestManager from '../components/client/ConnectionRequestManager';
import QRExerciseScanner from '../components/exercise/QRExerciseScanner';
import TDEECalculator from '../components/client/TDEECalculator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ClientDashboard() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal();
  const { data: workoutPlans = [], isLoading: plansLoading } = useGetAllWorkoutPlansForUser(userId);
  const { data: workoutRecords = [], isLoading: recordsLoading } = useGetWorkoutRecordsForUser(userId);
  const [qrScannerOpen, setQrScannerOpen] = React.useState(false);

  const activeWorkoutPlan = workoutPlans[0];

  return (
    <div className="container py-8">
      <div className="mb-8 border-b-4 border-primary pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-5xl font-black uppercase tracking-tighter text-primary">MY PROFILE</h1>
            <p className="text-xl font-bold text-muted-foreground">Your fitness command center. Track. Train. Transform.</p>
          </div>
          <Button
            size="lg"
            className="font-bold shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            onClick={() => setQrScannerOpen(true)}
          >
            <QrCode className="mr-2 h-5 w-5" />
            Scan QR
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-primary/30 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-extrabold uppercase">Active Plans</CardTitle>
            <Dumbbell className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{workoutPlans.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/30 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-extrabold uppercase">Workouts Logged</CardTitle>
            <Calendar className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">{workoutRecords.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/30 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-extrabold uppercase">This Week</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">
              {
                workoutRecords.filter((r) => {
                  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                  return Number(r.date) / 1000000 > weekAgo;
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tracker" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-14">
          <TabsTrigger value="tracker" className="gap-2 font-extrabold">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Tracker</span>
          </TabsTrigger>
          <TabsTrigger value="tdee" className="gap-2 font-extrabold">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">TDEE</span>
          </TabsTrigger>
          <TabsTrigger value="spotter" className="gap-2 font-extrabold">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Spotter AI</span>
          </TabsTrigger>
          <TabsTrigger value="buddy" className="gap-2 font-extrabold">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Gym Buddy</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-2 font-extrabold">
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Plans</span>
          </TabsTrigger>
          <TabsTrigger value="session" className="gap-2 font-extrabold">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Session</span>
          </TabsTrigger>
          <TabsTrigger value="exercise-schedule" className="gap-2 font-extrabold">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Exercises</span>
          </TabsTrigger>
          <TabsTrigger value="timetable" className="gap-2 font-extrabold">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="diet" className="gap-2 font-extrabold">
            <Utensils className="h-4 w-4" />
            <span className="hidden sm:inline">Diet</span>
          </TabsTrigger>
          <TabsTrigger value="general-diet" className="gap-2 font-extrabold">
            <UtensilsCrossed className="h-4 w-4" />
            <span className="hidden sm:inline">Gen Diet</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2 font-extrabold">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="weight" className="gap-2 font-extrabold">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Weight</span>
          </TabsTrigger>
          <TabsTrigger value="caffeine" className="gap-2 font-extrabold">
            <Coffee className="h-4 w-4" />
            <span className="hidden sm:inline">Caffeine</span>
          </TabsTrigger>
          <TabsTrigger value="music" className="gap-2 font-extrabold">
            <Music className="h-4 w-4" />
            <span className="hidden sm:inline">Music</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-4">
          <PersonalizedTracker />
        </TabsContent>

        <TabsContent value="tdee" className="space-y-4">
          <TDEECalculator />
        </TabsContent>

        <TabsContent value="spotter" className="space-y-4">
          <SpotterAIInterface />
        </TabsContent>

        <TabsContent value="buddy" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <LocationPreferenceForm />
              <TrainingPartnerPreferenceForm />
            </div>
            <div className="space-y-6">
              <GymBuddyLocator />
              <ConnectionRequestManager />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          {plansLoading ? (
            <Card className="border-2 border-primary/30">
              <CardContent className="py-8">
                <p className="text-center text-lg font-semibold text-muted-foreground">Loading workout plans...</p>
              </CardContent>
            </Card>
          ) : workoutPlans.length === 0 ? (
            <Card className="border-2 border-primary/30">
              <CardContent className="py-8">
                <p className="text-center text-lg font-semibold text-muted-foreground">
                  No workout plans assigned yet. Contact your trainer to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            workoutPlans.map((plan) => userId && <WorkoutPlanView key={plan.id} plan={plan} userId={userId} />)
          )}
        </TabsContent>

        <TabsContent value="session" className="space-y-4">
          {activeWorkoutPlan ? (
            <WorkoutSessionPanel plan={activeWorkoutPlan} />
          ) : (
            <Card className="border-2 border-primary/30">
              <CardContent className="py-8">
                <p className="text-center text-lg font-semibold text-muted-foreground">
                  No active workout plan. Go to the Workout Plans tab to view your assigned plans.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="exercise-schedule" className="space-y-4">
          <ExerciseScheduleSection />
        </TabsContent>

        <TabsContent value="timetable" className="space-y-4">
          {userId ? <TimetableView userId={userId} /> : <p>Please log in to view your timetable</p>}
        </TabsContent>

        <TabsContent value="diet" className="space-y-4">
          {userId ? <DietPlanView userId={userId} /> : <p>Please log in to view your diet plan</p>}
        </TabsContent>

        <TabsContent value="general-diet" className="space-y-4">
          <GeneralDietPlanSection />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl font-black uppercase">Your Progress</CardTitle>
              <CardDescription className="font-semibold">
                Track your workout completion and performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recordsLoading ? (
                <p className="text-lg font-semibold text-muted-foreground">Loading progress data...</p>
              ) : (
                <ProgressCharts records={workoutRecords} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="space-y-4">
          <WeightProgressionDisplay />
        </TabsContent>

        <TabsContent value="caffeine" className="space-y-4">
          <CaffeinePeakTracker />
        </TabsContent>

        <TabsContent value="music" className="space-y-4">
          <MusicPlaylistWidget />
        </TabsContent>
      </Tabs>

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
