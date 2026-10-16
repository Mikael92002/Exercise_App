import { DrawingUtils, PoseLandmarker } from "@mediapipe/tasks-vision";
import type { NormalizedLandmark, Landmark } from "@mediapipe/tasks-vision";
import { filterLandmarksByLandmarks } from "../utils/functions";
import type { ExerciseCalculator } from "../workoutLogic/ExerciseCalculator";
import type { ExerciseLogic } from "../workoutLogic/ExerciseLogic";
import type { FormCorrector } from "../workoutLogic/FormCorrector";

export interface ProcessPoseFrameOptions {
  landmarkArr: NormalizedLandmark[];
  worldLandmarkArr: Landmark[];
  drawingUtils: DrawingUtils;
  exerciseLogic: ExerciseLogic;
  exerciseCalculator: ExerciseCalculator;
  formCorrector: FormCorrector;
  onFormError: (errors: string[]) => void;
  onFormValid: () => void;
  onRepsChange: (reps: number) => void;
  onAngleChange: (angle: number) => void;
}

// frame processor for high performance:
export function processPoseFrame({
  landmarkArr,
  worldLandmarkArr,
  drawingUtils,
  exerciseLogic,
  exerciseCalculator,
  formCorrector,
  onFormError,
  onFormValid,
  onRepsChange,
  onAngleChange,
}: ProcessPoseFrameOptions): void {
  const formCheck = formCorrector.correctForm(landmarkArr);

  if (!formCheck?.result) {
    onFormError(formCheck?.messages ?? []);
    return;
  }

  onFormValid();

  const filteredLandmarkArr = filterLandmarksByLandmarks(
    landmarkArr,
    exerciseCalculator.landmarks as number[]
  );

  const filteredWorldLandmarkArr = filterLandmarksByLandmarks(
    worldLandmarkArr,
    exerciseCalculator.landmarks as number[]
  );

  exerciseLogic.acceptCoordsAndUpdateStateAngle(filteredWorldLandmarkArr);

  onRepsChange(exerciseLogic.reps);
  onAngleChange(exerciseCalculator.filteredSmoothedAngle);

  drawingUtils.drawLandmarks(filteredLandmarkArr, {
    radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
    color: "red",
  });

  drawingUtils.drawConnectors(
    filteredLandmarkArr,
    PoseLandmarker.POSE_CONNECTIONS
  );
}