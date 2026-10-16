import type { EnumObjType } from "../types/types";

export const exerciseEnum: EnumObjType = {
    "Bicep Curl": {
      // mod thresholds when right arm is visible:
      // 12, 14, 16: set angleState 0 to 140, angleState 2 to 105...
      states: {
        "angleState 0": 140,
        "angleState 2": 75,
      },
      landmarks: [11, 13, 15],
    },
    "Push Up": {
      states: {
        "angleState 0": 160,
        "angleState 2": 55,
      },
      landmarks: [11, 13, 15]
    },
    "Squat": {
      states: {
        "angleState 0": 160,
        "angleState 2": 60,
      },
      landmarks: [23, 25, 27]
    }
  }