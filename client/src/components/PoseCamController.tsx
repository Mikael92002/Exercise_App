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
import { ExerciseCalculator } from "./ExerciseCalculator";
import { ExerciseLogic } from "./ExerciseLogic";
import { addToSlidingWindow } from "../utils/functions";
import RepMachine from "./RepMachine";

const PoseCamController = () => {
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // to keep calling main loop:
  const animationRef = useRef<number>(0);
  // needs to be a ref unlike a "let" in google's official code
  // because setLastVideoTime would cause a re-render:
  const lastVideoTimeRef = useRef<number>(-1);
  const ExerciseCalculatorRef = useRef<ExerciseCalculator | null>(null);
  const ExerciseLogicRef = useRef<ExerciseLogic | null>(null);
  const slidingWindow = useRef<number[]>([]);
  // track landmarker loading:
  const [isLoaded, setIsLoaded] = useState(false);
  const [noCam, setNoCam] = useState<boolean>(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const [displayReps, setDisplayReps] = useState(0);
  const [displayAngle, setDisplayAngle] = useState(180);
  const [displayDistance, setDisplayDistance] = useState(1);

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
      const exerciseCalc = new ExerciseCalculator("Left Bicep Curl");
      const exerciseLogic = new ExerciseLogic(exerciseCalc);
      ExerciseCalculatorRef.current = exerciseCalc;
      ExerciseLogicRef.current = exerciseLogic;
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

        // landmark = [33 landmark objs]
        if (results.landmarks) {
          for (let i = 0; i < results.landmarks.length; i++) {
            const landmarkArr = results.landmarks[i];
            const worldLandmarkArr = results.worldLandmarks[i];

            const filteredLandmarkArr = filterLandmarksByLandmarks(
              landmarkArr,
              [11, 13, 15],
            );
            const filteredWorldLandmarkArr = filterLandmarksByLandmarks(
              worldLandmarkArr,
              [11, 13, 15],
            );
            if (checkLandmarkVisibilityByThreshold(filteredLandmarkArr, 0.8)) {
              ExerciseCalculatorRef.current?.calculateDistances(
                filteredLandmarkArr,
              );
              // const unfilteredRatio =
              //   ExerciseCalculatorRef.current?.calculateWristShoulderRatio(
              //     filteredWorldLandmarkArr,
              //   );
              // raw angle:
              const angle = ExerciseCalculatorRef.current?.calculateAngle();

              // add to global sliding window:
              addToSlidingWindow(angle!, slidingWindow.current);
              // addToSlidingWindow(unfilteredRatio!, slidingWindow.current);

              ExerciseCalculatorRef.current?.filterAndSmoothAngle(
                slidingWindow.current,
              );
              // ExerciseCalculatorRef.current?.filterAndSmoothDistance(
              //   slidingWindow.current,
              // );

              // state machine:
              ExerciseLogicRef.current?.stateUpdateLoopAngle();
              // ExerciseLogicRef.current?.stateUpdateLoopDistance();

              const newRepCount = ExerciseLogicRef.current?.reps;
              if (newRepCount !== displayReps) {
                setDisplayReps(newRepCount!);
              }
              setDisplayAngle(
                ExerciseCalculatorRef.current?.filteredSmoothedAngle!,
              );
              // setDisplayDistance(
              //   ExerciseCalculatorRef.current?.filteredSmoothedDistance!,
              // );

              // console.log(
              //   `landmark Z: ${filteredLandmarkArr[2].z}.
              //   worldLandmark Z: ${filteredWorldLandmarkArr[2].z}`,
              // );
              console.log(
                `filtered: ${ExerciseCalculatorRef.current?.filteredSmoothedAngle}`,
              );
              console.log(ExerciseLogicRef.current?.state);
            }

            drawingUtils.drawLandmarks(filteredLandmarkArr, {
              radius: (data) =>
                DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
              color: "red",
            });
            drawingUtils.drawConnectors(
              filteredLandmarkArr,
              PoseLandmarker.POSE_CONNECTIONS,
            );
          }
        }
        canvasCtx.restore();
        // results contains:
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

  function filterLandmarksByVisibility(
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

  function filterLandmarksByLandmarks(
    landmarks: NormalizedLandmark[],
    targetLandmarks: number[],
  ) {
    const filteredArr: NormalizedLandmark[] = [];
    for (let i = 0; i < targetLandmarks.length; i++) {
      filteredArr.push(landmarks[targetLandmarks[i]]);
    }
    return filteredArr;
  }

  function checkLandmarkVisibilityByThreshold(
    landmarks: NormalizedLandmark[],
    targetVisibility: number,
  ) {
    for (let landmark of landmarks) {
      if (landmark.visibility < targetVisibility) {
        return false;
      }
    }
    return true;
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.rep_counter}>Reps: {displayReps}</div>
      {!isLoaded && <p>Loading poseLandmarker</p>}
      {noCam ? (
        <p>No camera access found.</p>
      ) : (
        <>
          <button onClick={toggleCam}>
            {camEnabled ? "Disable Cam" : "Enable Cam"}
          </button>
          {camEnabled && (
            <div className={styles.action_container}>
              <div className={styles.webcam_canvas_container}>
                <ClientWebcam camRef={webcamRef} setNoCam={setNoCam} />
                <canvas ref={canvasRef}></canvas>
                <RepMachine angle={displayAngle}></RepMachine>
              </div>
              <div className={styles.state_display_container}>
                <button onClick={() => console.log(displayAngle)}>
                  disp angle
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PoseCamController;
