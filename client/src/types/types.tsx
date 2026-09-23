export type ExerciseType = "Left Bicep Curl" | "Push Up" | "Squat"; /*| "Pushup" | "Right Bicep Curl"*/

export type StateType = {
  "angleState 0": number;
  "angleState 2": number;
};
export type LandmarkType = Number[];

export type ValueType = {
  states: StateType;
  landmarks: LandmarkType;
};

export type EnumObjType = Record<ExerciseType, ValueType>;
