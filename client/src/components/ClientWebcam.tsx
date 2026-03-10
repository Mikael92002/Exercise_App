import { useMemo, useRef, useState } from "react";
import styles from "../css modules/Webcam.module.css";
import Webcam from "react-webcam";
import { DrawingUtils, PoseLandmarker } from "@mediapipe/tasks-vision";

const ClientWebcam = ({
  camRef,
  setNoCam,
}: {
  camRef: React.RefObject<Webcam | null>;
  setNoCam: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const videoConstraints = {
    width: { min: 480 },
    height: { min: 720 },
    aspectRatio: 0.666666667,
  };
  return (
    <>
      <Webcam
        ref={camRef}
        videoConstraints={videoConstraints}
        width={480}
        height={720}
        className={styles.webcam}
        onUserMediaError={() => {
          console.log("user media error");
          setNoCam(true);
        }}
      ></Webcam>
    </>
  );
};

export default ClientWebcam;
