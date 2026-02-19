import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Meal {
    id: MealId;
    foodItems: Array<FoodItem>;
    carbs: number;
    fats: number;
    name: string;
    time: string;
    totalCalories: bigint;
    protein: number;
}
export interface Exercise {
    id: ExerciseId;
    difficultyLevel: string;
    equipmentNeeded: string;
    name: string;
    description: string;
    recommendedSetsRange: string;
    targetMuscleGroups: string;
    videoUrl: string;
    recommendedRepsRange: string;
}
export interface BrandingSettings {
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
    secondaryColor: string;
}
export type Time = bigint;
export type TimetableId = string;
export interface WorkoutRecord {
    id: RecordId;
    completedSets: bigint;
    planId: WorkoutPlanId;
    userId: UserId;
    date: Time;
    personalNotes: string;
}
export interface User {
    id: UserId;
    name: string;
    role: AppUserRole;
    email: string;
}
export interface Set_ {
    id: SetId;
    weight: number;
    exerciseId: ExerciseId;
    reps: bigint;
}
export interface ScheduledSession {
    id: TimetableId;
    clientId: UserId;
    isCompleted: boolean;
    trainerNotes: string;
    trainerId: UserId;
    clientNotes: string;
    workoutPlanId: WorkoutPlanId;
    dateTime: bigint;
}
export interface WorkoutPlan {
    id: WorkoutPlanId;
    clientId: UserId;
    name: string;
    sets: Array<Set_>;
    notes: string;
    restTime: bigint;
    creatorTrainerId: UserId;
}
export type WorkoutPlanId = string;
export type UserId = Principal;
export type RecordId = string;
export type MealId = string;
export interface DietPlan {
    id: DietPlanId;
    meals: Array<Meal>;
    clientId: UserId;
    name: string;
    trainerId: UserId;
    dietaryNotes: string;
}
export interface DietOption {
    foodItems: Array<FoodItem>;
    description: string;
}
export interface FoodItem {
    carbs: number;
    fats: number;
    calories: bigint;
    name: string;
    portion: string;
    protein: number;
}
export type ExerciseId = bigint;
export type DietPlanId = string;
export type SetId = bigint;
export interface MealOption {
    options: Array<DietOption>;
    mealType: string;
}
export interface UserProfile {
    name: string;
    role: AppUserRole;
    email: string;
}
export enum AppUserRole {
    client = "client",
    admin = "admin",
    trainer = "trainer"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addExerciseToLibrary(id: ExerciseId, name: string, targetMuscleGroups: string, difficultyLevel: string, equipmentNeeded: string, videoUrl: string, description: string, recommendedRepsRange: string, recommendedSetsRange: string): Promise<void>;
    addUser(id: UserId, name: string, email: string, role: AppUserRole): Promise<void>;
    askVortex(searchQuery: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignClientToTrainer(trainerId: UserId, clientId: UserId): Promise<void>;
    createDietPlan(id: DietPlanId, trainerId: UserId, clientId: UserId, name: string, meals: Array<Meal>, dietaryNotes: string): Promise<void>;
    createScheduledSession(id: TimetableId, trainerId: UserId, clientId: UserId, workoutPlanId: WorkoutPlanId, dateTime: bigint, clientNotes: string): Promise<void>;
    createWorkoutPlan(planId: WorkoutPlanId, trainerId: UserId, clientId: UserId, name: string, sets: Array<Set_>, restTime: bigint, notes: string): Promise<void>;
    deleteDietPlan(id: DietPlanId): Promise<void>;
    deleteExerciseFromLibrary(id: ExerciseId): Promise<void>;
    deleteScheduledSession(id: TimetableId): Promise<void>;
    deleteWorkoutPlan(planId: WorkoutPlanId): Promise<void>;
    editUser(id: UserId, name: string, email: string, role: AppUserRole): Promise<void>;
    getAllExercises(): Promise<Array<Exercise>>;
    getAllUsers(): Promise<Array<User>>;
    getAllWorkoutPlansForUser(userId: UserId): Promise<Array<WorkoutPlan>>;
    getBrandingSettings(): Promise<BrandingSettings>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDietPlanTemplate(): Promise<Array<MealOption>>;
    getDietPlansForClient(clientId: UserId): Promise<Array<DietPlan>>;
    getExercise(id: ExerciseId): Promise<Exercise | null>;
    getScheduledSessionsForClient(clientId: UserId): Promise<Array<ScheduledSession>>;
    getScheduledSessionsForTrainer(trainerId: UserId): Promise<Array<ScheduledSession>>;
    getTrainerClients(trainerId: UserId): Promise<Array<UserId>>;
    getUser(id: UserId): Promise<User | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkoutPlan(id: WorkoutPlanId): Promise<WorkoutPlan | null>;
    getWorkoutRecordsForUser(userId: UserId): Promise<Array<WorkoutRecord>>;
    isCallerAdmin(): Promise<boolean>;
    logWorkoutCompletion(recordId: RecordId, planId: WorkoutPlanId, userId: UserId, completedSets: bigint, personalNotes: string): Promise<void>;
    removeUser(id: UserId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBrandingSettings(newSettings: BrandingSettings): Promise<void>;
    updateDietPlan(id: DietPlanId, meals: Array<Meal>, dietaryNotes: string): Promise<void>;
    updateExerciseInLibrary(id: ExerciseId, name: string, targetMuscleGroups: string, difficultyLevel: string, equipmentNeeded: string, videoUrl: string, description: string, recommendedRepsRange: string, recommendedSetsRange: string): Promise<void>;
    updateScheduledSession(id: TimetableId, dateTime: bigint, clientNotes: string): Promise<void>;
    updateWorkoutPlan(planId: WorkoutPlanId, name: string, sets: Array<Set_>, restTime: bigint, notes: string): Promise<void>;
    updateWorkoutRecord(recordId: RecordId, completedSets: bigint, personalNotes: string): Promise<void>;
}
