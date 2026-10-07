import styles from "../css modules/Header.module.css";

const Header = () => {
  return (
    <div className={styles.title_container}>
      <span className={styles.title}>
        <a href="/" id={styles.exerciseLink}>Exerc<span className={styles.title_ai}>AI</span>se</a>
      </span>
      <nav className={styles.links}>
        {/* If user not logged in: */}
        <button>Log In</button>
        <button>Sign Up</button>
        {/* If user logged in: */}
      </nav>
    </div>
  );
};

export default Header;
