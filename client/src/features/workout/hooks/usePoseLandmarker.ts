import { useState, useEffect, useRef } from "react";
import type { PoseLandmarker } from "@mediapipe/tasks-vision";
import { createPoseLandmarker } from "../Pose";

export function usePoseLandmarker() {
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      try {
        const landmarker = await createPoseLandmarker();
        if (!isCancelled) {
          landmarkerRef.current = landmarker;
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Failed to initialize PoseLandmarker:", error);
      }
    }

    init();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { landmarkerRef, isLoaded };
}