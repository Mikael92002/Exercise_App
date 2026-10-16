import { DrawingUtils, type NormalizedLandmark, type PoseLandmarker } from "@mediapipe/tasks-vision";
import type Webcam from "react-webcam";

export class PoseRender{
landmarkRef: PoseLandmarker
webcamRef: Webcam
canvasRef: HTMLCanvasElement
animationRef: number
lastVideoTimeRef: number
#onResult?: (landmarkArr: NormalizedLandmark[], worldLandmarkArr: NormalizedLandmark[], drawingUtils: DrawingUtils) => void // pass in exercise/formcorrector here

constructor(landmarkRef: PoseLandmarker, webcamRef: Webcam, canvasRef: HTMLCanvasElement){
    this.landmarkRef = landmarkRef
    this.webcamRef = webcamRef
    this.canvasRef = canvasRef
    this.animationRef = 0;
    this.lastVideoTimeRef = -1;
    this.main = this.main.bind(this);
}

start(onResult: (landmarkArr:NormalizedLandmark[], worldLandmarkArr: NormalizedLandmark[], drawingUtils: DrawingUtils)=>void){
this.#onResult = onResult;
this.animationRef = requestAnimationFrame(this.main);
}

main(){
    const video = this.webcamRef.video;
    const canvas = this.canvasRef;

    if(video && canvas && this.landmarkRef && video.readyState >= 2){
        if(canvas.width !== video.videoWidth || canvas.height !== video.videoHeight){
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }
        const canvasCtx = canvas.getContext("2d");

        if(canvasCtx && video.currentTime !== this.lastVideoTimeRef){
            this.lastVideoTimeRef = video.currentTime;
            const drawingUtils = new DrawingUtils(canvasCtx); //MIGHT NOT NEED THIS!

            const results = this.landmarkRef.detectForVideo(video, performance.now());

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            if(results.landmarks && this.#onResult){
                for(let i = 0;i<results.landmarks.length;i++){
                    const landmarkArr = results.landmarks[i];
                    const worldLandmarkArr = results.worldLandmarks[i];

                    this.#onResult(landmarkArr, worldLandmarkArr, drawingUtils); // try drawing inside here as well

                }
            }
            canvasCtx.restore();
        }
    }
    this.animationRef = requestAnimationFrame(this.main);
}

dispose(){
if(this.animationRef){
    cancelAnimationFrame(this.animationRef);
}
}

}