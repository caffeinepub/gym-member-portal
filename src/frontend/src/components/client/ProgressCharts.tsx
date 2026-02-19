import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { WorkoutRecord } from '../../backend';

interface ProgressChartsProps {
  records: WorkoutRecord[];
}

export default function ProgressCharts({ records }: ProgressChartsProps) {
  if (records.length === 0) {
    return <p className="text-center text-muted-foreground">No workout data yet. Start logging workouts to see your progress!</p>;
  }

  // Sort records by date
  const sortedRecords = [...records].sort((a, b) => Number(a.date) - Number(b.date));

  // Prepare data for chart
  const chartData = sortedRecords.map((record, index) => ({
    workout: index + 1,
    sets: Number(record.completedSets),
    date: new Date(Number(record.date) / 1000000).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Workout Completion Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="workout" label={{ value: 'Workout #', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Sets Completed', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="sets" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Recent Workouts</h3>
        <div className="space-y-2">
          {sortedRecords.slice(-5).reverse().map((record) => (
            <Card key={record.id}>
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{Number(record.completedSets)} sets completed</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Number(record.date) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                  {record.personalNotes && (
                    <p className="max-w-xs truncate text-sm text-muted-foreground">{record.personalNotes}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
