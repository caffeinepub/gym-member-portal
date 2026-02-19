import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllWorkoutPlansForUser, useGetWorkoutRecordsForUser } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, TrendingUp, Calendar } from 'lucide-react';
import WorkoutPlanView from '../components/client/WorkoutPlanView';
import ProgressCharts from '../components/client/ProgressCharts';

export default function ClientDashboard() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal();
  const { data: workoutPlans = [], isLoading: plansLoading } = useGetAllWorkoutPlansForUser(userId);
  const { data: workoutRecords = [], isLoading: recordsLoading } = useGetWorkoutRecordsForUser(userId);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">My Workouts</h1>
        <p className="text-muted-foreground">Track your progress and complete your workout plans</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutPlans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts Logged</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutRecords.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workoutRecords.filter((r) => {
                const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                return Number(r.date) / 1000000 > weekAgo;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Workout Plans</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {plansLoading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading workout plans...</p>
              </CardContent>
            </Card>
          ) : workoutPlans.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  No workout plans assigned yet. Contact your trainer to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            workoutPlans.map((plan) => <WorkoutPlanView key={plan.id} plan={plan} userId={userId!} />)
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your workout completion and performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              {recordsLoading ? (
                <p className="text-muted-foreground">Loading progress data...</p>
              ) : (
                <ProgressCharts records={workoutRecords} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
