import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Palette, Dumbbell } from 'lucide-react';
import BrandingControls from '../components/admin/BrandingControls';
import UserManagement from '../components/admin/UserManagement';
import ClientAssignment from '../components/admin/ClientAssignment';
import ExerciseLibraryManagement from '../components/admin/ExerciseLibraryManagement';

export default function AdminDashboard() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Admin Control Panel</h1>
        <p className="text-muted-foreground">Manage your gym portal settings, users, and branding</p>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-2">
            <Settings className="h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="exercises" className="gap-2">
            <Dumbbell className="h-4 w-4" />
            Exercise Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Customize your gym portal's logo and color scheme</CardDescription>
            </CardHeader>
            <CardContent>
              <BrandingControls />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Add, edit, and remove trainers and clients</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Assignments</CardTitle>
              <CardDescription>Assign clients to trainers</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientAssignment />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Library</CardTitle>
              <CardDescription>Manage the exercise database with videos and instructions</CardDescription>
            </CardHeader>
            <CardContent>
              <ExerciseLibraryManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
