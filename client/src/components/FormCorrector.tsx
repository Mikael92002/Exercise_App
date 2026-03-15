import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { filterLandmarksByVisibility } from "../utils/functions";

export class FormCorrector {
  exercise: string;
  constructor(exercise: KeyType) {
    this.exercise = exercise;
  }

  correctForm(worldLandmarks: NormalizedLandmark[]): {
    result: boolean;
    messages: string[];
  } {
    let result = true;
    const msgArr: string[] = [];
    if (this.exercise === "Left Bicep Curl") {
      // check if any point on
      // upper face is visible:
      const upperFaceArr = filterLandmarksByVisibility(
        worldLandmarks.slice(0, 9),
        0.8,
      );
      if (upperFaceArr.length === 0) {
        result = false;
        msgArr.push("At least one point on the face should be visible");
      }
      // check if ALL points on left arm are visible:
      const leftArmArr = filterLandmarksByVisibility(
        [worldLandmarks[11], worldLandmarks[13], worldLandmarks[15]],
        0.8,
      );
      console.log(leftArmArr);
      if (leftArmArr.length !== 3) {
        result = false;
        msgArr.push("Left arm should be visible");
      }
    }
    return { result: result, messages: msgArr };
  }
}
