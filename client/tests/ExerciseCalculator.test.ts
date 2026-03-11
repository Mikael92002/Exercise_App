import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { ExerciseCalculator } from "../src/components/ExerciseCalculator";
import { beforeEach, jest, test, describe, it, expect } from "@jest/globals";

describe("ExerciseCalculator tests", () => {
  let calc: ExerciseCalculator;
  let mockLandmarks: NormalizedLandmark[];
  beforeEach(() => {
    calc = new ExerciseCalculator("Left Bicep Curl");
    mockLandmarks = [
      { x: 0.5, y: 0.5, z: 0, visibility: 0 },
      { x: 0.5, y: 0.8, z: 0, visibility: 0 },
      { x: 0.5, y: 1.0, z: 0, visibility: 0 },
    ];
  });

  it("should calculate the correct distances", () => {
    const distances = calc.getDistances(mockLandmarks);
    expect(distances[0]).toBeCloseTo(0.3);
    expect(distances[1]).toBeCloseTo(0.19);
    expect(distances[2]).toBeCloseTo(0.5);
  });

  it("should calculate the correct angle", () => {
    const angle = calc.getAngle(calc.getDistances(mockLandmarks));
    expect(angle).toBe(180);
  });
});
