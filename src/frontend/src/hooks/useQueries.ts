import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  User,
  UserProfile,
  BrandingSettings,
  Exercise,
  ExerciseWithHistory,
  WeightProgressionEntry,
  WeightProgressionStats,
  OptimalWorkoutTime,
  LocationPreference,
  TrainingPartnerPreference,
  NearbyUser,
  ConnectionRequest,
  PRLeaderboard,
  FormAnalysisTip,
  SupplementStack,
  AppUserRole,
  UserId,
  WorkoutPlanId,
  RecordId,
  Set_,
} from '../backend';
import { PrType } from '../backend';
import { Principal } from '@dfinity/principal';

// Re-export types for components
export type { User, UserProfile, BrandingSettings, Exercise, FormAnalysisTip, SupplementStack };

// Additional types for frontend
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

export interface DietPlan {
  id: string;
  trainerId: UserId;
  clientId: UserId;
  name: string;
  meals: Meal[];
  dietaryNotes: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foodItems: FoodItem[];
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DietOption {
  description: string;
  foodItems: FoodItem[];
}

export interface MealOption {
  mealType: string;
  options: DietOption[];
}

// Helper function to convert PrType enum to integer for backend
function prTypeToInt(prType: PrType): bigint {
  switch (prType) {
    case PrType.squat:
      return BigInt(1);
    case PrType.benchPress:
      return BigInt(2);
    case PrType.deadlift:
      return BigInt(3);
    case PrType.shoulderPress:
      return BigInt(4);
    case PrType.barbellRow:
      return BigInt(5);
    default:
      return BigInt(1);
  }
}

// Vortex AI Query Hook - Fixed to use backend
export function useAskVortex() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (question: string) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        const response = await actor.askVortex(question);
        return response;
      } catch (error: any) {
        console.error('Vortex AI backend error:', error);
        throw new Error(error.message || 'Failed to get response from Vortex AI. Please try again.');
      }
    },
  });
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

// User Management Queries (Admin)
export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      email,
      role,
    }: {
      id: Principal;
      name: string;
      email: string;
      role: AppUserRole;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addUser(id, name, email, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useEditUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      email,
      role,
    }: {
      id: Principal;
      name: string;
      email: string;
      role: AppUserRole;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editUser(id, name, email, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Trainer-Client Assignment
export function useAssignClientToTrainer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      trainerId,
      clientId,
    }: {
      trainerId: Principal;
      clientId: Principal;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignClientToTrainer(trainerId, clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerClients'] });
    },
  });
}

export function useGetTrainerClients() {
  const { actor, isFetching } = useActor();

  return useQuery<User[]>({
    queryKey: ['trainerClients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyClients();
    },
    enabled: !!actor && !isFetching,
  });
}

// Branding Settings
export function useGetBrandingSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<BrandingSettings>({
    queryKey: ['brandingSettings'],
    queryFn: async () => {
      if (!actor)
        return {
          logoUrl: '',
          primaryColor: '#000000',
          secondaryColor: '#FFFFFF',
          accentColor: '#FF0000',
        };
      return actor.getBrandingSettings();
    },
    enabled: !!actor && !isFetching,
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

// Exercise Library
export function useGetAllExercises() {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['exercises'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExercises();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetExercise(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise | null>({
    queryKey: ['exercise', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getExercise(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetExerciseWithHistory(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ExerciseWithHistory | null>({
    queryKey: ['exerciseWithHistory', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getExerciseWithHistory(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exercise: {
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
        exercise.id,
        exercise.name,
        exercise.targetMuscleGroups,
        exercise.difficultyLevel,
        exercise.equipmentNeeded,
        exercise.videoUrl,
        exercise.description,
        exercise.recommendedRepsRange,
        exercise.recommendedSetsRange
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
    mutationFn: async (exercise: {
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
        exercise.id,
        exercise.name,
        exercise.targetMuscleGroups,
        exercise.difficultyLevel,
        exercise.equipmentNeeded,
        exercise.videoUrl,
        exercise.description,
        exercise.recommendedRepsRange,
        exercise.recommendedSetsRange
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

// Weight Progression
export function useLogWeightProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      exerciseId,
      weight,
      reps,
    }: {
      exerciseId: bigint;
      weight: number;
      reps: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logWeightProgress(exerciseId, weight, reps);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['weightProgressionEntries', variables.exerciseId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ['progressionStats', variables.exerciseId.toString()],
      });
    },
  });
}

export function useGetWeightProgressionEntries(exerciseId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<WeightProgressionEntry[]>({
    queryKey: ['weightProgressionEntries', exerciseId?.toString()],
    queryFn: async () => {
      if (!actor || !exerciseId) return [];
      return actor.getWeightProgressionEntries(exerciseId);
    },
    enabled: !!actor && !isFetching && exerciseId !== null,
  });
}

export function useGetProgressionStatsForExercise(exerciseId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<WeightProgressionStats | null>({
    queryKey: ['progressionStats', exerciseId?.toString()],
    queryFn: async () => {
      if (!actor || !exerciseId) return null;
      return actor.getProgressionStatsForExercise(exerciseId);
    },
    enabled: !!actor && !isFetching && exerciseId !== null,
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
  const { actor, isFetching } = useActor();

  return useQuery<OptimalWorkoutTime | null>({
    queryKey: ['optimalWorkoutTime'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOptimalWorkoutTime();
    },
    enabled: !!actor && !isFetching,
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

// Location & Training Partner Preferences
export function useSaveLocationPreference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      latitude,
      longitude,
      searchRadiusKm,
      gymName,
    }: {
      latitude: number;
      longitude: number;
      searchRadiusKm: bigint;
      gymName: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveLocationPreference(latitude, longitude, searchRadiusKm, gymName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locationPreference'] });
      queryClient.invalidateQueries({ queryKey: ['nearbyUsers'] });
    },
  });
}

export function useGetLocationPreference() {
  const { actor, isFetching } = useActor();

  return useQuery<LocationPreference | null>({
    queryKey: ['locationPreference'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLocationPreference();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveTrainingPartnerPreference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fitnessGoals,
      experienceLevel,
      preferredWorkoutTimes,
      bio,
    }: {
      fitnessGoals: string[];
      experienceLevel: string;
      preferredWorkoutTimes: string[];
      bio: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveTrainingPartnerPreference(
        fitnessGoals,
        experienceLevel,
        preferredWorkoutTimes,
        bio
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingPartnerPreference'] });
    },
  });
}

export function useGetTrainingPartnerPreference() {
  const { actor, isFetching } = useActor();

  return useQuery<TrainingPartnerPreference | null>({
    queryKey: ['trainingPartnerPreference'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTrainingPartnerPreference();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNearbyUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<NearbyUser[]>({
    queryKey: ['nearbyUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNearbyUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

// Connection Requests
export function useSendConnectionRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiverId, message }: { receiverId: Principal; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendConnectionRequest(receiverId, message);
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
    mutationFn: async (requestId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptConnectionRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
}

export function useRejectConnectionRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectConnectionRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
    },
  });
}

export function useGetMyConnectionRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<ConnectionRequest[]>({
    queryKey: ['connectionRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyConnectionRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyConnections() {
  const { actor, isFetching } = useActor();

  return useQuery<User[]>({
    queryKey: ['connections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyConnections();
    },
    enabled: !!actor && !isFetching,
  });
}

// PR Leaderboard
export function useSubmitPersonalRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      prType,
      weight,
      reps,
    }: {
      prType: PrType;
      weight: number;
      reps: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const prTypeInt = prTypeToInt(prType);
      return actor.submitPersonalRecord(prTypeInt, weight, reps);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prLeaderboard'] });
    },
  });
}

export function useGetPRLeaderboard(prType: PrType) {
  const { actor, isFetching } = useActor();

  return useQuery<PRLeaderboard>({
    queryKey: ['prLeaderboard', prType],
    queryFn: async () => {
      if (!actor)
        return {
          prType,
          entries: [],
        };
      const prTypeInt = prTypeToInt(prType);
      return actor.getPrLeaderboard(prTypeInt);
    },
    enabled: !!actor && !isFetching,
  });
}

// Form Analysis Tips
export function useGetFormAnalysisTip(exerciseId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<FormAnalysisTip | null>({
    queryKey: ['formAnalysisTip', exerciseId?.toString()],
    queryFn: async () => {
      if (!actor || !exerciseId) return null;
      return actor.getFormAnalysisTip(exerciseId);
    },
    enabled: !!actor && !isFetching && exerciseId !== null,
  });
}

export function useGetAllFormAnalysisTips() {
  const { actor, isFetching } = useActor();

  return useQuery<FormAnalysisTip[]>({
    queryKey: ['formAnalysisTips'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFormAnalysisTips();
    },
    enabled: !!actor && !isFetching,
  });
}

// Supplement Stacks
export function useGetSupplementStack(goalType: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SupplementStack | null>({
    queryKey: ['supplementStack', goalType],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSupplementStack(goalType);
    },
    enabled: !!actor && !isFetching && !!goalType,
  });
}

export function useGetAllSupplementStacks() {
  const { actor, isFetching } = useActor();

  return useQuery<SupplementStack[]>({
    queryKey: ['supplementStacks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSupplementStacks();
    },
    enabled: !!actor && !isFetching,
  });
}

// Placeholder hooks for features not yet implemented in backend
// These return empty data to prevent errors in components

export function useGetAllWorkoutPlansForUser() {
  return useQuery<WorkoutPlan[]>({
    queryKey: ['workoutPlans'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreateWorkoutPlan() {
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
      // Placeholder - backend not implemented yet
      console.log('Workout plan creation not yet implemented in backend', params);
      throw new Error('Workout plan creation not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutPlans'] });
    },
  });
}

export function useGetWorkoutRecordsForUser() {
  return useQuery<WorkoutRecord[]>({
    queryKey: ['workoutRecords'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useLogWorkoutCompletion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recordId,
      planId,
      userId,
      completedSets,
      personalNotes,
    }: {
      recordId: string;
      planId: string;
      userId: Principal;
      completedSets: bigint;
      personalNotes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logWorkoutCompletion(recordId, planId, userId, completedSets, personalNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutRecords'] });
    },
  });
}

export function useGetScheduledSessionsForClient() {
  return useQuery<ScheduledSession[]>({
    queryKey: ['scheduledSessions'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreateScheduledSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { receiverId: Principal; message: string }) => {
      // Placeholder - backend not implemented yet
      console.log('Scheduled session creation not yet implemented in backend', params);
      throw new Error('Scheduled session creation not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledSessions'] });
    },
  });
}

export function useGetDietPlansForClient() {
  return useQuery<DietPlan[]>({
    queryKey: ['dietPlans'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreateDietPlan() {
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
      // Placeholder - backend not implemented yet
      console.log('Diet plan creation not yet implemented in backend', params);
      throw new Error('Diet plan creation not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dietPlans'] });
    },
  });
}

export function useGetDietPlanTemplate() {
  return useQuery<MealOption[]>({
    queryKey: ['dietPlanTemplate'],
    queryFn: async () => {
      // Return a hardcoded template for now
      return [
        {
          mealType: 'Breakfast (7:00 AM - 8:00 AM)',
          options: [
            {
              description: 'High Protein Start',
              foodItems: [
                { name: '4 Whole Eggs', portion: '4 eggs', calories: 280, protein: 24, carbs: 2, fats: 20 },
                { name: 'Oatmeal', portion: '1 cup', calories: 150, protein: 5, carbs: 27, fats: 3 },
                { name: 'Banana', portion: '1 medium', calories: 105, protein: 1, carbs: 27, fats: 0 },
              ],
            },
            {
              description: 'Balanced Energy',
              foodItems: [
                { name: 'Greek Yogurt', portion: '200g', calories: 130, protein: 20, carbs: 9, fats: 0 },
                { name: 'Granola', portion: '1/2 cup', calories: 200, protein: 4, carbs: 30, fats: 8 },
                { name: 'Berries', portion: '1 cup', calories: 70, protein: 1, carbs: 17, fats: 0 },
              ],
            },
          ],
        },
        {
          mealType: 'Mid-Morning Snack (10:00 AM - 11:00 AM)',
          options: [
            {
              description: 'Protein Boost',
              foodItems: [
                { name: 'Protein Shake', portion: '1 scoop', calories: 120, protein: 25, carbs: 3, fats: 1 },
                { name: 'Almonds', portion: '1 oz', calories: 160, protein: 6, carbs: 6, fats: 14 },
              ],
            },
            {
              description: 'Natural Energy',
              foodItems: [
                { name: 'Apple', portion: '1 medium', calories: 95, protein: 0, carbs: 25, fats: 0 },
                { name: 'Peanut Butter', portion: '2 tbsp', calories: 190, protein: 8, carbs: 7, fats: 16 },
              ],
            },
          ],
        },
      ];
    },
  });
}
