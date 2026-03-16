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
      // check if ALL points on left arm are visible:
      const leftArmArr = filterLandmarksByVisibility(
        [worldLandmarks[11], worldLandmarks[13], worldLandmarks[15]],
        0.8,
      );
      if (leftArmArr.length !== 3) {
        console.log("left arm")
        result = false;
        msgArr.push("Left arm should be visible");
      }
      // right arm should not be visible
      const rightShoulderArr = filterLandmarksByVisibility(
        [worldLandmarks[12], worldLandmarks[14], worldLandmarks[16]],
        0.8,
      );
      console.log(rightShoulderArr);
      if (rightShoulderArr.length === 3) {
        console.log("right arm")
        result = false;
        msgArr.push("Right arm should not be visible");
      }
    }
    return { result: result, messages: msgArr };
  }
}
