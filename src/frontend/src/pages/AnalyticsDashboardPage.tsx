import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 border-b-4 border-primary pb-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/generated/trophy-icon.dim_128x128.png"
            alt="Trophy"
            className="h-16 w-16 drop-shadow-[0_0_20px_rgba(204,255,0,0.5)]"
          />
          <div>
            <h1 className="mb-2 text-5xl font-black uppercase tracking-tighter text-primary">PROGRESS ANALYTICS</h1>
            <p className="text-xl font-bold text-muted-foreground">
              Visualize your gains. Track your strength. Dominate your goals.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-2 border-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase">
            <TrendingUp className="h-6 w-6 text-secondary" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-muted-foreground">
            Your comprehensive analytics dashboard is being built. Soon you'll see interactive charts showing:
          </p>
          <ul className="mt-4 space-y-2 text-lg font-semibold text-foreground">
            <li className="flex items-center gap-2">
              <span className="text-primary">▸</span> Body weight fluctuations over time
            </li>
            <li className="flex items-center gap-2">
              <span className="text-secondary">▸</span> Strength progression per exercise
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">▸</span> Volume tracking and PR history
            </li>
            <li className="flex items-center gap-2">
              <span className="text-secondary">▸</span> Interactive tooltips with exact values
            </li>
          </ul>
          <p className="mt-6 text-lg font-semibold text-primary">Data-driven gains are coming your way!</p>
        </CardContent>
      </Card>
    </div>
  );
}
