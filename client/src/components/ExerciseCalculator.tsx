import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { KeyType, LandmarkType, StateType } from "../types/types";
import { ExerciseEnum } from "../utils/functions";

export class ExerciseCalculator {
  states: StateType;
  landmarks: LandmarkType;
  enumObj = ExerciseEnum();
  angle: number;
  distanceArray: number[];

  constructor(exercise: KeyType) {
    this.states = this.enumObj[exercise]["states"];
    this.landmarks = this.enumObj[exercise]["landmarks"];
    this.angle = -1;
    this.distanceArray = [0, 0, 0];

    if (exercise === "Left Bicep Curl") {
      this.states["state 0"] = 160;
      this.states["state 2"] = 50;
    }
  }

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
}
