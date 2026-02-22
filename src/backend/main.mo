import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Option "mo:core/Option";
import OutCall "http-outcalls/outcall";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  type UserId = Principal;
  type WorkoutPlanId = Text;
  type ExerciseId = Nat;
  type SetId = Nat;
  type RecordId = Text;
  type TimetableId = Text;
  type DietPlanId = Text;
  type MealId = Text;
  type ConnectionRequestId = Text;

  type AppUserRole = {
    #admin;
    #trainer;
    #client;
  };

  module AppUserRole {
    public func toText(userRole : AppUserRole) : Text {
      switch (userRole) {
        case (#admin) { "admin" };
        case (#trainer) { "trainer" };
        case (#client) { "client" };
      };
    };

    public func fromText(userRoleStr : Text) : AppUserRole {
      switch (userRoleStr) {
        case ("admin") { #admin };
        case ("trainer") { #trainer };
        case ("client") { #client };
        case (_) { Runtime.trap("Unknown role id " # userRoleStr) };
      };
    };
  };

  module User {
    public type T = { id : UserId; name : Text; email : Text; role : AppUserRole };
    public func compareByEmail(user1 : T, user2 : T) : Order.Order {
      Text.compare(user1.email, user2.email);
    };
  };

  type User = User.T;

  module Set {
    public type T = { id : SetId; exerciseId : ExerciseId; reps : Nat; weight : Float };
  };

  type Set = Set.T;

  type WorkoutPlan = {
    id : WorkoutPlanId;
    creatorTrainerId : UserId;
    clientId : UserId;
    name : Text;
    sets : [Set];
    restTime : Nat;
    notes : Text;
  };

  type WorkoutRecord = {
    id : RecordId;
    planId : WorkoutPlanId;
    userId : UserId;
    date : Time.Time;
    completedSets : Nat;
    personalNotes : Text;
  };

  module BrandingSettings {
    public type T = {
      logoUrl : Text;
      primaryColor : Text;
      secondaryColor : Text;
      accentColor : Text;
    };

    public func default() : T {
      {
        logoUrl = "";
        primaryColor = "#000000";
        secondaryColor = "#FFFFFF";
        accentColor = "#FF0000";
      };
    };
  };

  type BrandingSettings = BrandingSettings.T;

  public type UserProfile = {
    name : Text;
    email : Text;
    role : AppUserRole;
  };

  type ScheduledSession = {
    id : TimetableId;
    trainerId : UserId;
    clientId : UserId;
    workoutPlanId : WorkoutPlanId;
    dateTime : Int;
    isCompleted : Bool;
    clientNotes : Text;
    trainerNotes : Text;
  };

  type DietPlan = {
    id : DietPlanId;
    trainerId : UserId;
    clientId : UserId;
    name : Text;
    meals : [Meal];
    dietaryNotes : Text;
  };

  type Meal = {
    id : MealId;
    name : Text;
    time : Text;
    foodItems : [FoodItem];
    totalCalories : Nat;
    protein : Float;
    carbs : Float;
    fats : Float;
  };

  type DietOption = {
    description : Text;
    foodItems : [FoodItem];
  };

  type FoodItem = {
    name : Text;
    portion : Text;
    calories : Nat;
    protein : Float;
    carbs : Float;
    fats : Float;
  };

  type MealOption = {
    mealType : Text;
    options : [DietOption];
  };

  type Exercise = {
    id : ExerciseId;
    name : Text;
    targetMuscleGroups : Text;
    difficultyLevel : Text;
    equipmentNeeded : Text;
    videoUrl : Text;
    description : Text;
    recommendedRepsRange : Text;
    recommendedSetsRange : Text;
  };

  type ExerciseWithHistory = {
    exercise : Exercise;
    userHistory : ?[WeightProgressionEntry];
  };

  type WeightProgressionEntry = {
    exerciseId : ExerciseId;
    weight : Float;
    reps : Nat;
    timestamp : Int;
  };

  type WeightProgressionData = {
    userId : UserId;
    exerciseId : ExerciseId;
    entries : [WeightProgressionEntry];
  };

  type WeightProgressionStats = {
    exerciseId : ExerciseId;
    totalSessions : Nat;
    totalSets : Nat;
    totalVolume : Float;
    averageWeight : Float;
    suggestedIncrement : Float;
  };

  type CaffeineIntake = {
    userId : UserId;
    amountMg : Nat;
    intakeTime : Int;
  };

  type OptimalWorkoutTime = {
    userId : UserId;
    recommendedStartTime : Int;
    recommendedEndTime : Int;
    optimalWindow : Nat;
  };

  type LocationPreference = {
    userId : UserId;
    latitude : Float;
    longitude : Float;
    searchRadiusKm : Nat;
    gymName : Text;
  };

  type TrainingPartnerPreference = {
    userId : UserId;
    fitnessGoals : [Text];
    experienceLevel : Text;
    preferredWorkoutTimes : [Text];
    bio : Text;
  };

  type ConnectionRequest = {
    id : ConnectionRequestId;
    senderId : UserId;
    receiverId : UserId;
    status : { #pending; #accepted; #rejected };
    message : Text;
    timestamp : Int;
  };

  type NearbyUser = {
    userId : UserId;
    name : Text;
    distanceKm : Float;
    fitnessGoals : [Text];
    experienceLevel : Text;
  };

  type PrType = {
    #squat;
    #benchPress;
    #deadlift;
    #shoulderPress;
    #barbellRow;
  };

  module PrType {
    public func compare(a : PrType, b : PrType) : Order.Order {
      func encode(prType : PrType) : Nat {
        switch (prType) {
          case (#squat) { 0 };
          case (#benchPress) { 1 };
          case (#deadlift) { 2 };
          case (#shoulderPress) { 3 };
          case (#barbellRow) { 4 };
        };
      };
      Nat.compare(encode(a), encode(b));
    };

    public func fromInt(value : Int) : PrType {
      switch (value) {
        case (1) { #squat };
        case (2) { #benchPress };
        case (3) { #deadlift };
        case (4) { #shoulderPress };
        case (5) { #barbellRow };
        case (_) { #squat };
      };
    };
  };

  module PrRecordKey {
    public func compare(a : (UserId, PrType), b : (UserId, PrType)) : Order.Order {
      switch (Principal.compare(a.0, b.0)) {
        case (#equal) { PrType.compare(a.1, b.1) };
        case (other) { other };
      };
    };
  };

  public type PR = {
    prType : PrType;
    weight : Float;
    reps : Nat;
    date : Int;
  };

  public type PRLeaderboardEntry = {
    userId : UserId;
    weight : Float;
    date : Int;
    name : Text;
    ranking : Nat;
  };

  public type PRLeaderboard = {
    prType : PrType;
    entries : [PRLeaderboardEntry];
  };

  let userStore = Map.empty<UserId, User>();
  let workoutPlanStore = Map.empty<WorkoutPlanId, WorkoutPlan>();
  let workoutRecordStore = Map.empty<RecordId, WorkoutRecord>();
  let trainerToClients = Map.empty<UserId, List.List<UserId>>();
  let workoutTimetableStore = Map.empty<TimetableId, ScheduledSession>();
  let dietPlanStore = Map.empty<DietPlanId, DietPlan>();
  let weightProgressionStore = Map.empty<UserId, Map.Map<ExerciseId, List.List<WeightProgressionEntry>>>();
  let caffeineIntakeStore = Map.empty<UserId, CaffeineIntake>();
  let locationPreferenceStore = Map.empty<UserId, LocationPreference>();
  let trainingPartnerPreferenceStore = Map.empty<UserId, TrainingPartnerPreference>();
  let connectionRequestStore = Map.empty<ConnectionRequestId, ConnectionRequest>();
  let userConnectionsStore = Map.empty<UserId, List.List<UserId>>();
  var prStore = Map.empty<(UserId, PrType), PR>();

  var brandingSettings : BrandingSettings = BrandingSettings.default();
  var exerciseLibraryStore = Map.empty<ExerciseId, Exercise>();

  public query ({ caller }) func getPrLeaderboard(prTypeInt : Int) : async PRLeaderboard {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view leaderboards");
    };

    let prType = PrType.fromInt(prTypeInt);

    let entriesList = List.empty<(UserId, UserProfile, PR)>();

    for (((userId, prType), pr) in prStore.entries()) {
      if (prType == pr.prType) {
        switch (userStore.get(userId)) {
          case (?user) {
            let userProfile : UserProfile = {
              name = user.name;
              email = user.email;
              role = user.role;
            };
            entriesList.add((userId, userProfile, pr));
          };
          case (null) {};
        };
      };
    };

    let sortedEntries = entriesList.toArray().sort(
      func(a, b) {
        Float.compare(b.2.weight, a.2.weight);
      }
    );

    let leaderboardEntriesList = List.empty<PRLeaderboardEntry>();
    var rank = 1;

    for (entry in sortedEntries.values()) {
      let (userId, userProfile, pr) = entry;
      let leaderboardEntry : PRLeaderboardEntry = {
        userId;
        weight = pr.weight;
        date = pr.date;
        name = userProfile.name;
        ranking = rank;
      };

      leaderboardEntriesList.add(leaderboardEntry);
      rank += 1;
    };

    {
      prType;
      entries = leaderboardEntriesList.toArray();
    };
  };

  public shared ({ caller }) func submitPersonalRecord(prTypeInt : Int, weight : Float, reps : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit personal records");
    };

    let prType = PrType.fromInt(prTypeInt);
    let newPR : PR = {
      prType;
      weight;
      reps;
      date = Time.now();
    };

    prStore.add((caller, prType), newPR);
  };

  public shared ({ caller }) func logWeightProgress(exerciseId : ExerciseId, weight : Float, reps : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can log weight progression");
    };

    let newEntry : WeightProgressionEntry = {
      exerciseId;
      weight;
      reps;
      timestamp = Time.now();
    };

    let userEntries = switch (weightProgressionStore.get(caller)) {
      case (?entries) {
        let updatedEntries = switch (entries.get(exerciseId)) {
          case (?existingEntries) {
            existingEntries.add(newEntry);
            existingEntries;
          };
          case (null) {
            let newList = List.empty<WeightProgressionEntry>();
            newList.add(newEntry);
            newList;
          };
        };
        entries.add(exerciseId, updatedEntries);
        entries;
      };
      case (null) {
        let newEntries = Map.empty<ExerciseId, List.List<WeightProgressionEntry>>();
        let newList = List.empty<WeightProgressionEntry>();
        newList.add(newEntry);
        newEntries.add(exerciseId, newList);
        newEntries;
      };
    };

    weightProgressionStore.add(caller, userEntries);
  };

  public query ({ caller }) func getProgressionStatsForExercise(exerciseId : ExerciseId) : async WeightProgressionStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view progression stats");
    };

    var totalSessions = 0;
    var totalSets = 0;
    var totalVolume = 0.0;
    var weightSum = 0.0;

    switch (weightProgressionStore.get(caller)) {
      case (?userData) {
        switch (userData.get(exerciseId)) {
          case (?entries) {
            let entriesArray = entries.toArray();
            totalSessions := entriesArray.size();
            entriesArray.forEach(
              func(entry) {
                totalSets += entry.reps;
                totalVolume += entry.weight * entry.reps.toFloat();
                weightSum += entry.weight;
              }
            );
          };
          case (null) {};
        };
      };
      case (null) {};
    };

    let averageWeight = if (totalSessions > 0) {
      weightSum / totalSessions.toFloat();
    } else { 0.0 };

    let suggestedIncrement : Float = if (averageWeight < 20.0) { 2.5 } else if (averageWeight < 50.0) {
      5.0;
    } else if (averageWeight < 100.0) { 10.0 } else if (averageWeight < 200.0) { 20.0 } else {
      40.0;
    };

    {
      exerciseId;
      totalSessions;
      totalSets;
      totalVolume;
      averageWeight;
      suggestedIncrement;
    };
  };

  public shared ({ caller }) func logCaffeineIntake(amountMg : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can log caffeine intake");
    };
    let intake : CaffeineIntake = {
      userId = caller;
      amountMg;
      intakeTime = Time.now();
    };
    caffeineIntakeStore.add(caller, intake);
  };

  public query ({ caller }) func getOptimalWorkoutTime() : async ?OptimalWorkoutTime {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view optimal workout time");
    };

    switch (caffeineIntakeStore.get(caller)) {
      case (?intake) {
        let peakStartTime = intake.intakeTime + 15 * 60 * 1000000000;
        let peakEndTime = peakStartTime + 120 * 60 * 1000000000;
        let optimalWindow = 120;
        ?{
          userId = caller;
          recommendedStartTime = peakStartTime;
          recommendedEndTime = peakEndTime;
          optimalWindow;
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getWeightProgressionEntries(exerciseId : ExerciseId) : async [WeightProgressionEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view weight progression entries");
    };

    switch (weightProgressionStore.get(caller)) {
      case (?userEntries) {
        switch (userEntries.get(exerciseId)) {
          case (?entries) {
            entries.toArray();
          };
          case (null) {
            [];
          };
        };
      };
      case (null) {
        [];
      };
    };
  };

  public shared ({ caller }) func clearCaffeineIntake() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can clear caffeine intake");
    };

    caffeineIntakeStore.remove(caller);
  };

  func getAppUserRole(userId : UserId) : ?AppUserRole {
    switch (userStore.get(userId)) {
      case (?user) { ?user.role };
      case (null) { null };
    };
  };

  func isAppAdmin(userId : UserId) : Bool {
    switch (getAppUserRole(userId)) {
      case (?#admin) { true };
      case (_) { false };
    };
  };

  func isAppTrainer(userId : UserId) : Bool {
    switch (getAppUserRole(userId)) {
      case (?#trainer) { true };
      case (_) { false };
    };
  };

  func isAppClient(userId : UserId) : Bool {
    switch (getAppUserRole(userId)) {
      case (?#client) { true };
      case (_) { false };
    };
  };

  func trainerManagesClient(trainerId : UserId, clientId : UserId) : Bool {
    switch (trainerToClients.get(trainerId)) {
      case (?clients) { clients.any(func(id) { id == clientId }) };
      case (null) { false };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    switch (userStore.get(caller)) {
      case (?user) {
        ?{
          name = user.name;
          email = user.email;
          role = user.role;
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless admin");
    };
    switch (userStore.get(user)) {
      case (?userData) {
        ?{
          name = userData.name;
          email = userData.email;
          role = userData.role;
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let user : User = {
      id = caller;
      name = profile.name;
      email = profile.email;
      role = profile.role;
    };
    userStore.add(caller, user);
  };

  public shared ({ caller }) func addUser(id : UserId, name : Text, email : Text, role : AppUserRole) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add users");
    };
    let user : User = {
      id;
      name;
      email;
      role;
    };
    userStore.add(id, user);
    let authorizedRole = switch (role) {
      case (#admin) { #admin };
      case (_) { #user };
    };
    AccessControl.assignRole(accessControlState, caller, id, authorizedRole);
    if (role == #trainer) {
      trainerToClients.add(id, List.empty<UserId>());
    };
  };

  public shared ({ caller }) func editUser(id : UserId, name : Text, email : Text, role : AppUserRole) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit users");
    };
    switch (userStore.get(id)) {
      case (?_) {
        let user : User = {
          id;
          name;
          email;
          role;
        };
        userStore.add(id, user);
      };
      case (null) { Runtime.trap("User not found") };
    };
  };

  public shared ({ caller }) func removeUser(id : UserId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove users");
    };
    userStore.remove(id);
    trainerToClients.remove(id);
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userStore.values().toArray();
  };

  public query ({ caller }) func getMyClients() : async [User] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view clients");
    };

    if (not isAppTrainer(caller)) {
      Runtime.trap("Unauthorized: Only trainers can view their clients");
    };

    switch (trainerToClients.get(caller)) {
      case (?clientIds) {
        let clientsArray = clientIds.toArray();
        clientsArray.filterMap(func(clientId) { userStore.get(clientId) });
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func assignClientToTrainer(trainerId : UserId, clientId : UserId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign clients");
    };

    switch (userStore.get(trainerId)) {
      case (?trainer) {
        if (trainer.role != #trainer) {
          Runtime.trap("User is not a trainer");
        };
        switch (userStore.get(clientId)) {
          case (?client) {
            if (client.role != #client) {
              Runtime.trap("User is not a client");
            };
            let currentClients = switch (trainerToClients.get(trainerId)) {
              case (?clients) { clients };
              case (null) { List.empty<UserId>() };
            };
            currentClients.add(clientId);
            trainerToClients.add(trainerId, currentClients);
          };
          case (null) { Runtime.trap("Client not found") };
        };
      };
      case (null) { Runtime.trap("Trainer not found") };
    };
  };

  public shared ({ caller }) func createWorkoutPlan(planId : WorkoutPlanId, trainerId : UserId, clientId : UserId, name : Text, sets : [Set], restTime : Nat, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create workout plans");
    };

    if (not isAppTrainer(caller)) {
      Runtime.trap("Unauthorized: Only trainers can create workout plans");
    };

    if (caller != trainerId) {
      Runtime.trap("Unauthorized: Trainers can only create plans under their own name");
    };

    if (not trainerManagesClient(trainerId, clientId)) {
      Runtime.trap("Unauthorized: Trainer can only create plans for assigned clients");
    };

    let newPlan : WorkoutPlan = {
      id = planId;
      creatorTrainerId = trainerId;
      clientId;
      name;
      sets;
      restTime;
      notes;
    };
    workoutPlanStore.add(planId, newPlan);
  };

  public shared ({ caller }) func updateWorkoutPlan(planId : WorkoutPlanId, name : Text, sets : [Set], restTime : Nat, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update workout plans");
    };

    switch (workoutPlanStore.get(planId)) {
      case (?plan) {
        if (caller != plan.creatorTrainerId and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Only the creator trainer or admin can update this plan");
        };

        let updatedPlan : WorkoutPlan = {
          id = plan.id;
          creatorTrainerId = plan.creatorTrainerId;
          clientId = plan.clientId;
          name;
          sets;
          restTime;
          notes;
        };
        workoutPlanStore.add(planId, updatedPlan);
      };
      case (null) { Runtime.trap("Workout plan not found") };
    };
  };

  public shared ({ caller }) func deleteWorkoutPlan(planId : WorkoutPlanId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete workout plans");
    };

    switch (workoutPlanStore.get(planId)) {
      case (?plan) {
        if (caller != plan.creatorTrainerId and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Only the creator trainer or admin can delete this plan");
        };
        workoutPlanStore.remove(planId);
      };
      case (null) { Runtime.trap("Workout plan not found") };
    };
  };

  public shared ({ caller }) func logWorkoutCompletion(recordId : RecordId, planId : WorkoutPlanId, userId : UserId, completedSets : Nat, personalNotes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can log workouts");
    };

    if (caller != userId and not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only log your own workouts");
    };

    if (not isAppClient(userId) and not isAppAdmin(userId)) {
      Runtime.trap("Unauthorized: Only clients can log workouts");
    };

    switch (workoutPlanStore.get(planId)) {
      case (?plan) {
        if (plan.clientId != userId and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Cannot log workout for a plan not assigned to you");
        };
      };
      case (null) { Runtime.trap("Workout plan not found") };
    };

    let newRecord : WorkoutRecord = {
      id = recordId;
      planId;
      userId;
      date = Time.now();
      completedSets;
      personalNotes;
    };
    workoutRecordStore.add(recordId, newRecord);
  };

  public shared ({ caller }) func updateBrandingSettings(newSettings : BrandingSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update branding");
    };
    brandingSettings := newSettings;
  };

  public query ({ caller }) func getBrandingSettings() : async BrandingSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view branding settings");
    };
    brandingSettings;
  };

  public shared ({ caller }) func addExerciseToLibrary(id : ExerciseId, name : Text, targetMuscleGroups : Text, difficultyLevel : Text, equipmentNeeded : Text, videoUrl : Text, description : Text, recommendedRepsRange : Text, recommendedSetsRange : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add exercises");
    };

    let exercise : Exercise = {
      id;
      name;
      targetMuscleGroups;
      difficultyLevel;
      equipmentNeeded;
      videoUrl;
      description;
      recommendedRepsRange;
      recommendedSetsRange;
    };

    exerciseLibraryStore.add(id, exercise);
  };

  public shared ({ caller }) func updateExerciseInLibrary(id : ExerciseId, name : Text, targetMuscleGroups : Text, difficultyLevel : Text, equipmentNeeded : Text, videoUrl : Text, description : Text, recommendedRepsRange : Text, recommendedSetsRange : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update exercises");
    };
    let exercise : Exercise = {
      id;
      name;
      targetMuscleGroups;
      difficultyLevel;
      equipmentNeeded;
      videoUrl;
      description;
      recommendedRepsRange;
      recommendedSetsRange;
    };
    exerciseLibraryStore.add(id, exercise);
  };

  public shared ({ caller }) func deleteExerciseFromLibrary(id : ExerciseId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete exercises");
    };

    exerciseLibraryStore.remove(id);
  };

  public query ({ caller }) func getAllExercises() : async [Exercise] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view exercises");
    };
    exerciseLibraryStore.values().toArray();
  };

  public query ({ caller }) func getExerciseWithHistory(id : ExerciseId) : async ?ExerciseWithHistory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view exercises");
    };

    switch (exerciseLibraryStore.get(id)) {
      case (?exercise) {
        let userHistory = switch (weightProgressionStore.get(caller)) {
          case (?userEntries) {
            switch (userEntries.get(id)) {
              case (?entries) {
                ?entries.toArray();
              };
              case (null) { ?[] };
            };
          };
          case (null) { ?[] };
        };
        ?{
          exercise;
          userHistory;
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getExercise(id : ExerciseId) : async ?Exercise {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view exercises");
    };
    exerciseLibraryStore.get(id);
  };

  type FormAnalysisTip = {
    exerciseId : ExerciseId;
    formCheckpoints : [Text];
    commonMistakes : [Text];
    correctionSteps : [Text];
    videoUrl : Text;
  };

  type SupplementStack = {
    goalType : Text;
    products : [SupplementProduct];
    dosageRecommendations : [DosageRecommendation];
    timingGuidelines : [TimingGuideline];
    benefitDescriptions : [Text];
  };

  type SupplementProduct = {
    name : Text;
    productType : Text;
    description : Text;
  };

  type DosageRecommendation = {
    productName : Text;
    recommendedDosage : Text;
  };

  type TimingGuideline = {
    productName : Text;
    timing : Text;
    purpose : Text;
  };

  var formAnalysisTipsStore = Map.empty<ExerciseId, FormAnalysisTip>();
  var supplementStacksStore = Map.empty<Text, SupplementStack>();

  public query ({ caller }) func getFormAnalysisTip(exerciseId : ExerciseId) : async ?FormAnalysisTip {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view form analysis tips");
    };
    formAnalysisTipsStore.get(exerciseId);
  };

  public query ({ caller }) func getAllFormAnalysisTips() : async [FormAnalysisTip] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view form analysis tips");
    };
    formAnalysisTipsStore.values().toArray();
  };

  public query ({ caller }) func getSupplementStack(goalType : Text) : async ?SupplementStack {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view supplement stacks");
    };
    supplementStacksStore.get(goalType);
  };

  public query ({ caller }) func getAllSupplementStacks() : async [SupplementStack] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view supplement stacks");
    };
    supplementStacksStore.values().toArray();
  };

  public shared ({ caller }) func saveLocationPreference(latitude : Float, longitude : Float, searchRadiusKm : Nat, gymName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save location preferences");
    };

    let preference : LocationPreference = {
      userId = caller;
      latitude;
      longitude;
      searchRadiusKm;
      gymName;
    };
    locationPreferenceStore.add(caller, preference);
  };

  public query ({ caller }) func getLocationPreference() : async ?LocationPreference {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view location preferences");
    };
    locationPreferenceStore.get(caller);
  };

  public shared ({ caller }) func saveTrainingPartnerPreference(fitnessGoals : [Text], experienceLevel : Text, preferredWorkoutTimes : [Text], bio : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save training partner preferences");
    };

    let preference : TrainingPartnerPreference = {
      userId = caller;
      fitnessGoals;
      experienceLevel;
      preferredWorkoutTimes;
      bio;
    };
    trainingPartnerPreferenceStore.add(caller, preference);
  };

  public query ({ caller }) func getTrainingPartnerPreference() : async ?TrainingPartnerPreference {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view training partner preferences");
    };
    trainingPartnerPreferenceStore.get(caller);
  };

  func calculateDistance(lat1 : Float, lon1 : Float, lat2 : Float, lon2 : Float) : Float {
    let r = 6371.0;
    let dLat = (lat2 - lat1) * 3.14159265359 / 180.0;
    let dLon = (lon2 - lon1) * 3.14159265359 / 180.0;
    let a = Float.sin(dLat / 2.0) * Float.sin(dLat / 2.0) +
            Float.cos(lat1 * 3.14159265359 / 180.0) * Float.cos(lat2 * 3.14159265359 / 180.0) *
            Float.sin(dLon / 2.0) * Float.sin(dLon / 2.0);
    let c = 2.0 * Float.arctan2(Float.sqrt(a), Float.sqrt(1.0 - a));
    r * c;
  };

  public query ({ caller }) func getNearbyUsers() : async [NearbyUser] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view nearby users");
    };

    switch (locationPreferenceStore.get(caller)) {
      case (?myLocation) {
        let nearbyUsers = List.empty<NearbyUser>();

        for ((userId, location) in locationPreferenceStore.entries()) {
          if (userId != caller) {
            let distance = calculateDistance(
              myLocation.latitude,
              myLocation.longitude,
              location.latitude,
              location.longitude
            );

            if (distance <= myLocation.searchRadiusKm.toFloat()) {
              switch (trainingPartnerPreferenceStore.get(userId)) {
                case (?preferences) {
                  switch (userStore.get(userId)) {
                    case (?user) {
                      nearbyUsers.add({
                        userId;
                        name = user.name;
                        distanceKm = distance;
                        fitnessGoals = preferences.fitnessGoals;
                        experienceLevel = preferences.experienceLevel;
                      });
                    };
                    case (null) {};
                  };
                };
                case (null) {};
              };
            };
          };
        };

        nearbyUsers.toArray();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func sendConnectionRequest(receiverId : UserId, message : Text) : async ConnectionRequestId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send connection requests");
    };

    if (caller == receiverId) {
      Runtime.trap("Cannot send connection request to yourself");
    };

    let requestId = caller.toText() # "-" # receiverId.toText() # "-" # Time.now().toText();

    let request : ConnectionRequest = {
      id = requestId;
      senderId = caller;
      receiverId;
      status = #pending;
      message;
      timestamp = Time.now();
    };

    connectionRequestStore.add(requestId, request);
    requestId;
  };

  public shared ({ caller }) func acceptConnectionRequest(requestId : ConnectionRequestId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can accept connection requests");
    };

    switch (connectionRequestStore.get(requestId)) {
      case (?request) {
        if (request.receiverId != caller) {
          Runtime.trap("Unauthorized: Can only accept requests sent to you");
        };

        if (request.status != #pending) {
          Runtime.trap("Request already processed");
        };

        let updatedRequest : ConnectionRequest = {
          request with status = #accepted
        };
        connectionRequestStore.add(requestId, updatedRequest);

        let senderConnections = switch (userConnectionsStore.get(request.senderId)) {
          case (?connections) { connections };
          case (null) { List.empty<UserId>() };
        };
        senderConnections.add(caller);
        userConnectionsStore.add(request.senderId, senderConnections);

        let receiverConnections = switch (userConnectionsStore.get(caller)) {
          case (?connections) { connections };
          case (null) { List.empty<UserId>() };
        };
        receiverConnections.add(request.senderId);
        userConnectionsStore.add(caller, receiverConnections);
      };
      case (null) { Runtime.trap("Connection request not found") };
    };
  };

  public shared ({ caller }) func rejectConnectionRequest(requestId : ConnectionRequestId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can reject connection requests");
    };

    switch (connectionRequestStore.get(requestId)) {
      case (?request) {
        if (request.receiverId != caller) {
          Runtime.trap("Unauthorized: Can only reject requests sent to you");
        };

        if (request.status != #pending) {
          Runtime.trap("Request already processed");
        };

        let updatedRequest : ConnectionRequest = {
          request with status = #rejected
        };
        connectionRequestStore.add(requestId, updatedRequest);
      };
      case (null) { Runtime.trap("Connection request not found") };
    };
  };

  public query ({ caller }) func getMyConnectionRequests() : async [ConnectionRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view connection requests");
    };

    let requests = List.empty<ConnectionRequest>();
    for ((_, request) in connectionRequestStore.entries()) {
      if (request.receiverId == caller or request.senderId == caller) {
        requests.add(request);
      };
    };
    requests.toArray();
  };

  public query ({ caller }) func getMyConnections() : async [User] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view connections");
    };

    switch (userConnectionsStore.get(caller)) {
      case (?connections) {
        let connectionsArray = connections.toArray();
        connectionsArray.filterMap(func(userId) { userStore.get(userId) });
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func initializeFormAnalysisTipsAndSupplements() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize this data");
    };

    let formAnalysisTips : [FormAnalysisTip] = [
      {
        exerciseId = 1;
        formCheckpoints = [
          "Shoulder blades retracted",
          "Elbows at 45° angle",
          "Controlled descent"
        ];
        commonMistakes = [
          "Flaring elbows",
          "Bouncing the bar",
          "Lifting hips"
        ];
        correctionSteps = [
          "Practice with just the bar",
          "Focus on tempo",
          "Record yourself"
        ];
        videoUrl = "https://youtu.be/rT7DgCr-3pg";
      },
      {
        exerciseId = 14;
        formCheckpoints = [
          "Neutral spine",
          "Knees tracking over feet",
          "Depth below parallel"
        ];
        commonMistakes = [
          "Knees collapsing inward",
          "Heels off the ground",
          "Rounding lower back"
        ];
        correctionSteps = [
          "Mobility work",
          "Practice with bodyweight",
          "Use mirrors for feedback"
        ];
        videoUrl = "https://youtu.be/2MEQ6UoFflA";
      }
    ];

    let supplements : [SupplementStack] = [
      {
        goalType = "Muscle Gain";
        products = [
          { name = "Whey Protein"; productType = "Protein"; description = "Muscle building" },
          { name = "Creatine Monohydrate"; productType = "Performance"; description = "Strength increase" },
          { name = "BCAAs"; productType = "Amino Acids"; description = "Recovery" }
        ];
        dosageRecommendations = [
          { productName = "Whey Protein"; recommendedDosage = "20-40g post-workout" },
          { productName = "Creatine Monohydrate"; recommendedDosage = "5g daily" },
          { productName = "BCAAs"; recommendedDosage = "5-10g intra-workout" }
        ];
        timingGuidelines = [
          { productName = "Whey Protein"; timing = "Post-workout"; purpose = "Recovery" },
          { productName = "Creatine Monohydrate"; timing = "Daily"; purpose = "Performance" },
          { productName = "BCAAs"; timing = "During workout"; purpose = "Endurance" }
        ];
        benefitDescriptions = [
          "Whey Protein aids in muscle synthesis and recovery.",
          "Creatine enhances strength and power.",
          "BCAAs support endurance and muscle preservation."
        ];
      },
      {
        goalType = "Fat Loss";
        products = [
          { name = "Green Tea Extract"; productType = "Thermogenic"; description = "Metabolism Booster" },
          { name = "L-Carnitine"; productType = "Fat Burner"; description = "Helps transport fat" },
          { name = "Caffeine"; productType = "Stimulant"; description = "Energy booster" }
        ];
        dosageRecommendations = [
          { productName = "Green Tea Extract"; recommendedDosage = "400-500mg daily" },
          { productName = "L-Carnitine"; recommendedDosage = "1-2g daily" },
          { productName = "Caffeine"; recommendedDosage = "200-400mg as needed" }
        ];
        timingGuidelines = [
          { productName = "Caffeine"; timing = "Pre-workout"; purpose = "Energy boost" },
          { productName = "Green Tea Extract"; timing = "Morning/Afternoon"; purpose = "Metabolism support" },
          { productName = "L-Carnitine"; timing = "Pre-workout"; purpose = "Fat utilization" }
        ];
        benefitDescriptions = [
          "Green Tea Extract supports metabolism.",
          "L-Carnitine helps in fat transportation.",
          "Caffeine provides energy and focus."
        ];
      }
    ];

    formAnalysisTipsStore := Map.empty<ExerciseId, FormAnalysisTip>();
    supplementStacksStore := Map.empty<Text, SupplementStack>();

    for (tip in formAnalysisTips.values()) {
      formAnalysisTipsStore.add(tip.exerciseId, tip);
    };

    for (stack in supplements.values()) {
      supplementStacksStore.add(stack.goalType, stack);
    };
  };

  // Vortex AI Chat Implementation - FIXED

  public query func transform(input: OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Only returns relevant plain text from Vortex AI Backend
  public shared ({ caller }) func askVortex(question : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can use Vortex AI");
    };
    let url = "https://api.askvortex.ai/api/gen-ai?input=" # question;
    let response = await OutCall.httpGetRequest(url, [], transform);

    // Just clean up text with existing trims, do not attempt to slice or parse JSON here (already done on Vortex API server)
    response
      .trimStart(#char '\n')
      .trimStart(#char ' ')
      .trimEnd(#char '\n')
      .trimEnd(#char ' ')
      .trimEnd(#char '\n');
  };

  // New Gym Finder Implementation (No Validation Needed)

  type Address = {
    street : Text;
    zipCode : Text;
    city : Text;
    country : Text;
  };

  type Gym = {
    name : Text;
    id : Text;
    address : Address;
    openingHours : Text;
    contactInfo : Text;
    amenities : [Text];
  };

  let gymFinderStore = Map.empty<Text, List.List<Gym>>();
};
