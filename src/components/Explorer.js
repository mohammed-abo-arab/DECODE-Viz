import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import DicomPreviewer from "./DicomPreviewer";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  seriesStore,
  filesStore,
  explorer,
  explorerActivePatientIndex,
  explorerActiveStudyIndex,
  explorerActiveSeriesIndex,
} from "../actions";

import { groupBy } from "../functions";

const style = {
  width: "200px",
  padding: "8px 8px 8px 8px",
  marginTop: "40px",
};

const styleScrollbar = {
  height: "calc(100vh - 48px)",
};

const styleDicomViewerStack = {
  width: "182px",
  marginTop: "10px",
  marginLeft: "7px",
};

const styleDicomViewer = {
  padding: "4px 4px 4px 4px",
};

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selectText: {
    fontSize: "0.85em",
  },
  menuItemText: {
    fontSize: "0.85em",
  },
});

class Explorer extends PureComponent {
  constructor(props) {
    super(props);

    this.dicomViewersRefs = [];
    this.dicomViewers = [];
    for (let i = 0; i < 16; i++) {
      this.dicomViewers.push(this.setDcmViewer(i));
    }
  }

  state = {
    patientName: this.props.explorer.patient.keys[0],
    studies: [],
    study: "",
    series: [],
    seriesActiveIndex: 0,
  };

  // This function, setDcmViewer, is a utility function for generating instances of the DicomPreviewer component.

  setDcmViewer = (index) => {
    // Returns a JSX structure representing a container <div> with a style applied.
    return (
      <div style={styleDicomViewer}>
        {/* DicomPreviewer component responsible for previewing DICOM images */}
        <DicomPreviewer
          // Callback function to set the reference of the DicomPreviewer component to this.dicomViewersRefs[index].
          dcmRef={(ref) => {
            this.dicomViewersRefs[index] = ref;
          }}
          // Index prop indicating the index of this particular instance.
          index={index}
          // Function props runTool and changeTool passed to the DicomPreviewer component.
          runTool={(ref) => (this.runTool = ref)}
          changeTool={(ref) => (this.changeTool = ref)}
          // Callback functions executed when an image is loaded or rendered in the DicomPreviewer.
          onLoadedImage={this.onLoadedImage}
          onRenderedImage={this.onRenderedImage}
          // Boolean prop indicating whether the DicomPreviewer should be visible (true in this case).
          visible={true}
        />
      </div>
    );
  };
  // End of setDcmViewer function.

  onLoadedImage = () => {};

  onRenderedImage = () => {};

  getDcmViewerRef = (index) => {
    return this.dicomViewersRefs[index];
  };

  getDcmViewer = (index) => {
    return this.dicomViewers[index];
  };

  // Function to build a grid of DicomViewer components based on the specified number of rows
  buildPreviewStack = (rows) => {
    // Initialize an empty array to store DicomViewer components
    this.dicomviewers = [];

    // Loop through each row to create DicomViewer components
    for (let i = 0; i < rows; i++) {
      // Create a <div> for each DicomViewer with onClick and onTouchStart event handlers
      this.dicomviewers.push(
        <div
          key={i} // Set a unique key for each DicomViewer to optimize React rendering
          onClick={() => this.previewStackClick(i)} // Attach click event handler
          onTouchStart={() => this.previewStackTouch(i)} // Attach touch start event handler
        >
          {this.getDcmViewer(i)} {/* Render the DicomViewer component */}
        </div>
      );
    }

    // Return a container <div> with a grid layout to arrange DicomViewer components

    return (
      <div
        id="dicompreviewer-grid" // Set the id for styling or identification purposes
        style={{
          display: "grid", // Use CSS grid for layout
          gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`, // Set grid rows dynamically
          gridTemplateColumns: `repeat(${1}, ${100}%)`, // Set grid columns
          height: "100%", // Set container height to 100% of its parent
          width: "100%", // Set container width to 100% of its parent
        }}
      >
        {this.dicomviewers}
        {/* Render the array of DicomViewer components within the grid layout */}
      </div>
    );
  };

  componentDidMount() {
    // Retrieve active indices and data from props
    const patientIndex = this.props.explorerActivePatientIndex;
    const studyIndex = this.props.explorerActiveStudyIndex;
    const seriesIndex = this.props.explorerActiveSeriesIndex;
    const patientName = this.props.explorer.patient.keys[patientIndex];

    const files = this.props.files;

    // Update component state with the selected patient's name
    this.setState({ patientName: patientName }, () => {
      // Filter files based on the selected patient's name
      this.filesListForPatient = files.filter((a) => {
        return a.patient.patientName === patientName;
      });

      // Group files by studyDateTime or studyDescription
      this.studyList = groupBy(
        this.filesListForPatient,
        (a) => a.study.studyDateTime
      );
      let studyKeys = [...this.studyList.keys()];

      // Check if studyDateTime is undefined, group by studyDescription
      if (this.studyList.get(studyKeys[0])[0].study.studyDate === undefined) {
        this.studyList = groupBy(
          this.filesListForPatient,
          (a) => a.study.studyDescription
        );
        studyKeys = [...this.studyList.keys()];
      }

      // Update component state with study information
      this.study = {
        list: this.studyList,
        keys: studyKeys,
      };

      // Group files by seriesNumber and create a sorted map
      const seriesList = groupBy(
        this.studyList.get(studyKeys[0]),
        (a) => a.series.seriesNumber
      );
      this.seriesList = new Map([...seriesList].sort());

      // Get sorted series keys
      const seriesKeys = [...this.seriesList.keys()];
      seriesKeys.sort(function (a, b) {
        return a - b;
      });

      // Update component state with series information
      this.series = {
        seriesList: this.seriesList,
        seriesKeys: seriesKeys,
      };

      // Set the files for the initially selected series
      this.files = this.series.seriesList.get(seriesKeys[0]);

      // Dispatch series information to Redux store
      this.props.setSeriesStore(this.series);

      // Update component state with study, studies, and series information
      this.setState(
        {
          study: this.study.keys[studyIndex],
          studies: studyKeys,
          series: seriesKeys,
        },
        () => {
          // Trigger the previewStackClick function for the initially selected series
          this.previewStackClick(seriesIndex);
        }
      );
    });
  }

  componentDidUpdate() {
    // Uncomment the following line if you need to log information for debugging
    // console.log('Explorer - componentDidUpdate: ', this.state.series)

    // Loop through each series and update DicomViewers with files
    for (let i = 0; i < this.state.series.length; i++) {
      // Set the files for the current series in DicomViewer
      this.dicomViewersRefs[i].runTool(
        "setfiles",
        this.seriesList.get(this.state.series[i])
      );

      // Open the first image in the series using DicomViewer
      this.dicomViewersRefs[i].runTool("openimage", 0);
    }
  }

  //Function to handle changes in the selected patient
  handlePatientChange = (event, value) => {
    // Uncomment the line below to log the value for debugging purposes
    // console.log('handlePatientChange: ', value)

    // Set the selected patient name from the event
    this.patientName = event.target.value;

    // Get the index of the selected patient
    const patientIndex = value.key;

    // Filter files based on the selected patient name
    this.filesListForPatient = this.props.allFiles.filter((a) => {
      return a.patient.patientName === this.patientName;
    });

    // Group files by study date and time
    this.studyList = groupBy(
      this.filesListForPatient,
      (a) => a.study.studyDateTime
    );
    const studyKeys = [...this.studyList.keys()];

    // Set study-related information
    this.study = {
      list: this.studyList,
      keys: studyKeys,
    };

    // Group files by series number for the first study
    this.seriesList = groupBy(
      this.studyList.get(studyKeys[0]),
      (a) => a.series.seriesNumber
    );
    const seriesKeys = [...this.seriesList.keys()];

    // Set series-related information
    this.series = {
      seriesList: this.seriesList,
      seriesKeys: seriesKeys,
    };

    // Update the series store using a function passed via props
    this.props.setSeriesStore(this.series);

    // Update the component state with the selected patient, study, and series
    this.setState(
      {
        patientName: this.patientName,
        study: this.study.keys[0], // Set the first study as the default
        studies: studyKeys,
        series: seriesKeys,
      },
      () => {
        // Set the active patient index using a function passed via props
        this.props.setExplorerActivePatientIndex(patientIndex);

        // Call a function to handle preview stack click with the first stack index
        this.previewStackClick(0);
      }
    );
  };

  // Function to handle changes in the selected study
  handleStudyChange = (event, value) => {
    // Uncomment the line below to log the event for debugging purposes
    // console.log('handleStudyChange, event: ', event)

    // Get the index of the selected study
    const studyIndex = value.key;

    // Group files by study date and time for the selected patient
    this.studyList = groupBy(
      this.filesListForPatient,
      (a) => a.study.studyDateTime
    );
    let studyKeys = [...this.studyList.keys()];

    // Check if the first study has a defined study date
    if (this.studyList.get(studyKeys[0])[0].study.studyDate === undefined) {
      // If not, group files by study description
      this.studyList = groupBy(
        this.filesListForPatient,
        (a) => a.study.studyDescription
      );
      studyKeys = [...this.studyList.keys()];
    }

    // Set study-related information
    this.study = {
      list: this.studyList,
      keys: studyKeys,
    };

    // Group files by series number for the selected study
    this.seriesList = groupBy(
      this.studyList.get(studyKeys[studyIndex]),
      (a) => a.series.seriesNumber
    );
    const seriesKeys = [...this.seriesList.keys()];

    // Set series-related information
    this.series = {
      seriesList: this.seriesList,
      seriesKeys: seriesKeys,
    };

    // Update the series store using a function passed via props
    this.props.setSeriesStore(this.series);

    // Update the component state with the selected study and series
    this.setState(
      {
        study: this.study.keys[studyIndex],
        studies: studyKeys,
        series: seriesKeys,
      },
      () => {
        // Call a function to handle preview stack click with the first stack index
        this.previewStackClick(0);
      }
    );
  };

  // Function to handle clicks on the preview stack
  previewStackClick = (index) => {
    // console.log('previewStackClick: ', index)

    // Check if the clicked index is the same as the current active series index
    // This line is commented out and may be used for optimization to avoid redundant updates
    // if (index === this.state.seriesActiveIndex) return

    // Set the active series index using a function passed via props
    this.props.setExplorerActiveSeriesIndex(index);

    // Update the component state with the active series index
    this.setState({ seriesActiveIndex: index }, () => {
      // Call a function to handle the selection of the series
      this.props.onSelectSeries(
        this.series.seriesList.get(this.state.series[index]),
        index
      );
    });
  };

  // Function to handle touch events on the preview stack
  previewStackTouch = (index) => {
    // Set the active series index using a function passed via props
    this.props.setExplorerActiveSeriesIndex(index);

    // Update the component state with the active series index
    this.setState({ seriesActiveIndex: index }, () => {
      // Call a function to handle the selection of the series
      // Retrieve the selected series from the series list using the active index
      this.props.onSelectSeries(
        this.series.seriesList.get(this.state.series[index])
      );
    });
  };

  // Function to clear the tools in all dicom viewers
  clear = () => {
    // Iterate through each dicom viewer reference (assuming there are 16 viewers)
    for (let i = 0; i < 16; i++) {
      // Access the runTool method of the current dicom viewer reference and run the "clear" tool
      this.dicomViewersRefs[i].runTool("clear");
    }
  };

  // React render method for displaying a UI component
  render() {
    // Destructuring 'classes' from the props
    const { classes } = this.props;

    // JSX structure with PerfectScrollbar for custom scrollbar behavior
    return (
      <PerfectScrollbar>
        {/* Outer container div with custom styles */}
        <div style={styleScrollbar}>
          {/* Inner container div with custom styles */}
          <div style={style}>
            {/* Patient Selection Dropdown */}
            <FormControl className={classes.formControl}>
              <InputLabel id="patient-label">Patient</InputLabel>
              {/* Select component for patient selection */}
              <Select
                className={classes.selectText}
                labelId="patient-select-label"
                id="patient-select"
                value={this.state.patientName}
                onChange={this.handlePatientChange}
              >
                {/* Map through patient keys to generate MenuItem components */}
                {this.props.explorer.patient.keys.map((patient, index) => (
                  <MenuItem
                    className={classes.menuItemText}
                    value={patient}
                    key={index}
                  >
                    {patient}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Study Selection Dropdown */}
            <FormControl className={classes.formControl}>
              <InputLabel id="study-label">Study</InputLabel>
              {/* Select component for study selection */}
              <Select
                className={classes.selectText}
                labelId="study-select-label"
                id="study-select"
                value={this.state.study}
                onChange={this.handleStudyChange}
              >
                {/* Map through study keys to generate MenuItem components */}
                {this.state.studies.map((study, index) => (
                  // Considered code for displaying studyDate and studyTime
                  // `${studyDate} - ${studyTime}`
                  <MenuItem
                    className={classes.menuItemText}
                    value={study}
                    key={index}
                  >
                    {study}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Container for Dicom Viewer Stack */}
            <div style={styleDicomViewerStack}>
              {/* Call a function to build and render the preview stack based on the series length */}
              {this.buildPreviewStack(this.state.series.length)}
            </div>
          </div>
        </div>
      </PerfectScrollbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    files: state.files,
    explorerActivePatientIndex: state.explorerActivePatientIndex,
    explorerActiveStudyIndex: state.explorerActiveStudyIndex,
    explorerActiveSeriesIndex: state.explorerActiveSeriesIndex,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFilesStore: (files) => dispatch(filesStore(files)),
    setExplorer: (data) => dispatch(explorer(data)),
    setExplorerActivePatientIndex: (index) =>
      dispatch(explorerActivePatientIndex(index)),
    setExplorerActiveStudyIndex: (index) =>
      dispatch(explorerActiveStudyIndex(index)),
    setExplorerActiveSeriesIndex: (index) =>
      dispatch(explorerActiveSeriesIndex(index)),
    setSeriesStore: (series) => dispatch(seriesStore(series)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Explorer));
