import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { CheckCircle2, AlertCircle, Scan } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthenticationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [livenessVerified, setLivenessVerified] = useState(false);
  const [livenessChallenge, setLivenessChallenge] = useState("Blink Twice");
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [model, setModel] = useState(null); // State to hold the pretrained Xception model

  // Load pretrained Xception model
  useEffect(() => {
    async function loadModel() {
      try {
        // Load pretrained Xception model from TF Hub or other source
        const loadedModel = await tf.loadLayersModel(
          "https://cdn.jsdelivr.net/npm/@tensorflow-models/xception/xception_model.json"
        );
        setModel(loadedModel); // Set the model to state
        console.log("XceptionNet model loaded successfully.");
      } catch (error) {
        console.error("Error loading the XceptionNet model:", error);
      }
    }
    loadModel();
  }, []);

  // Webcam and TensorFlow.js setup
  useEffect(() => {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    const processVideo = async () => {
      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4 || !model) return; // Ensure video is ready and model is loaded

      // Capture frame from webcam
      const videoFrame = tf.browser.fromPixels(video);
      const resizedFrame = tf.image.resizeBilinear(videoFrame, [299, 299]); // Resize frame for Xception input
      const normalizedFrame = resizedFrame.div(255.0).expandDims(0); // Normalize and add batch dimension

      // Predict if the person is live or spoofed
      const prediction = await model.predict(normalizedFrame);
      const predictionValue = prediction.dataSync()[0];

      // If prediction value > 0.5, consider it a live face
      if (predictionValue > 0.5) {
        setLivenessVerified(true); // Person is live
      } else {
        setLivenessVerified(false); // Person is spoofed
      }

      // Draw the webcam frame on canvas (for visualization)
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        video,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      requestAnimationFrame(processVideo); // Loop the process
    };

    processVideo(); // Start processing video frames
  }, [model]);

  const handleAuthenticate = useCallback(async () => {
    if (!livenessVerified) {
      setError("Liveness not verified. Please complete the challenge.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      setTimeout(() => {
        setIsLoading(false);
        navigate("/profile/1");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setIsLoading(false);
    }
  }, [navigate, livenessVerified]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="flex items-center justify-center gap-20 mb-10">
          <img src="/logos/logo1.png" alt="Logo 1" className="h-24 w-auto" />
          <img src="/logos/logo2.png" alt="Logo 2" className="h-24 w-auto" />
          <img src="/logos/logo3.png" alt="Logo 3" className="h-24 w-auto" />
        </div>
        <h1 className="text-lg md:text-xl font-semibold text-center mb-6">
          Secure Encryption and Authentication Model
        </h1>

        <div className="max-w-xl w-full bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 aspect-w-16 aspect-h-9">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            ></canvas>
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
          </div>

          <div className="mb-4 text-center text-sm text-gray-600">
            {livenessVerified
              ? "Liveness Verified! You may now proceed."
              : `Please ${livenessChallenge}.`}
          </div>

          <button
            onClick={handleAuthenticate}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-green-300 
                     text-white disabled:cursor-not-allowed rounded-xl font-semibold 
                     transition-colors shadow-lg hover:shadow-xl disabled:shadow-none
                     flex items-center justify-center gap-2"
          >
            <Scan className="w-5 h-5" />
            {isLoading ? "Authenticating..." : "Authenticate"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-gray-500 text-sm">
          © SEAM Authentication System 2024. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
