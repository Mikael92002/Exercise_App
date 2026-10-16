import styles from "../css modules/FormModal.module.css";
import bicepView from "../assets/bicep view.png"

const FormModal = ({
  errors,
  modalSize,
}: {
  errors: string[];
  modalSize: {
    height: number;
    width: number;
  };
}) => {
  return (
    <div className={styles.modal} style={modalSize}>
      <div className={styles.errors}>
        {errors.map((error) => {
          return <div key={error}>{error}</div>;
        })}
      </div>
    </div>
  );
};

export default FormModal;
