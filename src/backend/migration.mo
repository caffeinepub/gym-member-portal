import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  type Exercise = {
    id : Nat;
    name : Text;
    targetMuscleGroups : Text;
    difficultyLevel : Text;
    equipmentNeeded : Text;
    videoUrl : Text;
    description : Text;
    recommendedRepsRange : Text;
    recommendedSetsRange : Text;
  };

  type Actor = {
    exerciseLibraryStore : Map.Map<Nat, Exercise>;
    // other fields...
  };

  public func run(old : Actor) : Actor {
    let initialExercises : [(Nat, Exercise)] = [
      (
        1,
        {
          id = 1;
          name = "Squats";
          targetMuscleGroups = "Legs";
          difficultyLevel = "Intermediate";
          equipmentNeeded = "None";
          videoUrl = "";
          description = "Foundation for the entire body";
          recommendedRepsRange = "3 sets x 12 reps";
          recommendedSetsRange = "3 sets";
        },
      ),
      (
        2,
        {
          id = 2;
          name = "Push-ups";
          targetMuscleGroups = "Chest/Shoulders/Triceps";
          difficultyLevel = "Beginner";
          equipmentNeeded = "None";
          videoUrl = "";
          description = "Essential for every gym session";
          recommendedRepsRange = "3 sets x max reps";
          recommendedSetsRange = "3 sets";
        },
      ),
      (
        3,
        {
          id = 3;
          name = "Bench Press";
          targetMuscleGroups = "Chest";
          difficultyLevel = "Intermediate";
          equipmentNeeded = "Barbell or Dumbbells";
          videoUrl = "";
          description = "Best exercise for broad chest";
          recommendedRepsRange = "3 sets x 10 reps";
          recommendedSetsRange = "3 sets";
        },
      ),
      (
        4,
        {
          id = 4;
          name = "Deadlift";
          targetMuscleGroups = "Back/Overall Strength";
          difficultyLevel = "Advanced";
          equipmentNeeded = "Barbell";
          videoUrl = "";
          description = "Gives power to the entire body, focus on form";
          recommendedRepsRange = "3 sets x 8 reps";
          recommendedSetsRange = "3 sets";
        },
      ),
      (
        5,
        {
          id = 5;
          name = "Pull-ups/Lat Pulldown";
          targetMuscleGroups = "Back/Biceps";
          difficultyLevel = "Intermediate";
          equipmentNeeded = "Pull-up Bar or Lat Machine";
          videoUrl = "";
          description = "Essential for V-shape body";
          recommendedRepsRange = "3 sets x 8-10 reps";
          recommendedSetsRange = "3 sets";
        },
      ),
      (
        6,
        {
          id = 6;
          name = "Overhead Press";
          targetMuscleGroups = "Shoulders";
          difficultyLevel = "Intermediate";
          equipmentNeeded = "Barbell or Dumbbells";
          videoUrl = "";
          description = "For broader shoulders";
          recommendedRepsRange = "3 sets x 10 reps";
          recommendedSetsRange = "3 sets";
        },
      ),
      (
        7,
        {
          id = 7;
          name = "Plank";
          targetMuscleGroups = "Core/Abs";
          difficultyLevel = "Beginner";
          equipmentNeeded = "None";
          videoUrl = "";
          description = "Perform at the end of workout";
          recommendedRepsRange = "3 sets x 1 minute";
          recommendedSetsRange = "3 sets";
        },
      ),
    ];

    let updatedExerciseLibraryStore = Map.fromIter<Nat, Exercise>(initialExercises.values());

    {
      old with
      exerciseLibraryStore = updatedExerciseLibraryStore
    };
  };
};
