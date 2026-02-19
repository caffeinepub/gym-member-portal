import Int "mo:core/Int";
import Array "mo:core/Array";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type UserId = Principal;
  type WorkoutPlanId = Text;
  type RecordId = Text;

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
  type SetId = Nat;

  module Set {
    public type T = { id : SetId; reps : Nat; weight : Float };
  };

  type Set = Set.T;

  module WorkoutPlan {
    public type T = {
      id : WorkoutPlanId;
      creatorTrainerId : UserId;
      clientId : UserId;
      name : Text;
      sets : [Set];
      restTime : Nat; // in seconds
      notes : Text;
    };
    public func compareByName(plan1 : T, plan2 : T) : Order.Order {
      Text.compare(plan1.name, plan2.name);
    };
  };

  type WorkoutPlan = WorkoutPlan.T;

  module WorkoutRecord {
    public type T = {
      id : RecordId;
      planId : WorkoutPlanId;
      userId : UserId;
      date : Time.Time;
      completedSets : Nat;
      personalNotes : Text;
    };
    public func compareByDate(record1 : T, record2 : T) : Order.Order {
      Int.compare(record1.date, record2.date);
    };
  };

  type WorkoutRecord = WorkoutRecord.T;

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

  let userStore = Map.empty<UserId, User>();
  let workoutPlanStore = Map.empty<WorkoutPlanId, WorkoutPlan>();
  let workoutRecordStore = Map.empty<RecordId, WorkoutRecord>();
  let trainerToClients = Map.empty<UserId, List.List<UserId>>();

  var brandingSettings : BrandingSettings = BrandingSettings.default();

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

    AccessControl.assignRole(accessControlState, caller, id, #user);

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

  public shared ({ caller }) func updateWorkoutRecord(recordId : RecordId, completedSets : Nat, personalNotes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update workout records");
    };

    switch (workoutRecordStore.get(recordId)) {
      case (?record) {
        if (caller != record.userId and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Can only update your own workout records");
        };

        let updatedRecord : WorkoutRecord = {
          id = record.id;
          planId = record.planId;
          userId = record.userId;
          date = record.date;
          completedSets;
          personalNotes;
        };
        workoutRecordStore.add(recordId, updatedRecord);
      };
      case (null) { Runtime.trap("Workout record not found") };
    };
  };

  public shared ({ caller }) func updateBrandingSettings(newSettings : BrandingSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update branding");
    };
    brandingSettings := newSettings;
  };

  public query ({ caller }) func getBrandingSettings() : async BrandingSettings {
    brandingSettings;
  };

  public shared ({ caller }) func askVortex(searchQuery : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can use VORTEX");
    };
    "VORTEX response to: " # searchQuery;
  };

  public query ({ caller }) func getUser(id : UserId) : async ?User {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view user data");
    };

    if (caller == id or isAppAdmin(caller)) {
      return userStore.get(id);
    };

    if (isAppTrainer(caller)) {
      switch (userStore.get(id)) {
        case (?user) {
          if (user.role == #client and trainerManagesClient(caller, id)) {
            return ?user;
          };
        };
        case (null) {};
      };
    };

    Runtime.trap("Unauthorized: Cannot view this user's data");
  };

  public query ({ caller }) func getWorkoutPlan(id : WorkoutPlanId) : async ?WorkoutPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view workout plans");
    };

    switch (workoutPlanStore.get(id)) {
      case (?plan) {
        if (caller == plan.clientId or caller == plan.creatorTrainerId or isAppAdmin(caller)) {
          return ?plan;
        };
        Runtime.trap("Unauthorized: Cannot view this workout plan");
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllWorkoutPlansForUser(userId : UserId) : async [WorkoutPlan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view workout plans");
    };

    if (caller != userId and not isAppAdmin(caller)) {
      if (not (isAppTrainer(caller) and trainerManagesClient(caller, userId))) {
        Runtime.trap("Unauthorized: Cannot view workout plans for this user");
      };
    };

    let allPlans = workoutPlanStore.values().toArray();
    allPlans.filter<WorkoutPlan>(func(plan) { plan.clientId == userId });
  };

  public query ({ caller }) func getWorkoutRecordsForUser(userId : UserId) : async [WorkoutRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view workout records");
    };

    if (caller != userId and not isAppAdmin(caller)) {
      if (not (isAppTrainer(caller) and trainerManagesClient(caller, userId))) {
        Runtime.trap("Unauthorized: Cannot view workout records for this user");
      };
    };

    let allRecords = workoutRecordStore.values().toArray();
    allRecords.filter<WorkoutRecord>(func(record) { record.userId == userId });
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userStore.values().toArray();
  };

  public query ({ caller }) func getTrainerClients(trainerId : UserId) : async [UserId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view trainer-client relationships");
    };

    if (caller != trainerId and not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own clients");
    };

    switch (trainerToClients.get(trainerId)) {
      case (?clients) { clients.toArray() };
      case (null) { [] };
    };
  };
};
