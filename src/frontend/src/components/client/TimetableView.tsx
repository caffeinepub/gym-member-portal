import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2, Circle, Dumbbell } from 'lucide-react';
import { useGetScheduledSessionsForClient } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TimetableViewProps {
  userId: Principal;
}

const weeklySchedule = [
  { day: 'Monday', muscles: 'Chest + Biceps + Forearms' },
  { day: 'Tuesday', muscles: 'Back + Triceps' },
  { day: 'Wednesday', muscles: 'Shoulder + Chest + Forearms' },
  { day: 'Thursday', muscles: 'Triceps + Biceps + Abs' },
  { day: 'Friday', muscles: 'Back + Shoulder' },
  { day: 'Saturday', muscles: 'Legs + Abs' },
];

export default function TimetableView({ userId }: TimetableViewProps) {
  const { data: sessions = [], isLoading } = useGetScheduledSessionsForClient(userId);

  const sortedSessions = [...sessions].sort((a, b) => Number(a.dateTime - b.dateTime));
  const now = BigInt(Date.now() * 1000000);

  const upcomingSessions = sortedSessions.filter((s) => s.dateTime > now && !s.isCompleted);
  const pastSessions = sortedSessions.filter((s) => s.dateTime <= now || s.isCompleted);

  const formatDateTime = (dateTime: bigint) => {
    const date = new Date(Number(dateTime) / 1000000);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading timetable...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekly Workout Schedule Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Weekly Workout Schedule 💪
          </CardTitle>
          <CardDescription>Your training plan for the week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Schedule Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold">Day</TableHead>
                  <TableHead className="font-bold">Primary Muscle Groups</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklySchedule.map((item) => (
                  <TableRow key={item.day}>
                    <TableCell className="font-semibold">{item.day}</TableCell>
                    <TableCell>{item.muscles}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Schedule Image */}
          <div className="rounded-lg border overflow-hidden bg-muted/20">
            <img
              src="/assets/generated/workout-schedule.dim_800x600.png"
              alt="Weekly Workout Schedule"
              className="w-full h-auto object-contain"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your scheduled workout sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No upcoming sessions scheduled</p>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => {
                const { date, time } = formatDateTime(session.dateTime);
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Circle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Workout Session</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {time}
                          </span>
                        </div>
                        {session.clientNotes && (
                          <p className="text-sm text-muted-foreground mt-2">{session.clientNotes}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Past Sessions</CardTitle>
          <CardDescription>Your completed workout history</CardDescription>
        </CardHeader>
        <CardContent>
          {pastSessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No past sessions</p>
          ) : (
            <div className="space-y-3">
              {pastSessions.slice(0, 10).map((session) => {
                const { date, time } = formatDateTime(session.dateTime);
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border p-4 opacity-75"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Workout Session</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
