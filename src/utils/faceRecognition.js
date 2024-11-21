import * as tf from "@tensorflow/tfjs";

// Load the custom model
const loadCustomModel = async () => {
  try {
    // Directly specify the path to the model, assuming the model is in the public folder
    const MODEL_URL = "/models/model.json"; // Assuming your model is in the public/models folder
    const model = await tf.loadGraphModel(MODEL_URL);

    console.log("Custom model loaded successfully.");
    return model;
  } catch (error) {
    console.error("Error loading the custom model:", error);
    throw new Error(
      "Failed to load the custom model. Check model path or files."
    );
  }
};

// Export the function with the name `loadModels` for backward compatibility
const loadModels = loadCustomModel;

// Compute the face descriptor
const computeFaceDescriptor = async (imageElement, model) => {
  try {
    const tensor = tf.browser
      .fromPixels(imageElement) // Convert the image element to a tensor
      .resizeBilinear([160, 160]) // Resize to the model's expected input size
      .expandDims(0) // Add batch dimension
      .toFloat() // Convert to float32
      .div(127.5) // Normalize
      .sub(1); // Scale between -1 and 1

    const descriptor = model.predict(tensor).arraySync()[0]; // Get the face descriptor
    tensor.dispose(); // Clean up the tensor to avoid memory leaks
    return descriptor;
  } catch (error) {
    console.error("Error computing face descriptor:", error);
    return null;
  }
};

// Find the best match by comparing descriptors
const findBestMatch = (webcamDescriptor, datasetDescriptors) => {
  if (!webcamDescriptor) return null;

  let bestMatch = null;
  let smallestDistance = Infinity;

  // Compare the webcam descriptor with dataset descriptors
  datasetDescriptors.forEach(({ descriptor, name }) => {
    const distance = tf
      .norm(tf.tensor(webcamDescriptor).sub(tf.tensor(descriptor)))
      .arraySync(); // Compute the distance between descriptors

    // If the distance is smaller, update the best match
    if (distance < smallestDistance) {
      smallestDistance = distance;
      bestMatch = { name, distance };
    }
  });

  // Return the best match if the distance is below a threshold (e.g., 0.6)
  return smallestDistance < 0.6 ? bestMatch : null;
};

export { loadModels, computeFaceDescriptor, findBestMatch };
