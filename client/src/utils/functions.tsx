import type { EnumObjType } from "../types/types";

export function ExerciseEnum() {
  const enumObj: EnumObjType = {
    "Left Bicep Curl": {
      states: { "state 0": 175, "state 2": 60 },
      landmarks: [12, 14, 16],
    },
  } as const;
  return enumObj;
}

export function findMedian(arr: number[]) {
  if (arr.length === 0) {
    return [];
  }
  arr = arr.sort((a, b) => a - b);

  // even arr:
  if (arr.length % 2 == 0) {
    return (arr[arr.length / 2] + arr[arr.length / 2 - 1]) / 2;
  }
  // odd arr:
  else {
    return arr[Math.floor(arr.length / 2)];
  }
}

export function addToSlidingWindow(
  unfilteredAngle: number,
  slidingWindow: number[],
) {
  // from global sliding window:
  if (slidingWindow.length === 5) {
    slidingWindow.shift();
  }
  slidingWindow.push(unfilteredAngle);
  return slidingWindow;
}

