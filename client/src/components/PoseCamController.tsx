import { PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import ClientWebcam from "./ClientWebcam";
import { useState, useRef, useMemo, useEffect } from "react";
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
import { PoseRender } from "./PoseRender";

Modal.setAppElement("#root");

const PoseCamController = () => {
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // to keep calling main loop:
  // needs to be a ref unlike a "let" in google's official code
  // because setLastVideoTime would cause a re-render:
  const ExerciseCalculatorRef = useRef<ExerciseCalculator | null>(null);
  const ExerciseLogicRef = useRef<ExerciseLogic | null>(null);
  const FormCorrectorRef = useRef<FormCorrector | null>(null);
  const modalIsOpenRef = useRef<boolean>(false);
  const PoseRenderRef = useRef<PoseRender | null>(null);
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
      setIsLoaded(true);
    }
    init();

    // necessary to stop PoseRenderRef
    // when cam turned off or component unmount:
    return () => {
      PoseRenderRef.current?.dispose();
    };
  }, []);

  function closeModal() {
    modalIsOpenRef.current = false;
  }

  function openModal() {
    modalIsOpenRef.current = true;
  }

  // start/finish button clicks:
  useEffect(() => {
    function finishWorkout() {
      PoseRenderRef.current?.dispose();
      ExerciseCalculatorRef.current = null;
      ExerciseLogicRef.current = null;
      FormCorrectorRef.current = null;
    }
    function startWorkout() {
      setDisplayAngle(180);
      setDisplayReps(0);
      setModalErrors([]);
      const exerciseCalc = new ExerciseCalculator("Left Bicep Curl");
      const exerciseLogic = new ExerciseLogic(exerciseCalc);
      const formCorrector = new FormCorrector(exerciseLogic.exercise);
      ExerciseCalculatorRef.current = exerciseLogic.exerciseCalculator;
      ExerciseLogicRef.current = exerciseLogic;
      FormCorrectorRef.current = formCorrector;

      // main loop:
      if (webcamRef.current && landmarkerRef.current && canvasRef.current) {
        PoseRenderRef.current = new PoseRender(
          landmarkerRef.current,
          webcamRef.current,
          canvasRef.current,
        );

        PoseRenderRef.current.start(
          (landmarkArr, worldLandmarkArr, drawingUtils) => {
            const formCheck =
              FormCorrectorRef.current?.correctForm(landmarkArr);

            if (!formCheck?.result) {
              openModal();
              setModalErrors(formCheck?.messages!);
              return;
            }

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

            const newRepCount = ExerciseLogicRef.current?.reps!;
            if (newRepCount !== displayReps) {
              setDisplayReps(newRepCount);
            }

            setDisplayAngle(
              ExerciseCalculatorRef.current?.filteredSmoothedAngle!,
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
          },
        );
      }
    }
    if (camEnabled) {
      startWorkout();
    }
    return () => finishWorkout();
  }, [camEnabled]);

  // enable/disable cam:
  function toggleCam() {
    // poseLandmarker not ready yet/do not do anything:
    if (!landmarkerRef.current) return;
    setCamEnabled(!camEnabled);
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
            {camEnabled ? "FINISH WORKOUT" : "START WORKOUT"}
          </button>
          {camEnabled && (
            <>
              <div className={styles.rep_counter_container}>
                <div className={styles.rep_counter}>Reps: {displayReps}</div>
              </div>
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
