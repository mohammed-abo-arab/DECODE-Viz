// Import necessary modules from cornerstone library
import * as cornerstone from "cornerstone-core";
import { import as csTools } from "cornerstone-tools";

// Import getRGBPixels utility function from csTools
const getRGBPixels = csTools("util/getRGBPixels");

// Function to get RGB pixel data from an image
function getRGBPixelsImage(image, x, y, width, height) {
  // Array to store the resulting pixel data
  const storedPixelData = [];

  // Round the input coordinates to the nearest integer
  x = Math.round(x);
  y = Math.round(y);

  // Initialize variables for loop indexing
  let index = 0;
  let spIndex, row, column;

  // Loop through the specified region in the image
  for (row = 0; row < height; row++) {
    for (column = 0; column < width; column++) {
      // Calculate the index in the flattened pixel data array
      spIndex = ((row + y) * image.rows + (column + x)) * 4;

      // Extract RGBA values from the pixel data
      const red = this.pixelData[spIndex];
      const green = this.pixelData[spIndex + 1];
      const blue = this.pixelData[spIndex + 2];
      const alpha = this.pixelData[spIndex + 3];

      // Store the RGBA values in the result array
      storedPixelData[index++] = red;
      storedPixelData[index++] = green;
      storedPixelData[index++] = blue;
      storedPixelData[index++] = alpha;
    }
  }

  // Return the resulting pixel data array
  return storedPixelData;
}

// Function to get a single pixel value from an image
export function getPixel(element, image, isDcm, x, y) {
  // Array to store the pixel value
  let sp = [];

  // Check if the image is in DICOM format
  if (isDcm) {
    // If the image is a color image, use getRGBPixels to get pixel data for a single pixel
    if (image.color) {
      sp = getRGBPixels(element, x, y, 1, 1);
    } else {
      // If the image is grayscale, use cornerstone.getStoredPixels to get pixel data for a single pixel
      sp = cornerstone.getStoredPixels(element, x, y, 1, 1);
    }
  } else {
    // If the image is not in DICOM format, use getRGBPixelsImage to get pixel data for a single pixel
    sp = this.getRGBPixelsImage(image, x, y, 1, 1);
  }

  // Return the first element of the resulting pixel value array
  return sp[0];
}
