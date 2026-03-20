import { Calibrator } from "./Calibrator";

export class CalibratorLogic {
  calibrator: Calibrator;
  calibrationState: number;
  isCalibrating: boolean;

  constructor() {
    this.calibrator = new Calibrator();
    this.calibrationState = 0;
    this.isCalibrating = false;
  }

  async calibrationLoop(angle: number) {
    if (this.calibrationState === 0) {
      // add angles to calibration array for 5 seconds, then
      // make a calculation:
      this.calibrator.pushToCalibrationArr(angle);
      if (!this.isCalibrating) {
        this.isCalibrating = true;
        this.calibrator.calibrationArr = [];
        const result: Promise<number> = new Promise((resolve) => {
          setTimeout(() => {
            this.calibrationState = 1;
            this.isCalibrating = false;
            resolve(this.calibrator.calculateFlexedThreshold());
          }, 5000);
        });
        return await result;
      }
    } else if (this.calibrationState === 1) {
      this.calibrator.pushToCalibrationArr(angle);
      if (!this.isCalibrating) {
        this.isCalibrating = true;
        this.calibrator.calibrationArr = [];
        const result: Promise<number> = new Promise((resolve) => {
          setTimeout(() => {
            this.calibrationState = 2;
            this.isCalibrating = false;
            resolve(this.calibrator.calculateRelaxedThreshold());
          }, 5000);
        });
        return await result;
      }
    }
  }
}
