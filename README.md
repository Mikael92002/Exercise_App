# Exercise_App

A real-time, browser-based exercise tracker that uses a webcam and Google MediaPipe's pose estimation to count reps, track form, and provides guidance through workouts.

---

## Features

- **Real-time pose estimation**: Via MediaPipe PoseLandmarker
- **Rep counting**: Uses a 3-state finite state machine (resting -> concentric -> eccentric)
- **Form correction**: With live overlay messages when user's positioning is off
- **Signal smoothing**: Via sliding window median filter + linear/exponential moving average, reducing noise from raw landmark detection
- **Visual rep tracker**: An animated bar that moves with your joint angle so user can see exactly where they are in the rep
- **4 supported exercises (note: some exercises in development)** (see below)

---

## Supported Exercises

1. Left Bicep Curl
2. Right Bicep Curl \*
3. Push-Up \*
4. Squat \*

## \*: In development

## How It Works

### Pose Detection

MediaPipe's `PoseLandmarker` model runs on the webcam via `requestAnimationFrame`. It outputs 33 landmarks in both screen-space (`landmarks`) and 3D space (`worldLandmarks`). In this application, the 3D world landmarks are used for all angle and distance calculations to stay invariant to camera distance and position.

### Rep Counting (State Machine)

Each exercise uses a 3-state machine:

```
State 0 (Rest) -> State 1 (Concentric) -> State 2 (Eccentric) -> State 0 + rep++
```

Transitions are triggered by crossing configurable angle/distance thresholds defined per exercise in `ExerciseEnum`.

### Signal Processing

Raw landmark coordinates are noisy so each frame's computed angle or ratio is:

1. Added to a **sliding window** (last N frames)
2. **Median filtered** to remove outlier spikes
3. **Linearly/Exponentially smoothed** (moving average) to smooth data

This makes rep counting more robust under imperfect lighting or fast movement.

### Form Correction

`FormCorrector` checks each frame for exercise-specific visibility and positioning rules. If a violation is detected (e.g. wrong side of body facing camera, arm out of frame), a modal overlay appears with a correction message. Processing is paused until form is corrected.

---

## Tech Stack

- **React + TypeScript**: Setup with Vite
- **MediaPipe Tasks Vision**: Pose landmark detection
- **Jest**: For testing
- **CSS Modules**: component-scoped styling

---

## Installation

### Prerequisites

- Node.js 18+
- A webcam
- A modern browser (Chrome or Edge recommended for best MediaPipe performance)

```bash
git clone https://github.com/yourusername/reptrack.git
cd reptrack
npm install
npm run dev
```

Go to `http://localhost:5173` in your browser.

### Usage

1. Click **Start Workout**
2. Grant camera permissions when prompted
3. Select an exercise from the dropdown
4. Position yourself so your full body (or relevant limbs) are visible
5. Follow on-screen form correction, then start your set
6. Reps are counted automatically; the animated bar shows your current joint angle relative to the rep threshold

---

## Features To Come

- Mobile layout optimization
- Additional exercises: Pushups, Squats

---

## IMPORTANT LIMITATIONS

- Works best in **good lighting** with a clear background
- Landmark detection accuracy drops when joints are **occluded/blocked** (e.g. side-on pushup view)
- Currently optimized for **desktop** — mobile performance varies by device
- Requires a **Chromium-based browser** for best performance with Google MediaPipe
