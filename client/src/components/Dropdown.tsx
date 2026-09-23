import type { ExerciseType } from "../types/types";

interface DropdownMenuProps {
	exercise: ExerciseType | "",
	setExercise: React.Dispatch<React.SetStateAction<ExerciseType | "">>
}

const DropdownMenu = ({exercise, setExercise}: DropdownMenuProps) => {

  return (
    <div className="main-container">
      <label htmlFor="exercise-select">Exercise Selection: </label>

      <select
        name="exercises"
        id="exercises"
        onChange={(e) => setExercise(e.target.value as ExerciseType)}
		value={exercise}
      >
        <option value="" disabled hidden>
          Please choose an exercise
        </option>
        <option value="Left Bicep Curl">Left Bicep Curl</option>
        <option value="Push Up">Push up</option>
        <option value="Squat">Squat</option>
      </select>
      <button
        onClick={() => {
          console.log(exercise);
        }}
      >
        hi
      </button>
    </div>
  );
};

export default DropdownMenu;
