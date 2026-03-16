import { PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import ClientWebcam from "./ClientWebcam";
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { createPoseLandmarker } from "./Pose";
import styles from "../css modules/PoseCamController.module.css";
import { ExerciseCalculator } from "./ExerciseCalculator";
import { ExerciseLogic } from "./ExerciseLogic";
import { filterLandmarksByLandmarks } from "../utils/functions";
import RepMachine from "./RepMachine";
import { FormCorrector } from "./FormCorrector";
import FormModal from "./FormModal";
import Modal from "react-modal";

Modal.setAppElement("#root");

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
  const FormCorrectorRef = useRef<FormCorrector | null>(null);
  const modalIsOpenRef = useRef<boolean>(false);
  // track landmarker loading:
  const [isLoaded, setIsLoaded] = useState(false);
  const [noCam, setNoCam] = useState<boolean>(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const [displayReps, setDisplayReps] = useState(0);
  const [displayAngle, setDisplayAngle] = useState(180);
  const [modalErrors, setModalErrors] = useState<string[]>([]);

  const sweetSpot = useMemo(() => {
    return ExerciseCalculatorRef.current?.states["angleState 2"];
  }, [ExerciseCalculatorRef.current?.states["angleState 2"]]);
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
      const formCorrector = new FormCorrector(
        exerciseLogic.exercise,
      );
      ExerciseCalculatorRef.current = exerciseLogic.exerciseCalculator;
      ExerciseLogicRef.current = exerciseLogic;
      FormCorrectorRef.current = formCorrector;
      setIsLoaded(true);
    }
    init();

    // necessary to stop poseLandmarker
    // when cam turned off or component unmount:
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  function closeModal() {
    modalIsOpenRef.current = false;
  }

  function openModal() {
    modalIsOpenRef.current = true;
  }

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

            const formCheck =
              FormCorrectorRef.current?.correctForm(landmarkArr);

            if (formCheck?.result) {
              if (modalIsOpenRef.current) {
                closeModal();
              }
              const filteredLandmarkArr = filterLandmarksByLandmarks(
                landmarkArr,
                [11, 13, 15],
              );
              const filteredWorldLandmarkArr = filterLandmarksByLandmarks(
                worldLandmarkArr,
                [11, 13, 15, 12, 14, 16],
              );

              ExerciseLogicRef.current?.acceptCoordsAndUpdateStateAngle(
                filteredWorldLandmarkArr,
              );

              const newRepCount = ExerciseLogicRef.current?.reps;
              if (newRepCount !== displayReps) {
                setDisplayReps(newRepCount!);
              }

              setDisplayAngle(
                ExerciseCalculatorRef.current?.filteredSmoothedAngle!,
              );

              // console.log(
              //   `landmark Z: ${filteredLandmarkArr[2].z}.
              //   worldLandmark Z: ${filteredWorldLandmarkArr[2].z}`,
              // );
              console.log(
                `filtered: ${ExerciseCalculatorRef.current?.filteredSmoothedAngle}`,
              );

              drawingUtils.drawLandmarks(filteredLandmarkArr, {
                radius: (data) =>
                  DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
                color: "red",
              });
              drawingUtils.drawConnectors(
                filteredLandmarkArr,
                PoseLandmarker.POSE_CONNECTIONS,
              );
            } else {
              openModal();
              setModalErrors(formCheck?.messages!);
            }
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

  const modalSizingStyle = {
    height: webcamRef.current?.video?.videoHeight || 0,
    width: webcamRef.current?.video?.videoWidth || 0,
  };

  return (
    <div className={styles.main_container}>
      {!isLoaded && <p>Loading poseLandmarker</p>}
      {noCam ? (
        <p>No camera access found.</p>
      ) : (
        <>
          <button onClick={toggleCam} className={styles.startButton}>
            {camEnabled ? "Finish Workout" : "Start Workout"}
          </button>
          {camEnabled && (
            <>
              <div className={styles.rep_counter}>Reps: {displayReps}</div>
              <div className={styles.action_container}>
                <div className={styles.webcam_canvas_container}>
                  <ClientWebcam camRef={webcamRef} setNoCam={setNoCam} />
                  <canvas ref={canvasRef}></canvas>
                  <RepMachine
                    angle={displayAngle}
                    sweetSpot={sweetSpot}
                  ></RepMachine>
                  {modalIsOpenRef.current && (
                    <FormModal
                      modalSize={modalSizingStyle}
                      errors={modalErrors}
                    ></FormModal>
                  )}
                </div>
                <div className={styles.state_display_container}></div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PoseCamController;
