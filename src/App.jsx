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
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [detectedGesture, setDetectedGesture] = useState('No Detection');
  const [gestureImage, setGestureImage] = useState(null);
  const [palmCenter, setPalmCenter] = useState(null);
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
        setMessage('Back camera is available.')
        console.log('Back camera is available.');
        setTimeout(() => setBackCameraAvailable(false), 10000);
      } else {
        setBackCameraAvailable(true);
        console.log('Back camera is not present.');
        setMessage('Back camera is not present.');
        setToastType('error')
        setTimeout(() => setBackCameraAvailable(false), 10000);
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
      console.log(`${hands[0]} hands h ye toh`)
      const ctx = canvasRef.current.getContext('2d');
      // drawHand(hands, ctx);
      // console.log("hand detected");

      if (hands.length > 0) {
        const { gesture: detectedGesture, fingertips, palmCenter } = estimateGesture(hands[0].landmarks);

        setPalmCenter(palmCenter);
        setDetectedGesture(detectedGesture);
        setGestureImage(
          detectedGesture === 'thumbsUp' ? thumbsUp :
            detectedGesture === 'one' ? number1 :
              detectedGesture === 'two' ? number2 :
                detectedGesture === 'three' ? number3 :
                  detectedGesture === 'four' ? number4 :
                    detectedGesture === 'five' ? number5 :
                      null
        );
      }
    }
  }
  return (
    <>
      <div className='flex items-center justify-center mt-8 '>
        <div className="card card-compact shadow-xl ">
          <figure className='relative'>
            {palmCenter && gestureImage && (
              <img
                src={gestureImage}
                alt="Detected Gesture"
                style={{
                  position: 'absolute',
                  left: palmCenter.x,
                  top: palmCenter.y,
                  transform: 'translate(-50%, -50%)',
                  width: '100px',
                  height: '100px'
                }}
              />
            )}
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
      {
        backCameraAvailable && (<div role="alert" className={`alert alert-${toastType} w-72 m-5`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{`${message}`}</span>
        </div>)
      }
    </>
  )
}

export default App
