// state machine class
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import {
  addToSlidingWindow,
} from "../utils/functions";
import { ExerciseCalculator } from "./ExerciseCalculator";

export class ExerciseLogic {
  state: number = 0;
  exerciseCalculator: ExerciseCalculator;
  reps: number;
  exercise: string;
  globalSlidingWindow: number[];

  // landmarks for bicep curl:
  // right arm: 12 (shoulder), 14(elbow), 16 (wrist, maybe)
  // left arm: 11, 13, 15

  constructor(exerciseCalculator: ExerciseCalculator) {
    this.exerciseCalculator = exerciseCalculator;
    this.exercise = this.exerciseCalculator.exercise;
    this.reps = 0;
    this.globalSlidingWindow = [];
  }

  #stateUpdateLoopAngle() {
    // based off of bicep curl:
    // state 0: resting/ around 160 deg
    // state 1: between 180 and 60 deg (concentric)
    // when <60 deg, change to state 2
    // state 2: between 60 and 180 deg (eccentric)
    // reset state to 0 when state 2 passed
    // full rep completed when back to 180/ reset state to 0.

    // concentric case:
    if (
      this.exerciseCalculator.filteredSmoothedAngle <
        this.exerciseCalculator.states["angleState 0"] &&
      this.exerciseCalculator.filteredSmoothedAngle >
        this.exerciseCalculator.states["angleState 2"] &&
      this.state === 0
    ) {
      this.state = 1;
    }
    // eccentric case:
    if (
      this.exerciseCalculator.filteredSmoothedAngle <
        this.exerciseCalculator.states["angleState 2"] &&
      this.state === 1
    ) {
      this.state = 2;
    }
    // rep complete case:
    if (
      this.exerciseCalculator.filteredSmoothedAngle >
        this.exerciseCalculator.states["angleState 0"] &&
      this.state === 2
    ) {
      this.reps++;
      this.state = 0;
    }
  }

  #stateUpdateLoopDistance() {
    if (
      this.exerciseCalculator.filteredSmoothedDistance <
        this.exerciseCalculator.states["distanceState 0"] &&
      this.exerciseCalculator.filteredSmoothedDistance >
        this.exerciseCalculator.states["distanceState 2"] &&
      this.state === 0
    ) {
      this.state = 1;
    }
    // eccentric case:
    if (
      this.exerciseCalculator.filteredSmoothedDistance <
        this.exerciseCalculator.states["distanceState 2"] &&
      this.state === 1
    ) {
      this.state = 2;
    }
    // rep complete case:
    if (
      this.exerciseCalculator.filteredSmoothedDistance >
        this.exerciseCalculator.states["distanceState 0"] &&
      this.state === 2
    ) {
      this.reps++;
      this.state = 0;
    }
  }

  #acceptCoordsLoop(coords: NormalizedLandmark[]) {
    const unfilteredRatio =
      this.exerciseCalculator.calculateWristShoulderRatio(coords);

    addToSlidingWindow(unfilteredRatio!, this.globalSlidingWindow);

    this.exerciseCalculator.filterAndSmoothDistance(this.globalSlidingWindow);
  }

  acceptCoordsAndUpdateState(coords: NormalizedLandmark[]) {
    // Might need to change depending on exercise:
    this.#acceptCoordsLoop(coords);
    this.#stateUpdateLoopDistance();
  }

  #acceptCoordsLoopAngle(worldLandmarks: NormalizedLandmark[]) {
    this.exerciseCalculator.calculateDistances(worldLandmarks);
    const angle = this.exerciseCalculator.calculateAngle();
    addToSlidingWindow(angle, this.globalSlidingWindow);
    this.exerciseCalculator.filterAndSmoothAngle(this.globalSlidingWindow);
  }

  acceptCoordsAndUpdateStateAngle(worldLandmarks: NormalizedLandmark[]) {
    this.#acceptCoordsLoopAngle(worldLandmarks);
    this.#stateUpdateLoopAngle();
  }
}
