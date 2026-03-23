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
        return result;
      }
      case CalibratorLogic.calibrationEnum.FLEXED: {
        this.calibrator.pushToCalibrationArr(angle);
        const result: Promise<number | null> = this.checkAndMoveState(
          CalibratorLogic.calibrationEnum.COMPLETE,
          () => this.calibrator.calculateFlexedThreshold(),
        );
        return result;
      }
      default:
        return null;
    }
  }

  calibratorPromise(
    nextState: number,
    calculation: () => number,
  ): Promise<number> {
    const result: Promise<number> = new Promise<number>((resolve) => {
      setTimeout(() => {
        const val = calculation();
        this.calibrationState = nextState;
        this.isCalibrating = false;
        resolve(val);
      }, 5000);
    });

    return result;
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
