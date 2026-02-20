import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetWorkoutRecordsForUser } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function WorkoutLogsPage() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal();
  const { data: workoutRecords = [], isLoading } = useGetWorkoutRecordsForUser(userId);

  // Sort records by date (most recent first)
  const sortedRecords = [...workoutRecords].sort((a, b) => Number(b.date) - Number(a.date));

  return (
    <div className="container py-8">
      <div className="mb-8 border-b-4 border-primary pb-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/generated/dumbbell-icon.dim_128x128.png"
            alt="Dumbbell"
            className="h-16 w-16 drop-shadow-[0_0_20px_rgba(204,255,0,0.5)]"
          />
          <div>
            <h1 className="mb-2 text-5xl font-black uppercase tracking-tighter text-primary">WORKOUT LOGS</h1>
            <p className="text-xl font-bold text-muted-foreground">
              Your complete training history. Every rep. Every set. Every session.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-extrabold uppercase">Total Sessions</CardTitle>
            <Dumbbell className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{workoutRecords.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-extrabold uppercase">This Week</CardTitle>
            <Calendar className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">
              {
                workoutRecords.filter((r) => {
                  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                  return Number(r.date) / 1000000 > weekAgo;
                }).length
              }
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-extrabold uppercase">This Month</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">
              {
                workoutRecords.filter((r) => {
                  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
                  return Number(r.date) / 1000000 > monthAgo;
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl font-black uppercase">Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-lg font-semibold text-muted-foreground">Loading workout logs...</p>
          ) : sortedRecords.length === 0 ? (
            <p className="text-center text-lg font-semibold text-muted-foreground">
              No workouts logged yet. Start crushing it and log your first session!
            </p>
          ) : (
            <div className="space-y-4">
              {sortedRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg border-2 border-primary/20 bg-card/50 p-4 transition-all hover:border-primary/50"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-primary" />
                      <span className="font-black uppercase text-primary">Workout Session</span>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Completed {Number(record.completedSets)} sets
                    </p>
                    {record.personalNotes && (
                      <p className="mt-2 text-sm font-semibold italic text-foreground/80">"{record.personalNotes}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-secondary">
                      {format(new Date(Number(record.date) / 1000000), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {format(new Date(Number(record.date) / 1000000), 'h:mm a')}
                    </p>
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
