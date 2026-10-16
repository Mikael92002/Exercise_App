import { useState, useRef, useEffect, useCallback } from "react";
import type Webcam from "react-webcam";
import { toast } from "sonner";
import type { PoseLandmarker } from "@mediapipe/tasks-vision";
import type { ExerciseType } from "../types/types";
import { ExerciseCalculator } from "../workoutLogic/ExerciseCalculator";
import { ExerciseLogic } from "../workoutLogic/ExerciseLogic";
import { FormCorrector } from "../workoutLogic/FormCorrector";
import { PoseRender } from "../workoutLogic/PoseRender";
import { processPoseFrame } from "../services/poseFrameProcessor";

interface UseWorkoutSessionOptions {
  landmarkerRef: React.RefObject<PoseLandmarker | null>;
}

export function useWorkoutSession({ landmarkerRef }: UseWorkoutSessionOptions) {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const exerciseCalculatorRef = useRef<ExerciseCalculator | null>(null);
  const exerciseLogicRef = useRef<ExerciseLogic | null>(null);
  const formCorrectorRef = useRef<FormCorrector | null>(null);
  const poseRenderRef = useRef<PoseRender | null>(null);
  const modalIsOpenRef = useRef<boolean>(false);

  const [exercise, setExercise] = useState<ExerciseType | "">("");
  const [camEnabled, setCamEnabled] = useState<boolean>(false);
  const [displayReps, setDisplayReps] = useState<number>(0);
  const [displayAngle, setDisplayAngle] = useState<number>(180);
  const [modalErrors, setModalErrors] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sweetSpot, setSweetSpot] = useState<any>(undefined);

  const handleFormError = useCallback((messages: string[]) => {
    if (!modalIsOpenRef.current) {
      modalIsOpenRef.current = true;
      setIsModalOpen(true);
    }
    setModalErrors(messages);
  }, []);

  const handleFormValid = useCallback(() => {
    if (modalIsOpenRef.current) {
      modalIsOpenRef.current = false;
      setIsModalOpen(false);
    }
  }, []);

  const handleRepsChange = useCallback((newRepCount: number) => {
    setDisplayReps((prevRep) => (newRepCount !== prevRep ? newRepCount : prevRep));
  }, []);

  const handleAngleChange = useCallback((newAngle: number) => {
    setDisplayAngle((prevAngle) => (newAngle !== prevAngle ? newAngle : prevAngle));
  }, []);

  const finishWorkout = useCallback(() => {
    poseRenderRef.current?.dispose();
    poseRenderRef.current = null;
    exerciseCalculatorRef.current = null;
    exerciseLogicRef.current = null;
    formCorrectorRef.current = null;
    setSweetSpot(undefined);
  }, []);

  const startWorkout = useCallback(() => {
    setDisplayAngle(180);
    setDisplayReps(0);
    setModalErrors([]);
    setIsModalOpen(false);
    modalIsOpenRef.current = false;

    if (!exercise) return;

    const exerciseCalc = new ExerciseCalculator(exercise);
    const exerciseLogic = new ExerciseLogic(exerciseCalc);
    const formCorrector = new FormCorrector(exerciseLogic.exercise);

    exerciseCalculatorRef.current = exerciseLogic.exerciseCalculator;
    exerciseLogicRef.current = exerciseLogic;
    formCorrectorRef.current = formCorrector;
    setSweetSpot(exerciseCalc.states["angleState 2"]);

    if (webcamRef.current && landmarkerRef.current && canvasRef.current) {
      poseRenderRef.current = new PoseRender(
        landmarkerRef.current,
        webcamRef.current,
        canvasRef.current
      );

      poseRenderRef.current.start((landmarkArr, worldLandmarkArr, drawingUtils) => {
        if (
          !exerciseCalculatorRef.current ||
          !exerciseLogicRef.current ||
          !formCorrectorRef.current
        ) {
          return;
        }

        processPoseFrame({
          landmarkArr,
          worldLandmarkArr,
          drawingUtils,
          exerciseLogic: exerciseLogicRef.current,
          exerciseCalculator: exerciseCalculatorRef.current,
          formCorrector: formCorrectorRef.current,
          onFormError: handleFormError,
          onFormValid: handleFormValid,
          onRepsChange: handleRepsChange,
          onAngleChange: handleAngleChange,
        });
      });
    }
  }, [
    exercise,
    landmarkerRef,
    handleFormError,
    handleFormValid,
    handleRepsChange,
    handleAngleChange,
  ]);

  useEffect(() => {
    if (camEnabled) {
      startWorkout();
    }
    return () => {
      finishWorkout();
    };
  }, [camEnabled, startWorkout, finishWorkout]);

  // Cleanup on unmount:
  useEffect(() => {
    return () => {
      poseRenderRef.current?.dispose();
    };
  }, []);

  const toggleCam = () => {
    if (!landmarkerRef.current) return;
    if (!exercise) {
      toast.error("Please choose an exercise!", {
        className: "error_toast",
      });
      return;
    }
    setCamEnabled((prev) => !prev);
  };

  return {
    exercise,
    setExercise,
    camEnabled,
    toggleCam,
    webcamRef,
    canvasRef,
    displayReps,
    displayAngle,
    sweetSpot,
    isModalOpen,
    modalErrors,
  };
}