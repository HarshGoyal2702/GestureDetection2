# Hand Gesture Detection React App

This project is a **Hand Gesture Detection** React application that utilizes TensorFlow.js and the HandPose model to detect hand gestures. When the model detects a hand, it recognizes the numbers **1, 2, 3, 4, and 5** and displays the corresponding image on the camera feed.

## Features
- **Real-time Hand Gesture Detection** using TensorFlow.js
- **Finger Gesture Recognition** for numbers 1 to 5
- **Webcam Integration** for live video input
- **Switch Camera Option** (Switch between front and back camera, with a message if no back camera is available)
- **Custom Gesture Definitions** using Fingerpose
- **React.js & Vite** for a fast and efficient development environment

## Tech Stack
- **React.js** (with Vite for fast builds)
- **TensorFlow.js** (@tensorflow/tfjs, @tensorflow-models/handpose)
- **Fingerpose** (for gesture recognition)
- **React-Webcam** (for capturing video input)

## Installation & Setup
### 1. Clone the Repository
```sh
git clone https://github.com/your-repo-name/hand-gesture-detection.git
cd hand-gesture-detection
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Start the Development Server
```sh
npm run dev
```

### 4. Build for Production
```sh
npm run build
```

## Required TensorFlow.js Models & Links
This app uses **TensorFlow.js** and **HandPose** for hand tracking:
- **TensorFlow.js**: [https://www.tensorflow.org/js](https://www.tensorflow.org/js)
- **HandPose Model**: [https://github.com/tensorflow/tfjs-models/tree/master/handpose](https://github.com/tensorflow/tfjs-models/tree/master/handpose)
- **Fingerpose Library**: [https://github.com/andypotato/fingerpose](https://github.com/andypotato/fingerpose)

## How It Works
1. The app initializes the **HandPose Model** using TensorFlow.js.
2. It accesses the webcam feed and processes each frame.
3. The model detects the **hand landmarks** and sends them to **Fingerpose** for gesture recognition.
4. If the detected gesture matches **1, 2, 3, 4, or 5**, the corresponding number image is displayed on the camera.
5. Users can **switch the camera** between front and back. If a back camera is not available, a message will be displayed.

## Project Structure
```bash
📂 hand-gesture-detection
 ├── 📂 src
 │   ├── 📂 assets (Images for detected gestures)
 │   ├── 📂 components
 │   ├── 📂 utilities (Helper functions for gesture detection)
 │   ├── App.jsx (Main React Component)
 │   ├── index.js (Entry Point)
 ├── package.json (Dependencies & Scripts)
 ├── README.md (Project Documentation)
 ├── vite.config.js (Vite Configuration)
```

## Future Enhancements
- Improve gesture recognition accuracy.
- Add support for custom gestures.
- Implement audio feedback for detected gestures.
- Enhance UI for better user experience.

## 📷 How It Works
1. The app accesses your **webcam** to track your hand.
2. The **TensorFlow.js model** detects the hand landmarks.
3. A gesture recognition algorithm maps the detected landmarks to a **number (1-5)**.
4. The app displays an image corresponding to the detected number.
5. A **switch camera** option allows toggling between the front and back camera. If no back camera is available, a message is displayed.

## 📩 Contact
For any queries, feel free to reach out!
📧 Email: harshgoyal1331@gmail.com

## License
This project is **open-source** and available under the **MIT License**.

---
### ✨ Contributions are Welcome!
If you'd like to improve the project, feel free to **fork the repo** and submit a **pull request**! 🚀

