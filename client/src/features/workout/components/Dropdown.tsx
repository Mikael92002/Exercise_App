import type { ExerciseType } from "../types/types";
import "../css/dropdown.css";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import downArrow from "../assets/down arrow.png"

interface DropdownMenuProps {
  exercise: ExerciseType | "";
  setExercise: React.Dispatch<React.SetStateAction<ExerciseType | "">>;
}

const exercises = ["Bicep Curl", "Push Up", "Squat"];

const DropdownMenu = ({ exercise, setExercise }: DropdownMenuProps) => {
  return (
    <div className="dropdown_main_container">
      <label htmlFor="exercise_select">Choose Exercise</label>
      <Listbox onChange={(e) => setExercise(e)} value={exercise}>
        <ListboxButton className="listbox_button">
          {exercise ? exercise : "Please choose an exercise"} <img src={downArrow} alt="arrow pointing down" width={20} className="arrow"/>
        </ListboxButton>
        <ListboxOptions anchor="bottom" transition className="listbox_options">
          {exercises.map((exercise) => {
            return (
              <ListboxOption className="listbox_option" value={exercise} key={exercise}>
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
