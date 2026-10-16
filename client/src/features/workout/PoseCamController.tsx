import Modal from "react-modal";
import DropdownMenu from "./components/Dropdown";
import "./css/PoseCamController.css";
import { useCameraAvailability } from "./hooks/useCameraAvailability";
import { usePoseLandmarker } from "./hooks/usePoseLandmarker";
import { useWorkoutSession } from "./hooks/useWorkoutSession";
import { WorkoutWorkspace } from "./components/WorkoutWorkspace";

Modal.setAppElement("#root");

const PoseCamController = () => {
  const { noCam, setNoCam } = useCameraAvailability();
  const { landmarkerRef, isLoaded } = usePoseLandmarker();

  const {
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
  } = useWorkoutSession({ landmarkerRef });

  return (
    <div className="main_container">
      {!isLoaded && <p>Loading poseLandmarker</p>}
      {noCam ? (
        <p>No camera access found.</p>
      ) : (
        <>
          {!camEnabled && (
            <DropdownMenu exercise={exercise} setExercise={setExercise} />
          )}
          <div className="workout_container">
            <button onClick={toggleCam} className="startButton">
              {camEnabled ? "FINISH WORKOUT" : "START WORKOUT"}
            </button>
            {camEnabled && (
              <WorkoutWorkspace
                webcamRef={webcamRef}
                canvasRef={canvasRef}
                setNoCam={setNoCam}
                reps={displayReps}
                angle={displayAngle}
                sweetSpot={sweetSpot}
                isModalOpen={isModalOpen}
                modalErrors={modalErrors}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PoseCamController;