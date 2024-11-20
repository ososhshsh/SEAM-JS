import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import * as faceDetection from '@tensorflow-models/face-detection';
import { CheckCircle2, AlertCircle, Scan } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthenticationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const handleAuthenticate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const model = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceDetector
      );

      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) throw new Error('Failed to capture image');

      const img = new Image();
      img.src = imageSrc;
      await img.decode();

      const faces = await model.estimateFaces(img);

      if (faces.length === 0) {
        throw new Error('No face detected. Please ensure you are clearly visible in the camera.');
      }

      if (faces.length > 1) {
        throw new Error('Multiple faces detected. Please ensure only one person is in frame.');
      }

      // Simulate API call for authentication
      setTimeout(() => {
        setIsLoading(false);
        navigate('/profile/1');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsLoading(false);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        {/* Header Section */}
        <div className="flex items-center justify-center gap-12 mb-6">
          <img src="/logos/logo1.png" alt="Logo 1" className="h-16 w-auto" />
          <img src="/logos/logo2.png" alt="Logo 2" className="h-16 w-auto" />
          <img src="/logos/logo3.png" alt="Logo 3" className="h-16 w-auto" />
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
            className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-green-300 
                     text-white disabled:cursor-not-allowed rounded-xl font-semibold 
                     transition-colors shadow-lg hover:shadow-xl disabled:shadow-none
                     flex items-center justify-center gap-2"
          >
            <Scan className="w-5 h-5" />
            {isLoading ? 'Authenticating...' : 'Authenticate'}
          </button>

          {/* Guidelines */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-sm">Ensure good lighting and face the camera directly</p>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">Remove any face coverings or accessories</p>
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
