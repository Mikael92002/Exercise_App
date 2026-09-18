import styles from "../css modules/Header.module.css";

const Header = () => {
  return (
    <div className={styles.title_container}>
      <span className={styles.title}>
        Exerc<span className={styles.title_ai}>AI</span>se
      </span>
      <nav className={styles.links}>
        <button>Calibration</button>
        <button>Exercise</button>
      </nav>
    </div>
  );
};

export default Header;
