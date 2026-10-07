import App from "./App";
import Hero from "./components/Hero";
import PoseCamController from "./services/PoseCamController";

const routes = [{
    path: "/",
    Component: App,
    children: [
        {
            index: true,
            Component: Hero,
        },
        {
            path: "/exercise",
            Component: PoseCamController,
        }
    ]
}]

export default routes;