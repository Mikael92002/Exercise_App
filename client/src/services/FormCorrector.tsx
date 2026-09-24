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
    switch (this.exercise) {
      case "Left Bicep Curl":
        this.#visibilityBuffer.set(
          "left arm",
          new SlidingWindow(this.#bufferSize),
        );
        this.#visibilityBuffer.set(
          "right arm",
          new SlidingWindow(this.#bufferSize),
        );
        break;
      case "Push Up":
        this.#visibilityBuffer.set(
          "left arm",
          new SlidingWindow(this.#bufferSize),
        );
        this.#visibilityBuffer.set(
          "right arm",
          new SlidingWindow(this.#bufferSize),
        );
        break;
      case "Squat":
        this.#visibilityBuffer.set(
          "left leg",
          new SlidingWindow(this.#bufferSize),
        );
        this.#visibilityBuffer.set(
          "right leg",
          new SlidingWindow(this.#bufferSize),
        );
    }
  }

  correctForm(landmarks: NormalizedLandmark[]): {
    result: boolean;
    messages: string[];
  } {
    let result = true;
    const msgArr: string[] = [];

    if (this.exercise == "Left Bicep Curl" || this.exercise === "Push Up") {
      // check if ALL points on left arm are visible:
      const leftArmArr = filterLandmarksByVisibility(
        [landmarks[11], landmarks[13], landmarks[15]],
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
        result = false;
        msgArr.push("Left arm should be visible");
      }
      // right arm should not be visible
      const rightArmArr = filterLandmarksByVisibility(
        [landmarks[12], landmarks[14], landmarks[16]],
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
        result = false;
        msgArr.push("Right arm should not be visible");
      }
    } else if (this.exercise === "Squat") {
      const leftLegArr = filterLandmarksByVisibility(
        [landmarks[23], landmarks[25], landmarks[27]],
        0.65,
      ).length;

      const leftLegSlidingWindow = this.#visibilityBuffer.get("left leg")!;
      leftLegArr === 3
        ? leftLegSlidingWindow?.add(true)
        : leftLegSlidingWindow?.add(false);

      if (
        leftLegSlidingWindow?.getTrueRatio() < 0.7 &&
        leftLegSlidingWindow?.isFull()
      ) {
        msgArr.push("Left leg should be visible");
      }

      const rightLegArr = filterLandmarksByVisibility(
        [landmarks[24], landmarks[26], landmarks[28]],
        0.8,
      ).length;
      const rightLegSlidingWindow = this.#visibilityBuffer.get("right leg")!;

      rightLegArr === 3
        ? rightLegSlidingWindow.add(true)
        : rightLegSlidingWindow.add(false);

      if (
        rightLegSlidingWindow.getTrueRatio() > 0.7 &&
        rightLegSlidingWindow.isFull()
      ) {
        msgArr.push("Right leg should not be visible");
      }
    }
    return { result: result, messages: msgArr };
  }
}
