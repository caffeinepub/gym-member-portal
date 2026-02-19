import React from 'react';
import { Principal } from '@dfinity/principal';
import { useGetUser } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Plus } from 'lucide-react';

interface ClientListProps {
  clients: Principal[];
  onCreatePlan: (clientId: string) => void;
}

function ClientCard({ clientId, onCreatePlan }: { clientId: Principal; onCreatePlan: (id: string) => void }) {
  const { data: client, isLoading } = useGetUser(clientId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{client.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => onCreatePlan(clientId.toString())} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Plan
        </Button>
      </CardHeader>
    </Card>
  );
}

export default function ClientList({ clients, onCreatePlan }: ClientListProps) {
  return (
    <div className="space-y-3">
      {clients.map((clientId) => (
        <ClientCard key={clientId.toString()} clientId={clientId} onCreatePlan={onCreatePlan} />
      ))}
    </div>
  );
}
