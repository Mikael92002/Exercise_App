import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { EnumObjType } from "../types/types";

export function ExerciseEnum() {
  const enumObj: EnumObjType = {
    "Left Bicep Curl": {
      // mod thresholds when right arm is visible:
      // 12, 14, 16: set angleState 0 to 140, angleState 2 to 105...
      states: {
        "angleState 0": 160,
        "angleState 2": 45,
        "distanceState 0": 0.95,
        "distanceState 2": 0.63,
      },
      landmarks: [11, 13, 15],
    },
  } as const;
  return enumObj;
}

export function findMedian(arr: number[]) {
  if (arr.length === 0) {
    return 0;
  }
  let filteredArr = [...arr];
  filteredArr = filteredArr.sort((a, b) => a - b);

  // even arr:
  if (filteredArr.length % 2 == 0) {
    return (
      (filteredArr[filteredArr.length / 2] +
        filteredArr[filteredArr.length / 2 - 1]) /
      2
    );
  }
  // odd arr:
  else {
    return filteredArr[Math.floor(filteredArr.length / 2)];
  }
}

export function addToSlidingWindow(angle: number, slidingWindow: number[]) {
  // from global sliding window:
  if (slidingWindow.length === 5) {
    slidingWindow.shift();
  }
  slidingWindow.push(angle);
  return slidingWindow;
}

// the sliding window in this function's arg should
// be median filtered:
export function movingAverage(
  slidingWindow: number[],
  initialVal: number,
  newDataPoint: number,
) {
  // for first 5 data points, do a simple moving average:
  if (slidingWindow.length < 5) {
    return simpleMovingAverage(slidingWindow);
  }
  return exponentialMovingAverage(initialVal, newDataPoint);
}

function simpleMovingAverage(slidingWindow: number[]) {
  const initial = 0;
  const simpleSum = slidingWindow.reduce(
    (total, current) => total + current,
    initial,
  );
  const simpleAvg = simpleSum / slidingWindow.length;
  return simpleAvg;
}

function exponentialMovingAverage(initialVal: number, newDataPoint: number) {
  const alpha = 0.5;
  const EMA = alpha * newDataPoint + (1 - alpha) * initialVal;
  return EMA;
}

// process to add data to a filteredSmoothedArray:
// push to global noisy slidingWindow array
// findMedian on the array
// then exponentialMovingAverage on the array
// push the resultant value into a new array

export function filterLandmarksByVisibility(
  landmarks: NormalizedLandmark[],
  targetVisibility: number,
) {
  const filteredArr: NormalizedLandmark[] = [];
  for (const landmark of landmarks) {
    if (landmark.visibility >= targetVisibility) {
      filteredArr.push(landmark);
    }
  }
  return filteredArr;
}

export function filterLandmarksByLandmarks(
  landmarks: NormalizedLandmark[],
  targetLandmarks: number[],
) {
  const filteredArr: NormalizedLandmark[] = [];
  for (let i = 0; i < targetLandmarks.length; i++) {
    filteredArr.push(landmarks[targetLandmarks[i]]);
  }
  return filteredArr;
}

export function checkLandmarkVisibilityByThreshold(
  landmarks: NormalizedLandmark[],
  targetVisibility: number,
) {
  for (let landmark of landmarks) {
    if (landmark.visibility < targetVisibility) {
      return false;
    }
  }
  return true;
}
