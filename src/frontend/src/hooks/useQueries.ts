import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { UserProfile, AppUserRole, WorkoutPlan, WorkoutRecord, User, BrandingSettings, Set_ } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Branding Queries
export function useGetBrandingSettings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BrandingSettings>({
    queryKey: ['brandingSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBrandingSettings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateBrandingSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: BrandingSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBrandingSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brandingSettings'] });
    },
  });
}

// Admin User Management
export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<User[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: Principal; name: string; email: string; role: AppUserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addUser(params.id, params.name, params.email, params.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useEditUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: Principal; name: string; email: string; role: AppUserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editUser(params.id, params.name, params.email, params.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useRemoveUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useAssignClientToTrainer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { trainerId: Principal; clientId: Principal }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignClientToTrainer(params.trainerId, params.clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerClients'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

// Trainer Queries
export function useGetTrainerClients(trainerId?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['trainerClients', trainerId?.toString()],
    queryFn: async () => {
      if (!actor || !trainerId) throw new Error('Actor or trainerId not available');
      return actor.getTrainerClients(trainerId);
    },
    enabled: !!actor && !actorFetching && !!trainerId,
  });
}

export function useGetUser(userId?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<User | null>({
    queryKey: ['user', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) throw new Error('Actor or userId not available');
      return actor.getUser(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

// Workout Plan Queries
export function useGetAllWorkoutPlansForUser(userId?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkoutPlan[]>({
    queryKey: ['workoutPlans', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) throw new Error('Actor or userId not available');
      return actor.getAllWorkoutPlansForUser(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useCreateWorkoutPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      planId: string;
      trainerId: Principal;
      clientId: Principal;
      name: string;
      sets: Set_[];
      restTime: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWorkoutPlan(
        params.planId,
        params.trainerId,
        params.clientId,
        params.name,
        params.sets,
        params.restTime,
        params.notes
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workoutPlans', variables.clientId.toString()] });
    },
  });
}

export function useUpdateWorkoutPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      planId: string;
      name: string;
      sets: Set_[];
      restTime: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWorkoutPlan(params.planId, params.name, params.sets, params.restTime, params.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutPlans'] });
    },
  });
}

export function useDeleteWorkoutPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteWorkoutPlan(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutPlans'] });
    },
  });
}

// Workout Record Queries
export function useGetWorkoutRecordsForUser(userId?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkoutRecord[]>({
    queryKey: ['workoutRecords', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) throw new Error('Actor or userId not available');
      return actor.getWorkoutRecordsForUser(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useLogWorkoutCompletion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      recordId: string;
      planId: string;
      userId: Principal;
      completedSets: bigint;
      personalNotes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logWorkoutCompletion(
        params.recordId,
        params.planId,
        params.userId,
        params.completedSets,
        params.personalNotes
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workoutRecords', variables.userId.toString()] });
    },
  });
}

export function useUpdateWorkoutRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { recordId: string; completedSets: bigint; personalNotes: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWorkoutRecord(params.recordId, params.completedSets, params.personalNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutRecords'] });
    },
  });
}

// VORTEX AI Assistant
export function useAskVortex() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (query: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.askVortex(query);
    },
  });
}
