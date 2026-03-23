import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { filterLandmarksByVisibility } from "../utils/functions";

export class FormCorrector {
  exercise: string;
  #visibilityBuffer: Map<String, boolean[]>;
  #bufferSize: number;

  constructor(exercise: string) {
    this.exercise = exercise;
    this.#visibilityBuffer = new Map<String, boolean[]>();
    this.#visibilityBuffer.set("left arm", []);
    this.#visibilityBuffer.set("right arm", []);
    this.#bufferSize = 15;
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
        0.65,
      ).length;

      const leftArmVisibilityArr = this.#visibilityBuffer.get("left arm")!;
      leftArmArr === 3
        ? this.#addToBuffer(true, leftArmVisibilityArr)
        : this.#addToBuffer(false, leftArmVisibilityArr);

      if (
        this.#checkBufferPercentage(leftArmVisibilityArr) < 0.7 &&
        leftArmVisibilityArr.length >= this.#bufferSize
      ) {
        console.log("left arm");
        result = false;
        msgArr.push("Left arm should be visible");
      }
      // right arm should not be visible
      const rightArmArr = filterLandmarksByVisibility(
        [worldLandmarks[12], worldLandmarks[14], worldLandmarks[16]],
        0.8,
      ).length;

      const rightArmVisibilityArr = this.#visibilityBuffer.get("right arm")!;
      rightArmArr === 3
        ? this.#addToBuffer(true, rightArmVisibilityArr)
        : this.#addToBuffer(false, rightArmVisibilityArr);

      if (
        this.#checkBufferPercentage(rightArmVisibilityArr) > 0.7 &&
        rightArmVisibilityArr.length >= this.#bufferSize
      ) {
        console.log("right arm");
        result = false;
        msgArr.push("Right arm should not be visible");
      }
    }
    return { result: result, messages: msgArr };
  }

  #checkBufferPercentage(booleanArr: boolean[]) {
    let total = 0;
    for (let i = 0; i < booleanArr.length; i++) {
      if (booleanArr[i] === true) {
        total++;
      }
    }
    return total / this.#bufferSize;
  }

  #addToBuffer(booleanValue: boolean, booleanArr: boolean[]) {
    if (booleanArr.length === this.#bufferSize) {
      booleanArr.shift();
    }
    booleanArr.push(booleanValue);
  }
}
