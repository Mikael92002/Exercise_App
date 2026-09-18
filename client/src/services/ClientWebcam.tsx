import styles from "../css modules/Webcam.module.css";
import Webcam from "react-webcam";

const ClientWebcam = ({
  camRef,
  setNoCam,
}: {
  camRef: React.RefObject<Webcam | null>;
  setNoCam: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  return (
    <>
      <Webcam
        ref={camRef}
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
