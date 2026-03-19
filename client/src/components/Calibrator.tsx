// calibration is also a state machine
// used for thresholds
// takes 2 measurements (in bicep curl, for e.g.):
// angle at top of rep
// angle at bottom of rep
// top of rep... must be calculated when angle is narrow like <60 deg?
// bottom of rep calculated when angle is wider >120 deg?
// above calculations take 10 seconds to do
// in the 10 seconds, find the median of the calculations array
// calculations array can't be too big... maybe 100 elements?
// make those the thresholds

import { addToSlidingWindow, findMedian } from "../utils/functions";

export class Calibrator{
    calibrationArr: number[];
    flexed_threshold: number;
    relaxed_threshold: number;
    calibration_state: number;

    constructor(){
        this.calibrationArr = [];
        this.flexed_threshold = -1;
        this.relaxed_threshold = -1;
        this.calibration_state = 0;
    }

    calibrate(){
        if(this.calibration_state === 0){
            this.flexed_threshold = this.calculateThreshold();
        }
        else if(this.calibration_state === 1){
            this.relaxed_threshold = this.calculateThreshold();
        }
    }

    calculateThreshold(){
        return findMedian(this.calibrationArr);
    }

    pushToCalibrationArr(angle: number){
        addToSlidingWindow(angle, this.calibrationArr, 100);
    }
}