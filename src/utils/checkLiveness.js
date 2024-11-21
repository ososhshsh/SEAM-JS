import * as tf from "@tensorflow/tfjs";
import * as faceDetection from "@tensorflow-models/face-detection";

// Load the face detection model
const loadFaceDetectionModel = async () => {
  await tf.setBackend("webgl");
  const model = await faceDetection.createDetector(
    faceDetection.SupportedModels.MediaPipeFaceDetector,
    {
      runtime: "tfjs",
    }
  );
  return model;
};

// Detect faces in the image
const detectFace = async (model, image) => {
  const faces = await model.estimateFaces(image);
  return faces;
};

// Check if liveness is detected (simplified)
const checkLiveness = async (image) => {
  const model = await loadFaceDetectionModel();
  const faces = await detectFace(model, image);

  if (faces.length === 0) {
    throw new Error("No face detected");
  }

  // Simulate liveness check (a real implementation would involve more complex checks)
  return faces.length === 1; // Valid liveness if only one face detected
};

// Export functions individually
export { loadFaceDetectionModel, detectFace, checkLiveness };
