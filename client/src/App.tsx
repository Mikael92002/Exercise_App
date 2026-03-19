import "./App.css";
import PoseCamController from "./components/PoseCamController";
import Header from "./components/Header";

function App() {
  return (
    <div className="app_container">
      <Header></Header>
      <PoseCamController />
    </div>
  );
}

export default App;
