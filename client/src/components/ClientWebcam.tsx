import styles from "../css modules/Webcam.module.css";
import Webcam from "react-webcam";

const ClientWebcam = ({
  camRef,
  setNoCam,
}: {
  camRef: React.RefObject<Webcam | null>;
  setNoCam: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  
  // const webCamStyle = {
  //   position: "absolute" as const,
  //   top: 0,
  //   left: 0,
  //   width: "100%",
  //   height: "100%",
  // };

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
