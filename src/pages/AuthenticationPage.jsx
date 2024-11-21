import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as faceDetection from "@tensorflow-models/face-detection";
import { CheckCircle2, AlertCircle, Scan } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthenticationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // Set TensorFlow.js backend to WebGL for better performance
  useEffect(() => {
    const setBackend = async () => {
      try {
        await tf.setBackend("webgl");
        console.log("Backend set to WebGL");
      } catch (err) {
        console.error("Error setting WebGL backend:", err);
      }
    };
    setBackend();
  }, []);

  // Function to handle authentication
  const handleAuthenticate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load the face detection model
      const model = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceDetector,
        {
          runtime: "tfjs",
        }
      );

      // Capture a screenshot from the webcam
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture image from webcam");

      // Create an image object and decode the captured screenshot
      const img = new Image();
      img.src = imageSrc;
      await img.decode();

      // Detect faces in the image
      const faces = await model.estimateFaces(img);

      if (!faces || faces.length === 0) {
        throw new Error(
          "No face detected. Please ensure your face is clearly visible in the camera."
        );
      }

      if (faces.length > 1) {
        throw new Error(
          "Multiple faces detected. Please ensure only one person is in the frame."
        );
      }

      // Simulate authentication success
      setTimeout(() => {
        setIsLoading(false);
        navigate("/profile/1");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setIsLoading(false);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        {/* Header Section */}
        <div className="flex items-center justify-center gap-20 mb-10">
          <img src="/logos/logo1.png" alt="Logo 1" className="h-24 w-auto" />
          <img src="/logos/logo2.png" alt="Logo 2" className="h-24 w-auto" />
          <img src="/logos/logo3.png" alt="Logo 3" className="h-24 w-auto" />
        </div>
        <h1 className="text-lg md:text-xl font-semibold text-center mb-6">
          Secure Encryption and Authentication Model
        </h1>

        {/* Main Content */}
        <div className="max-w-xl w-full bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200">
          {/* Webcam Container */}
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

          {/* Action Button */}
          <button
            onClick={handleAuthenticate}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-xl font-semibold shadow-lg transition-colors flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-green-300 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <Scan className="w-5 h-5" />
            {isLoading ? "Authenticating..." : "Authenticate"}
          </button>

          {/* Guidelines */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-sm">
                Ensure good lighting and face the camera directly
              </p>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">
                Remove any face coverings or accessories
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          © SEAM Authentication System 2024. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
