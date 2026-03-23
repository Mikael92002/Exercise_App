import { Calibrator } from "./Calibrator";

export class CalibratorLogic {
  calibrator: Calibrator;
  calibrationState: number;
  isCalibrating: boolean;

  static calibrationEnum = {
    RESTING: 0,
    FLEXED: 1,
    COMPLETE: 2,
  };

  constructor() {
    this.calibrator = new Calibrator();
    this.calibrationState = CalibratorLogic.calibrationEnum.RESTING;
    this.isCalibrating = false;
  }

  async calibrationLoop(angle: number): Promise<number | null> {
    switch (this.calibrationState) {
      case CalibratorLogic.calibrationEnum.RESTING: {
        this.calibrator.pushToCalibrationArr(angle);
        const result: Promise<number | null> = this.checkAndMoveState(
          CalibratorLogic.calibrationEnum.FLEXED,
          () => this.calibrator.calculateRelaxedThreshold(),
        );
        return await result;
      }
      case CalibratorLogic.calibrationEnum.FLEXED: {
        this.calibrator.pushToCalibrationArr(angle);
        const result: Promise<number | null> = this.checkAndMoveState(
          CalibratorLogic.calibrationEnum.COMPLETE,
          () => this.calibrator.calculateFlexedThreshold(),
        );
        return await result;
      }
      default:
        return null;
    }
  }

  async calibratorPromise(
    nextState: number,
    calculation: () => number,
  ): Promise<number> {
    const result: Promise<number> = new Promise((resolve) => {
      setTimeout(() => {
        this.calibrationState = nextState;
        this.isCalibrating = false;
        this.calibrator.calibrationArr = [];
        resolve(calculation());
      }, 5000);
    });

    return await result;
  }

  async checkAndMoveState(
    nextState: number,
    calculation: () => number,
  ): Promise<number | null> {
    if (!this.isCalibrating) {
      this.isCalibrating = true;
      const result: Promise<number> = this.calibratorPromise(
        nextState,
        calculation,
      );
      return result;
    }
    return null;
  }
}
