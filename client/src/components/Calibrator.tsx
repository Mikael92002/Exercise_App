import { addToSlidingWindow, findMedian } from "../utils/functions";

export class Calibrator {
  calibrationArr: number[];
  flexed_threshold: number | null;
  relaxed_threshold: number | null;

  constructor() {
    this.calibrationArr = [];
    this.flexed_threshold = null;
    this.relaxed_threshold = null;
  }

  calculateFlexedThreshold() {
    this.flexed_threshold = findMedian(this.calibrationArr);
    return this.flexed_threshold;
  }

  calculateRelaxedThreshold() {
    this.relaxed_threshold = findMedian(this.calibrationArr);
    return this.relaxed_threshold;
  }

  pushToCalibrationArr(angle: number) {
    addToSlidingWindow(angle, this.calibrationArr, 100);
  }
}
