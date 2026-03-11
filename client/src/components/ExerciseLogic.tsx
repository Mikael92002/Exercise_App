// state machine class
import type { KeyType } from "../types/types";
import { ExerciseCalculator } from "./ExerciseCalculator";

export class ExerciseLogic {
  state: number = 0;
  currAngle: number; // get from separate "ExerciseCalculator" class
  exerciseCalculator: ExerciseCalculator;
  reps: number;

  // landmarks for bicep curl:
  // right arm: 12 (shoulder), 14(elbow), 16 (wrist, maybe)
  // left arm: 11, 13, 15

  constructor(exerciseCalculator: ExerciseCalculator) {
    this.exerciseCalculator = exerciseCalculator;
    this.currAngle = -1;
    this.reps = 0;
  }

  stateUpdateLoop() {
    console.log(this.state);
    // based off of bicep curl:
    // state 0: resting/ around 160 deg
    // state 1: between 180 and 60 deg (concentric)
    // when <60 deg, change to state 2
    // state 2: between 60 and 180 deg (eccentric)
    // reset state to 0 when state 2 passed
    // full rep completed when back to 180/ reset state to 0.

    // concentric case:
    if (
      this.exerciseCalculator.angle <
        this.exerciseCalculator.states["state 0"] &&
      this.exerciseCalculator.angle >
        this.exerciseCalculator.states["state 2"] &&
      this.state === 0
    ) {
      this.state = 1;
    }
    // eccentric case:
    if (
      this.exerciseCalculator.angle <
        this.exerciseCalculator.states["state 2"] &&
      this.state === 1
    ) {
      this.state = 2;
    }
    // rep complete case:
    if (
      this.exerciseCalculator.angle >
        this.exerciseCalculator.states["state 0"] &&
      this.state === 2
    ) {
      this.reps++;
      this.state = 0;
    }
    // resting case:
  }
}
