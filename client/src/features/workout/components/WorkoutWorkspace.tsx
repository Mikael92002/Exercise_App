import type { RefObject } from "react";
import type Webcam from "react-webcam";
import ClientWebcam from "../ClientWebcam";
import RepMachine from "../RepMachine";
import FormModal from "../FormModal";
import { RepCounter } from "./RepCounter";

interface WorkoutWorkspaceProps {
  webcamRef: RefObject<Webcam | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  setNoCam: React.Dispatch<React.SetStateAction<boolean>>
  reps: number;
  angle: number;
  sweetSpot: any;
  isModalOpen: boolean;
  modalErrors: string[];
}

export const WorkoutWorkspace = ({
  webcamRef,
  canvasRef,
  setNoCam,
  reps,
  angle,
  sweetSpot,
  isModalOpen,
  modalErrors,
}: WorkoutWorkspaceProps) => {
  const modalSizingStyle = {
    height: webcamRef.current?.video?.videoHeight || 0,
    width: webcamRef.current?.video?.videoWidth || 0,
  };

  return (
    <>
      <RepCounter reps={reps} />
      <div className="action_container">
        <div className="webcam_canvas_container">
          <ClientWebcam camRef={webcamRef} setNoCam={setNoCam} />
          <canvas ref={canvasRef} />
          <RepMachine angle={angle} sweetSpot={sweetSpot} />
          {isModalOpen && (
            <FormModal modalSize={modalSizingStyle} errors={modalErrors} />
          )}
        </div>
        <div className="state_display_container" />
      </div>
    </>
  );
};