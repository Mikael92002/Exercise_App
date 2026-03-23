import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { KeyType, LandmarkType, StateType } from "../types/types";
import {
  addToSlidingWindow,
  ExerciseEnum,
  findMedian,
  movingAverage,
} from "../utils/functions";

export class ExerciseCalculator {
  states: StateType;
  landmarks: LandmarkType;
  enumObj = ExerciseEnum();
  angle: number;
  distanceArray: number[];
  filteredSmoothedAngle: number;
  filteredSmoothedDistance: number;
  filteredSlidingWindow: number[];
  exercise: string;

  constructor(exercise: KeyType) {
    this.states = this.enumObj[exercise]["states"];
    this.landmarks = this.enumObj[exercise]["landmarks"];
    this.angle = -1;
    this.distanceArray = [0, 0, 0];
    this.filteredSmoothedAngle = 0;
    this.filteredSmoothedDistance = 0;
    this.filteredSlidingWindow = [];
    this.exercise = exercise;
  }

  // ANGLE-BASED METHOD:
  
  // pass in filtered landmark array from poseLandmarker:
  calculateDistances(landmarkArr: NormalizedLandmark[]) {
    const A = landmarkArr[0];
    const B = landmarkArr[1];
    const C = landmarkArr[2];
    // AB: 12 to 14
    const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    //BC: 14 to 16
    const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    //AC: 12 to 16
    const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));

    const distances = [AB, BC, AC];
    this.distanceArray = distances;

    return distances;
  }

  calculateAngle() {
    let angle = Math.acos(
      (Math.pow(this.distanceArray[1], 2) +
        Math.pow(this.distanceArray[0], 2) -
        Math.pow(this.distanceArray[2], 2)) /
        (2 * this.distanceArray[1] * this.distanceArray[0]),
    );
    angle = angle * (180 / Math.PI);
    this.angle = angle;

    return angle;
  }

  #filterAngle(slidingWindow: number[]) {
    const filteredAngle = findMedian(slidingWindow);
    addToSlidingWindow(filteredAngle, this.filteredSlidingWindow, 5);
    return filteredAngle;
  }

  #smoothAngle() {
    this.filteredSmoothedAngle = movingAverage(
      this.filteredSlidingWindow,
      this.filteredSmoothedAngle,
      this.filteredSlidingWindow[this.filteredSlidingWindow.length - 1],
    );
    return this.filteredSmoothedAngle;
  }

  filterAndSmoothAngle(slidingWindow: number[]) {
    this.#filterAngle(slidingWindow);
    this.#smoothAngle();
  }
}
