// Importing the EPSILON constant from the "./constants" module
import { EPSILON } from "./constants";

// Function to check if two numbers are approximately equal within a specified epsilon
export const areEqual = (one, other, epsilon = EPSILON) =>
  Math.abs(one - other) < epsilon;

// Function to check if a number is nearly zero within a specified epsilon
export const isNearlyZero = (v) => Math.abs(v) < EPSILON;

// Function to convert radians to degrees
export const toDegrees = (radians) => (radians * 180) / Math.PI;

// Function to convert degrees to radians
export const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Function to calculate the sum of an array of numbers
export const sum = (arr) => arr.reduce((acc, value) => acc + value, 0);

// Function to remove an element from an array at the specified index
export const withoutElementAtIndex = (arr, index) => [
  // Using the spread operator (...) to include elements before the specified index
  ...arr.slice(0, index),
  // Using the spread operator (...) to include elements after the specified index
  ...arr.slice(index + 1),
];
