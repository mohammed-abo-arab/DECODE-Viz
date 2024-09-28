// Importing linear algebra utility classes for handling points, vectors, and matrices
import Point from "../LinearAlgebra/Point";
import Vector from "../LinearAlgebra/Vector";
import Matrix from "../LinearAlgebra/Matrix";

// Defining a class for handling DICOM image geometry
export default class DicomGeometry {
  constructor(image) {
    this.image = image;

    // Extracting Image Position Patient - x, y, z of the top-left corner
    const ipp = this.image.data
      .string("x00200032")
      .split("\\")
      .map((v) => parseFloat(v));

    // Extracting Image Orientation Patient - direction cosines of the first row and column
    const iop = this.image.data
      .string("x00200037")
      .split("\\")
      .map((v) => parseFloat(v));

    // Extracting Pixel Spacing information
    const pixelSpacing = this.image.data
      .string("x00280030")
      .split("\\")
      .map((v) => parseFloat(v));
    this.spacingY = pixelSpacing[0];
    this.spacingX = pixelSpacing[1];

    // Setting the number of rows and columns in the image
    this.rows = image.rows;
    this.cols = image.columns;

    // Calculating physical lengths in X and Y directions
    this.lengthX = this.cols * this.spacingY;
    this.lengthY = this.rows * this.spacingX;

    // Creating vectors representing the direction of rows and columns
    this.rowDir = new Vector(iop[0], iop[1], iop[2]);
    this.colDir = new Vector(iop[3], iop[4], iop[5]);

    // Calculating the normal direction using cross product of row and column directions
    this.nrmDir = this.rowDir.crossProduct(this.colDir);

    // Calculating coordinates of image corners
    this.topLeft = new Point(ipp[0], ipp[1], ipp[2]);
    this.topRight = this.topLeft.add(
      this.rowDir.mul(this.spacingX * this.cols)
    );
    this.bottomLeft = this.topLeft.add(
      this.colDir.mul(this.spacingY * this.rows)
    );
    this.bottomRight = this.bottomLeft.add(this.topRight.sub(this.topLeft));

    // Creating transformation matrix from Image to Reference Coordinate System (RCS)
    this.transformImageToRcs = new Matrix(
      [
        this.rowDir.x * this.spacingX,
        this.colDir.x * this.spacingY,
        this.nrmDir.x,
        this.topLeft.x,
      ],
      [
        this.rowDir.y * this.spacingX,
        this.colDir.y * this.spacingY,
        this.nrmDir.y,
        this.topLeft.y,
      ],
      [
        this.rowDir.z * this.spacingX,
        this.colDir.z * this.spacingY,
        this.nrmDir.z,
        this.topLeft.z,
      ],
      [0, 0, 0, 1]
    );

    // Creating the inverse transformation matrix from RCS to Image
    this.transformRcsToImage = this.transformImageToRcs.inverse();

    // Determining the orientation based on the normal direction
    const p = this.nrmDir.round().abs();
    if (p.x === 1) this.orientation = "sagittal";
    else if (p.y === 1) this.orientation = "coronal";
    else if (p.z === 1) this.orientation = "axial";
  }
}
