import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

const vision = await FilesetResolver.forVisionTasks();

const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: "../models/pose_landmarker_lite.task",
  },
  runningMode: "VIDEO",
  outputSegmentationMasks: true,
});
