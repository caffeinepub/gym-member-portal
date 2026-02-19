import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BrandingSettings {
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
    secondaryColor: string;
}
export type Time = bigint;
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
    reps: bigint;
}
export type RecordId = string;
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
export type SetId = bigint;
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
    addUser(id: UserId, name: string, email: string, role: AppUserRole): Promise<void>;
    askVortex(searchQuery: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignClientToTrainer(trainerId: UserId, clientId: UserId): Promise<void>;
    createWorkoutPlan(planId: WorkoutPlanId, trainerId: UserId, clientId: UserId, name: string, sets: Array<Set_>, restTime: bigint, notes: string): Promise<void>;
    deleteWorkoutPlan(planId: WorkoutPlanId): Promise<void>;
    editUser(id: UserId, name: string, email: string, role: AppUserRole): Promise<void>;
    getAllUsers(): Promise<Array<User>>;
    getAllWorkoutPlansForUser(userId: UserId): Promise<Array<WorkoutPlan>>;
    getBrandingSettings(): Promise<BrandingSettings>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
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
    updateWorkoutPlan(planId: WorkoutPlanId, name: string, sets: Array<Set_>, restTime: bigint, notes: string): Promise<void>;
    updateWorkoutRecord(recordId: RecordId, completedSets: bigint, personalNotes: string): Promise<void>;
}
