import './App.css'
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';
import Webcam from 'react-webcam';
import { drawHand } from './utilities';
import React, { useEffect, useRef, useState } from 'react';
import { estimateGesture } from './gestures';
import { noUser, number1, number2, number3, number4, number5, thumbsUp } from './assets';
function App() {
  // this is for the reference of the webcam and canvas to make the handgesture
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // to check the model is loading or not to show the loader
  const [isModelLoading, setIsModelLoading] = useState(true);
  // to detect the detection ready or not
  const [detection, setDetection] = useState(false);
  // to detect the changes of the frontcamera and backcamera
  const [frontCamera, setFrontCamera] = useState('user');
  // to check the system has the backcamera or not
  const [backCameraAvailable, setBackCameraAvailable] = useState(false);

  const [detectedGesture, setDetectedGesture] = useState('No Detection');
  const [fingerPositions, setFingerPositions] = useState([]);
  const [gestureImage, setGestureImage] = useState(null);

  const fingerImages = [
    number1, number2, number3, number4, number5
  ];

  const loadHandposeModel = async () => {
    try {
      setIsModelLoading(false);
      const model = await handpose.load();
      console.log('Handpose model loaded.');
      setIsModelLoading(true);
      setDetection(true)

      setInterval(() => {
        detectHandGesture(model);
      }, 500);
    } catch (error) {
      console.error('Error loading Handpose model:', error);
    }
  };

  // Detect available cameras (front and back)
  const checkAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      // Check if a back camera is available
      const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back') || device.facing === 'environment');

      if (backCamera) {
        setBackCameraAvailable(true);
        setFrontCamera('environment'); // Set the camera to back if available
        console.log('Back camera is available.');
      } else {
        setBackCameraAvailable(false);
        console.log('Back camera is not present.');
        setFrontCamera('user'); // Use front camera if no back camera is found
      }
    } catch (error) {
      console.error('Error checking camera devices:', error);
    }
  };

  const detectHandGesture = async (model) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hands = await model.estimateHands(video);
      const ctx = canvasRef.current.getContext('2d');
      drawHand(hands, ctx);
      // console.log("hand detected");

      if (hands.length > 0) {
        // const gestureEstimator = new fp.GestureEstimator([
        //   oneGesture,
        //   twoGesture,
        //   threeGesture,
        //   fourGesture,
        //   fiveGesture,
        //   fp.Gestures.ThumbsUpGesture,
        // ]);
        const { gesture: detectedGesture, fingertips } = estimateGesture(hands[0].landmarks);
        setFingerPositions(fingertips);
        // const estimatedGestures = await gestureEstimator.estimate(hands[0].landmarks, 8);
        console.log(detectedGesture);
        setDetectedGesture(detectedGesture);
        switch (detectedGesture) {
          case 'thumbsUp':
            setGestureImage(thumbsUp);
            break;
          case 'one':
            setGestureImage(number1);
            break;
          case 'two':
            setGestureImage(number2);
            break;
          case 'three':
            setGestureImage(number3);
            break;
          case 'four':
            setGestureImage(number4);
            break;
          case 'five':
            setGestureImage(number5);
            break;
          default:
            setGestureImage(null);
        }

        // setDetectionStatus('Gesture Detected');

        // if (estimatedGestures.gestures.length > 0) {
        //   const highestConfidenceGesture = estimatedGestures.gestures.reduce((prev, current) =>
        //     prev.confidence > current.confidence ? prev : current
        //   );
        //   switch (highestConfidenceGesture.name) {
        //     case 'thumbs_up':
        //       setGestureImage(thumbsUp);
        //       break;
        //     case 'one':
        //       setGestureImage(number1);
        //       break;
        //     case 'two':
        //       setGestureImage(number2);
        //       break;
        //     case 'three':
        //       setGestureImage(number3);
        //       break;
        //     case 'four':
        //       setGestureImage(number4);
        //       break;
        //     case 'five':
        //       setGestureImage(number5);
        //       break;
        //     default:
        //       setGestureImage(null);
        //   }

        //   console.log('Detected Gesture:', highestConfidenceGesture.name);
        //   setDetectedGesture(highestConfidenceGesture.name);
        // }
      }
    }
  }
  return (
    <>
      <div className='flex items-center justify-center mt-8 '>
        <div className="card card-compact shadow-xl ">
          <figure className='relative'>
            <div style={{ position: 'absolute', right: 10, top: 100, width: '100px' }}>
              <img src={gestureImage} style={{ width: '100%' }} alt="Detected Gesture" />
            </div>
            {fingerPositions.map((pos, index) => (
              <img
                key={index}
                src={fingerImages[index] || "default_finger.png"} // Use a default if index exceeds array
                alt={`Finger ${index + 1}`}
                style={{
                  position: "absolute",
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: "30px",
                  height: "30px",
                }}
              />
            ))}
            {!detection ? (
              <img src={noUser} alt="User Placeholder" />
            ) : (
              <Webcam
                ref={webcamRef}
                videoConstraints={{ facingMode: frontCamera }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            )}

            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: 10,
              }}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Hand Gesture Recognition Model</h2>
            {
              isModelLoading ? "Detect" : <div className='m-auto flex justify-center items-center flex-col'><p>Model Loading</p> <div className='flex justify-center items-center'><span className="loading loading-ring loading-xs"></span>
                <span className="loading loading-ring loading-sm"></span>
                <span className="loading loading-ring loading-md"></span>
                <span className="loading loading-ring loading-lg"></span></div></div>
            }{
              !detection ? "" : `  ${detectedGesture}`
            }
            <div className="card-actions justify-end">
              <button className="btn btn-success text-white" onClick={loadHandposeModel}>Start Detection</button>
              <button className="btn btn-primary" onClick={checkAvailableCameras}>Switch Camera</button>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default App
