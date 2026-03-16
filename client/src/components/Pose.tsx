import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

export const createPoseLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );

  return await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "/models/pose_landmarker_lite.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    minPoseDetectionConfidence: 0.7,
    minTrackingConfidence: 0.8,
    minPosePresenceConfidence: 0.8,
  });
};
