// Import the getPixel function from the 'getPixel' module
import { getPixel } from "./getPixel";

// Function to invert pixel values in a DICOM image
export function invert(image, element, isDcm) {
  // Loop through each row (y) and column (x) of the image
  for (let y = 0; y < image.columns; y++) {
    for (let x = 0; x < image.rows; x++) {
      // Get the original pixel value at position (x, y) using the getPixel function
      let sp = getPixel(image, element, isDcm, x, y);

      // Invert the pixel value using a linear transformation
      // This transformation is common in DICOM images and involves scaling and offsetting
      let mo = image.maxPixelValue - sp * image.slope + image.intercept;

      // The variable 'mo' now contains the inverted pixel value at position (x, y)
      // You can perform further processing or assignments based on the inverted value if needed
    }
  }
}
