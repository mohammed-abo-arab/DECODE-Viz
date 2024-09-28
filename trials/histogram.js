import React, { PureComponent } from "react";
import Slider from "@material-ui/core/Slider";
import { connect } from "react-redux";
//import * as cornerstone from 'cornerstone-core'
// import { import as csTools } from 'cornerstone-tools'

// const getRGBPixels = csTools('util/getRGBPixels')

const HIST_WIDTH = 256;
const HIST_HEIGHT = 128;
const N_BINS = 256;

const style = {
  width: "273px",
  padding: "8px 8px 8px 8px",
  backgroundColor: "#444444",
};

const styleSlider = {
  width: "255px",
  marginTop: "-9px",
};

const styleCanvasGradient = {
  marginTop: "-9px",
};

const styleTable = {
  borderCollapse: "collapse",
  fontFamily: "Courier, monospace",
  fontSize: "67%",
  width: "100%",
};

const styleTableTd = {
  tableLayout: "fixed",
  width: "25%",
};

class Histogram extends PureComponent {
  // Constructor function for the Histogram component.
  // Initializes state variables and creates refs for canvases.
  constructor(props) {
    super(props);
    this.canvasHistogram = React.createRef(); // Ref for the main histogram canvas.
    this.canvasGradient = React.createRef(); // Ref for the gradient scale canvas.
  }

  // Component state initialization.
  state = {
    activeDrags: 0, // Number of currently active drags.
    deltaPosition: { x: 0, y: 0 }, // Delta position for dragging.
    controlledPosition: { x: -400, y: 200 }, // Controlled position for dragging.
    value: 128, // Current slider value.
    histCount: 0, // Count of histogram values at the selected position.
    valueScale: 0, // Scaled value based on the slider position.
    minHist: 0, // Minimum value in the histogram.
    maxHist: 0, // Maximum value in the histogram.
    mean: 0, // Mean value of the histogram.
    stdDev: 0, // Standard deviation of the histogram.
    indexDcm: -1, // Index of the active DICOM image.
  };

  // Lifecycle method called after the component has been mounted to the DOM.
  componentDidMount() {
    // Uncommented log statements and variable assignments for debugging purposes.
    // console.log('Histogram - componentDidMount: ')
    // this.image = this.props.activeDcm.image
    // this.element = this.props.activeDcm.element
    // this.isDicom = this.props.activeDcm.isDicom
    // this.pixelData = this.props.activeDcm.image.getPixelData()

    // Get the reference to the histogram canvas and its 2D rendering context.
    const canvasH = this.canvasHistogram.current;
    const ctxH = canvasH.getContext("2d");

    // Set up canvas transformation to handle drawing in a coordinate system
    // with the origin at the bottom-left corner.
    ctxH.translate(0, canvasH.height);
    ctxH.scale(1, -1);

    // Call the method to update the canvas with the latest data.
    this.updateCanvas();
  }

  // Lifecycle method called after the component has been updated.
  componentDidUpdate() {
    // Uncommented log statements and code block for potential debugging.
    // console.log('Histogram - componentDidUpdate: ')

    /* 
     Conditional check commented out for debugging and optimization purposes.
     If the active DICOM image is null, clear the histogram canvas.
  */
    /* if (this.props.activeDcm === null) {
      const ctxH = this.canvasHistogram.current.getContext("2d");
      ctxH.clearRect(0, 0, ctxH.canvas.width, ctxH.canvas.height);
      return;
  }
  this.updateCanvas(); */

    // Check if the index of the active DICOM image has changed.
    // If true, update the component's state with the new index and call the updateCanvas method.
    if (this.state.indexDcm !== this.props.activeDcmIndex) {
      this.setState({ indexDcm: this.props.activeDcmIndex });
      this.updateCanvas();
    }
  }

  // Function to get the mouse position relative to a canvas element.
  //It takes two parameters: canvas - the target canvas element, and evt - the mouse event
  getMousePos(canvas, evt) {
    // Get the position of the canvas in the viewport.
    const rect = canvas.getBoundingClientRect();

    // Calculate and return the mouse position relative to the canvas.
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  /**
   * Retrieves RGB pixel data from the active Dicom image.
   * @param {number} x - X-coordinate of the starting pixel.
   * @param {number} y - Y-coordinate of the starting pixel.
   * @param {number} width - Width of the pixel region.
   * @param {number} height - Height of the pixel region.
   * @returns {number[]} - Array containing RGB pixel data (red, green, blue, alpha values).
   */
  getRGBPixelsImage(x, y, width, height) {
    // Obtain pixel data from the active Dicom image.
    const pixelData = this.props.activeDcm.image.getPixelData();
    const storedPixelData = []; // Array to store RGB pixel data.

    // Round the coordinates to ensure they are integers.
    x = Math.round(x);
    y = Math.round(y);

    let index = 0;
    let spIndex, row, column;

    // Iterate through the specified region to retrieve RGB pixel data.
    for (row = 0; row < height; row++) {
      for (column = 0; column < width; column++) {
        // Calculate the index in the pixelData array for the current pixel.
        spIndex =
          ((row + y) * this.props.activeDcm.image.rows + (column + x)) * 4;

        // Extract individual color channels and alpha value.
        const red = pixelData[spIndex];
        const green = pixelData[spIndex + 1];
        const blue = pixelData[spIndex + 2];
        const alpha = pixelData[spIndex + 3];

        // Store the RGB values in the result array.
        storedPixelData[index++] = red;
        storedPixelData[index++] = green;
        storedPixelData[index++] = blue;
        storedPixelData[index++] = alpha;
      }
    }

    return storedPixelData;
  }

  /**
   * Retrieves pixel data from the active Dicom image.
   * @param {number} x - X-coordinate of the starting pixel.
   * @param {number} y - Y-coordinate of the starting pixel.
   * @param {number} width - Width of the pixel region.
   * @param {number} height - Height of the pixel region.
   * @returns {number[]} - Array containing pixel values.
   */
  getPixelsImage(x, y, width, height) {
    // Obtain pixel data from the active Dicom image.
    const pixelData = this.props.activeDcm.image.getPixelData();
    const storedPixelData = []; // Array to store pixel data.

    // Round the coordinates to ensure they are integers.
    x = Math.round(x);
    y = Math.round(y);

    let index = 0;
    let spIndex, row, column;

    // Iterate through the specified region to retrieve pixel data.
    for (row = 0; row < height; row++) {
      for (column = 0; column < width; column++) {
        // Calculate the index in the pixelData array for the current pixel.
        spIndex = (row + y) * this.props.activeDcm.image.rows + (column + x);

        // Store the pixel value in the result array.
        storedPixelData[index++] = pixelData[spIndex];
      }
    }

    return storedPixelData;
  }

  /**
   * Retrieves a single pixel value from the active Dicom image.
   * @param {number} x - X-coordinate of the pixel.
   * @param {number} y - Y-coordinate of the pixel.
   * @returns {number} - Pixel value.
   */
  getPixel(x, y) {
    let sp = [];

    // Check if the active Dicom is valid.
    if (this.props.activeDcm.isDicom) {
      // Check if the Dicom image is a color image.
      if (this.props.activeDcm.image.color) {
        // Use getRGBPixelsImage to obtain pixel value for color image.
        sp = this.getRGBPixelsImage(x, y, 1, 1);
      } else {
        // Use getPixelsImage to obtain pixel value for grayscale image.
        sp = this.getPixelsImage(x, y, 1, 1);
      }
    } else {
      // If not a Dicom image, use getRGBPixelsImage as a fallback.
      sp = this.getRGBPixelsImage(x, y, 1, 1);
    }

    // Return the first element of the resulting array (pixel value).
    return sp[0];
  }

  /**
   * Updates the canvas with the histogram, WindowWidth, and WindowCenter based on the active Dicom image properties.
   * If there is no active Dicom or the image is not available, the function returns early.
   */
  updateCanvas() {
    // Check if there is an active Dicom.
    if (this.props.activeDcm === null) return;

    // Retrieve the active Dicom image.
    const image = this.props.activeDcm.image;

    // Check if the Dicom image is available.
    if (image === null) return;

    // Calculate histogram-related values.
    const maxPixelValue = image.maxPixelValue;
    const minPixelValue = image.minPixelValue;
    const minHist = minPixelValue + image.intercept;
    const maxHist = maxPixelValue + image.intercept;
    const lenHist = maxHist - minHist + 1;
    const binSize = lenHist / N_BINS;
    let zero256 = Math.floor(Math.abs(minHist) / binSize);
    let stepWW = Math.round(image.windowWidth / binSize / 2);
    let stepWC = Math.round(image.windowCenter / binSize);

    // Update component state with calculated values.
    this.setState({ minHist: minHist });
    this.setState({ maxHist: maxHist });
    this.binSize = binSize;

    // Initialize mean value.
    let m = 0;

    // Build the histogram.
    let hist = Array(lenHist).fill(0);
    for (let y = 0; y < image.columns; y++) {
      for (let x = 0; x < image.rows; x++) {
        let sp = this.getPixel(x, y);
        let mo = sp * image.slope + image.intercept;
        hist[mo - minHist] += 1;
        m += mo;
      }
    }

    // Calculate mean value.
    m = m / (image.columns * image.rows);
    this.setState({ mean: m });

    // Calculate standard deviation.
    let s = 0;
    for (let y = 0; y < image.columns; y++)
      for (let x = 0; y < image.rows; x++) {
        let sp = this.getPixel(x, y);
        let mo = sp * image.slope + image.intercept;
        s += Math.pow(mo - m, 2);
      }
    s = Math.sqrt(s / (image.columns * image.rows));
    this.setState({ stdDev: s });

    // Binning the histogram.
    let hist256 = Array(N_BINS).fill(0);
    let max = 0;

    if (binSize < 1) {
      let binStep = Math.round(N_BINS / lenHist);
      let iHist = 0;
      let i = 0;
      while (i < N_BINS) {
        for (let j = 0; j < binStep; j++) {
          hist256[i] = iHist < lenHist ? hist[iHist] : 0;
          if (max < hist256[i]) max = hist256[i];
          i++;
        }
        iHist++;
      }
    } else {
      let step = 0;
      for (let i = 0; i < N_BINS; i++) {
        for (let j = step; j < Math.round(step + binSize); j++) {
          if (j >= lenHist) break;
          hist256[i] += hist[j];
        }
        if (max < hist256[i]) {
          max = hist256[i];
        }
        step = Math.round(step + binSize);
      }
    }

    // Update component state with histogram values.
    this.hist256 = hist256;

    if (max / HIST_HEIGHT > 100) max = max / 5;

    // Clear the histogram canvas.
    const canvasH = this.canvasHistogram.current;
    const ctxH = canvasH.getContext("2d");
    ctxH.clearRect(0, 0, ctxH.canvas.width, ctxH.canvas.height);

    // Set up an event listener for pointer movement to display values on the canvas.
    canvasH.addEventListener(
      "pointermove",
      (evt) => {
        const mousePos = this.getMousePos(canvasH, evt);
        this.setState({ histCount: hist256[mousePos.x] });
        let p = Math.round(mousePos.x * this.binSize);
        this.setState({ valueScale: p + minHist });
      },
      true
    );

    // Calculate the initial value, draw WindowWidth area, histogram, and WindowCenter cursor.
    let value = Math.round((m - minHist) / binSize);
    this.setState({
      value: value,
      valueScale: m,
      histCount: hist256[value],
    });

    // Draw WindowWidth area on the histogram canvas.
    ctxH.beginPath();
    ctxH.fillStyle = "rgba(210, 210, 210, 0.5)";
    ctxH.fillRect(zero256 - stepWW + stepWC, 0, stepWW * 2, HIST_HEIGHT);

    // Draw the histogram on the histogram canvas.
    ctxH.beginPath();
    ctxH.strokeStyle = "rgba(0, 0, 0, 1.0)";
    for (let i = 0; i < N_BINS; i++) {
      let h = Math.round((hist256[i] / max) * HIST_HEIGHT);
      ctxH.moveTo(i, 0);
      ctxH.lineTo(i, h);
      ctxH.stroke();
    }

    // Draw WindowCenter cursor on the histogram canvas.
    ctxH.beginPath();
    ctxH.strokeStyle = "rgba(140, 140, 140, 0.5)";
    ctxH.moveTo(zero256 + stepWC, 0);
    ctxH.lineTo(zero256 + stepWC, HIST_HEIGHT);
    ctxH.lineWidth = 1;
    ctxH.stroke();

    // Draw gradient scale on a separate canvas.
    const canvasG = this.canvasGradient.current;
    const ctxG = canvasG.getContext("2d");

    ctxG.fillStyle = "#000000";
    ctxG.fillRect(0, 0, zero256, 10);

    let grd = ctxG.createLinearGradient(
      zero256,
      0,
      zero256 + (zero256 < 0 ? zero256 : 0),
      0
    );
    grd.addColorStop(0, "black");
    grd.addColorStop(1, "white");
    ctxG.fillStyle = grd;
    ctxG.fillRect(zero256, 0, zero256 + stepWC, 10);
  }

  /**
   * Handles the change of the value slider.
   * Updates the component state with the new value, scaled value, and corresponding histogram count.
   *
   * @param {Object} event - The event object.
   * @param {number} newValue - The new value from the slider.
   */
  handleChangeValue = (event, newValue) => {
    // Update component state with the new value, scaled value, and corresponding histogram count.
    this.setState({ value: newValue });
    this.setState({ valueScale: newValue * this.binSize + this.state.minHist });
    this.setState({ histCount: this.hist256[newValue] });
  };

  /**
   * Hides the component.
   * Calls the onClose function provided by the parent component.
   */
  hide = () => {
    this.props.onClose();
  };

  /**
   * Handles the drag event when the component is being dragged.
   * Updates the state with the new delta position.
   *
   * @param {Object} e - The drag event object.
   * @param {Object} ui - The delta position information.
   */
  onDrag = (e, ui) => {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      },
    });
  };

  /**
   * Handles the start of the drag event.
   * Increases the count of active drags in the state.
   */
  onStart = () => {
    this.setState({ activeDrags: this.state.activeDrags + 1 });
  };

  /**
   * Handles the stop of the drag event.
   * Decreases the count of active drags in the state.
   */
  onStop = () => {
    this.setState({ activeDrags: this.state.activeDrags - 1 });
  };

  /**
   * Render method for the component.
   * Displays a canvas for histogram, a gradient scale, a slider, and a table with statistics.
   */
  render() {
    return (
      <div style={style}>
        <div>
          <canvas
            ref={this.canvasHistogram}
            width={HIST_WIDTH}
            height={HIST_HEIGHT}
            style={{ backgroundColor: "#FFFFFF", cursor: "crosshair" }}
          />
        </div>
        <div style={styleCanvasGradient}>
          <canvas
            ref={this.canvasGradient}
            width={HIST_WIDTH}
            height={10}
            style={{ backgroundColor: "#FFFFFF" }}
          />
        </div>
        <div style={styleSlider}>
          <Slider
            value={this.state.value}
            onChange={this.handleChangeValue}
            aria-labelledby="continuous-slider"
            color="secondary"
            min={0}
            max={255}
          />
        </div>
        <div>
          <table style={styleTable}>
            <tbody>
              <tr>
                <td style={styleTableTd}>min:</td>
                <td style={styleTableTd}>{this.state.minHist}</td>
                <td style={styleTableTd}>max:</td>
                <td style={styleTableTd}>{this.state.maxHist}</td>
              </tr>
              <tr>
                <td>mean:</td>
                <td>{parseFloat(this.state.mean).toFixed(3)}</td>
                <td>std dev:</td>
                <td>{parseFloat(this.state.stdDev).toFixed(3)}</td>
              </tr>
              <tr>
                <td>count:</td>
                <td>{this.state.histCount}</td>
                <td>value:</td>
                <td>{parseFloat(this.state.valueScale).toFixed(3)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

/**
 * Connects the Histogram component to the Redux store.
 * Maps the activeDcmIndex and activeDcm properties from the store to the component's props.
 */
const mapStateToProps = (state) => {
  return {
    activeDcmIndex: state.activeDcmIndex,
    activeDcm: state.activeDcm,
  };
};

// Connects the Histogram component to the Redux store using the mapStateToProps function.
export default connect(mapStateToProps)(Histogram);
