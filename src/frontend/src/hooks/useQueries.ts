import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type {
  UserProfile,
  AppUserRole,
  BrandingSettings,
  Set_,
  Exercise,
  WeightProgressionEntry,
  WeightProgressionStats,
  OptimalWorkoutTime,
  ExerciseId,
  UserId,
  WorkoutPlanId,
  RecordId,
  FormAnalysisTip,
  SupplementStack,
  LocationPreference,
  TrainingPartnerPreference,
  ConnectionRequest,
  NearbyUser,
  ExerciseWithHistory,
  ConnectionRequestId,
} from '../backend';

// Local type definitions for types not exported by backend
export interface User {
  id: UserId;
  name: string;
  email: string;
  role: AppUserRole;
}

export interface WorkoutPlan {
  id: WorkoutPlanId;
  creatorTrainerId: UserId;
  clientId: UserId;
  name: string;
  sets: Set_[];
  restTime: bigint;
  notes: string;
}

export interface WorkoutRecord {
  id: RecordId;
  planId: WorkoutPlanId;
  userId: UserId;
  date: bigint;
  completedSets: bigint;
  personalNotes: string;
}

export interface FoodItem {
  name: string;
  portion: string;
  calories: bigint;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foodItems: FoodItem[];
  totalCalories: bigint;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DietPlan {
  id: string;
  trainerId: UserId;
  clientId: UserId;
  name: string;
  meals: Meal[];
  dietaryNotes: string;
}

export interface DietOption {
  description: string;
  foodItems: FoodItem[];
}

export interface MealOption {
  mealType: string;
  options: DietOption[];
}

export interface ScheduledSession {
  id: string;
  trainerId: UserId;
  clientId: UserId;
  workoutPlanId: WorkoutPlanId;
  dateTime: bigint;
  isCompleted: boolean;
  clientNotes: string;
  trainerNotes: string;
}

export interface VortexMessage {
  role: 'user' | 'assistant';
  content: string;
}

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

export function useGetUser(userId: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<User | null>({
    queryKey: ['user', userId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getUserProfile(userId);
      if (!profile) return null;
      return {
        id: userId,
        name: profile.name,
        email: profile.email,
        role: profile.role,
      };
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

// Trainer-Client Assignment
export function useGetMyClients() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<User[]>({
    queryKey: ['myClients'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyClients();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTrainerClients() {
  return useGetMyClients();
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
      queryClient.invalidateQueries({ queryKey: ['myClients'] });
    },
  });
}

// Workout Plans - Mock implementations
export function useGetAllWorkoutPlansForUser(userId: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkoutPlan[]>({
    queryKey: ['workoutPlans', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      // Backend doesn't have this method, return empty array
      return [];
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutPlans'] });
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

// Workout Records
export function useGetWorkoutRecordsForUser(userId: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkoutRecord[]>({
    queryKey: ['workoutRecords', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      // Backend doesn't have this method, return empty array
      return [];
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutRecords'] });
    },
  });
}

// Scheduled Sessions - Mock implementations
export function useGetScheduledSessionsForClient(userId: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ScheduledSession[]>({
    queryKey: ['scheduledSessions', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      // Backend doesn't have this method, return empty array
      return [];
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useCreateScheduledSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      sessionId: string;
      trainerId: Principal;
      clientId: Principal;
      workoutPlanId: string;
      dateTime: bigint;
      trainerNotes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't have this method, mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledSessions'] });
    },
  });
}

// Diet Plans - Mock implementations
export function useGetDietPlansForClient(userId: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DietPlan[]>({
    queryKey: ['dietPlans', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      // Backend doesn't have this method, return empty array
      return [];
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useGetDietPlanTemplate() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MealOption[]>({
    queryKey: ['dietPlanTemplate'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend doesn't have this method, return empty array
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateDietPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      planId: string;
      trainerId: Principal;
      clientId: Principal;
      name: string;
      meals: Meal[];
      dietaryNotes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't have this method, mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dietPlans'] });
    },
  });
}

// Exercise Library
export function useGetAllExercises() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['exercises'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllExercises();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetExercise(exerciseId: ExerciseId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Exercise | null>({
    queryKey: ['exercise', exerciseId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getExercise(exerciseId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetExerciseWithHistory(exerciseId: ExerciseId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExerciseWithHistory | null>({
    queryKey: ['exerciseWithHistory', exerciseId?.toString()],
    queryFn: async () => {
      if (!actor || !exerciseId) throw new Error('Actor not available');
      return actor.getExerciseWithHistory(exerciseId);
    },
    enabled: !!actor && !actorFetching && exerciseId !== null,
  });
}

export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: ExerciseId;
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
      id: ExerciseId;
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
    mutationFn: async (id: ExerciseId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteExerciseFromLibrary(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

// Weight Progression
export function useLogWeightProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { exerciseId: ExerciseId; weight: number; reps: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logWeightProgress(params.exerciseId, params.weight, params.reps);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightProgression'] });
      queryClient.invalidateQueries({ queryKey: ['progressionStats'] });
    },
  });
}

export function useGetProgressionStatsForExercise(exerciseId: ExerciseId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WeightProgressionStats>({
    queryKey: ['progressionStats', exerciseId?.toString()],
    queryFn: async () => {
      if (!actor || !exerciseId) throw new Error('Actor not available');
      return actor.getProgressionStatsForExercise(exerciseId);
    },
    enabled: !!actor && !actorFetching && exerciseId !== null,
  });
}

export function useGetWeightProgressionEntries(exerciseId: ExerciseId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WeightProgressionEntry[]>({
    queryKey: ['weightProgression', exerciseId?.toString()],
    queryFn: async () => {
      if (!actor || !exerciseId) throw new Error('Actor not available');
      return actor.getWeightProgressionEntries(exerciseId);
    },
    enabled: !!actor && !actorFetching && exerciseId !== null,
  });
}

// Caffeine Tracking
export function useLogCaffeineIntake() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amountMg: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logCaffeineIntake(amountMg);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimalWorkoutTime'] });
    },
  });
}

export function useGetOptimalWorkoutTime() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OptimalWorkoutTime | null>({
    queryKey: ['optimalWorkoutTime'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getOptimalWorkoutTime();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useClearCaffeineIntake() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearCaffeineIntake();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimalWorkoutTime'] });
    },
  });
}

// Form Analysis Tips
export function useGetFormAnalysisTip(exerciseId: ExerciseId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FormAnalysisTip | null>({
    queryKey: ['formAnalysisTip', exerciseId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFormAnalysisTip(exerciseId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllFormAnalysisTips() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FormAnalysisTip[]>({
    queryKey: ['formAnalysisTips'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllFormAnalysisTips();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Supplement Stacks
export function useGetSupplementStack(goalType: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SupplementStack | null>({
    queryKey: ['supplementStack', goalType],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSupplementStack(goalType);
    },
    enabled: !!actor && !actorFetching && !!goalType,
  });
}

export function useGetAllSupplementStacks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SupplementStack[]>({
    queryKey: ['supplementStacks'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllSupplementStacks();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Gym Buddy Locator
export function useSaveLocationPreference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { latitude: number; longitude: number; searchRadiusKm: bigint; gymName: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveLocationPreference(params.latitude, params.longitude, params.searchRadiusKm, params.gymName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locationPreference'] });
      queryClient.invalidateQueries({ queryKey: ['nearbyUsers'] });
    },
  });
}

export function useGetLocationPreference() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LocationPreference | null>({
    queryKey: ['locationPreference'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLocationPreference();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveTrainingPartnerPreference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      fitnessGoals: string[];
      experienceLevel: string;
      preferredWorkoutTimes: string[];
      bio: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveTrainingPartnerPreference(
        params.fitnessGoals,
        params.experienceLevel,
        params.preferredWorkoutTimes,
        params.bio
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingPartnerPreference'] });
    },
  });
}

export function useGetTrainingPartnerPreference() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TrainingPartnerPreference | null>({
    queryKey: ['trainingPartnerPreference'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTrainingPartnerPreference();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetNearbyUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NearbyUser[]>({
    queryKey: ['nearbyUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getNearbyUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSendConnectionRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { receiverId: Principal; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendConnectionRequest(params.receiverId, params.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
    },
  });
}

export function useAcceptConnectionRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: ConnectionRequestId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptConnectionRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myConnections'] });
    },
  });
}

export function useRejectConnectionRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: ConnectionRequestId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectConnectionRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
    },
  });
}

export function useGetMyConnectionRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ConnectionRequest[]>({
    queryKey: ['connectionRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyConnectionRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMyConnections() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<User[]>({
    queryKey: ['myConnections'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyConnections();
    },
    enabled: !!actor && !actorFetching,
  });
}

// VORTEX AI - Mock implementation
export function useAskVortex() {
  return useMutation({
    mutationFn: async (message: string) => {
      // Mock response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return `VORTEX AI response to: ${message}`;
    },
  });
}
