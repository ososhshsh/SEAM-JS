// Correctly export the model loading function and the liveness checking function
export const loadFaceLandmarksModel = async () => {
  await tf.ready(); // Ensure TensorFlow.js is ready
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
  );
  return model;
};

export const checkLiveness = async (img, face) => {
  const model = await loadFaceLandmarksModel();

  const predictions = await model.estimateFaces({
    input: img,
  });

  if (predictions.length === 0) {
    console.log("No landmarks detected - liveness failed");
    return false;
  }

  const faceLandmarks = predictions[0].scaledMesh;
  const eyesClosed = checkForBlink(faceLandmarks);
  if (!eyesClosed) {
    console.log("No blink detected - liveness failed");
    return false;
  }

  console.log("Blink detected - liveness passed");
  return true;
};

const checkForBlink = (landmarks) => {
  const leftEye = landmarks.slice(133, 144); // Left eye landmarks
  const rightEye = landmarks.slice(362, 374); // Right eye landmarks

  const isLeftEyeClosed = leftEye.some((point) => point[1] < 0.5);
  const isRightEyeClosed = rightEye.some((point) => point[1] < 0.5);

  return isLeftEyeClosed && isRightEyeClosed;
};
