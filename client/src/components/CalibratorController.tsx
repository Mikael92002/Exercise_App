import { Calibrator } from "./Calibrator";

export class CalibratorController {
  calibrator;
  ready;
  stageOneComplete;
  stageTwoComplete;

  constructor() {
    this.calibrator = new Calibrator();
    this.ready = this.stageOneComplete = this.stageTwoComplete = false;
  }

  async calibrateLoop(angle: number) {
    // first stage, get ready: "flex ur arm for 3 secs"
    if (!this.ready) {
      const result = new Promise((resolve) => {
        setTimeout(() => {
          this.ready = true;
          console.log("ready");
          return true;
        }, 3000);
      });
      return await result;
    }

    if (this.ready && !this.stageOneComplete) {
      this.calibrator.pushToCalibrationArr(angle);
      const result: Promise<number> = new Promise((resolve) => {
        setTimeout(() => {
          this.stageOneComplete = true;
          this.calibrator.calibrationArr = [];
          this.calibrator.calibration_state = 1;
          console.log(
            "stage one complete, flexed threshold is: " +
              this.calibrator.flexed_threshold,
          );
          const flexedThresh = this.calibrator.flexed_threshold;
          resolve(flexedThresh);
        }, 10000);
      });
      return await result;
    }

    if (this.stageOneComplete && !this.stageTwoComplete) {
      this.calibrator.pushToCalibrationArr(angle);

      const result: Promise<number> = new Promise((resolve) => {
        setTimeout(() => {
          this.stageTwoComplete = true;
          console.log(
            "stage 2 complete, relaxed threshold is: " +
              this.calibrator.relaxed_threshold,
          );
          const relaxedThresh = this.calibrator.relaxed_threshold;
          resolve(relaxedThresh);
        }, 10000);
      });

      return await result;
    }

    console.log("Should not be logged");
    return null;
  }
}
