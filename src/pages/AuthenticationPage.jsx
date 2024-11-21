import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { CheckCircle2, AlertCircle, Scan } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { checkLiveness } from "../utils/checkLiveness"; // Correct import
import {
  loadModels,
  computeFaceDescriptor,
  findBestMatch,
} from "../utils/faceRecognition";

const AuthenticationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(null);
  const [matchedFace, setMatchedFace] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [dataset, setDataset] = useState([]); // Storing the descriptors

  useEffect(() => {
    const initialize = async () => {
      try {
        await tf.setBackend("webgl"); // Set TensorFlow backend
        console.log("TensorFlow backend set to WebGL");

        // Load the face recognition models
        await loadModels();

        // Load dataset images and compute their face descriptors
        const datasetFolder = `${process.env.PUBLIC_URL}/dataset/`;
        const imageNames = ["1.jpg", "2.jpg", "3.jpg"]; // Add all dataset filenames

        const descriptors = [];
        for (const name of imageNames) {
          const img = new Image();
          img.src = `${datasetFolder}${name}`;
          await img.decode(); // Ensure image is loaded
          const descriptor = await computeFaceDescriptor(img);
          if (descriptor) {
            descriptors.push({ name, descriptor });
          }
        }
        setDataset(descriptors); // Save dataset in state
        console.log("Dataset initialized:", descriptors);
      } catch (err) {
        console.error("Error initializing models or dataset:", err);
        setError("Failed to initialize the authentication system.");
      }
    };

    initialize();
  }, []); // Run only once on component mount

  const handleAuthenticate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsLive(null);
      setMatchedFace(null);

      // Capture the image from the webcam
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture image from webcam.");

      const img = new Image();
      img.src = imageSrc;
      await img.decode();

      // Perform liveness detection
      const isHumanLive = await checkLiveness(img); // Check liveness
      if (!isHumanLive) {
        throw new Error(
          "Liveness detection failed. Ensure you're showing a real face."
        );
      }
      setIsLive(true);

      // Compute the face descriptor for the captured image
      const webcamDescriptor = await computeFaceDescriptor(img);
      if (!webcamDescriptor) {
        throw new Error(
          "No face detected. Ensure your face is clearly visible."
        );
      }

      // Find the best match from the dataset
      const match = findBestMatch(webcamDescriptor, dataset);
      if (!match) {
        throw new Error("No matching face found in the dataset.");
      }

      setMatchedFace(match.name); // Save the matched face ID

      // Navigate to the profile page with the matched face ID
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/profile/${match.name.split(".")[0]}`);
      }, 1500);
    } catch (err) {
      console.error("Authentication error:", err);
      setIsLive(false);
      setError(err.message || "Authentication failed.");
      setIsLoading(false);
    }
  }, [dataset, navigate]);

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
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
          </div>

          <button
            onClick={handleAuthenticate}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white disabled:cursor-not-allowed rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
          >
            <Scan className="w-5 h-5" />
            {isLoading ? "Authenticating..." : "Authenticate"}
          </button>

          {matchedFace && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Matched Face: {matchedFace}</p>
              </div>
            </div>
          )}

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
