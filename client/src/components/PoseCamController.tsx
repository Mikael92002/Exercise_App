import {
  PoseLandmarker,
  DrawingUtils,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import ClientWebcam from "./ClientWebcam";
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { createPoseLandmarker } from "./Pose";
import styles from "../css modules/PoseCamController.module.css";

const PoseCamController = () => {
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // to keep calling main loop:
  const animationRef = useRef<number>(0);
  // needs to be a ref unlike a "let" in google's official code
  // because setLastVideoTime would cause a re-render:
  const lastVideoTimeRef = useRef<number>(-1);
  // track landmarker loading:
  const [isLoaded, setIsLoaded] = useState(false);
  const [noCam, setNoCam] = useState<boolean>(false);
  const [camEnabled, setCamEnabled] = useState(false);

  // need to run only once to determine if user has permissions:
  const hasGetUserMedia = useMemo(
    () => !!navigator.mediaDevices?.getUserMedia,
    [],
  );

  useEffect(() => {
    if (!hasGetUserMedia) setNoCam(true);
  }, [hasGetUserMedia]);

  // poseLandmarker initialization:
  useEffect(() => {
    async function init() {
      const landMarker = await createPoseLandmarker();
      landmarkerRef.current = landMarker;
      setIsLoaded(true);
    }
    init();

    // necessary to stop poseLandmarker
    // when cam turned off or component unmount:
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // main loop:
  const predictWebcam = useCallback(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    // video.readyState >=2 needed because
    // 2 means video has enough data to play
    if (video && canvas && landmarkerRef.current && video.readyState >= 2) {
      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      const canvasCtx = canvas.getContext("2d");

      // video.currentTime statement needed to prevent duplicate
      // processing:
      if (canvasCtx && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const drawingUtils = new DrawingUtils(canvasCtx);

        const results = landmarkerRef.current.detectForVideo(
          video,
          performance.now(),
        );

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        //results.landmarks = [[33 landmark objs]]
        // landmark = [33 landmark objs]
        if (results.landmarks) {
          for (const landmark of results.landmarks) {
            const filteredArr = filterLandmarks(landmark, 0.75);

            drawingUtils.drawLandmarks(filteredArr, {
              radius: (data) =>
                DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
              color: "red",
            });
            drawingUtils.drawConnectors(
              landmark,
              PoseLandmarker.POSE_CONNECTIONS,
            );
          }
        }
        canvasCtx.restore();
        // results.landmarks contains:
        // {landmarks: [[[33 landmark objs]]],
        // worldLandmarks: [[[33 landmark objs]]]}
      }
    }

    animationRef.current = requestAnimationFrame(predictWebcam);
  }, []);

  // enable/disable cam:
  function toggleCam() {
    // poseLandmarker not ready yet/do not do anything:
    if (!landmarkerRef.current) return;

    // toggle cam:
    const nextState = !camEnabled;
    setCamEnabled(nextState);

    // if cam enabled, give some time for vid to start:
    if (nextState) {
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(predictWebcam);
      }, 500);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  }

  function filterLandmarks(
    landmarks: NormalizedLandmark[],
    targetVisibility: number,
  ) {
    const filteredArr: NormalizedLandmark[] = [];
    for (const landmark of landmarks) {
      if (landmark.visibility >= targetVisibility) {
        filteredArr.push(landmark);
      }
    }
    return filteredArr;
  }

  return (
    <div className={styles.main_container}>
      {!isLoaded && <p>Loading poseLandmarker</p>}
      {noCam ? (
        <p>No camera access found.</p>
      ) : (
        <>
          <button onClick={toggleCam}>
            {camEnabled ? "Disable Cam" : "Enable Cam"}
          </button>
          {camEnabled && (
            <div className={styles.webcam_canvas_container}>
              <div>
                <ClientWebcam camRef={webcamRef} setNoCam={setNoCam} />
                <canvas ref={canvasRef}></canvas>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PoseCamController;
