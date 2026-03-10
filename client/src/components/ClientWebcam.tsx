import styles from "../css modules/Webcam.module.css";
import Webcam from "react-webcam";

const ClientWebcam = () => {
  const videoConstraints = {
    width: { min: 480 },
    height: { min: 720 },
    aspectRatio: 0.666666667,
  };
  return (
    <Webcam
      videoConstraints={videoConstraints}
      width={480}
      height={720}
      className={styles.webcam}
    ></Webcam>
  );
};

export default ClientWebcam;
