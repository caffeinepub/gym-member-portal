import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetTrainerClients } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Utensils } from 'lucide-react';
import ClientList from '../components/trainer/ClientList';
import WorkoutPlanForm from '../components/trainer/WorkoutPlanForm';
import TimetableScheduler from '../components/trainer/TimetableScheduler';
import DietPlanForm from '../components/trainer/DietPlanForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Principal } from '@dfinity/principal';

export default function TrainerDashboard() {
  const { identity } = useInternetIdentity();
  const trainerId = identity?.getPrincipal();
  const { data: clients = [], isLoading: clientsLoading } = useGetTrainerClients();

  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showDietForm, setShowDietForm] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  const handleCreatePlan = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowPlanForm(true);
  };

  const handleCreateDiet = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowDietForm(true);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Trainer Dashboard</h1>
        <p className="text-muted-foreground">Manage your clients, create workout plans, and schedule sessions</p>
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
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diet Plans</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">My Clients</TabsTrigger>
          <TabsTrigger value="timetables">Timetables</TabsTrigger>
          <TabsTrigger value="diet">Diet Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client List</CardTitle>
              <CardDescription>View and manage your assigned clients</CardDescription>
            </CardHeader>
            <CardContent>
              {clientsLoading ? (
                <p className="text-center text-muted-foreground">Loading clients...</p>
              ) : clients.length === 0 ? (
                <p className="text-center text-muted-foreground">No clients assigned yet</p>
              ) : (
                <ClientList clients={clients} onCreatePlan={handleCreatePlan} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetables" className="space-y-4">
          {trainerId && <TimetableScheduler trainerId={trainerId} clients={clients} />}
        </TabsContent>

        <TabsContent value="diet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Diet Plan</CardTitle>
              <CardDescription>Select a client to create a personalized nutrition plan</CardDescription>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <p className="text-center text-muted-foreground">No clients available</p>
              ) : (
                <div className="space-y-3">
                  {clients.map((client) => (
                    <Card key={client.id.toString()} className="cursor-pointer hover:bg-accent" onClick={() => handleCreateDiet(client.id.toString())}>
                      <CardContent className="flex items-center justify-between py-4">
                        <div>
                          <p className="font-semibold">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                        <Utensils className="h-5 w-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Workout Plan Form Dialog */}
      <Dialog open={showPlanForm} onOpenChange={setShowPlanForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Workout Plan</DialogTitle>
          </DialogHeader>
          {trainerId && selectedClientId && (
            <WorkoutPlanForm
              trainerId={trainerId}
              clientId={Principal.fromText(selectedClientId)}
              onSuccess={() => setShowPlanForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diet Plan Form Dialog */}
      <Dialog open={showDietForm} onOpenChange={setShowDietForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Diet Plan</DialogTitle>
          </DialogHeader>
          {trainerId && selectedClientId && (
            <DietPlanForm
              trainerId={trainerId}
              clientId={Principal.fromText(selectedClientId)}
              onSuccess={() => setShowDietForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
