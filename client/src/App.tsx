import "./App.css";
import PoseCamController from "./services/PoseCamController";
import Header from "./services/Header";

function App() {
  return (
    <div className="app_container">
      <Header></Header>
      <PoseCamController />
    </div>
  );
}

export default App;
