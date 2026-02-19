import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { UserProfile, AppUserRole, WorkoutPlan, WorkoutRecord, User, BrandingSettings, Set_, Meal, Exercise, DietPlan, ScheduledSession, MealOption } from '../backend';

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

// Workout Timetable Queries
export function useGetScheduledSessionsForClient(clientId?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ScheduledSession[]>({
    queryKey: ['scheduledSessions', clientId?.toString()],
    queryFn: async () => {
      if (!actor || !clientId) return [];
      return actor.getScheduledSessionsForClient(clientId);
    },
    enabled: !!actor && !actorFetching && !!clientId,
  });
}

export function useCreateScheduledSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      trainerId: Principal;
      clientId: Principal;
      workoutPlanId: string;
      dateTime: bigint;
      clientNotes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createScheduledSession(
        params.id,
        params.trainerId,
        params.clientId,
        params.workoutPlanId,
        params.dateTime,
        params.clientNotes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledSessions'] });
    },
  });
}

export function useUpdateScheduledSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; dateTime: bigint; clientNotes: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateScheduledSession(params.id, params.dateTime, params.clientNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledSessions'] });
    },
  });
}

export function useDeleteScheduledSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteScheduledSession(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledSessions'] });
    },
  });
}

// Diet Plan Queries
export function useGetDietPlanForClient(clientId?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DietPlan | null>({
    queryKey: ['dietPlan', clientId?.toString()],
    queryFn: async () => {
      if (!actor || !clientId) return null;
      const plans = await actor.getDietPlansForClient(clientId);
      return plans.length > 0 ? plans[0] : null;
    },
    enabled: !!actor && !actorFetching && !!clientId,
  });
}

export function useGetDietPlanTemplate() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MealOption[]>({
    queryKey: ['dietPlanTemplate'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDietPlanTemplate();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateDietPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      trainerId: Principal;
      clientId: Principal;
      name: string;
      meals: Meal[];
      dietaryNotes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDietPlan(
        params.id,
        params.trainerId,
        params.clientId,
        params.name,
        params.meals,
        params.dietaryNotes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dietPlan'] });
    },
  });
}

export function useUpdateDietPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; meals: Meal[]; dietaryNotes: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDietPlan(params.id, params.meals, params.dietaryNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dietPlan'] });
    },
  });
}

export function useDeleteDietPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDietPlan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dietPlan'] });
    },
  });
}

// Exercise Library Queries
export function useGetAllExercises() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['exercises'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExercises();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      targetMuscleGroups: string;
      difficultyLevel: string;
      equipmentNeeded: string;
      videoUrl: string;
      description: string;
      recommendedRepsRange: string;
      recommendedSetsRange: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addExerciseToLibrary(
        params.id,
        params.name,
        params.targetMuscleGroups,
        params.difficultyLevel,
        params.equipmentNeeded,
        params.videoUrl,
        params.description,
        params.recommendedRepsRange,
        params.recommendedSetsRange
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useUpdateExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      targetMuscleGroups: string;
      difficultyLevel: string;
      equipmentNeeded: string;
      videoUrl: string;
      description: string;
      recommendedRepsRange: string;
      recommendedSetsRange: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateExerciseInLibrary(
        params.id,
        params.name,
        params.targetMuscleGroups,
        params.difficultyLevel,
        params.equipmentNeeded,
        params.videoUrl,
        params.description,
        params.recommendedRepsRange,
        params.recommendedSetsRange
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useDeleteExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteExerciseFromLibrary(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

// Re-export types from backend
export type { Exercise, DietPlan, ScheduledSession, MealOption };
