import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { ExerciseCalculator } from "../src/components/ExerciseCalculator";
import { beforeEach, jest, test, describe, it, expect } from "@jest/globals";
import { addToSlidingWindow, movingAverage, findMedian } from "../src/utils/functions";

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
    const distances = calc.calculateDistances(mockLandmarks);
    expect(distances[0]).toBeCloseTo(0.3);
    expect(distances[1]).toBeCloseTo(0.2);
    expect(distances[2]).toBeCloseTo(0.5);
  });

  it("should calculate the correct angle", () => {
    calc.calculateDistances(mockLandmarks);
    const angle = calc.calculateAngle();
    expect(angle).toBe(180);
  });

  it("should have correct state object key-values", () => {
    expect(calc.states).toHaveProperty("state 0");
    expect(calc.states).toHaveProperty("state 2");
    expect(calc.states["state 0"]).toBe(160);
    expect(calc.states["state 2"]).toBe(50);
  });
});

describe("filter tests", () => {
  it("should find the median in an array", () => {
    const evenArr = [6, 12, 9, 3, 18, 15];
    expect(findMedian(evenArr)).toBe(10.5);
    const oddArr = [6, 12, 9, 18, 3];
    expect(findMedian(oddArr)).toBe(9);
    const singleElemArr = [1];
    expect(findMedian(singleElemArr)).toBe(1);
    const doubleElemArr = [1, 4];
    expect(findMedian(doubleElemArr)).toBe(2.5);
  });

  const globalArr = [13, 15, 12, 16];
  it("should not mutate global array", () => {
    findMedian(globalArr);
    expect(globalArr).toEqual([13, 15, 12, 16]);
  });

  it("should build up a sliding window from length 0 to max length 5", () => {
    const incomingData = [10, 19, 16, 22, 20, 21, 25, 28, 26, 30];

    const slidingWindow: number[] = [];
    for (let i = 0; i < incomingData.length; i++) {
      addToSlidingWindow(incomingData[i], slidingWindow);
      if (i === 0) {
        expect(slidingWindow.length).toBe(1);
      }
      if (i === 1) {
        expect(slidingWindow.length).toBe(2);
      }
      if (i === 4) {
        expect(slidingWindow.length).toBe(5);
      }
      if (i === 6) {
        expect(slidingWindow.length).toBe(5);
      }
    }
    expect(slidingWindow.length).toBe(5);
    expect(slidingWindow[0]).toBe(21);
    expect(slidingWindow[4]).toBe(30);
  });

  it("should provide a correct median filter", () => {
    const incomingData = [10, 19, 16, 22, 20, 21, 25, 28, 26, 30];

    const slidingWindow: number[] = [];
    for (let i = 0; i < incomingData.length; i++) {
      addToSlidingWindow(incomingData[i], slidingWindow);
      const median = findMedian(slidingWindow);
      if (i === 0) {
        expect(median).toBe(10);
      }
      if (i === 3) {
        expect(median).toBe(17.5);
      }
      if (i === 4) {
        expect(median).toBe(19);
      }
      if (i === 9) {
        expect(median).toBe(26);
      }
    }
    expect(findMedian(slidingWindow)).toBe(26);
  });
});

describe("smoothing tests", ()=>{
  it("Should output the correct simple moving average at each index", ()=>{
    const incomingData = [10, 19, 16, 22, 20, 21, 25, 28, 26, 30];
    const slidingWindow: number[] = [];
    let lastAvg = 0;
    for(let i = 0;i<incomingData.length;i++){
      addToSlidingWindow(incomingData[i], slidingWindow);
      lastAvg = movingAverage(slidingWindow, lastAvg, incomingData[i]);
      if(i === 0){
        expect(lastAvg).toBe(10);
      }
      if(i === 1){
        expect(lastAvg).toBe(14.5);
      }
      if(i === 2){
        expect(lastAvg).toBe(15);
      }
      // if(i === 4){
      //   expect(lastAvg).toBe(17.4);
      // }
      // exponentialMovingAverage starts:
    }
  })
})