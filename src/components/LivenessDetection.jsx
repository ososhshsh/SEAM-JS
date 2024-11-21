import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as faceDetection from "@tensorflow-models/face-detection";
import { CheckCircle2, AlertCircle } from "lucide-react";

const LivenessDetection = () => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("Idle");
  const [isLive, setIsLive] = useState(false);
  const [isBlinkDetected, setIsBlinkDetected] = useState(false);
  const [isHeadMotionDetected, setIsHeadMotionDetected] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    // Load the TensorFlow model when the component mounts
    const loadModel = async () => {
      try {
        await tf.setBackend("webgl"); // Set WebGL backend for performance
        const faceModel = await faceDetection.createDetector(
          faceDetection.SupportedModels.MediaPipeFaceDetector,
          { runtime: "tfjs" }
        );
        setModel(faceModel);
        console.log("Face Detection model loaded");
      } catch (error) {
        console.error("Error loading face detection model", error);
      }
    };

    loadModel();
  }, []);

  const checkLiveness = async () => {
    if (!model) {
      setStatus("Model not loaded yet.");
      return;
    }

    setStatus("Detecting...");

    // Capture the current frame from the webcam
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setStatus("Failed to capture image.");
      return;
    }

    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      try {
        const faces = await model.estimateFaces(img);

        if (faces.length === 0) {
          setStatus("No face detected.");
          setIsLive(false);
          return;
        }

        // Check for blink detection and head motion detection
        const blinkDetected = detectBlink(faces[0]);
        const headMotionDetected = detectHeadMotion(faces[0]);

        if (blinkDetected && headMotionDetected) {
          setIsLive(true);
          setStatus("Liveness confirmed!");
        } else {
          setIsLive(false);
          setStatus("Liveness detection failed.");
        }
      } catch (error) {
        setStatus("Error during liveness detection.");
        setIsLive(false);
      }
    };
  };

  const detectBlink = (face) => {
    // Example logic to simulate blink detection
    // In a real-world application, you would use facial landmarks to detect eye movements
    const eyeAspectRatio = face.boundingBox.width / face.boundingBox.height;
    if (eyeAspectRatio > 1.1) {
      setIsBlinkDetected(true);
      return true; // Simulate blink detection (you can enhance this logic)
    }
    setIsBlinkDetected(false);
    return false;
  };

  const detectHeadMotion = (face) => {
    // Example logic to simulate head motion detection
    // In a real-world application, you would track the position of the face
    const headMotionDetected = face.boundingBox.width > 100; // Placeholder logic
    if (headMotionDetected) {
      setIsHeadMotionDetected(true);
      return true; // Simulate head motion detection
    }
    setIsHeadMotionDetected(false);
    return false;
  };

  return (
    <div className="liveness-detection">
      <div className="webcam-container">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="webcam-view"
          videoConstraints={{ facingMode: "user" }}
        />
      </div>

      <button onClick={checkLiveness} className="check-liveness-button">
        Check Liveness
      </button>

      <p>Status: {status}</p>
      {isLive ? (
        <p className="success">
          <CheckCircle2 className="icon" />
          Liveness confirmed!
        </p>
      ) : (
        <p className="error">
          <AlertCircle className="icon" />
          Liveness detection failed.
        </p>
      )}

      {isBlinkDetected && <p>Blink detected!</p>}
      {isHeadMotionDetected && <p>Head motion detected!</p>}
    </div>
  );
};

export default LivenessDetection;
