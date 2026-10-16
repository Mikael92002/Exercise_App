import App from "./App";
import Hero from "./features/workout/components/Hero";
import PoseCamController from "./features/workout/PoseCamController";

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