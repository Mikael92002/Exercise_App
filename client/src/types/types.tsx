import type { Landmark } from "@mediapipe/tasks-vision";

export type KeyType = "Left Bicep Curl";

export type StateType = {
  "state 0": number;
  "state 2": number;
};
export type LandmarkType = Number[];

export type ValueType = {
  states: StateType;
  landmarks: LandmarkType;
};

export type EnumObjType = Record<KeyType, ValueType>;
