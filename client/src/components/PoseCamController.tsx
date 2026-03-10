import { DrawingUtils } from "@mediapipe/tasks-vision";
import ClientWebcam from "./ClientWebcam";
import { poseLandmarker, vision } from "./Pose";
import { useState, useRef, useMemo } from "react";
import Webcam from "react-webcam";

const PoseCamController = () => {
  const [noCam, setNoCam] = useState<boolean>(false);
  const [camEnabled, setCamEnabled] = useState(false);

  const webcamRef = useRef<Webcam | null>(null);
  const canvasCtx = webcamRef.current?.getCanvas()?.getContext("2d");
  const drawingUtils = new DrawingUtils(canvasCtx!);

  const hasGetUserMedia = useMemo(
    () => !!navigator.mediaDevices?.getUserMedia,
    [],
  );

  if (!hasGetUserMedia) {
    setNoCam(true);
  }

  function enableCam(event) {
    if (!poseLandmarker) {
      console.log("Wait! PoseLandmarker not loaded yet");
      return;
    }
  }

  return (
    <>
      {noCam ? (
        <>
          User did not allow camera permissions. Reload browser to reset
          permissions.
        </>
      ) : (
        <>
        <button onClick={() => setCamEnabled(!camEnabled)}>
            {camEnabled && <>Disable Cam</>}
            {!camEnabled && <>Enable Cam</>}
          </button>
          {camEnabled ? (
            <ClientWebcam camRef={webcamRef} setNoCam={setNoCam}></ClientWebcam>
          ) : (
            <></>
          )}
          
        </>
      )}
    </>
  );
};

export default PoseCamController;