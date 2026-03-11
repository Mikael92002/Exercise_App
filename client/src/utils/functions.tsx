import type { EnumObjType } from "../types/types";

export function ExerciseEnum() {
  const enumObj: EnumObjType = {
    "Left Bicep Curl": {
      states: { "state 0": 175, "state 2": 60 },
      landmarks: [12, 14, 16],
    },
  } as const;
  return enumObj;
}
