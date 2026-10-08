import type { ExerciseType } from "../types/types";
import "../css/dropdown.css";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

interface DropdownMenuProps {
  exercise: ExerciseType | "";
  setExercise: React.Dispatch<React.SetStateAction<ExerciseType | "">>;
}

const exercises = ["Bicep Curl", "Push Up", "Squat"];

const DropdownMenu = ({ exercise, setExercise }: DropdownMenuProps) => {
  return (
    <div className="dropdown_main_container">
      <label htmlFor="exercise_select">Exercise Selection: </label>
      <Listbox onChange={(e) => setExercise(e)} value={exercise}>
        <ListboxButton className="exercise_select">
          {exercise ? exercise : "Please choose an exercise"}
        </ListboxButton>
        <ListboxOptions anchor="bottom">
          {exercises.map((exercise) => {
            return (
              <ListboxOption className="exercise_name" value={exercise} key={exercise}>
                {exercise}
              </ListboxOption>
            );
          })}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};

export default DropdownMenu;
