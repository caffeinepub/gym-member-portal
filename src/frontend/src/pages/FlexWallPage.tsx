import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function FlexWallPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 border-b-4 border-primary pb-4">
        <h1 className="mb-2 flex items-center gap-3 text-5xl font-black uppercase tracking-tighter text-primary">
          <Users className="h-12 w-12" />
          THE FLEX WALL
        </h1>
        <p className="text-xl font-bold text-muted-foreground">
          Share your progress. Celebrate your PRs. Inspire the community.
        </p>
      </div>

      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl font-black uppercase">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-muted-foreground">
            The Flex Wall community feed is under construction. Soon you'll be able to upload progress photos, share
            personal records, and engage with fellow gym rats through likes and comments.
          </p>
          <p className="mt-4 text-lg font-semibold text-primary">Stay tuned for the ultimate fitness social experience!</p>
        </CardContent>
      </Card>
    </div>
  );
}
