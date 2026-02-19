import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
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

  let userStore = Map.empty<UserId, User>();
  let workoutPlanStore = Map.empty<WorkoutPlanId, WorkoutPlan>();
  let workoutRecordStore = Map.empty<RecordId, WorkoutRecord>();
  let trainerToClients = Map.empty<UserId, List.List<UserId>>();
  let workoutTimetableStore = Map.empty<TimetableId, ScheduledSession>();
  let dietPlanStore = Map.empty<DietPlanId, DietPlan>();
  let exerciseLibraryStore = Map.empty<ExerciseId, Exercise>();

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

  func getCompletedSetsForUserExercise(userId : UserId, exerciseId : ExerciseId) : Nat {
    let userRecords = workoutRecordStore.values().toArray().filter(
      func(record) { record.userId == userId }
    );

    var setCount = 0;
    for (record in userRecords.values()) {
      switch (workoutPlanStore.get(record.planId)) {
        case (?plan) { setCount += plan.sets.filter(func(set) { set.exerciseId == exerciseId }).size() };
        case (null) {};
      };
    };
    setCount;
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

    let normalizedQuery = searchQuery.toLower();

    let response = switch (normalizedQuery) {
      case (normalizedQuery) {
        if (containsAnyPhrase(normalizedQuery, ["hello", "hi", "hey"])) {
          ?greetingResponse()
        } else if (containsAnyPhrase(normalizedQuery, ["how are you", "how's it going"])) {
          ?feelingResponse()
        } else if (containsAnyPhrase(normalizedQuery, ["who are you", "what is your name"])) {
          ?identityResponse()
        } else if (containsAnyPhrase(normalizedQuery, ["motivation", "encouragement", "inspiration"])) {
          ?motivationResponse()
        } else if (normalizedQuery.contains(#text("workout tips"))) {
          ?workoutTipsResponse()
        } else if (containsAnyPhrase(normalizedQuery, ["yes", "lets do it", "sure"])) {
          ?affirmativeResponse()
        } else if (containsAnyPhrase(normalizedQuery, ["no", "not today", "lazy", "tired"])) {
          ?positiveOutlookResponse()
        } else if (containsAnyPhrase(normalizedQuery, ["cant do this", "don't feel like it", "no motivation", "overwhelmed"])) {
          ?supportResponse()
        } else if (containsAnyPhrase(normalizedQuery, ["workout completed", "just finished", "done training", "session complete"])) {
          ?workoutCompletionResponse()
        } else if (containsAnyPhrase(normalizedQuery, ["diet tips", "food recommendations", "nutrition guidance"])) {
          ?nutritionTipsResponse()
        } else if (containsAnyPhrase(normalizedQuery, ["why work out", "what are the benefits of exercise"])) {
          ?benefitsResponse()
        } else {
          null;
        };
      };
    };

    switch (response) {
      case (?resp) { resp };
      case (null) { fallbackResponse() };
    };
  };

  func containsAnyPhrase(text : Text, phrases : [Text]) : Bool {
    for (phrase in phrases.values()) {
      if (text.contains(#text(phrase))) { return true };
    };
    false;
  };

  func greetingResponse() : Text {
    "Hello! 👋 How can I assist you with your fitness goals today? Are you interested in creating a workout plan, checking your progress, or do you need some motivation?";
  };

  func feelingResponse() : Text {
    "I'm doing great, thank you! I'm here to support your fitness journey. What would you like to focus on today?";
  };

  func identityResponse() : Text {
    "I'm your personal AI fitness assistant, VORTEX. I help create effective workout plans and track your progress. Would you like to start a new workout plan or review existing ones?";
  };

  func motivationResponse() : Text {
    "You have the power to achieve your fitness goals! 💪 Consistency is key. Every small step counts. Would you like some workout tips or help tracking a new exercise?";
  };

  func workoutTipsResponse() : Text {
    "Based on your recent activities, I recommend implementing progressive overload to maximize your gains. Would you like suggestions for specific exercises?";
  };

  func affirmativeResponse() : Text {
    "Awesome attitude! 💪 Let's get started on creating a customized workout plan for you. What type of results are you looking for - muscle building, fat loss, or general fitness?";
  };

  func positiveOutlookResponse() : Text {
    "I understand, sometimes it's hard to find motivation. Let's just do a quick session to get started. Small steps lead to big results! Would you like a short workout suggestion?";
  };

  func supportResponse() : Text {
    "I understand, staying motivated can be tough. Remember, fitness is a marathon, not a sprint. Let's set a small, achievable goal for today and build from there. Would you like a quick workout suggestion?";
  };

  func workoutCompletionResponse() : Text {
    "Amazing work! Your dedication is inspiring - every workout brings you closer to your goal. Let's keep pushing your progress to the next level.";
  };

  func nutritionTipsResponse() : Text {
    "Here are some nutrition tips:" # "\n\n" # "- Start your day with a balanced breakfast." # "\n" # "- Drink plenty of water." # "\n" # "- Incorporate more fruits and vegetables into your meals." # "\n" # "- Limit processed foods and sugary drinks." # "\n" # "- Practice portion control. \n\n Would you like more detailed meal plans ?";
  };

  func benefitsResponse() : Text {
    "Regular exercise increases energy, improves mood, helps maintain a healthy weight, boosts self-confidence, and is crucial for a long, happy life. Is this the right motivation for you at the moment, or is there another reason you wish to explore?";
  };

  func fallbackResponse() : Text {
    "I'm here to assist you with your fitness journey! You can ask me to create workout plans, log your progress, or get fitness tips. How can I help you today?";
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

  // Workout Timetabling
  public shared ({ caller }) func createScheduledSession(id : TimetableId, trainerId : UserId, clientId : UserId, workoutPlanId : WorkoutPlanId, dateTime : Int, clientNotes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create sessions");
    };

    if (not isAppTrainer(caller)) {
      Runtime.trap("Unauthorized: Only trainers can create sessions");
    };

    if (caller != trainerId) {
      Runtime.trap("Unauthorized: Trainers can only create sessions under their own name");
    };

    if (not trainerManagesClient(trainerId, clientId)) {
      Runtime.trap("Unauthorized: Trainer can only create sessions for assigned clients");
    };

    let session : ScheduledSession = {
      id;
      trainerId;
      clientId;
      workoutPlanId;
      dateTime;
      isCompleted = false;
      clientNotes;
      trainerNotes = "";
    };
    workoutTimetableStore.add(id, session);
  };

  public shared ({ caller }) func updateScheduledSession(id : TimetableId, dateTime : Int, clientNotes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update sessions");
    };

    if (not isAppTrainer(caller)) {
      Runtime.trap("Unauthorized: Only trainers can update sessions");
    };

    switch (workoutTimetableStore.get(id)) {
      case (?session) {
        if (caller != session.trainerId and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Only the creator trainer or admin can update this session");
        };

        let updatedSession : ScheduledSession = {
          id = session.id;
          trainerId = session.trainerId;
          clientId = session.clientId;
          workoutPlanId = session.workoutPlanId;
          dateTime;
          isCompleted = session.isCompleted;
          clientNotes;
          trainerNotes = session.trainerNotes;
        };
        workoutTimetableStore.add(id, updatedSession);
      };
      case (null) { Runtime.trap("Scheduled session not found") };
    };
  };

  public shared ({ caller }) func deleteScheduledSession(id : TimetableId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete sessions");
    };

    if (not isAppTrainer(caller)) {
      Runtime.trap("Unauthorized: Only trainers can delete sessions");
    };

    switch (workoutTimetableStore.get(id)) {
      case (?session) {
        if (caller != session.trainerId and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Only the creator trainer or admin can delete this session");
        };
        workoutTimetableStore.remove(id);
      };
      case (null) { Runtime.trap("Scheduled session not found") };
    };
  };

  public query ({ caller }) func getScheduledSessionsForClient(clientId : UserId) : async [ScheduledSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view scheduled sessions");
    };

    if (caller != clientId and not isAppAdmin(caller)) {
      if (not (isAppTrainer(caller) and trainerManagesClient(caller, clientId))) {
        Runtime.trap("Unauthorized: Cannot view sessions for this client");
      };
    };

    let allSessions = workoutTimetableStore.values().toArray();
    allSessions.filter<ScheduledSession>(func(session) { session.clientId == clientId });
  };

  public query ({ caller }) func getScheduledSessionsForTrainer(trainerId : UserId) : async [ScheduledSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view scheduled sessions");
    };

    if (caller != trainerId and not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own sessions");
    };

    let allSessions = workoutTimetableStore.values().toArray();
    allSessions.filter<ScheduledSession>(func(session) { session.trainerId == trainerId });
  };

  // Diet Plan
  public shared ({ caller }) func createDietPlan(id : DietPlanId, trainerId : UserId, clientId : UserId, name : Text, meals : [Meal], dietaryNotes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create diet plans");
    };

    if (not isAppTrainer(caller)) {
      Runtime.trap("Unauthorized: Only trainers can create diet plans");
    };

    if (caller != trainerId) {
      Runtime.trap("Unauthorized: Trainers can only create diet plans under their own name");
    };

    if (not trainerManagesClient(trainerId, clientId)) {
      Runtime.trap("Unauthorized: Trainer can only create diet plans for assigned clients");
    };

    let dietPlan : DietPlan = {
      id;
      trainerId;
      clientId;
      name;
      meals;
      dietaryNotes;
    };
    dietPlanStore.add(id, dietPlan);
  };

  public shared ({ caller }) func updateDietPlan(id : DietPlanId, meals : [Meal], dietaryNotes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update diet plans");
    };

    if (not isAppTrainer(caller)) {
      Runtime.trap("Unauthorized: Only trainers can update diet plans");
    };

    switch (dietPlanStore.get(id)) {
      case (?plan) {
        if (caller != plan.trainerId and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Only the creator trainer or admin can update this diet plan");
        };

        let updatedPlan : DietPlan = {
          id = plan.id;
          trainerId = plan.trainerId;
          clientId = plan.clientId;
          name = plan.name;
          meals;
          dietaryNotes;
        };
        dietPlanStore.add(id, updatedPlan);
      };
      case (null) { Runtime.trap("Diet plan not found") };
    };
  };

  public shared ({ caller }) func deleteDietPlan(id : DietPlanId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete diet plans");
    };

    if (not isAppTrainer(caller)) {
      Runtime.trap("Unauthorized: Only trainers can delete diet plans");
    };

    switch (dietPlanStore.get(id)) {
      case (?plan) {
        if (caller != plan.trainerId and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Only the creator trainer or admin can delete this diet plan");
        };
        dietPlanStore.remove(id);
      };
      case (null) { Runtime.trap("Diet plan not found") };
    };
  };

  public query ({ caller }) func getDietPlansForClient(clientId : UserId) : async [DietPlan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view diet plans");
    };

    if (caller != clientId and not isAppAdmin(caller)) {
      if (not (isAppTrainer(caller) and trainerManagesClient(caller, clientId))) {
        Runtime.trap("Unauthorized: Cannot view diet plans for this client");
      };
    };

    let allPlans = dietPlanStore.values().toArray();
    allPlans.filter<DietPlan>(func(plan) { plan.clientId == clientId });
  };

  // Exercise Library
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

  public query ({ caller }) func getExercise(id : ExerciseId) : async ?Exercise {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view exercises");
    };
    exerciseLibraryStore.get(id);
  };

  public query ({ caller }) func getDietPlanTemplate() : async [MealOption] {
    [
      {
        mealType = "Breakfast";
        options = [
          {
            description = "Option 1: 3 Boiled Eggs + Brown Bread / Roti";
            foodItems = [
              {
                name = "Eggs";
                portion = "3 boiled";
                calories = 210;
                protein = 18.0;
                carbs = 1.5;
                fats = 15.0;
              },
              {
                name = "Brown Bread / Roti";
                portion = "2 slices";
                calories = 120;
                protein = 4.0;
                carbs = 24.0;
                fats = 2.0;
              },
            ];
          },
          {
            description = "Option 2: Oats with Milk + 1 Banana";
            foodItems = [
              {
                name = "Oats";
                portion = "1 bowl";
                calories = 150;
                protein = 5.0;
                carbs = 27.0;
                fats = 3.0;
              },
              {
                name = "Milk";
                portion = "1 cup (200ml)";
                calories = 120;
                protein = 8.0;
                carbs = 12.0;
                fats = 5.0;
              },
              {
                name = "Banana";
                portion = "1 medium";
                calories = 90;
                protein = 1.0;
                carbs = 23.0;
                fats = 0.5;
              },
            ];
          },
        ];
      },
      {
        mealType = "Mid-Morning";
        options = [
          {
            description = "Option 1: 1 bowl Roasted Chana (High Protein)";
            foodItems = [
              {
                name = "Roasted Chana";
                portion = "1 bowl";
                calories = 200;
                protein = 12.0;
                carbs = 30.0;
                fats = 4.0;
              },
            ];
          },
          {
            description = "Option 2: Handful of Peanuts + 1 Apple";
            foodItems = [
              {
                name = "Peanuts";
                portion = "1 handful (30g)";
                calories = 180;
                protein = 8.0;
                carbs = 6.0;
                fats = 15.0;
              },
              {
                name = "Apple";
                portion = "1 medium";
                calories = 95;
                protein = 0.5;
                carbs = 25.0;
                fats = 0.3;
              },
            ];
          },
        ];
      },
      {
        mealType = "Lunch";
        options = [
          {
            description = "Option 1: Dal + Rice + Curd (Dahi) + Salad";
            foodItems = [
              {
                name = "Dal";
                portion = "1 bowl";
                calories = 150;
                protein = 7.0;
                carbs = 26.0;
                fats = 3.0;
              },
              {
                name = "Rice";
                portion = "1 cup";
                calories = 200;
                protein = 4.0;
                carbs = 45.0;
                fats = 0.5;
              },
              {
                name = "Curd (Dahi)";
                portion = "1 bowl";
                calories = 100;
                protein = 6.0;
                carbs = 7.0;
                fats = 5.0;
              },
              {
                name = "Salad";
                portion = "1 serving";
                calories = 50;
                protein = 1.0;
                carbs = 10.0;
                fats = 0.5;
              },
            ];
          },
          {
            description = "Option 2: Soya Chunks Curry + 2 Roti + Salad";
            foodItems = [
              {
                name = "Soya Chunks Curry";
                portion = "1 bowl";
                calories = 180;
                protein = 16.0;
                carbs = 20.0;
                fats = 5.0;
              },
              {
                name = "Roti";
                portion = "2 pieces";
                calories = 120;
                protein = 4.0;
                carbs = 22.0;
                fats = 2.0;
              },
              {
                name = "Salad";
                portion = "1 serving";
                calories = 50;
                protein = 1.0;
                carbs = 10.0;
                fats = 0.5;
              },
            ];
          },
        ];
      },
      {
        mealType = "Pre-Workout";
        options = [
          {
            description = "Option 1: 1 Banana + Black Coffee (for energy)";
            foodItems = [
              {
                name = "Banana";
                portion = "1 medium";
                calories = 90;
                protein = 1.0;
                carbs = 23.0;
                fats = 0.5;
              },
              {
                name = "Black Coffee";
                portion = "1 cup";
                calories = 5;
                protein = 0.0;
                carbs = 1.0;
                fats = 0.0;
              },
            ];
          },
          {
            description = "Option 2: 1 Sweet Potato (Shakarkandi)";
            foodItems = [
              {
                name = "Sweet Potato";
                portion = "1 medium";
                calories = 100;
                protein = 2.0;
                carbs = 23.0;
                fats = 0.2;
              },
            ];
          },
        ];
      },
      {
        mealType = "Post-Workout";
        options = [
          {
            description = "Option 1: 4 Egg Whites or Paneer (50g)";
            foodItems = [
              {
                name = "Egg Whites";
                portion = "4 pieces";
                calories = 68;
                protein = 14.0;
                carbs = 0.8;
                fats = 0.2;
              },
              {
                name = "Paneer";
                portion = "50g";
                calories = 165;
                protein = 10.0;
                carbs = 5.0;
                fats = 13.0;
              },
            ];
          },
          {
            description = "Option 2: Sattu Drink (3-4 spoons in water/milk)";
            foodItems = [
              {
                name = "Sattu Drink";
                portion = "3-4 spoons";
                calories = 150;
                protein = 10.0;
                carbs = 27.0;
                fats = 2.5;
              },
              {
                name = "Milk";
                portion = "1 cup (200ml)";
                calories = 120;
                protein = 8.0;
                carbs = 12.0;
                fats = 5.0;
              },
            ];
          },
        ];
      },
      {
        mealType = "Dinner";
        options = [
          {
            description = "Option 1: Paneer Bhurji / Chicken + 2 Roti";
            foodItems = [
              {
                name = "Paneer Bhurji";
                portion = "1 bowl";
                calories = 220;
                protein = 12.0;
                carbs = 8.0;
                fats = 15.0;
              },
              {
                name = "Chicken";
                portion = "100g cooked";
                calories = 165;
                protein = 20.0;
                carbs = 0.0;
                fats = 7.0;
              },
              {
                name = "Roti";
                portion = "2 pieces";
                calories = 120;
                protein = 4.0;
                carbs = 22.0;
                fats = 2.0;
              },
            ];
          },
          {
            description = "Option 2: Moong Dal Khichdi + Omelette";
            foodItems = [
              {
                name = "Moong Dal Khichdi";
                portion = "1 bowl";
                calories = 250;
                protein = 10.0;
                carbs = 50.0;
                fats = 3.0;
              },
              {
                name = "Omelette";
                portion = "2 eggs";
                calories = 140;
                protein = 12.0;
                carbs = 2.0;
                fats = 11.0;
              },
            ];
          },
        ];
      },
    ];
  };
};
