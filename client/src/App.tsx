import "./App.css";
import Header from "./components/Header";
import { Toaster } from "sonner";
import { Outlet } from "react-router";

function App() {
  return (
    <div className="app_container">
      <Toaster></Toaster>
      <Header></Header>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
