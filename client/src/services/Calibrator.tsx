import { findMedian } from "../utils/functions";
import { SlidingWindow } from "../utils/SlidingWindow";

export class Calibrator {
  calibrationArr: SlidingWindow<number>;
  flexed_threshold: number | null;
  relaxed_threshold: number | null;

  constructor() {
    this.calibrationArr = new SlidingWindow(100);
    this.flexed_threshold = null;
    this.relaxed_threshold = null;
  }

  calculateFlexedThreshold() {
    this.flexed_threshold = findMedian(this.calibrationArr.array);
    return this.flexed_threshold;
  }

  calculateRelaxedThreshold() {
    this.relaxed_threshold = findMedian(this.calibrationArr.array);
    return this.relaxed_threshold;
  }

  pushToCalibrationArr(angle: number) {
    this.calibrationArr.add(angle);
  }
}
