// state machine class
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { addToSlidingWindow } from "../utils/functions";
import { ExerciseCalculator } from "./ExerciseCalculator";

export class ExerciseLogic {
  state: number;
  exerciseCalculator: ExerciseCalculator;
  reps: number;
  exercise: string;
  globalSlidingWindow: number[];

  static stateEnum = Object.freeze({
    RESTING: 0,
    CONCENTRIC: 1,
    ECCENTRIC: 2,
  });

  // landmarks for bicep curl:
  // right arm: 12 (shoulder), 14(elbow), 16 (wrist, maybe)
  // left arm: 11, 13, 15

  constructor(exerciseCalculator: ExerciseCalculator) {
    this.exerciseCalculator = exerciseCalculator;
    this.exercise = this.exerciseCalculator.exercise;
    this.reps = 0;
    this.globalSlidingWindow = [];
    this.state = ExerciseLogic.stateEnum.RESTING;
  }

  #stateUpdateLoopAngle() {
    // based off of bicep curl:
    // state 0: resting/ around 160 deg
    // state 1: between 180 and 60 deg (concentric)
    // when <60 deg, change to state 2
    // state 2: between 60 and 180 deg (eccentric)
    // reset state to 0 when state 2 passed
    // full rep completed when back to 180/ reset state to 0.

    switch (this.state) {
      // transition to concentric:
      case ExerciseLogic.stateEnum.RESTING:
        if (
          this.exerciseCalculator.filteredSmoothedAngle <
            this.exerciseCalculator.states["angleState 0"] &&
          this.exerciseCalculator.filteredSmoothedAngle >
            this.exerciseCalculator.states["angleState 2"]
        ) {
          this.state = ExerciseLogic.stateEnum.CONCENTRIC;
        }
        break;
      // transition to eccentric:
      case ExerciseLogic.stateEnum.CONCENTRIC:
        if (
          this.exerciseCalculator.filteredSmoothedAngle <
          this.exerciseCalculator.states["angleState 2"]
        ) {
          this.state = ExerciseLogic.stateEnum.ECCENTRIC;
        }
        break;
      // transition to resting:
      case ExerciseLogic.stateEnum.ECCENTRIC:
        if (
          this.exerciseCalculator.filteredSmoothedAngle >
          this.exerciseCalculator.states["angleState 0"]
        ) {
          this.reps++;
          this.state = ExerciseLogic.stateEnum.RESTING;
        }
    }
  }

  #acceptCoordsLoopAngle(worldLandmarks: NormalizedLandmark[]) {
    this.exerciseCalculator.calculateDistances(worldLandmarks);
    const angle = this.exerciseCalculator.calculateAngle();
    addToSlidingWindow(angle, this.globalSlidingWindow, 5);
    this.exerciseCalculator.filterAndSmoothAngle(this.globalSlidingWindow);
  }

  acceptCoordsAndUpdateStateAngle(worldLandmarks: NormalizedLandmark[]) {
    this.#acceptCoordsLoopAngle(worldLandmarks);
    this.#stateUpdateLoopAngle();
  }
}
