import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { KeyType, LandmarkType, StateType } from "../types/types";
import { ExerciseEnum } from "../utils/functions";

export class ExerciseCalculator {
  states: StateType;
  landmarks: LandmarkType;
  enumObj = ExerciseEnum();

  constructor(exercise: KeyType) {
    this.states = this.enumObj[exercise]["states"];
    this.landmarks = this.enumObj[exercise]["landmarks"];
  }

  // pass in filtered landmark array from poseLandmarker:
  getDistances(landmarkArr: NormalizedLandmark[]) {
    const A = landmarkArr[0];
    const B = landmarkArr[1];
    const C = landmarkArr[2];
    // AB: 12 to 14
    const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    //BC: 14 to 16
    const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    //AC: 12 to 16
    const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));

    return [AB, BC, AC];
  }

  getAngle(distanceArr: number[]) {
    let angle = Math.acos(
      (Math.pow(distanceArr[1], 2) +
        Math.pow(distanceArr[0], 2) -
        Math.pow(distanceArr[2], 2)) /
        (2 * distanceArr[1] * distanceArr[0]),
    );
    angle = angle*(180/Math.PI)
    return angle;
  }
}
