import styles from "../css modules/RepMachine.module.css";

const RepMachine = ({
  angle,
  distance,
}: {
  angle: number;
  distance?: number;
}) => {
  // 160 is placeholder, replace with max threshold of current exercise
  const angleAsMultiplier = angle / 180;
  // 200 is placeholder, replace with responsive height of .main_container:
  const angleTopValue = 180 - angleAsMultiplier * 180;

  const stateBarStyle = {
    top: `${angleTopValue}px`,
  };
  //   Programatically select:
  const sweetSpotBarStyle = {
    top: `150px`,
  };
  return (
    <div className={styles.main_container}>
      <div className={styles.state_bar} style={stateBarStyle}></div>
      <div className={styles.sweet_spot_bar} style={sweetSpotBarStyle}></div>
    </div>
  );
};

export default RepMachine;
