import { HERO_CATCHPHRASES } from "../utils/constants";
import pushup from "../assets/pushup view.png";
import calibration from "../assets/calibration view.png";
import "../css/hero.css"

const randomCatchphrase = HERO_CATCHPHRASES[Math.floor(Math.random() * HERO_CATCHPHRASES.length)]

const Hero = () => {
    // If user signed in,
    // "Welcome guest!" should be replaced with username
    return (
        <div className="hero-container">
            <h1 className="greeting">Welcome, guest!</h1>
            <h2 className="random-tagline">{randomCatchphrase}</h2>
            <div className="selection-grid">
                <a href="/exercise">
                <h3>Exercise</h3>
                <img src={pushup} alt="workout" className="grid-img"/>
                </a>
                <a href="/">
                <h3>Calibration</h3>
                <img src={calibration} alt="calibration" className="grid-img"/>
                </a>
            </div>
        </div>
    )
}

export default Hero;