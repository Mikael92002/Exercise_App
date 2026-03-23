import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { filterLandmarksByVisibility } from "../utils/functions";
import { SlidingWindow } from "../utils/SlidingWindow";

export class FormCorrector {
  exercise: string;
  #visibilityBuffer: Map<String, SlidingWindow<boolean>>;
  #bufferSize: number;

  constructor(exercise: string) {
    this.exercise = exercise;
    this.#visibilityBuffer = new Map<String, SlidingWindow<boolean>>();
    this.#bufferSize = 15;
    this.#visibilityBuffer.set("left arm", new SlidingWindow(this.#bufferSize));
    this.#visibilityBuffer.set(
      "right arm",
      new SlidingWindow(this.#bufferSize),
    );
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

      const leftArmSlidingWindow = this.#visibilityBuffer.get("left arm")!;
      leftArmArr === 3
        ? leftArmSlidingWindow.add(true)
        : leftArmSlidingWindow.add(false);

      if (
        leftArmSlidingWindow.getTrueRatio() < 0.7 &&
        leftArmSlidingWindow.isFull()
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

      const rightArmSlidingWindow = this.#visibilityBuffer.get("right arm")!;
      rightArmArr === 3
        ? rightArmSlidingWindow.add(true)
        : rightArmSlidingWindow.add(false);

      if (
        rightArmSlidingWindow.getTrueRatio() > 0.7 &&
        rightArmSlidingWindow.isFull()
      ) {
        console.log("right arm");
        result = false;
        msgArr.push("Right arm should not be visible");
      }
    }
    return { result: result, messages: msgArr };
  }
}
