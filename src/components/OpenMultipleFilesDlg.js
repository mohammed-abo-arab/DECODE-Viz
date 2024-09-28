import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import {
  //allFilesStore,
  filesStore,
} from "../actions";
import {
  getDicomPatientName,
  getDicomStudyId,
  getDicomStudyDate,
  getDicomStudyTime,
  getDicomStudyDescription,
  getDicomSeriesDate,
  getDicomSeriesTime,
  getDicomSeriesDescription,
  getDicomSeriesNumber,
  getDicomInstanceNumber,
  getDicomSliceLocation,
  getDicomSliceDistance,
  getDicomRows,
  getDicomColumns,
  getDicomEchoNumber,
  getFileNameCorrect,
  dicomDateTimeToLocale,
} from "../functions";

//This library is likely designed to load DICOM images in the WADO (Web Access to DICOM Objects)
//format using the cornerstone library
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

class OpenMultipleFilesDlg extends PureComponent {
  state = {
    progress: 0,
    cancel: false,
  };

  componentDidMount() {
    // Initialize variables to track progress and control file loading
    this.items = [];
    this.count = 0;
    this.step = 0;

    // Retrieve files from component props
    const files = this.props.files;

    // Calculate step size for progress updates
    this.step = files.length / 50;
    this.nextProgress = this.step;
    this.t0 = performance.now();
    //console.log("Initial timestamp:", this.t0);

    // Create an array to store imageIds
    let imageIds = [];

    // Generate imageIds based on file origin (local or file system)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.props.origin === "local")
        imageIds.push(cornerstoneWADOImageLoader.wadouri.fileManager.add(file));
      // it's fs item
      else
        imageIds.push(
          cornerstoneWADOImageLoader.wadouri.fileManager.addBuffer(file.data)
        );
    }

    // Loop through files and load images
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.state.cancel) {
        // Abort loading if the user cancels
        this.props.setFilesStore(null);
        this.close();
        return;
      }

      // Load image using Cornerstone
      cornerstone.loadImage(imageIds[i]).then(
        (image) => {
          // Extract DICOM metadata
          const patientName = getDicomPatientName(image);
          const studyId = getDicomStudyId(image);
          const studyDate = getDicomStudyDate(image);
          const studyTime = getDicomStudyTime(image);
          const studyDescription = getDicomStudyDescription(image);
          const seriesDate = getDicomSeriesDate(image);
          const seriesTime = getDicomSeriesTime(image);
          const seriesDescription = getDicomSeriesDescription(image);
          const seriesNumber = getDicomSeriesNumber(image);
          const instanceNumber = getDicomInstanceNumber(image);
          const sliceDistance = getDicomSliceDistance(image);
          const echoNumber = getDicomEchoNumber(image);
          const sliceLocation = getDicomSliceLocation(image);
          const columns = getDicomColumns(image);
          const rows = getDicomRows(image);

          // Format studyDateTime for display
          const studyDateTime =
            studyDate === undefined
              ? undefined
              : dicomDateTimeToLocale(`${studyDate}.${studyTime}`);

          // Create an item object to store DICOM metadata and image details
          let item = null;
          if (this.props.origin === "local")
            item = {
              imageId: imageIds[i],
              instanceNumber: instanceNumber,
              name: getFileNameCorrect(file.name),
              image: image,
              rows: rows,
              columns: columns,
              sliceDistance: sliceDistance,
              sliceLocation: sliceLocation,
              patient: {
                patientName: patientName,
              },
              study: {
                studyId: studyId,
                studyDate: studyDate,
                studyTime: studyTime,
                studyDateTime: studyDateTime,
                studyDescription: studyDescription,
              },
              series: {
                seriesDate: seriesDate,
                seriesTime: seriesTime,
                seriesDescription: seriesDescription,
                seriesNumber: seriesNumber,
                echoNumber: echoNumber,
              },
            };
          else
            item = {
              imageId: imageIds[i],
              instanceNumber: instanceNumber,
              name: file.name,
              image: image,
              rows: rows,
              columns: columns,
              sliceDistance: sliceDistance,
              sliceLocation: sliceLocation,
              patient: {
                patientName: patientName,
              },
              study: {
                studyId: studyId,
                studyDate: studyDate,
                studyTime: studyTime,
                studyDateTime: studyDateTime,
                studyDescription: studyDescription,
              },
              series: {
                seriesDate: seriesDate,
                seriesTime: seriesTime,
                seriesDescription: seriesDescription,
                seriesNumber: seriesNumber,
                echoNumber: echoNumber,
              },
            };
          this.items.push(item);
          this.count++;

          // Update progress and check if loading is complete
          const progress = Math.floor(this.count * (100 / files.length));
          if (progress > this.nextProgress) {
            this.nextProgress += this.step;
            this.setState({ progress: progress });
          }
          if (this.count === files.length) {
            // Sort items based on instanceNumber
            this.items.sort((l, r) => l.instanceNumber - r.instanceNumber);
            this.t1 = performance.now();
            console.log(
              `Performance: Loaded ${this.count} images in ${
                this.t1 - this.t0
              } milliseconds`
            );
            this.props.setFilesStore(this.items);
            this.close();
          }
        },
        (e) => {
          // Handle errors during image loading
          console.log("Error in reading multiple files: ", e);
          this.count++;
        }
      );
      if (this.count === files.length) {
        // Additional logic can be added if needed after all files are loaded
      }
    }
    //this.close()
  }

  // This method is responsible for triggering the onClose callback provided as a prop.
  // It presumably closes or hides a modal or dialog in the parent component.
  close = () => {
    this.props.onClose();
  };
  //This state change likely serves as a signal to cancel or interrupt an ongoing process.
  cancel = () => {
    this.setState({ cancel: true });
  };

  /**
   * Render method for a component displaying a dialog with a progress bar.
   * This component is likely used for indicating the progress of opening multiple files.
   * It utilizes Material-UI components for the dialog, progress bar, and button.
   */
  render() {
    return (
      <div>
        {/* Dialog component for displaying information about opening multiple files */}
        <Dialog
          open={true}
          onClose={this.close}
          aria-labelledby="alert-dialog-title"
        >
          {/* Dialog title */}
          <DialogTitle id="alert-dialog-title">
            {"Opening multiple files ..."}
          </DialogTitle>

          {/* Dialog content containing a linear progress bar */}
          <DialogContent>
            <LinearProgress
              variant="determinate"
              value={this.state.progress}
              color="secondary"
            />
          </DialogContent>

          {/* Dialog actions with a cancel button */}
          <DialogActions>
            <Button onClick={this.cancel}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

// Define mapDispatchToProps function to map dispatch actions to component props
const mapDispatchToProps = (dispatch) => {
  return {
    setFilesStore: (files) => dispatch(filesStore(files)),
  };
};

// Connect the OpenMultipleFilesDlg component to the Redux store
export default connect(null, mapDispatchToProps)(OpenMultipleFilesDlg);
