import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetTrainerClients } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, CalendarDays, Utensils } from 'lucide-react';
import ClientList from '../components/trainer/ClientList';
import WorkoutPlanForm from '../components/trainer/WorkoutPlanForm';
import TimetableScheduler from '../components/trainer/TimetableScheduler';
import DietPlanForm from '../components/trainer/DietPlanForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Principal } from '@dfinity/principal';

export default function TrainerDashboard() {
  const { identity } = useInternetIdentity();
  const trainerId = identity?.getPrincipal();
  const { data: clients = [], isLoading: clientsLoading } = useGetTrainerClients(trainerId);
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [createDietOpen, setCreateDietOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleCreatePlan = (clientId: string) => {
    setSelectedClientId(clientId);
    setCreatePlanOpen(true);
  };

  const handleCreateDiet = (clientId: string) => {
    setSelectedClientId(clientId);
    setCreateDietOpen(true);
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
          <TabsTrigger value="clients" className="gap-2">
            <Users className="h-4 w-4" />
            My Clients
          </TabsTrigger>
          <TabsTrigger value="timetable" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Timetables
          </TabsTrigger>
          <TabsTrigger value="diet" className="gap-2">
            <Utensils className="h-4 w-4" />
            Diet Plans
          </TabsTrigger>
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

        <TabsContent value="timetable" className="space-y-4">
          {trainerId && <TimetableScheduler trainerId={trainerId} clients={clients} />}
        </TabsContent>

        <TabsContent value="diet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diet Plan Management</CardTitle>
              <CardDescription>Create and manage nutrition plans for your clients</CardDescription>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <p className="text-muted-foreground">No clients assigned yet</p>
              ) : (
                <div className="space-y-2">
                  {clients.map((clientId) => (
                    <div
                      key={clientId.toString()}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{clientId.toString().slice(0, 10)}...</p>
                        <p className="text-sm text-muted-foreground">Client</p>
                      </div>
                      <button
                        onClick={() => handleCreateDiet(clientId.toString())}
                        className="text-sm text-primary hover:underline"
                      >
                        Create Diet Plan
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              trainerId={trainerId.toString()}
              clientId={selectedClientId}
              onSuccess={() => setCreatePlanOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={createDietOpen} onOpenChange={setCreateDietOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Diet Plan</DialogTitle>
          </DialogHeader>
          {selectedClientId && trainerId && (
            <DietPlanForm
              trainerId={trainerId}
              clientId={Principal.fromText(selectedClientId)}
              onSuccess={() => setCreateDietOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
