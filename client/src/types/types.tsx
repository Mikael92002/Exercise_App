import type { Landmark } from "@mediapipe/tasks-vision";

export type KeyType = "Left Bicep Curl";

export type StateType = {
  "angleState 0": number;
  "angleState 2": number;
  "distanceState 0": number;
  "distanceState 2": number
};
export type LandmarkType = Number[];

export type ValueType = {
  states: StateType;
  landmarks: LandmarkType;
};

export type EnumObjType = Record<KeyType, ValueType>;
