import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

export const vision = await FilesetResolver.forVisionTasks();

export const poseLandmarker = async () => {
  try {
    const toReturn = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "../models/pose_landmarker_lite.task",
      },
      runningMode: "VIDEO",
      outputSegmentationMasks: true,
    });
    return toReturn;
  } catch (e) {
    console.error(e);
    return null;
  }
};
