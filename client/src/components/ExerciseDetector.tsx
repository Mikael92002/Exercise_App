// state machine class

import type { KeyType } from "../types/types";
import { ExerciseCalculator } from "./ExerciseCalculator";

export class ExerciseDetector {
  exercise: KeyType;
  // based off of bicep curl:
  // state 0: resting/ around 180 deg
  // state 1: between 180 and 60 deg (concentric)
  // when <60 deg, change to state 2
  // state 2: between 60 and 180 deg (eccentric)
  // full rep completed when back to 180/ reset state to 0.
  state: number = 0;
  currAngle: number; // get from separate "ExerciseCalculator" class
  exerciseCalculator: ExerciseCalculator;

  // landmarks for bicep curl:
  // right arm: 12 (shoulder), 14(elbow), 16 (wrist, maybe)
  // left arm: 11, 13, 15

  constructor(exercise: KeyType) {
    this.exerciseCalculator = new ExerciseCalculator(exercise);
    this.exercise = exercise;
    this.currAngle = -1;
  }
}
