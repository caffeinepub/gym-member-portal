import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TrainingPartnerPreference {
    bio: string;
    experienceLevel: string;
    fitnessGoals: Array<string>;
    preferredWorkoutTimes: Array<string>;
    userId: UserId;
}
export type RecordId = string;
export interface FormAnalysisTip {
    exerciseId: ExerciseId;
    formCheckpoints: Array<string>;
    commonMistakes: Array<string>;
    correctionSteps: Array<string>;
    videoUrl: string;
}
export interface SupplementStack {
    goalType: string;
    timingGuidelines: Array<TimingGuideline>;
    benefitDescriptions: Array<string>;
    products: Array<SupplementProduct>;
    dosageRecommendations: Array<DosageRecommendation>;
}
export type WorkoutPlanId = string;
export interface LocationPreference {
    latitude: number;
    gymName: string;
    searchRadiusKm: bigint;
    userId: UserId;
    longitude: number;
}
export interface ConnectionRequest {
    id: ConnectionRequestId;
    status: Variant_pending_rejected_accepted;
    receiverId: UserId;
    message: string;
    timestamp: bigint;
    senderId: UserId;
}
export type ExerciseId = bigint;
export type ConnectionRequestId = string;
export interface BrandingSettings {
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
    secondaryColor: string;
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
export interface User {
    id: UserId;
    name: string;
    role: AppUserRole;
    email: string;
}
export interface DosageRecommendation {
    productName: string;
    recommendedDosage: string;
}
export interface WeightProgressionEntry {
    weight: number;
    exerciseId: ExerciseId;
    reps: bigint;
    timestamp: bigint;
}
export interface OptimalWorkoutTime {
    recommendedEndTime: bigint;
    userId: UserId;
    recommendedStartTime: bigint;
    optimalWindow: bigint;
}
export interface SupplementProduct {
    name: string;
    description: string;
    productType: string;
}
export interface WeightProgressionStats {
    totalVolume: number;
    exerciseId: ExerciseId;
    totalSets: bigint;
    averageWeight: number;
    totalSessions: bigint;
    suggestedIncrement: number;
}
export interface Set_ {
    id: SetId;
    weight: number;
    exerciseId: ExerciseId;
    reps: bigint;
}
export type UserId = Principal;
export interface NearbyUser {
    experienceLevel: string;
    fitnessGoals: Array<string>;
    userId: UserId;
    name: string;
    distanceKm: number;
}
export interface ExerciseWithHistory {
    userHistory?: Array<WeightProgressionEntry>;
    exercise: Exercise;
}
export interface TimingGuideline {
    timing: string;
    productName: string;
    purpose: string;
}
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
export enum Variant_pending_rejected_accepted {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export interface backendInterface {
    acceptConnectionRequest(requestId: ConnectionRequestId): Promise<void>;
    addExerciseToLibrary(id: ExerciseId, name: string, targetMuscleGroups: string, difficultyLevel: string, equipmentNeeded: string, videoUrl: string, description: string, recommendedRepsRange: string, recommendedSetsRange: string): Promise<void>;
    addUser(id: UserId, name: string, email: string, role: AppUserRole): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignClientToTrainer(trainerId: UserId, clientId: UserId): Promise<void>;
    clearCaffeineIntake(): Promise<void>;
    createWorkoutPlan(planId: WorkoutPlanId, trainerId: UserId, clientId: UserId, name: string, sets: Array<Set_>, restTime: bigint, notes: string): Promise<void>;
    deleteExerciseFromLibrary(id: ExerciseId): Promise<void>;
    deleteWorkoutPlan(planId: WorkoutPlanId): Promise<void>;
    editUser(id: UserId, name: string, email: string, role: AppUserRole): Promise<void>;
    getAllExercises(): Promise<Array<Exercise>>;
    getAllFormAnalysisTips(): Promise<Array<FormAnalysisTip>>;
    getAllSupplementStacks(): Promise<Array<SupplementStack>>;
    getAllUsers(): Promise<Array<User>>;
    getBrandingSettings(): Promise<BrandingSettings>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExercise(id: ExerciseId): Promise<Exercise | null>;
    getExerciseWithHistory(id: ExerciseId): Promise<ExerciseWithHistory | null>;
    getFormAnalysisTip(exerciseId: ExerciseId): Promise<FormAnalysisTip | null>;
    getLocationPreference(): Promise<LocationPreference | null>;
    getMyClients(): Promise<Array<User>>;
    getMyConnectionRequests(): Promise<Array<ConnectionRequest>>;
    getMyConnections(): Promise<Array<User>>;
    getNearbyUsers(): Promise<Array<NearbyUser>>;
    getOptimalWorkoutTime(): Promise<OptimalWorkoutTime | null>;
    getProgressionStatsForExercise(exerciseId: ExerciseId): Promise<WeightProgressionStats>;
    getSupplementStack(goalType: string): Promise<SupplementStack | null>;
    getTrainingPartnerPreference(): Promise<TrainingPartnerPreference | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeightProgressionEntries(exerciseId: ExerciseId): Promise<Array<WeightProgressionEntry>>;
    initializeFormAnalysisTipsAndSupplements(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    logCaffeineIntake(amountMg: bigint): Promise<void>;
    logWeightProgress(exerciseId: ExerciseId, weight: number, reps: bigint): Promise<void>;
    logWorkoutCompletion(recordId: RecordId, planId: WorkoutPlanId, userId: UserId, completedSets: bigint, personalNotes: string): Promise<void>;
    rejectConnectionRequest(requestId: ConnectionRequestId): Promise<void>;
    removeUser(id: UserId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveLocationPreference(latitude: number, longitude: number, searchRadiusKm: bigint, gymName: string): Promise<void>;
    saveTrainingPartnerPreference(fitnessGoals: Array<string>, experienceLevel: string, preferredWorkoutTimes: Array<string>, bio: string): Promise<void>;
    sendConnectionRequest(receiverId: UserId, message: string): Promise<ConnectionRequestId>;
    updateBrandingSettings(newSettings: BrandingSettings): Promise<void>;
    updateExerciseInLibrary(id: ExerciseId, name: string, targetMuscleGroups: string, difficultyLevel: string, equipmentNeeded: string, videoUrl: string, description: string, recommendedRepsRange: string, recommendedSetsRange: string): Promise<void>;
    updateWorkoutPlan(planId: WorkoutPlanId, name: string, sets: Array<Set_>, restTime: bigint, notes: string): Promise<void>;
}
