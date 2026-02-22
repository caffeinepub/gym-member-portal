import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';

export default function WorkoutLogsPage() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal();

  // Placeholder data since backend doesn't have workout records yet
  const workoutRecords: any[] = [];
  const isLoading = false;

  const sortedRecords = [...workoutRecords].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

  const thisWeekCount = sortedRecords.filter((r) => {
    return Number(r.timestamp) / 1000000 > weekAgo;
  }).length;

  const thisMonthCount = sortedRecords.filter((r) => {
    return Number(r.timestamp) / 1000000 > monthAgo;
  }).length;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading workout logs...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">WORKOUT LOGS</h1>
        <p className="mt-2 text-lg text-muted-foreground">Your complete training history 📊</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-volt-green/20 bg-gradient-to-br from-volt-green/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Total Workouts</CardTitle>
            <Dumbbell className="h-5 w-5 text-volt-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-volt-green">{sortedRecords.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-electric-blue/20 bg-gradient-to-br from-electric-blue/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">This Week</CardTitle>
            <TrendingUp className="h-5 w-5 text-electric-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-electric-blue">{thisWeekCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">This Month</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{thisMonthCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Workout History */}
      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
          <CardDescription>Chronological list of all your logged workouts</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedRecords.length === 0 ? (
            <div className="py-12 text-center">
              <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No workouts logged yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start tracking your workouts to see your progress here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedRecords.map((record) => (
                <div
                  key={record.timestamp}
                  className="flex items-start justify-between rounded-lg border border-border/50 bg-card p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-bold">
                        Workout Session
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Exercise ID: {record.exerciseId.toString()}
                    </p>
                    <p className="text-sm font-semibold">
                      {record.weight}kg × {Number(record.reps)} reps
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(Number(record.timestamp) / 1000000), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {format(new Date(Number(record.timestamp) / 1000000), 'h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
