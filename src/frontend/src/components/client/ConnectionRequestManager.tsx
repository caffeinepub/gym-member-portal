import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, Users } from 'lucide-react';
import {
  useGetMyConnectionRequests,
  useGetMyConnections,
  useAcceptConnectionRequest,
  useRejectConnectionRequest,
} from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Variant_pending_rejected_accepted } from '../../backend';

export default function ConnectionRequestManager() {
  const { identity } = useInternetIdentity();
  const { data: requests = [], isLoading: requestsLoading } = useGetMyConnectionRequests();
  const { data: connections = [], isLoading: connectionsLoading } = useGetMyConnections();
  const acceptRequest = useAcceptConnectionRequest();
  const rejectRequest = useRejectConnectionRequest();

  const myPrincipal = identity?.getPrincipal();

  const incomingRequests = requests.filter(
    (req) => req.receiverId.toString() === myPrincipal?.toString() && req.status === Variant_pending_rejected_accepted.pending
  );
  const outgoingRequests = requests.filter(
    (req) => req.senderId.toString() === myPrincipal?.toString() && req.status === Variant_pending_rejected_accepted.pending
  );

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest.mutateAsync(requestId);
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest.mutateAsync(requestId);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
          <Users className="h-5 w-5 text-primary" />
          Connections & Requests
        </CardTitle>
        <CardDescription className="font-semibold">
          Manage your training partner connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="incoming" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="incoming" className="font-bold">
              Incoming ({incomingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="outgoing" className="font-bold">
              Outgoing ({outgoingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="connections" className="font-bold">
              Connected ({connections.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="space-y-3">
            {requestsLoading ? (
              <p className="py-8 text-center font-semibold text-muted-foreground">Loading requests...</p>
            ) : incomingRequests.length === 0 ? (
              <div className="rounded-lg border-2 border-muted bg-muted/20 p-8 text-center">
                <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="font-semibold text-muted-foreground">No incoming requests</p>
              </div>
            ) : (
              incomingRequests.map((request) => (
                <Card key={request.id} className="border-2 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <p className="font-bold text-foreground">Connection Request</p>
                        <p className="text-sm font-semibold text-muted-foreground">
                          {new Date(Number(request.timestamp) / 1000000).toLocaleDateString()}
                        </p>
                      </div>
                      {request.message && (
                        <div className="rounded-md bg-muted/50 p-3">
                          <p className="text-sm font-semibold italic">"{request.message}"</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 font-bold"
                          onClick={() => handleAccept(request.id)}
                          disabled={acceptRequest.isPending}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 font-bold"
                          onClick={() => handleReject(request.id)}
                          disabled={rejectRequest.isPending}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="outgoing" className="space-y-3">
            {requestsLoading ? (
              <p className="py-8 text-center font-semibold text-muted-foreground">Loading requests...</p>
            ) : outgoingRequests.length === 0 ? (
              <div className="rounded-lg border-2 border-muted bg-muted/20 p-8 text-center">
                <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="font-semibold text-muted-foreground">No outgoing requests</p>
              </div>
            ) : (
              outgoingRequests.map((request) => (
                <Card key={request.id} className="border-2 border-secondary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">Request Sent</p>
                        <p className="text-sm font-semibold text-muted-foreground">
                          {new Date(Number(request.timestamp) / 1000000).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="font-bold">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="connections" className="space-y-3">
            {connectionsLoading ? (
              <p className="py-8 text-center font-semibold text-muted-foreground">Loading connections...</p>
            ) : connections.length === 0 ? (
              <div className="rounded-lg border-2 border-muted bg-muted/20 p-8 text-center">
                <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="font-semibold text-muted-foreground">No connections yet</p>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  Start connecting with training partners!
                </p>
              </div>
            ) : (
              connections.map((connection) => (
                <Card key={connection.id.toString()} className="border-2 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">{connection.name}</p>
                        <p className="text-sm font-semibold text-muted-foreground">{connection.email}</p>
                      </div>
                      <Badge className="font-bold">
                        <Check className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
