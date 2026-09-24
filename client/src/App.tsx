import "./App.css";
import PoseCamController from "./services/PoseCamController";
import Header from "./services/Header";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="app_container">
      <Toaster></Toaster>
      <Header></Header>
      <PoseCamController />
    </div>
  );
}

export default App;
