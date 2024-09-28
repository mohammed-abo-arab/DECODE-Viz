// Importing the isNearlyZero function from the './utils' module
import { isNearlyZero } from "./utils";

// Class representing a vector in 3D space
export default class Vector {
  // Constructor takes variable number of components
  constructor(...components) {
    this.components = components; // Array to store vector components
  }

  // Static method to create a zero vector
  static get zero() {
    return new Vector(0, 0, 0);
  }

  // Getter and setter for the x-component of the vector
  get x() {
    return this.components[0];
  }

  set x(n) {
    this.components[0] = n;
  }

  // Getter and setter for the y-component of the vector
  get y() {
    return this.components[1];
  }

  set y(n) {
    this.components[1] = n;
  }

  // Getter and setter for the z-component of the vector
  get z() {
    return this.components[2];
  }

  set z(n) {
    this.components[2] = n;
  }

  // Method to calculate the length (magnitude) of the vector
  length() {
    return Math.hypot(...this.components);
  }

  // Method to check if the vector is approximately zero
  isZero() {
    return this.components.reduce(
      (acc, _, index) => acc && isNearlyZero(this.components[index]),
      true
    );
  }

  // Method to calculate the absolute values of each component
  abs() {
    return new Vector(
      ...this.components.map((component) => Math.abs(component))
    );
  }

  // Method to round each component to the nearest integer
  round() {
    return new Vector(
      ...this.components.map((component) => Math.round(component))
    );
  }

  // Method to find the nearest axis (x, y, or z) based on component values
  nearestAxis() {
    const b = Vector.zero; // Zero vector
    const xabs = Math.abs(this.components[0]);
    const yabs = Math.abs(this.components[1]);
    const zabs = Math.abs(this.components[2]);

    // Determine the axis with the maximum absolute component value
    if (xabs >= yabs && xabs >= zabs)
      b.x = this.components[0] > 0.0 ? 1.0 : -1.0;
    else if (yabs >= zabs) b.y = this.components[1] > 0.0 ? 1.0 : -1.0;
    else b.z = this.components[2] > 0.0 ? 1.0 : -1.0;

    return b;
  }

  // Method to convert the vector to an array
  toArray() {
    return this.components;
  }

  // Method to multiply each component by a scalar
  mul(number) {
    return new Vector(
      ...this.components.map((component) => component * number)
    );
  }

  // Method to add another vector to this vector
  add({ components }) {
    return new Vector(
      ...components.map(
        (component, index) => this.components[index] + component
      )
    );
  }

  // Method to subtract another vector from this vector
  sub({ components }) {
    return new Vector(
      ...components.map(
        (component, index) => this.components[index] - component
      )
    );
  }

  // Method to calculate the cross product with another vector
  crossProduct({ components }) {
    // Check if vectors are 3D
    if (this.components.length !== 3) return;

    return new Vector(
      this.components[1] * components[2] - this.components[2] * components[1],
      this.components[2] * components[0] - this.components[0] * components[2],
      this.components[0] * components[1] - this.components[1] * components[0]
    );
  }

  // Method to calculate the dot product with another vector
  dotProduct({ components }) {
    return components.reduce(
      (acc, component, index) => acc + component * this.components[index],
      0
    );
  }
}
