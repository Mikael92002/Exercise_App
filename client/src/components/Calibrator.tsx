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

export class Calibrator{
    
}