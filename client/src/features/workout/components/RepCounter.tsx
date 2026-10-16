interface RepCounterProps {
  reps: number;
}

export const RepCounter = ({ reps }: RepCounterProps) => {
  return (
    <div className="rep_counter_container">
      <div className="rep_counter">Reps: {reps}</div>
    </div>
  );
};