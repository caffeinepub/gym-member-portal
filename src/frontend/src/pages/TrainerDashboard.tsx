import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetTrainerClients, useGetUser } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, TrendingUp } from 'lucide-react';
import ClientList from '../components/trainer/ClientList';
import WorkoutPlanForm from '../components/trainer/WorkoutPlanForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function TrainerDashboard() {
  const { identity } = useInternetIdentity();
  const trainerId = identity?.getPrincipal();
  const { data: clients = [], isLoading: clientsLoading } = useGetTrainerClients(trainerId);
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleCreatePlan = (clientId: string) => {
    setSelectedClientId(clientId);
    setCreatePlanOpen(true);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Trainer Dashboard</h1>
        <p className="text-muted-foreground">Manage your clients and their workout plans</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">My Clients</TabsTrigger>
          <TabsTrigger value="plans">Workout Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client List</CardTitle>
              <CardDescription>View and manage your assigned clients</CardDescription>
            </CardHeader>
            <CardContent>
              {clientsLoading ? (
                <p className="text-muted-foreground">Loading clients...</p>
              ) : clients.length === 0 ? (
                <p className="text-muted-foreground">No clients assigned yet</p>
              ) : (
                <ClientList clients={clients} onCreatePlan={handleCreatePlan} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workout Plans</CardTitle>
              <CardDescription>Manage workout plans for your clients</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select a client to view their workout plans</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={createPlanOpen} onOpenChange={setCreatePlanOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Workout Plan</DialogTitle>
          </DialogHeader>
          {selectedClientId && trainerId && (
            <WorkoutPlanForm
              clientId={selectedClientId}
              trainerId={trainerId.toString()}
              onSuccess={() => setCreatePlanOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
