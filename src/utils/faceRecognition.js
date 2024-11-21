import * as faceapi from "face-api.js";

// Initialize Face Recognition Models
export const initializeModels = async () => {
  try {
    const MODEL_URL = process.env.PUBLIC_URL + "/models";

    // Load models from public/models
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

    console.log("Face API models loaded successfully.");
  } catch (error) {
    console.error("Error loading models:", error);
    throw new Error("Failed to initialize face recognition models.");
  }
};

// Detect Face and Compute Descriptor
export const detectFace = async (videoElement) => {
  try {
    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      console.warn("No face detected.");
      return null;
    }

    return detection.descriptor; // Return the face descriptor
  } catch (error) {
    console.error("Error detecting face:", error);
    return null;
  }
};

// Compare Descriptors to Find a Match
export const findBestMatch = (descriptor, dataset) => {
  if (!descriptor || !dataset || dataset.length === 0) return null;

  let bestMatch = null;
  let smallestDistance = Infinity;

  dataset.forEach(({ name, descriptor: savedDescriptor }) => {
    const distance = faceapi.euclideanDistance(descriptor, savedDescriptor);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      bestMatch = { name, distance };
    }
  });

  return smallestDistance < 0.6 ? bestMatch : null; // Threshold of 0.6
};
