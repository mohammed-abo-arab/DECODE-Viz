import Vector from "../LinearAlgebra/Vector";
import Matrix from "../LinearAlgebra/Matrix";

// Definition of the Point class
export default class Point {
  // Constructor takes a variable number of components
  constructor(...components) {
    this.components = components;
  }

  // Static method to create a zero point
  static get zero() {
    return new Point(0, 0, 0);
  }

  // Getter and setter for the x-component of the point
  get x() {
    return this.components[0];
  }

  set x(n) {
    this.components[0] = n;
  }

  // Getter and setter for the y-component of the point
  get y() {
    return this.components[1];
  }

  set y(n) {
    this.components[1] = n;
  }

  // Getter and setter for the z-component of the point
  get z() {
    return this.components[2];
  }

  set z(n) {
    this.components[2] = n;
  }

  // Method to calculate the length (magnitude) of the point
  length() {
    return Math.hypot(...this.components);
  }

  // Method to calculate the absolute values of each component
  abs() {
    return new Point(
      ...this.components.map((component) => Math.abs(component))
    );
  }

  // Method to convert the point to a Vector
  toVector() {
    return new Vector(...this.components);
  }

  // Method to convert the point to a Matrix
  toMatrix() {
    return new Matrix(...this.components.map((component) => [component]));
  }

  // Method to calculate the Euclidean distance between two points
  distance(b) {
    return Math.sqrt(
      this.components.reduce(
        (acc, component, i) =>
          acc + Math.pow(this.components[i] - b.components[i], 2),
        0
      )
    );
  }

  // Method to perform vector addition with another point
  // Returns a new point
  add({ components }) {
    return new Point(
      ...components.map(
        (component, index) => this.components[index] + component
      )
    );
  }

  // Method to perform vector subtraction with another point
  // Returns a new vector
  sub({ components }) {
    return new Vector(
      ...components.map(
        (component, index) => this.components[index] - component
      )
    );
  }
}
