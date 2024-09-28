import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

// Importing various components used in the application
import AboutDlg from "./components/AboutDlg";
import Dicomdir from "./components/Dicomdir";
import DicomViewer from "./components/DicomViewer";
import DicomHeader from "./components/DicomHeader";
import DownloadZipDlg from "./components/DownloadZipDlg";
import Explorer from "./components/Explorer";
import FsUI from "./components/FsUI";
import Histogram from "./components/Histogram";
import LayoutTool from "./components/LayoutTool";
import ToolsPanel from "./components/ToolsPanel";
import Measurements from "./components/Measurements";
import OpenMultipleFilesDlg from "./components/OpenMultipleFilesDlg";
import Settings from "./components/Settings";

// Importing Material-UI components
import AppBar from "@material-ui/core/AppBar";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Icon from "@mdi/react";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Popover from "@material-ui/core/Popover";
import Slider from "@material-ui/core/Slider";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

import { isMobile, isTablet } from "react-device-detect";

import {
  clearStore,
  localFileStore,
  dcmIsOpen,
  activeDcm,
  activeDcmIndex,
  activeMeasurements,
  setLayout,
  dcmTool,
  setDicomdir,
  setZippedFile,
  setVolume,
  filesStore,
  explorerActiveSeriesIndex,
} from "./actions/index";

import {
  // log, // Importing a function named 'log' for logging purposes.

  // Functions related to extracting DICOM metadata.
  getDicomPixelSpacing,
  getDicomSpacingBetweenSlice,
  getDicomSliceThickness,
  getDicomSliceLocation,
  getDicomStudyId,
  getDicomIpp,
  getDicomEchoNumber,

  // Utility functions for working with file extensions and input directory support.
  getFileExtReal,
  isInputDirSupported,

  // Functions for retrieving settings related to file system views, DICOM directory views, and MPR interpolation.
  getSettingsFsView,
  getSettingsDicomdirView,
  getSettingsMprInterpolation,

  // Functions related to DICOM image processing and grouping.
  getDicomImageXOnRows,
  groupBy,

  // Utility functions for checking if an object is empty.
  objectIsEmpty,
} from "./functions";

import {
  mdiAngleAcute,
  mdiAnimationOutline,
  mdiArrowAll,
  mdiArrowSplitHorizontal,
  mdiAxisArrow,
  mdiCamera,
  mdiChartHistogram,
  mdiCheck,
  mdiCheckboxIntermediate,
  mdiContentSaveOutline,
  mdiCursorDefault,
  mdiCursorPointer,
  mdiDelete,
  mdiEllipse,
  mdiEyedropper,
  mdiFileCabinet,
  mdiFileDocument,
  mdiFileCad,
  mdiFolder,
  mdiFolderMultiple,
  mdiGesture,
  mdiCog,
  mdiViewGridPlusOutline,
  mdiImageEdit,
  mdiInformationOutline,
  mdiInvertColors,
  mdiMagnify,
  mdiFolderOpen,
  mdiRefresh,
  mdiRectangle,
  mdiRuler,
  //mdiToolbox,
  mdiTools,
  mdiTrashCanOutline,
  mdiVectorLink,
  mdiVideo,
  mdiWeb,
  mdiPlay,
  mdiPause,
  mdiSkipBackward,
  mdiSkipForward,
  mdiSkipNext,
  mdiSkipPrevious,
} from "@mdi/js";

import "./App.css";

// import * as cornerstoneTools from "cornerstone-tools";

// log(); // Calls the log function, for logging purposes or debugging.

// Sets a 'debug' item in the localStorage with the value 'cornerstoneTools'.
// localStorage.setItem("debug", "cornerstoneTools");

//
//
//

// Defines the width of a drawer component, typically used in responsive layouts.
const drawerWidth = 240;
const iconColor = "#FFFFFF";

const activeColor = "rgba(0, 255, 0, 1.0)";

const styles = (theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.black,
    },
  },

  grow: {
    flexGrow: 1,
  },

  root: {
    display: "flex",
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },

  title: {
    flexGrow: 1,
    fontSize: "1.0em",
  },

  appBar: {
    position: "relative",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#110a07", // White background for a formal app bar
  },

  appBarShift: {
    marginLeft: 1,
    width: "100%",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  hide: {
    display: "none",
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    backgroundColor: "#1f1f1f", // New color for the Drawer
  },

  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },

  toolbar: theme.mixins.toolbar,

  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  listItemText: {
    fontSize: "0.85em",
    marginLeft: "-20px",
  },
});

//
//
//

class App extends PureComponent {
  constructor(props) {
    // Call the constructor of the parent class (React.Component)
    super(props);

    // Initialize instance variables for managing files, folders, URLs, and exploration
    this.files = [];
    this.folder = null;
    this.file = null;
    this.url = null;
    this.explorer = null;
    this.series = null;

    // Initialize data structures for multi-planar reconstruction (MPR)
    this.mprData = {};
    this.mprPlane = "";
    this.echoNumber = 0;

    // Initialize an array to store voxel data for 3D rendering
    this.volume = [];

    // Create references for file open dialogs and bind their respective functions
    this.fileOpen = React.createRef();
    this.showFileOpen = this.showFileOpen.bind(this);

    // Create references for DICOMDIR open dialogs and bind their respective functions
    this.openDicomdir = React.createRef();
    this.showOpenDicomdir = this.showOpenDicomdir.bind(this);

    // Create references for folder open dialogs and bind their respective functions
    this.openFolder = React.createRef();
    this.showOpenFolder = this.showOpenFolder.bind(this);

    // Create a reference for the URL input field
    this.openUrlField = React.createRef();

    // Initialize arrays and references for managing DICOM viewers
    this.dicomViewersActive = [];
    this.dicomViewersActiveSameStudy = [];
    this.dicomViewersActiveSamePlane = [];
    this.dicomViewersRefs = [];
    this.dicomViewers = [];

    // Initialize DICOM viewer instances and references
    for (let i = 0; i < 16; i++) {
      this.dicomViewers.push(this.setDcmViewer(i));
    }

    // Track the number of active DICOM viewers
    this.activeDcmViewersNum = 0;

    // Initialize a data structure for storing reference lines
    this.referenceLines = {};
  }

  state = {
    // Anchor element for layout menu
    anchorElLayout: null,

    // Anchor element for tools panel menu
    anchorElToolsPanel: null,

    // State for controlling the visibility of various menus
    openMenu: false, // Main menu
    openImageEdit: false, // Image editing menu
    openTools: false, // Tools menu
    mprMenu: false, // Multi-Planar Reconstruction (MPR) menu
    mprMode: false, // MPR mode state

    // Text and title message state for displaying messages
    textMessage: "",
    titleMessage: "",

    // State for controlling the visibility of various UI components
    visibleMainMenu: true, // Main menu
    visibleHeader: false, // Header
    visibleSettings: false, // Settings
    visibleToolbar: true, // Toolbar
    visibleOpenUrl: false, // Open URL dialog
    visibleToolbox: false, // Toolbox
    visibleTools: false, // Tools
    visibleMeasure: false, // Measurement tools
    visibleClearMeasureDlg: false, // Clear measurements dialog
    visibleAbout: false, // About dialog
    visibleDicomdir: false, // DICOMDIR viewer
    visibleFileManager: false, // File manager
    visibleZippedFileDlg: false, // Zipped file dialog
    visibleDownloadZipDlg: false, // Download ZIP dialog
    visibleOpenMultipleFilesDlg: false, // Open multiple files dialog
    visibleVolumeBuilding: false, // 3D volume building dialog
    visibleMpr3D: false, // MPR 3D view
    visibleMprOrthogonal: false, // MPR Orthogonal view
    visibleMprCoronal: false, // MPR Coronal view
    visibleMprSagittal: false, // MPR Sagittal view
    visibleMprAxial: false, // MPR Axial view
    visibleExplorer: false, // Explorer
    visibleMessage: false, // Message display
    visibleReferenceLines: true, // Reference lines visibility
    visibleSeriesLink: true, // Series link visibility

    // Tool state and active tool identifier
    toolState: 1,
    toolActive: "notool",

    // Slice index and maximum slice count
    sliceIndex: 0,
    sliceMax: 1,

    // State for controlling the scrolling of the list of open files
    listOpenFilesScrolling: false,
  };

  /*componentDidUpdate() {
    console.log('App - componentDidUpdate: ', this.props.explorerActiveSeriesIndex)

  }*/

  //Function to create and return a DicomViewer component with specified properties
  setDcmViewer = (index) => {
    return (
      <DicomViewer
        // Reference function to store the DicomViewer reference in the array
        dcmRef={(ref) => {
          this.dicomViewersRefs[index] = ref;
        }}
        // Index of the DicomViewer in the array
        index={index}
        // Reference array for DicomViewer components
        dicomViewersRefs={this.dicomViewersRef}
        // Reference function to run a tool
        runTool={(ref) => (this.runTool = ref)}
        // Reference function to change a tool
        changeTool={(ref) => (this.changeTool = ref)}
        // Callback function for image loading completion
        onLoadedImage={this.onLoadedImage}
        // Callback function for image rendering completion
        onRenderedImage={this.onRenderedImage}
        // Function to navigate to the previous frame in the list of open files
        listOpenFilesPreviousFrame={this.listOpenFilesPreviousFrame}
        // Function to navigate to the next frame in the list of open files
        listOpenFilesNextFrame={this.listOpenFilesNextFrame}
        // Flag to enable overlay in the DicomViewer
        overlay={true}
        // Flag to control the visibility of the DicomViewer
        visible={true}
      />
    );
  };

  // Callback function triggered when an image is loaded in the DicomViewer
  onLoadedImage = () => {
    //console.log('App - onLoadedImage: ')
  };

  // Callback function triggered when an image is rendered in the DicomViewer
  onRenderedImage = (index) => {
    // Check if reference lines are defined, visible, and the slice has changed
    if (
      this.referenceLines.crossViewer !== undefined &&
      this.state.visibleReferenceLines &&
      this.isSliceChange &&
      this.referenceLines.crossViewer.layoutIndex === index
    ) {
      // Reset the slice change flag and show reference lines
      this.isSliceChange = false;
      this.referenceLinesShow();
    }
  };

  // Retrieve the reference to the DicomViewer component at a specific index
  getDcmViewerRef = (index) => {
    return this.dicomViewersRefs[index];
  };

  // Retrieve the JSX element of the DicomViewer component at a specific index
  getDcmViewer = (index) => {
    return this.dicomViewers[index];
  };

  // Retrieve the reference to the currently active DicomViewer component based on the activeDcmIndex
  getActiveDcmViewer = () => {
    return this.dicomViewersRefs[this.props.activeDcmIndex];
  };

  /**
   * Handles the action to show the file open dialog.
   * It triggers the closing of any open file-related stores (if any),
   * and programmatically clicks the hidden file input element,
   * effectively opening the file selection dialog for the user.
   */
  showFileOpen() {
    // Close any open file-related stores
    this.props.isOpenStore(false);

    // Programmatically trigger the file input click to open the file selection dialog
    this.fileOpen.current.click();
  }

  // it modified, file cancellation
  /**
   * Handles the action to open local files or a local folder from the file system.
   * If multiple files are selected, it adjusts the layout, resets the MPR state,
   * and displays a dialog for handling multiple files.
   * If a single file is selected, it checks the file type and takes appropriate actions.
   * For ZIP files, it displays a dialog for handling zipped files.
   * For other supported file types, it sets the local file in the store and opens it in the active DICOM viewer.
   * Note: The 'application/x-zip-compressed' and 'application/zip' types are treated as ZIP files.
   *
   * @param {Array} filesSelected - Array of selected files from the file system.
   */
  // Check if any files are selected
  handleOpenLocalFs = (filesSelected) => {
    if (filesSelected.length > 0) {
      // Check if multiple files are selected
      if (filesSelected.length > 1) {
        // Handle multiple files
        this.files = filesSelected;
        this.changeLayout(1, 1);
        this.mprPlane = "";
        this.volume = [];
        // Reset state for multiple files, set visibility flags, and open dialog
        this.setState(
          {
            sliceIndex: 0,
            sliceMax: 1,
            visibleMprOrthogonal: false,
            visibleMprCoronal: false,
            visibleMprSagittal: false,
            visibleMprAxial: false,
          },
          () => {
            this.setState({ visibleOpenMultipleFilesDlg: true });
          }
        );
      } else {
        // Handle a single file
        const file = filesSelected[0];
        // Check if 'type' property exists on the file object
        if (file && typeof file.type !== "undefined") {
          // Log file type for debugging
          console.log("File type:", file.type);
          // Check if the file is a zip file
          if (
            file.type === "application/x-zip-compressed" ||
            file.type === "application/zip"
          ) {
            // Set state for handling a zipped file and open dialog
            this.file = file;
            this.url = null;
            this.setState({ visibleZippedFileDlg: true });
          } else {
            // Reset state, set slice index, and open local file in the viewer
            this.setState({ sliceIndex: 0, sliceMax: 1 });
            this.props.setLocalFileStore(file);
            // Clear and open the local file in the DICOM viewer
            this.dicomViewersRefs[this.props.activeDcmIndex].runTool("clear");
            this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
              "openLocalFs",
              file
            );
          }
        } else {
          // Log an error for an invalid file object or missing 'type' property
          console.error("Invalid file object or missing 'type' property.");
        }
      }
    } else {
      // Log an error if no files are selected
      console.error("No files selected.");
    }
  };

  //Method for handling the opening of a file from a sandbox file system
  handleOpenSandboxFs = (fsItem) => {
    // Clear existing content in the DICOM viewer
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool("clear");

    // Open the specified sandbox file system item in the DICOM viewer
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
      "openSandboxFs",
      fsItem
    );
  };

  //Method for handling the opening of a specific image at the given index
  handleOpenImage = (index) => {
    // Set the slice index in the DICOM viewer for the currently active DCM index
    this.dicomViewersRefs[this.props.activeDcmIndex].sliceIndex = index; // this.state.sliceIndex

    // Retrieve the visibility status and plane of the source image
    const visibleMprOrthogonal = this.state.visibleMprOrthogonal;
    const visibleMprSagittal = this.state.visibleMprSagittal;
    const visibleMprCoronal = this.state.visibleMprCoronal;
    const visibleMprAxial = this.state.visibleMprAxial;
    const plane = this.mprPlanePosition(); // plane of source

    // Check and handle different scenarios based on visibility flags and active DCM index
    if (visibleMprOrthogonal) {
      if (this.props.activeDcmIndex === 0) {
        // Open the image in the first viewer and update reference lines if in MPR mode
        this.dicomViewersRefs[0].runTool("openimage", index);
        if (this.state.mprMode) {
          this.dicomViewersRefs[1].mprReferenceLines(index);
          this.dicomViewersRefs[2].mprReferenceLines(index);
        }
      } else if (this.props.activeDcmIndex === 1) {
        // Commented part: Open specific planes in the second viewer based on the source plane
        if (plane === "sagittal") {
          this.dicomViewersRefs[1].mprRenderXZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        } else if (plane === "axial") {
          this.dicomViewersRefs[1].mprRenderXZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        } else {
          this.dicomViewersRefs[1].mprRenderXZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        }
        // Uncommented part: Continue rendering in the second viewer and update reference lines
        this.dicomViewersRefs[1].mprRenderXZPlane(
          this.dicomViewersRefs[0].filename,
          plane,
          index,
          this.mprData
        );
        this.dicomViewersRefs[2].mprReferenceLines2(index);
        this.dicomViewersRefs[0].mprReferenceLines3(index, this.mprData);
      } else if (this.props.activeDcmIndex === 2) {
        // Commented part: Open specific planes in the third viewer based on the source plane
        if (plane === "sagittal") {
          this.dicomViewersRefs[2].mprRenderYZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        } else if (plane === "axial") {
          this.dicomViewersRefs[2].mprRenderYZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        } else {
          this.dicomViewersRefs[2].mprRenderYZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        }
        // Uncommented part: Continue rendering in the third viewer and update reference lines
        this.dicomViewersRefs[2].mprRenderYZPlane(
          this.dicomViewersRefs[0].filename,
          plane,
          index,
          this.mprData
        );
        this.dicomViewersRefs[1].mprReferenceLines2(index);
        this.dicomViewersRefs[0].mprReferenceLines3(index, this.mprData);
      }
    } else {
      if (objectIsEmpty(this.mprData)) {
        // Works on new image, open it in the current viewer
        this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
          "openimage",
          index
        );
      } else if (
        (plane === "sagittal" && visibleMprSagittal) ||
        (plane === "axial" && visibleMprAxial) ||
        (plane === "coronal" && visibleMprCoronal)
      )
        this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
          "openimage",
          index
        );
      else if (plane === "sagittal" && visibleMprAxial)
        this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderXZPlane(
          this.dicomViewersRefs[0].filename,
          plane,
          index,
          this.mprData
        );
      else if (plane === "sagittal" && visibleMprCoronal)
        this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderYZPlane(
          this.dicomViewersRefs[0].filename,
          plane,
          index,
          this.mprData
        );
      else if (plane === "axial" && visibleMprSagittal)
        this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderYZPlane(
          this.dicomViewersRefs[0].filename,
          plane,
          index,
          this.mprData
        );
      else if (plane === "axial" && visibleMprCoronal)
        this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderXZPlane(
          this.dicomViewersRefs[0].filename,
          plane,
          index,
          this.mprData
        );
      else if (plane === "coronal" && visibleMprSagittal)
        this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderYZPlane(
          this.dicomViewersRefs[0].filename,
          plane,
          index,
          this.mprData
        );
      else if (plane === "coronal" && visibleMprAxial)
        this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderXZPlane(
          this.dicomViewersRefs[0].filename,
          plane,
          index,
          this.mprData
        );
      else {
        // If not a possible MPR scenario, open the image as a normal DICOM file
        this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
          "openimage",
          index
        );
      }
    }

    // Update the count of active DICOM viewers
    this.activeDcmViewersNum = this.getActiveDcmViewers();

    // If there are active viewers, handle additional actions
    if (this.activeDcmViewersNum > 0) {
      // Update viewers with the same study and same plane
      this.getActiveDcmViewersSameStudy();
      this.getActiveDcmViewersSamePlane();

      // If reference lines are visible and there are multiple viewers, show reference lines
      if (
        this.state.visibleReferenceLines &&
        this.dicomViewersActive.length > 1
      ) {
        this.referenceLinesShow();
      }
    }
  };

  // Method for handling the opening of a DICOMDIR file
  handleOpenFileDicomdir = (file) => {
    // Clear tools in the active DICOM viewer
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool("clear");

    // Open the DICOMDIR file in the active DICOM viewer
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
      "openLocalFs",
      file
    );
  };

  // Trigger the click event on the hidden input element to show the file explorer for opening folders
  showOpenFolder() {
    this.openFolder.current.click();
  }

  // Trigger the click event on the hidden input element to show the file explorer for opening DICOMDIR files
  showOpenDicomdir() {
    this.openDicomdir.current.click();
  }

  // Method for handling the opening of a folder containing DICOM files
  handleOpenFolder = (files) => {
    // Check if the DICOM file explorer is currently visible
    if (this.state.visibleExplorer) {
      // If visible, hide the explorer first and then handle opening the folder
      this.setState({ visibleExplorer: false }, () => {
        this.handleOpenFolderDo(files);
      });
    } else {
      // If not visible, directly handle opening the folder
      this.handleOpenFolderDo(files);
    }
  };

  // it's modified, folder cancellation
  // Method for handling the opening of a folder containing DICOM files
  handleOpenFolderDo = (files) => {
    // Check if the files array is not empty and the first file exists
    if (files && files.length > 0 && files[0].webkitRelativePath) {
      // Reset layout, MPR settings, and clear any existing data
      this.changeLayout(1, 1);
      this.mprPlane = "";
      this.volume = [];
      this.files = [];
      this.clear();

      // Extract the folder name from the webkitRelativePath of the first file
      this.folder = files[0].webkitRelativePath.split("/")[0];

      // Copy files into the class property for further reference
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }

      // Reset slice index, visibility flags, and open the multiple files dialog
      this.setState({
        sliceIndex: 0,
        sliceMax: 1,
        visibleMprOrthogonal: false,
        visibleMprCoronal: false,
        visibleMprSagittal: false,
        visibleMprAxial: false,
      });
      this.setState({ visibleOpenMultipleFilesDlg: true });
    } else {
      // Log an error if the files array is invalid or missing 'webkitRelativePath'
      console.error(
        "Invalid files array or missing 'webkitRelativePath' property."
      );
    }
  };

  // Method for handling the opening of a DICOMDIR file
  handleOpenDicomdir = (files) => {
    // Hide the DICOMDIR visibility to initiate processing
    this.setState({ visibleDicomdir: false }, () => {
      // Initialize variables to store DICOMDIR file and other data files
      let dicomdir = null;
      let datafiles = [];

      // Iterate through each file in the selected files array
      for (let i = 0; i < files.length; i++) {
        // Check if the file path includes "DICOMDIR"
        if (files[i].webkitRelativePath.includes("DICOMDIR")) {
          // Set the DICOMDIR file
          dicomdir = files[i];
        } else {
          // Collect other data files
          datafiles.push(files[i]);
        }
      }

      // Check if a DICOMDIR file was found
      if (dicomdir !== null) {
        // Set DICOMDIR information in the application state
        this.props.setDicomdirStore({
          origin: "local",
          dicomdir: dicomdir,
          files: datafiles,
        });

        // Toggle the visibility of the DICOMDIR component
        this.toggleDicomdir();
      } else {
        // If no DICOMDIR file was found, display a warning message
        this.setState(
          {
            titleMessage: "Warning",
            textMessage:
              "The selected folder does not contain any DICOMDIR file.",
          },
          () => {
            // Show the warning message
            this.setState({ visibleMessage: true });
          }
        );
      }
    });
  };

  // Method for handling the opening of a DICOMDIR from the file system
  handleOpenFsDicomdir = (fsItem) => {
    // Set DICOMDIR information in the application state for file system origin
    this.props.setDicomdirStore({ origin: "fs", dicomdir: fsItem, files: [] });

    // Toggle the visibility of the DICOMDIR component
    this.toggleDicomdir();
  };

  // Lifecycle method called after the component is mounted
  componentDidMount() {
    // Need to set the renderNode since the drawer uses an overlay
    // this.dialog = document.getElementById('drawer-routing-example-dialog')

    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }

  // Method to show the app bar by scrolling to the top of the window
  showAppBar = () => {
    window.scrollTo(0, 0);
  };

  // Method to toggle the visibility of the main menu
  toggleMainMenu = () => {
    // Check the settings for file system view position
    const fsViewPosition = getSettingsFsView();

    // Determine the behavior based on the file system view position
    if (fsViewPosition === "left") {
      // If file system view is on the left, toggle main menu and hide file manager
      this.setState({
        visibleMainMenu: !this.state.visibleMainMenu,
        visibleFileManager: false,
      });
    } else {
      // If file system view is not on the left, toggle main menu
      this.setState({ visibleMainMenu: !this.state.visibleMainMenu });
    }
  };

  // Method to explicitly show the main menu
  showMainMenu = () => {
    this.setState({ visibleMainMenu: true });
  };

  // Method to explicitly hide the main menu
  hideMainMenu = () => {
    this.setState({ visibleMainMenu: false });
  };

  // Method to handle the visibility of the main menu
  handleVisibility = (visibleMainMenu) => {
    this.setState({ visibleMainMenu });
  };

  // Method to toggle the visibility of the file manager
  toggleFileManager = () => {
    // Check the settings for file system view position
    if (getSettingsFsView() === "left") {
      // If file system view is on the left, toggle file manager and hide main menu
      this.setState({
        visibleMainMenu: false,
        visibleFileManager: !this.state.visibleFileManager,
      });
    } else {
      // If file system view is not on the left
      const visible = !this.state.visibleFileManager;
      this.setState({ visibleFileManager: visible });

      // If file manager is being shown, hide other UI components
      if (visible)
        this.setState({
          visibleMeasure: false,
          visibleHeader: false,
          visibleToolbox: false,
          visibleDicomdir: false,
          visibleExplorer: false,
        });
    }
  };

  // Method to toggle the visibility of the explorer
  toggleExplorer = () => {
    // Toggle the visibility of the explorer
    const visible = !this.state.visibleExplorer;
    this.setState({ visibleExplorer: visible });

    // If explorer is being shown, hide other UI components
    if (visible)
      this.setState({
        visibleMeasure: false,
        visibleHeader: false,
        visibleToolbox: false,
        visibleDicomdir: false,
        visibleFileManager: false,
      });
  };

  // Method to toggle the visibility of the header
  toggleHeader = () => {
    // Toggle the visibility of the header
    const visible = !this.state.visibleHeader;
    this.setState({ visibleHeader: visible });

    // If header is being shown, hide other UI components
    if (visible)
      this.setState({
        visibleMeasure: false,
        visibleToolbox: false,
        visibleDicomdir: false,
        visibleFileManager: false,
        visibleExplorer: false,
      });
  };

  // Method to toggle the visibility of the toolbox
  toggleToolbox = () => {
    // Toggle the visibility of the toolbox
    const visible = !this.state.visibleToolbox;
    this.setState({ visibleToolbox: visible });

    // If toolbox is being shown, hide other UI components
    if (visible)
      this.setState({
        visibleMeasure: false,
        visibleHeader: false,
        visibleDicomdir: false,
        visibleFileManager: false,
        visibleExplorer: false,
      });
  };

  // Method to save measurements using the active DICOM viewer's tool
  saveMeasure = () => {
    // Run the "savetools" tool on the active DICOM viewer
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool("savetools");
  };

  // Method to toggle the visibility of measurement tools
  toggleMeasure = () => {
    // Toggle the visibility of measurement tools
    const visible = !this.state.visibleMeasure;
    this.setState({ visibleMeasure: visible });

    // If measurement tools are being shown, hide other UI components
    if (visible)
      this.setState({
        visibleToolbox: false,
        visibleHeader: false,
        visibleDicomdir: false,
        visibleFileManager: false,
        visibleExplorer: false,
      });
  };

  // Method to explicitly hide measurement tools
  hideMeasure = () => {
    this.setState({ visibleMeasure: false });
  };

  // Method to handle the visibility of measurement tools
  handleVisibilityMeasure = (visibleMeasure) => {
    this.setState({ visibleMeasure });
  };

  // Method to toggle the visibility of DICOM directory
  toggleDicomdir = () => {
    // Toggle the visibility of DICOM directory
    const visible = !this.state.visibleDicomdir;
    this.setState({ visibleDicomdir: visible });

    // If DICOM directory is being shown, hide other UI components
    if (visible)
      this.setState({
        visibleMeasure: false,
        visibleToolbox: false,
        visibleHeader: false,
        visibleFileManager: false,
      });
  };

  // Method to clear measurements and prompt for confirmation
  clearMeasure = () => {
    // Show the clear measurement dialog
    this.showClearMeasureDlg();
  };

  // Method to show the clear measurement dialog
  showClearMeasureDlg = () => {
    this.setState({ visibleClearMeasureDlg: true });
  };

  // Method to hide the clear measurement dialog
  hideClearMeasureDlg = () => {
    this.setState({ visibleClearMeasureDlg: false });
  };

  // Method to confirm and execute the clear measurement action
  confirmClearMeasureDlg = () => {
    // Hide the clear measurement dialog
    this.hideClearMeasureDlg();

    // Run the "removetools" tool on the active DICOM viewer
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool("removetools");
  };

  // Method to show the zipped file dialog
  showZippedFileDlg = () => {
    this.setState({ visibleZippedFileDlg: true });
  };

  // Method to hide the zipped file dialog
  hideZippedFileDlg = () => {
    this.setState({ visibleZippedFileDlg: false });
  };

  // Method to confirm the zipped file dialog action
  confirmZippedFileDlg = () => {
    // Hide the zipped file dialog
    this.hideZippedFileDlg();

    // Set visibility for the file manager and handle further actions
    this.setState({ visibleFileManager: true }, () => {
      // If there is a URL, show the download zip dialog; otherwise, set the zipped file in the file system
      if (this.url !== null) {
        this.setState({ visibleDownloadZipDlg: true });
      } else {
        this.props.setFsZippedFile(this.file);
      }
    });
  };

  // Method to toggle the visibility of the "About" section
  showAbout = () => {
    // Toggle the visibility of the "About" section
    this.setState({ visibleAbout: !this.state.visibleAbout });
  };

  // Method to show the settings and hide other UI components
  showSettings = () => {
    this.setState({
      visibleMainMenu: false,
      visibleSettings: true,
      visibleToolbar: false,
      position: "right",
    });
  };

  // Method to hide the settings and show other UI components
  hideSettings = () => {
    this.setState({
      visibleMainMenu: true,
      visibleSettings: false,
      visibleToolbar: true,
      visibleFileManager: false,
      visibleDicomdir: false,
    });
  };

  // Method to handle the visibility of the settings
  handleVisibilitySettings = (visibleSettings) => {
    this.setState({ visibleSettings });
  };

  // Method to hide the download zip dialog
  hideDownloadZipDlg = () => {
    this.setState({ visibleDownloadZipDlg: false });
  };

  // Method to hide the open multiple files dialog and perform additional actions
  hideOpenMultipleFilesDlg = () => {
    this.setState({ visibleOpenMultipleFilesDlg: false });

    // Perform additional actions after closing the open multiple files dialog
    this.openMultipleFilesCompleted();
  };

  // Method to handle actions after completing the opening of multiple files
  openMultipleFilesCompleted = () => {
    // Check if files are available in props
    if (this.props.files !== null) {
      // Change layout to 1x1
      this.changeLayout(1, 1);

      // Open the first image in the series
      this.dicomViewersRefs[this.props.activeDcmIndex].runTool("openimage", 0);

      // Set the maximum number of slices
      const sliceMax = this.props.files.length;
      this.setState({ sliceMax: sliceMax });

      // Check if there are studies and series, if so, prepare the Explorer
      const patientList = groupBy(
        this.props.files,
        (a) => a.patient.patientName
      );
      const patientKeys = [...patientList.keys()];
      const patient = {
        list: patientList,
        keys: patientKeys,
      };

      this.explorer = {
        folder: this.folder,
        patient: patient,
      };

      // Show Explorer if there are multiple slices
      if (sliceMax > 1)
        this.setState({ visibleExplorer: true, visibleFileManager: false });
    }
  };

  // Method to show the open URL dialog
  showOpenUrl = () => {
    this.setState({ visibleOpenUrl: true });
  };

  // Method to hide the open URL dialog and perform actions based on user input
  hideOpenUrl = (openDlg) => {
    this.setState({ visibleOpenUrl: false }, () => {
      // Check if the user confirmed opening the URL dialog
      if (openDlg) {
        // Hide the main menu
        this.hideMainMenu();

        // Clear file and set URL
        this.file = null;
        this.url = this.openUrlField.value;

        // Check if the URL points to a zip file
        if (getFileExtReal(this.url) === "zip") {
          // Show the dialog for handling zipped files
          this.setState({ visibleZippedFileDlg: true });
        } else {
          // Open the URL in the DICOM viewer
          return this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
            "openurl",
            this.openUrlField.value
          );
        }
      }
    });
  };

  // Method to handle the download of the opened URL
  downloadOpenUrl = () => {
    // Hide the open URL dialog and show the toolbar
    this.setState({ visibleOpenUrl: false, visibleToolbar: true });
  };

  // Method to reset the image in the active DICOM viewer
  resetImage = () => {
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool("reset");
  };

  // Method to save the current view as an image shot
  saveShot = () => {
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool("saveas");
  };

  // Method to activate the cine player tool in the active DICOM viewer
  cinePlayer = () => {
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool("cine");
  };

  // Method to clear the active DICOM viewer and reset the state
  clear = () => {
    // Change layout to 1x1 and clear each open DICOM viewer
    this.layoutGridClick(0);
    for (let i = 0; i < this.props.isOpen.length; i++)
      if (this.props.isOpen[i] && this.dicomViewersRefs[i]) {
        this.dicomViewersRefs[i].runTool("clear");
      }

    // Set timeouts to ensure the state changes happen after clearing
    setTimeout(() => {
      // Reset various state properties
      this.setState(
        {
          openImageEdit: false,
          openTools: false,
          mprMenu: false,
          visibleToolbox: false,
          visibleMeasure: false,
          visibleHeader: false,
          visibleDicomdir: false,
        },
        () => {}
      );
      // Change layout to 1x1 and clear files and dicomdir in the store
      this.changeLayout(1, 1);
      this.props.setFilesStore(null);
      this.props.setDicomdirStore(null);
    }, 100);
  };

  //#region Layout handler
  // Method to handle the layout based on user actions
  handleLayout = (event) => {
    // Open the layout options menu
    this.setState({ anchorElLayout: event.currentTarget });
  };

  // Method to close the layout options menu
  closeLayout = () => {
    this.setState({ anchorElLayout: null });
  };

  // Method to change the layout of DICOM viewers in the application
  changeLayout = (row, col) => {
    // Check if the new layout size is smaller than the current layout
    if (row < this.props.layout[0] || col < this.props.layout[1]) {
      // Loop through the DICOM viewer grid
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          // Check if the viewer at the current grid position should be removed
          if (i + 1 > row || j + 1 > col) {
            const index = i * 4 + j;
            // Set the reference to the DICOM viewer as undefined
            this.dicomViewersRefs[index] = undefined;
            // If the removed viewer is the active one, click the previous viewer
            if (index === this.props.activeDcmIndex)
              this.layoutGridClick(index - 1);
          }
        }
      }
      // Update the number of active DICOM viewers
      this.activeDcmViewersNum = this.getActiveDcmViewers();
      // If multiple files are open and only one viewer is active, show the MPR menu
      if (this.isMultipleFiles && this.activeDcmViewersNum === 1)
        this.setState({ mprMenu: true });
    }
    // Update the layout in the application store
    this.props.setLayoutStore(row, col);
  };

  //#endregion

  // Tools panel handler region
  //#region Tools panel handler
  // Method to handle the opening of the tools panel
  handleToolsPanel = (event) => {
    this.setState({ anchorElToolsPanel: event.currentTarget });
  };

  // Method to handle the closing of the tools panel
  closeToolsPanel = () => {
    this.setState({ anchorElToolsPanel: null });
  };
  //#endregion

  // Method to execute a specified tool
  toolExecute = (tool) => {
    // Close the tools panel
    this.closeToolsPanel();

    // Execute the specified tool based on the provided argument
    if (tool === "referencelines") {
      this.referenceLinesToggle();
    } else if (tool === "serieslink") {
      this.seriesLinkToggle();
    } else {
      // Set the active tool in the component state and store
      this.setState({ toolActive: tool });
      this.props.toolStore(tool);

      // Run the specified tool in the DICOM viewer
      this.dicomViewersRefs[this.props.activeDcmIndex].runTool(tool);
    }
  };

  // Method to toggle the state of a tool
  toolChange = () => {
    // Toggle the state of the tool
    const toolState = 1 - this.state.toolState;
    this.setState({ toolState: toolState }, () => {
      this.changeTool.changeTool(this.props.tool, toolState);
    });
  };

  // Method to remove a specific tool
  toolRemove = (index) => {
    // Run the remove tool action in the DICOM viewer
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
      "removetool",
      index
    );
  };

  // Toggle method for opening/closing the main menu
  toggleOpenMenu = () => {
    this.setState({ openMenu: !this.state.openMenu });
  };

  // Toggle method for opening/closing the image edit menu
  toggleImageEdit = () => {
    this.setState({ openImageEdit: !this.state.openImageEdit });
  };

  // Toggle method for opening/closing the tools menu
  toggleTools = () => {
    this.setState({ openTools: !this.state.openTools });
  };

  // Toggle method for opening/closing the MPR (Multi-Planar Reconstruction) menu
  toggleMpr = () => {
    this.setState({ mprMenu: !this.state.mprMenu });
  };

  // Method to handle click on the layout grid
  layoutGridClick = (index) => {
    // Ignore the click on mobile if it's the active DCM index
    if (isMobile && index === this.props.activeDcmIndex) return;

    // Set the slice information based on the clicked viewer
    const sliceMax = this.dicomViewersRefs[index].sliceMax;
    const sliceIndex = this.dicomViewersRefs[index].sliceIndex;
    this.setState({ sliceMax: sliceMax, sliceIndex: sliceIndex });

    // Set the active DCM index
    this.props.setActiveDcmIndex(index);

    // Update the slice information if MPR orthogonal view is active
    if (this.state.visibleMprOrthogonal) {
      this.setState({ sliceMax: sliceMax, sliceIndex: sliceIndex });
    }

    const dcmViewer = this.getDcmViewerRef(index);

    // Return if the clicked frame is empty
    if (dcmViewer.image === null) return;

    // Set active measurements and DCM for further processing
    this.props.setActiveMeasurements(dcmViewer.measurements);
    this.props.setActiveDcm(dcmViewer);
    this.props.setExplorerActiveSeriesIndex(dcmViewer.explorerIndex);

    // If reference lines are visible, update the scoutViewer and toggle reference lines
    if (
      this.state.visibleReferenceLines &&
      this.dicomViewersActive.length > 1
    ) {
      if (this.referenceLines.scoutViewer !== undefined)
        this.referenceLines.scoutViewer.updateImage();
      this.setState({ visibleReferenceLines: false }, () => {
        this.referenceLinesToggle();
      });
    }
  };

  // Method to handle touch events on the layout grid
  layoutGridTouch = (index) => {
    // Ignore touch events on non-mobile devices if it's the active DCM index
    if (!isMobile && index === this.props.activeDcmIndex) return;
  };

  // Function to construct a grid layout for DICOM viewers
  buildLayoutGrid = () => {
    // Commented out: Hides reference lines, potential feature toggle
    //this.referenceLinesHide()

    // Array to store DICOM viewer elements
    let dicomviewers = [];

    // Outer loop for grid rows
    for (let i = 0; i < this.props.layout[0]; i++) {
      // Inner loop for grid columns
      for (let j = 0; j < this.props.layout[1]; j++) {
        // Style definition for each grid cell
        const styleLayoutGrid = {
          border:
            this.props.layout[0] === 1 && this.props.layout[1] === 1
              ? "solid 1px #000000" // Single-cell layout border color
              : "solid 1px #444444", // Border color for other layouts
        };

        // Calculate the index for DICOM viewer in the grid
        const index = i * 4 + j;

        // Create a grid cell with DICOM viewer
        dicomviewers.push(
          <div
            key={index}
            style={styleLayoutGrid}
            onClick={() => this.layoutGridClick(index)} // Click event handler
            onTouchStart={() => this.layoutGridTouch(index)} // Touch event handler
          >
            {/* // DICOM viewer content */}
            {this.getDcmViewer(index)}
          </div>
        );
      }
    }

    // Return the constructed grid layout
    return (
      <div
        id="dicomviewer-grid"
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${this.props.layout[0]}, ${
            100 / this.props.layout[0]
          }%)`,
          gridTemplateColumns: `repeat(${this.props.layout[1]}, ${
            100 / this.props.layout[1]
          }%)`,
          height: "90%",
          width: "80%",
          marginLeft: "auto", // Add a right margin to shift towards the right
          marginRight: "auto",
        }}
      >
        {/* Include DICOM viewers in the grid */}
        {dicomviewers}
      </div>
    );
  };

  // Function to determine the string representation of the currently visible MPR plane
  getStringVisiblePlane = () => {
    if (this.state.visibleMprOrthogonal) return "orthogonal";
    else if (this.state.visibleMprSagittal) return "sagittal";
    else if (this.state.visibleMprAxial) return "axial";
    else if (this.state.visibleMprCoronal) return "coronal";
  };

  // Function to determine the title for the app bar based on screen size, viewer state, and DICOM directory information
  appBarTitle = (classes, isOpen, dcmViewer) => {
    // Check if the device is mobile and not a tablet
    if (isMobile && !isTablet) {
      // Check if a viewer is open
      if (isOpen) return null;
      // Return app title if no viewer is open
      else
        return (
          <div>
            <img
              className="navbar__top__logo__image"
              src="/DECODE1.png"
              alt="DECODE"
            />
            <Typography variant="overline" className={classes.title}>
              <strong></strong> <strong></strong> <strong></strong>
            </Typography>
          </div>
        );
    } else {
      // Check if a viewer is open
      if (isOpen) {
        // Determine the current MPR plane and display it if MPR is active
        const plane = this.getStringVisiblePlane();
        if (
          this.state.sliceMax > 1 &&
          this.mprPlane !== plane &&
          this.mprPlane !== ""
        ) {
          return (
            <Typography variant="overline" className={classes.title}>
              {"MPR " + plane}
            </Typography>
          );
        }
        // Display the filename of the currently open DICOM image if dcmViewer and filename are defined
        if (dcmViewer && dcmViewer.filename) {
          return (
            <Typography variant="overline" className={classes.title}>
              {dcmViewer.filename}
            </Typography>
          );
        }
      } else if (this.props.dicomdir !== null) {
        // Display the path of the DICOM directory if available
        if (
          this.props.dicomdir.dicomdir &&
          this.props.dicomdir.dicomdir.webkitRelativePath
        ) {
          return (
            <Typography variant="overline" className={classes.title}>
              {this.props.dicomdir.dicomdir.webkitRelativePath}
            </Typography>
          );
        }
      }
      // Return app title if no viewer is open and no DICOM directory is loaded
      return (
        <div>
          <img
            className="navbar__top__logo__image"
            src="/DECODE1.png"
            alt="DECODE"
          />
          <Typography variant="overline" className={classes.title}>
            <strong></strong> <strong></strong>
            <strong></strong>
          </Typography>
        </div>
      );
    }
  };

  // ------- LINK SERIES
  // #region LINK SERIES

  // Toggle function for controlling the visibility of series linking feature
  seriesLinkToggle = () => {
    // Toggle the visibility of the series linking feature
    this.setState({ visibleSeriesLink: !this.state.visibleSeriesLink });
  };

  // -------- REFERENCE LINES
  // #region REFERENCE LINES

  // Toggle function for controlling the visibility of reference lines
  referenceLinesToggle = () => {
    // Commented out: Skip if in MPR (Multi-Planar Reconstruction) mode
    //if (this.state.mprMode) return;

    // Toggle the visibility of reference lines
    const visible = !this.state.visibleReferenceLines;
    this.setState({ visibleReferenceLines: visible });

    // Check if reference lines are visible and there are multiple active DICOM viewers
    if (visible && this.dicomViewersActive.length > 1) {
      // Set the cross-sectional viewer as the reference for reference lines
      this.referenceLines.crossViewer = this.getDcmViewerRef(
        this.props.activeDcmIndex
      ); // this is the cross-sectional image

      // Get the plane of the cross-sectional viewer for filtering other viewers
      const crossMprPlane = this.referenceLines.crossViewer.mprPlane;

      // Filter other viewers based on layout and plane
      this.openViewers = this.dicomViewersActive.filter(
        (v) =>
          v.layoutIndex !== this.props.activeDcmIndex &&
          crossMprPlane !== v.mprPlane
      );

      // Draw reference lines and show them
      this.referenceLinesDraw();
      this.referenceLinesShow();
    } else {
      // If reference lines are not visible or there's only one viewer, hide reference lines
      this.referenceLinesHide();
    }
  };

  // Function to show reference lines
  referenceLinesShow = () => {
    // Conditions to check whether to proceed with showing reference lines
    if (
      this.state.mprMode ||
      !this.state.visibleReferenceLines ||
      this.dicomViewersActive.length < 2
    )
      return;

    // Set the cross-sectional viewer as the reference for reference lines
    this.referenceLines.crossViewer = this.getDcmViewerRef(
      this.props.activeDcmIndex
    ); // this is cross-sectional image

    // Get the plane of the cross-sectional viewer for filtering other viewers
    const crossMprPlane = this.referenceLines.crossViewer.mprPlane;

    // Filter other viewers based on layout and plane
    this.openViewers = this.dicomViewersActive.filter(
      (v) =>
        v.layoutIndex !== this.props.activeDcmIndex &&
        crossMprPlane !== v.mprPlane
    );

    // Draw reference lines
    this.referenceLinesDraw();

    // Update the image of the cross-sectional viewer
    this.referenceLines.crossViewer.updateImage();

    // Build reference lines for other viewers
    for (let i = 0; i < this.openViewers.length; i++) {
      this.openViewers[i].referenceLinesBuild(
        this.referenceLines.crossViewer.image
      ); // this is scout image
    }
  };

  // Function to hide reference lines
  referenceLinesHide = () => {
    // Conditions to check whether to proceed with hiding reference lines
    if (this.state.mprMode || this.openViewers === undefined) return;

    // Update the image of other viewers (scout image)
    for (let i = 0; i < this.openViewers.length; i++) {
      this.openViewers[i].updateImage(); // this is scout image
    }
  };

  // Function to draw reference lines
  referenceLinesDraw = () => {
    // Skip drawing if in MPR mode
    if (this.state.mprMode) return;

    // Update the image of the cross-sectional viewer
    this.referenceLines.crossViewer.updateImage();

    // Build reference lines for other viewers
    for (let i = 0; i < this.openViewers.length; i++) {
      this.openViewers[i].referenceLinesBuild(
        this.referenceLines.crossViewer.image
      ); // this is scout image
    }
  };

  // #endregion

  // ---------------------------------------------------------------------------------------------- MPR
  // #region MPR

  // Define a method for building the volume for multiplanar reconstruction (MPR)
  mprBuildVolume = () => {
    // "For the specific case of dual-echo MR images select files with same EchoNumber tag of selected image.
    // see https://groups.google.com/forum/#!topic/comp.protocols.dicom/zh2TzgbjvdE
    // Extract the echo number from the selected DICOM image
    const echoNumber = getDicomEchoNumber(
      this.dicomViewersRefs[this.props.activeDcmIndex].image
    );

    // Check if the volume is already built for the given echo number
    if (this.volume.length > 0 && echoNumber === this.echoNumber) return;

    // Record the start time for performance measurement
    this.t0 = performance.now();

    // Filter files with the same echo number as the selected image
    const files = this.dicomViewersRefs[0].files.filter((a) => {
      return a.series.echoNumber === echoNumber;
    });

    // If the number of filtered files is less than the total number of files, update files and echo number
    if (files.length < this.files.length) {
      this.echoNumber = echoNumber;
      this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
        "setfiles",
        files
      );
    }

    // Retrieve information about the selected slice
    const sliceIndex = this.state.sliceIndex;
    const xPixelSpacing = getDicomPixelSpacing(files[sliceIndex].image, 1);
    const spacingBetweenSlice = getDicomSpacingBetweenSlice(
      files[sliceIndex].image
    );
    const sliceThickness = getDicomSliceThickness(files[sliceIndex].image);
    const length = files[sliceIndex].image.getPixelData().length;
    const sliceLocation = getDicomSliceLocation(files[sliceIndex].image);

    // Initialize the volume array
    this.volume = [];
    // see https://stackoverflow.com/questions/58412358/dicom-multiplanar-image-reconstruction
    // Calculate the z dimension for MPR based on the selected files equation
    this.mprData.zDim = Math.round(
      (files.length * spacingBetweenSlice) / xPixelSpacing
    );

    // Check if an alternative algorithm should be used based on slice distance
    let zDimMethod2 = false;
    if (spacingBetweenSlice < sliceThickness && sliceLocation === undefined) {
      const max = Math.max(...files.map((file) => file.sliceDistance));
      const min = Math.min(...files.map((file) => file.sliceDistance));
      this.mprData.zDim = Math.round(Math.abs(max - min) / xPixelSpacing);
      zDimMethod2 = true;
    }

    // Calculate the z step for MPR
    this.mprData.zStep =
      files.length > 0 ? Math.round(this.mprData.zDim / files.length) : 1;

    // Build the volume based on the number of files and selected method
    if (files.length === this.mprData.zDim) {
      // Slices are contiguous
      for (let i = 0, len = files.length; i < len; i++) {
        this.volume.push(files[i].image.getPixelData());
      }
    } else if (files.length < this.mprData.zDim) {
      // Gap between slices

      // Initialize an empty plane
      let emptyPlane = new Int16Array(length).fill(0);
      for (let i = 0, len = this.mprData.zDim; i < len; i++) {
        this.volume.push(emptyPlane);
      }

      // Create an order array based on slice distance
      let order = files.map((file, i) => ({
        iFile: i,
        instanceNumber: file.instanceNumber,
        sliceDistance: file.sliceDistance,
        sliceLocation: file.sliceLocation,
      }));

      // Process order array based on the selected method
      if (zDimMethod2) {
        // Eliminate duplicates and sort by instance number
        order = order.reduce((previous, current) => {
          let object = previous.filter(
            (object) => object.sliceDistance === current.sliceDistance
          );
          if (object.length === 0) {
            previous.push(current);
          }
          return previous;
        }, []);

        order.sort((l, r) => {
          return l.instanceNumber - r.instanceNumber;
        });
      } else {
        // Sort based on slice distance and orientation
        const reorder = files[0].sliceDistance < files[1].sliceDistance;
        if (reorder) {
          order.sort((l, r) => {
            return r.sliceDistance - l.sliceDistance;
          });
        } else {
          const isOnRows = getDicomImageXOnRows(files[sliceIndex].image);
          const reorder =
            Math.sign(files[0].sliceDistance) *
              Math.sign(files[0].sliceLocation) <
            0;
          if (reorder) {
            order.sort((l, r) => {
              if (isOnRows) return l.sliceDistance - r.sliceDistance;
              else return r.sliceDistance - l.sliceDistance;
            });
          }
        }
      }

      // Update MPR data based on the order
      this.mprData.instanceNumberOrder =
        files[order[0].iFile].instanceNumber <
        files[order[1].iFile].instanceNumber
          ? 1
          : -1;
      this.mprData.indexMax = files.length;

      // Create intervals for interpolation
      let intervals = [0];
      this.volume[0] = files[order[0].iFile].image.getPixelData();
      this.volume[this.mprData.zDim - 1] =
        files[order[order.length - 1].iFile].image.getPixelData();

      // Adjust the step size based on the total number of slices and the level of detail you want in the interpolation
      const step = Math.floor((this.mprData.zDim - 2) / (order.length - 2));

      let i = 0;
      for (let k = 1; k <= order.length - 2; k++) {
        i += step;
        intervals.push(i);
        this.volume[i] = files[order[k].iFile].image.getPixelData();
      }
      intervals.push(this.mprData.zDim - 1);

      // Select interpolation method
      const interpolationMethod = getSettingsMprInterpolation();

      if (interpolationMethod === "no") {
        // Build missing planes without interpolation (simple duplicate)
        for (let i = 0; i < intervals.length - 1; i++)
          for (let j = intervals[i] + 1; j <= intervals[i + 1] - 1; j++)
            this.volume[j] = this.volume[intervals[i + 1]];
      } else if (interpolationMethod === "weightedlinear") {
        // Build interpolate planes between original planes using bicubic interpolation for edge pixels and bilinear interpolation for other pixels
        for (let i = 0; i < intervals.length - 1; i++) {
          const step = intervals[i + 1] - intervals[i];
          for (let j = intervals[i] + 1; j < intervals[i + 1]; j++) {
            let p = new Int16Array(length);
            const w = (j - intervals[i]) / step;
            for (let k = 0; k < length - 1; k++) {
              if (isEdgePixel(k, length)) {
                // bicubic interpolation for edge pixels
                const p0 = this.volume[intervals[i] - 1]
                  ? this.volume[intervals[i] - 1][k]
                  : this.volume[intervals[i]][k];
                const p1 = this.volume[intervals[i]][k];
                const p2 = this.volume[intervals[i] + 1]
                  ? this.volume[intervals[i] + 1][k]
                  : this.volume[intervals[i]][k];
                const p3 = this.volume[intervals[i] + 2]
                  ? this.volume[intervals[i] + 2][k]
                  : this.volume[intervals[i]][k];

                p[k] = bicubicInterpolate(p0, p1, p2, p3, w);
              } else {
                // weighted bilinear interpolation for non-edge pixels
                if (k - 1 > 0 && k + 1 < length) {
                  const p0 =
                    this.volume[intervals[i]][k] * (1 - w) * 0.5 +
                    this.volume[intervals[i]][k - 1] * (1 - w) * 0.25 +
                    this.volume[intervals[i]][k + 1] * (1 - w) * 0.25;
                  const p1 =
                    this.volume[intervals[i + 1]][k] * w * 0.5 +
                    this.volume[intervals[i + 1]][k - 1] * w * 0.25 +
                    this.volume[intervals[i + 1]][k + 1] * w * 0.25;
                  p[k] = p0 + p1;
                } else if (k - 1 < 0) {
                  const p0 =
                    this.volume[intervals[i]][k] * (1 - w) * 0.75 +
                    this.volume[intervals[i]][k + 1] * (1 - w) * 0.25;
                  const p1 =
                    this.volume[intervals[i + 1]][k] * w * 0.5 +
                    this.volume[intervals[i + 1]][k + 1] * w * 0.25;
                  p[k] = p0 + p1;
                } else {
                  const p0 =
                    this.volume[intervals[i]][k] * (1 - w) * 0.75 +
                    this.volume[intervals[i]][k - 1] * (1 - w) * 0.25;
                  const p1 =
                    this.volume[intervals[i + 1]][k] * w * 0.5 +
                    this.volume[intervals[i + 1]][k - 1] * w * 0.25;
                  p[k] = p0 + p1;
                }
              }
            }

            // Update the volume with the interpolated plane
            this.volume[j] = p;
          }
        }

        // Check if a pixel is an edge pixel
        function isEdgePixel(index, length) {
          return index === 0 || index === length - 1;
        }

        // Bicubic interpolation function
        function bicubicInterpolate(p0, p1, p2, p3, t) {
          const v0 = cubicInterpolate(p0, p1, p2, p3, t - 1);
          const v1 = cubicInterpolate(p0, p1, p2, p3, t);
          const v2 = cubicInterpolate(p0, p1, p2, p3, t + 1);
          const v3 = cubicInterpolate(p0, p1, p2, p3, t + 2);

          return cubicInterpolate(v0, v1, v2, v3, t);
        }

        // Cubic interpolation function
        function cubicInterpolate(p0, p1, p2, p3, t) {
          const a = p3 - p2 - p0 + p1;
          const b = p0 - p1 - a;
          const c = p2 - p0;
          const d = p1;

          return a * t * t * t + b * t * t + c * t + d;
        }
      }
    } else {
      // Overlapping slices

      // Calculate z step for overlapping slices
      this.mprData.zStep = Math.round(files.length / this.mprData.zDim);

      // Initialize the volume array with zeros
      this.volume = Array(this.mprData.zDim)
        .fill(0)
        .map(() => new Int16Array(length));

      // Build the volume for overlapping slices
      for (let i = 0, len = this.mprData.zDim; i < len; i++) {
        const k = i * this.mprData.zStep;
        this.volume[i] = files[k].image.getPixelData();
      }
    }

    // Record the end time for performance measurement
    this.t1 = performance.now();
    console.log(
      `Performance: Volume building time - ${this.t1 - this.t0} milliseconds`
    );

    // Set the slice index and update the view based on the current MPR mode
    const index = Math.round(files.length / 2);
    this.setState({ sliceIndex: index }, () => {
      if (this.state.visibleMprOrthogonal) {
        this.changeToOrthogonalView();
      } else if (this.state.visibleMprSagittal) {
        this.changeToSagittalView();
      } else if (this.state.visibleMprCoronal) {
        this.changeToCoronalView();
      } else {
        // Axial view
        this.changeToAxialView();
      }
    });
  };

  // Switch to orthogonal view mode
  changeToOrthogonalView = () => {
    // Set the maximum slice number based on the number of files in the first viewer
    this.setState({ sliceMax: this.dicomViewersRefs[0].files.length });

    // Change the layout to display three orthogonal planes (axial, coronal, sagittal)
    this.changeLayout(1, 3);

    // Calculate the index for the central slice
    const index = Math.trunc(this.dicomViewersRefs[0].files.length / 2);

    // Update state to reflect changes and switch to multiplanar reconstruction (MPR) mode
    this.setState(
      { visibleVolumeBuilding: false, sliceIndex: index, mprMode: true },
      () => {
        // Calculate the current position of the MPR plane
        const plane = this.mprPlanePosition();

        // Set the volume for the first viewer if not already set
        if (this.dicomViewersRefs[0].volume === null)
          this.dicomViewersRefs[0].volume = this.volume;

        // Open the image in the first viewer at the central slice index
        this.dicomViewersRefs[0].runTool("openimage", index);

        // Set the volume for the second viewer if not already set
        if (this.dicomViewersRefs[1].volume === null)
          this.dicomViewersRefs[1].volume = this.volume;

        // Set files, explorer index, and slice information for the second viewer
        this.dicomViewersRefs[1].runTool("setfiles", this.files);
        this.dicomViewersRefs[1].explorerIndex =
          this.dicomViewersRefs[0].explorerIndex;
        this.dicomViewersRefs[1].sliceMax =
          this.dicomViewersRefs[0].files[index].image.columns;

        // Calculate the index for the XZ plane in the second viewer
        const xzIndex = Math.trunc(this.dicomViewersRefs[1].sliceMax / 2);

        // Render the XZ plane in the second viewer based on MPR data
        this.dicomViewersRefs[1].mprRenderXZPlane(
          this.dicomViewersRefs[0].filename,
          plane,
          xzIndex,
          this.mprData
        );

        // Set the volume for the third viewer if not already set
        if (this.dicomViewersRefs[2].volume === null)
          this.dicomViewersRefs[2].volume = this.volume;

        // Set files, explorer index, and slice information for the third viewer
        this.dicomViewersRefs[2].runTool("setfiles", this.files);
        this.dicomViewersRefs[2].explorerIndex =
          this.dicomViewersRefs[0].explorerIndex;
        this.dicomViewersRefs[2].sliceMax =
          this.dicomViewersRefs[0].files[index].image.columns;

        // Calculate the index for the YZ plane in the third viewer
        const yzIndex = Math.trunc(this.dicomViewersRefs[2].sliceMax / 2);

        // Render the YZ plane in the third viewer based on MPR data
        this.dicomViewersRefs[2].mprRenderYZPlane(
          this.dicomViewersRefs[0].filename,
          plane,
          yzIndex,
          this.mprData
        );
      }
    );
  };

  // Switch to sagittal view mode
  changeToSagittalView = () => {
    // Change layout to display a single sagittal plane
    this.changeLayout(1, 1);

    // Update state to reflect changes and disable volume building visibility
    this.setState({ visibleVolumeBuilding: false }, () => {
      // Calculate the current position of the MPR plane
      const plane = this.mprPlanePosition();

      // Set the volume for the active DICOM viewer if not already set
      if (this.dicomViewersRefs[this.props.activeDcmIndex].volume === null)
        this.dicomViewersRefs[this.props.activeDcmIndex].volume = this.volume;

      // Check the orientation of the MPR plane
      if (plane === "sagittal") {
        // Set files for the first viewer and update state for axial orientation
        this.dicomViewersRefs[0].runTool("setfiles", this.files);
        const sliceMax =
          this.dicomViewersRefs[0].files === null
            ? 1
            : this.dicomViewersRefs[0].files.length;
        const index = Math.trunc(sliceMax / 2);
        this.setState(
          { sliceIndex: index, sliceMax: sliceMax, mprMode: false },
          () => {
            this.dicomViewersRefs[this.props.activeDcmIndex].sliceMax =
              sliceMax;
            this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
              "openimage",
              index
            );
          }
        );
      } else if (plane === "axial") {
        // Set slice information for axial orientation
        const sliceMax = this.dicomViewersRefs[0].files[0].image.rows;
        const index = Math.trunc(sliceMax / 2);
        this.setState({ sliceIndex: index, sliceMax: sliceMax }, () => {
          this.dicomViewersRefs[this.props.activeDcmIndex].sliceMax = sliceMax;
          this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderYZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        });
      } else {
        // Set slice information for coronal orientation
        const sliceMax = this.dicomViewersRefs[0].files[0].image.columns;
        const index = Math.trunc(sliceMax / 2);
        this.setState({ sliceIndex: index, sliceMax: sliceMax }, () => {
          this.dicomViewersRefs[this.props.activeDcmIndex].sliceMax = sliceMax;
          this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderXZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        });
      }
    });
  };

  // Switch to coronal view mode
  changeToCoronalView = () => {
    // Change layout to display a single coronal plane
    this.changeLayout(1, 1);

    // Update state to reflect changes and disable volume building visibility
    this.setState({ visibleVolumeBuilding: false }, () => {
      // Calculate the current position of the MPR plane
      const plane = this.mprPlanePosition();

      // Set the volume for the active DICOM viewer if not already set
      if (this.dicomViewersRefs[this.props.activeDcmIndex].volume === null)
        this.dicomViewersRefs[this.props.activeDcmIndex].volume = this.volume;

      // Check the orientation of the MPR plane
      if (plane === "coronal") {
        // Set files for the first viewer and update state for axial orientation
        this.dicomViewersRefs[0].runTool("setfiles", this.files);
        const sliceMax =
          this.dicomViewersRefs[0].files === null
            ? 1
            : this.dicomViewersRefs[0].files.length;
        const index = Math.trunc(sliceMax / 2);
        this.setState(
          { sliceIndex: index, sliceMax: sliceMax, mprMode: false },
          () => {
            this.dicomViewersRefs[this.props.activeDcmIndex].sliceMax =
              sliceMax;
            this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
              "openimage",
              index
            );
          }
        );
      } else if (plane === "axial") {
        // Set slice information for axial orientation
        const sliceMax = this.dicomViewersRefs[0].files[0].image.columns;
        const index = Math.trunc(sliceMax / 2);
        this.setState({ sliceIndex: index, sliceMax: sliceMax }, () => {
          this.dicomViewersRefs[this.props.activeDcmIndex].sliceMax = sliceMax;
          this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderXZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        });
      } else {
        // Plane is sagittal
        const sliceMax = this.dicomViewersRefs[0].files[0].image.rows;
        const index = Math.trunc(sliceMax / 2);
        this.setState({ sliceIndex: index, sliceMax: sliceMax }, () => {
          this.dicomViewersRefs[this.props.activeDcmIndex].sliceMax = sliceMax;
          this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderYZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        });
      }
    });
  };

  // Switch to axial view mode
  changeToAxialView = () => {
    // Change layout to display a single axial plane
    this.changeLayout(1, 1);

    // Update state to reflect changes and disable volume building visibility
    this.setState({ visibleVolumeBuilding: false }, () => {
      // Calculate the current position of the MPR plane
      const plane = this.mprPlanePosition();

      // Set the volume for the active DICOM viewer if not already set
      if (this.dicomViewersRefs[this.props.activeDcmIndex].volume === null)
        this.dicomViewersRefs[this.props.activeDcmIndex].volume = this.volume;

      // Check the orientation of the MPR plane
      if (plane === "axial") {
        // Set files for the first viewer and update state for axial orientation
        this.dicomViewersRefs[0].runTool("setfiles", this.files);
        const sliceMax =
          this.dicomViewersRefs[0].files === null
            ? 1
            : this.dicomViewersRefs[0].files.length;
        const index = Math.trunc(sliceMax / 2);
        this.setState(
          { sliceIndex: index, sliceMax: sliceMax, mprMode: false },
          () => {
            this.dicomViewersRefs[this.props.activeDcmIndex].sliceMax =
              sliceMax;
            this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
              "openimage",
              index
            );
          }
        );
      } else if (plane === "sagittal") {
        // Set slice information for sagittal orientation
        const sliceMax = this.dicomViewersRefs[0].files[0].image.columns;
        const index = Math.trunc(sliceMax / 2);
        this.setState({ sliceIndex: index, sliceMax: sliceMax }, () => {
          this.dicomViewersRefs[this.props.activeDcmIndex].sliceMax = sliceMax;
          this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderXZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        });
      } else {
        // Plane is coronal
        const sliceMax = this.dicomViewersRefs[0].files[0].image.rows;
        const index = Math.trunc(sliceMax / 2);
        this.setState({ sliceIndex: index, sliceMax: sliceMax }, () => {
          this.dicomViewersRefs[this.props.activeDcmIndex].sliceMax = sliceMax;
          this.dicomViewersRefs[this.props.activeDcmIndex].mprRenderYZPlane(
            this.dicomViewersRefs[0].filename,
            plane,
            index,
            this.mprData
          );
        });
      }
    });
  };

  // Determine the MPR plane position based on the active DICOM viewer
  mprPlanePosition = (force = false, index = this.props.activeDcmIndex) => {
    // Check if MPR plane information is not available or forced update is requested
    if (this.mprPlane === "" || force) {
      // Get the MPR plane position from the active DICOM viewer
      this.mprPlane = this.dicomViewersRefs[index].mprPlanePosition();

      // Update visibility state based on the MPR plane for non-orthogonal views
      if (!this.state.visibleMprOrthogonal) {
        if (this.mprPlane === "sagittal")
          this.setState({
            visibleMprOrthogonal: false,
            visibleMprSagittal: true,
            visibleMprAxial: false,
            visibleMprCoronal: false,
          });
        else if (this.mprPlane === "coronal")
          this.setState({
            visibleMprOrthogonal: false,
            visibleMprSagittal: false,
            visibleMprAxial: false,
            visibleMprCoronal: true,
          });
        else
          this.setState({
            visibleMprOrthogonal: false,
            visibleMprSagittal: false,
            visibleMprAxial: true,
            visibleMprCoronal: false,
          });
      }
    }
    // Return the determined MPR plane position
    return this.mprPlane;
  };

  // Switch to orthogonal MPR view
  mprOrthogonal = () => {
    // Check the current visibility status of orthogonal MPR
    const visibleMprOrthogonal = this.state.visibleMprOrthogonal;

    // Execute if orthogonal MPR is not currently visible
    if (!visibleMprOrthogonal) {
      // Update MPR data to switch from the current plane to orthogonal
      this.mprData.plane = {
        from: this.mprPlane,
        to: "orthogonal",
      };

      // Update state to set orthogonal MPR as visible
      this.setState(
        {
          visibleMprOrthogonal: true,
          visibleMprCoronal: false,
          visibleMprSagittal: false,
          visibleMprAxial: false,
        },
        () => {
          // If the volume is not built, trigger volume building with a delay
          if (this.volume.length === 0) {
            this.setState({ visibleVolumeBuilding: true }, () => {
              setTimeout(() => {
                this.mprBuildVolume();
              }, 100);
            });
          } else {
            // If the volume is already built, switch to orthogonal view
            this.changeToOrthogonalView();
          }
        }
      );
    }
  };

  // Method to switch to sagittal MPR view
  mprSagittal = () => {
    // Check if sagittal MPR is currently visible
    const visibleMprSagittal = this.state.visibleMprSagittal;

    // Execute if sagittal MPR is not currently visible
    if (!visibleMprSagittal) {
      // Update MPR data to switch from the current plane to sagittal
      this.mprData.plane = {
        from: this.mprPlane,
        to: "sagittal",
      };

      // Update state to set sagittal MPR as visible and other MPR views as invisible
      this.setState(
        {
          visibleMprOrthogonal: false,
          visibleMprSagittal: true,
          visibleMprCoronal: false,
          visibleMprAxial: false,
        },
        () => {
          // If the volume is not built, trigger volume building with a delay
          if (this.volume.length === 0) {
            this.setState({ visibleVolumeBuilding: true }, () => {
              // Set a timeout to simulate asynchronous volume building
              setTimeout(() => {
                this.mprBuildVolume();
              }, 100);
            });
          } else {
            // If the volume is already built, switch to sagittal view
            this.changeToSagittalView();
          }
        }
      );
    }
  };

  // Method to switch to coronal MPR view
  mprCoronal = () => {
    // Check if coronal MPR is currently visible
    const visibleMprCoronal = this.state.visibleMprCoronal;

    // Execute if coronal MPR is not currently visible
    if (!visibleMprCoronal) {
      // Update MPR data to switch from the current plane to coronal
      this.mprData.plane = {
        from: this.mprPlane,
        to: "coronal",
      };

      // Update state to set coronal MPR as visible and other MPR views as invisible
      this.setState(
        {
          visibleMprOrthogonal: false,
          visibleMprSagittal: false,
          visibleMprCoronal: true,
          visibleMprAxial: false,
        },
        () => {
          // If the volume is not built, trigger volume building with a delay
          if (this.volume.length === 0) {
            this.setState({ visibleVolumeBuilding: true }, () => {
              // Set a timeout to simulate asynchronous volume building
              setTimeout(() => {
                this.mprBuildVolume();
              }, 100);
            });
          } else {
            // If the volume is already built, switch to coronal view
            this.changeToCoronalView();
          }
        }
      );
    }
  };

  // Method to switch to axial MPR view
  mprAxial = () => {
    // Check if axial MPR is currently visible
    const visibleMprAxial = this.state.visibleMprAxial;

    // Execute if axial MPR is not currently visible
    if (!visibleMprAxial) {
      // Update MPR data to switch from the current plane to axial
      this.mprData.plane = {
        from: this.mprPlane,
        to: "axial",
      };

      // Update state to set axial MPR as visible and other MPR views as invisible
      this.setState(
        {
          visibleMprOrthogonal: false,
          visibleMprSagittal: false,
          visibleMprCoronal: false,
          visibleMprAxial: true,
        },
        () => {
          // If the volume is not built, trigger volume building with a delay
          if (this.volume.length === 0) {
            this.setState({ visibleVolumeBuilding: true }, () => {
              // Set a timeout to simulate asynchronous volume building
              setTimeout(() => {
                this.mprBuildVolume();
              }, 100);
            });
          } else {
            // If the volume is already built, switch to axial view
            this.changeToAxialView();
          }
        }
      );
    }
  };

  // Method to switch to 3D MPR view
  // Placeholder method for 3D MPR rendering
  /*
  mpr3D = () => {
    // Your 3D rendering logic goes here
    console.log("Rendering 3D MPR...");
  };*/

  // Switch to 3D view mode
  /* mpr3DView = () => {
  //   // Check if 3D MPR is currently visible
  //   const visibleMpr3D = this.state.visibleMpr3D;

  //   // Execute if 3D MPR is not currently visible
  //   if (!visibleMpr3D) {
  //     // Update state to set 3D MPR as visible and other MPR views as invisible
  //     this.setState(
  //       {
  //         visibleMprOrthogonal: false,
  //         visibleMprSagittal: false,
  //         visibleMprCoronal: false,
  //         visibleMprAxial: false,
  //         visibleMpr3D: true,
  //       },
  //       () => {
  //         // If the volume is not built, trigger volume building with a delay
  //         if (this.volume.length === 0) {
  //           this.setState({ visibleVolumeBuilding: true }, () => {
  //             // Set a timeout to simulate asynchronous volume building
  //             setTimeout(() => {
  //               this.mprBuildVolume();
  //             }, 100);
  //           });
  //         } else {
  //           // If the volume is already built, switch to 3D view
  //           this.mpr3D();
  //         }
  //       }
  //     );
  //   }
   };*/

  // #endregion

  // -------- FILES/SLICE MANIPULATION -------- \\
  //#region FILES/SLICE MANIPULATION

  // Method to set slice index to the first frame and update state
  listOpenFilesFirstFrame = () => {
    const index = 0;
    this.setState({ sliceIndex: index }, () => {
      this.isSliceChange = true;
      this.handleOpenImage(index);
    });
  };

  // Method to set slice index to the previous frame and update state
  listOpenFilesPreviousFrame = () => {
    let index = this.state.sliceIndex;
    index = index === 0 ? this.state.sliceMax - 1 : index - 1;
    this.setState({ sliceIndex: index }, () => {
      this.isSliceChange = true;
      this.handleOpenImage(index);
      this.syncActiveDcmViewersSamePlane(-1);
    });
  };

  // Method to set slice index to the next frame and update state
  listOpenFilesNextFrame = () => {
    let index = this.state.sliceIndex;
    index = index === this.state.sliceMax - 1 ? 0 : index + 1;
    this.setState({ sliceIndex: index }, () => {
      this.isSliceChange = true;
      this.handleOpenImage(index);
      this.syncActiveDcmViewersSamePlane(+1);
    });
  };

  // Method to set slice index to the last frame and update state
  listOpenFilesLastFrame = () => {
    const index = this.state.sliceMax - 1;
    this.setState({ sliceIndex: index }, () => {
      this.isSliceChange = true;
      this.handleOpenImage(index);
    });
  };

  // Method to toggle scrolling through open files and update state
  listOpenFilesScrolling = () => {
    const scrolling = this.state.listOpenFilesScrolling;
    this.setState({ listOpenFilesScrolling: !scrolling }, () => {
      if (scrolling) {
        clearInterval(this.timerScrolling);
      } else {
        // Set interval to scroll to the next frame every 500 milliseconds
        this.timerScrolling = setInterval(() => {
          this.listOpenFilesNextFrame();
        }, 500);
      }
    });
  };

  // Method to handle slice change using a slider and update state
  handleSliceChange = (event, value) => {
    this.setState({ sliceIndex: Math.floor(value) }, () => {
      let index = this.state.sliceIndex;
      this.isSliceChange = true;
      this.handleOpenImage(index);
    });
  };

  //#endregion

  // ------------- EXPLORER -------------\\
  //#region EXPLORER

  // Method called when a series is selected in the explorer
  explorerOnSelectSeries = (files, explorerIndex) => {
    // Determine the viewer index based on MPR mode or active DCM index
    let index = this.props.activeDcmIndex;
    if (this.state.mprMode) {
      index = 0;
      // Reset state and layout for MPR mode
      this.setState({
        sliceIndex: 0,
        sliceMax: 1,
        visibleMprOrthogonal: false,
        visibleMprCoronal: false,
        visibleMprSagittal: false,
        visibleMprAxial: false,
      });
      this.props.setActiveDcmIndex(index);
      this.changeLayout(1, 1);
    }

    // Update instance variables and reset MPR-related data
    this.files = files;
    this.mprPlane = "";
    this.mprData = {};
    this.volume = [];

    // Set files and explorer index for the active viewer
    this.dicomViewersRefs[index].runTool("setfiles", this.files);
    this.dicomViewersRefs[index].explorerIndex = explorerIndex;

    // Set sliceMax, sliceIndex, and trigger opening the first image
    const sliceMax = this.dicomViewersRefs[index].sliceMax;
    const sliceIndex = 0;
    this.setState(
      { sliceMax: sliceMax, sliceIndex: sliceIndex, mprMode: false },
      () => {
        this.handleOpenImage(sliceIndex);
      }
    );
  };

  //#endregion EXPLORER

  // Get the active DICOM viewers that have a valid image
  getActiveDcmViewers = () => {
    this.dicomViewersActive = this.dicomViewersRefs.filter(
      (v) => v !== undefined && v.image !== null
    );
    return this.dicomViewersActive.length;
  };

  // Get the number of active DICOM viewers from the same study as the active viewer
  getActiveDcmViewersSameStudy = () => {
    // Get the study ID of the active viewer
    const studyId = getDicomStudyId(
      this.dicomViewersRefs[this.props.activeDcmIndex].image
    );
    // Filter DICOM viewers from the same study
    this.dicomViewersActiveSameStudy = this.dicomViewersRefs.filter(
      (v) => v !== undefined && getDicomStudyId(v.image) === studyId
    );
    return this.dicomViewersActiveSameStudy.length;
  };

  // Get the number of active DICOM viewers from the same plane as the active viewer
  getActiveDcmViewersSamePlane = () => {
    this.dicomViewersActiveSamePlane = [];
    const plane = this.dicomViewersRefs[this.props.activeDcmIndex].mprPlane;
    // Loop through DICOM viewers from the same study and filter those from the same plane
    for (let i = 0; i < this.dicomViewersActiveSameStudy.length; i++) {
      if (
        this.dicomViewersActiveSameStudy[i].mprPlane === plane &&
        this.dicomViewersActiveSameStudy[i].layoutIndex !==
          this.props.activeDcmIndex
      )
        this.dicomViewersActiveSamePlane.push(
          this.dicomViewersActiveSameStudy[i]
        );
    }
  };

  // Synchronize active DICOM viewers from the same plane in a given direction
  syncActiveDcmViewersSamePlane = (direction) => {
    // Check if series linking is enabled
    if (!this.state.visibleSeriesLink) return;
    if (this.dicomViewersActiveSamePlane.length > 0) {
      // Get plane and image position parameters of the active viewer
      const plane = this.dicomViewersRefs[this.props.activeDcmIndex].mprPlane;
      const ippX = getDicomIpp(
        this.dicomViewersRefs[this.props.activeDcmIndex].image,
        0
      );
      const ippY = getDicomIpp(
        this.dicomViewersRefs[this.props.activeDcmIndex].image,
        1
      );
      const ippZ = getDicomIpp(
        this.dicomViewersRefs[this.props.activeDcmIndex].image,
        2
      );

      let j = 0;
      // Loop through DICOM viewers from the same plane and update slices
      for (let i = 0; i < this.dicomViewersActiveSamePlane.length; i++) {
        if (plane === "sagittal")
          j = this.dicomViewersActiveSamePlane[i].findFirstSliceWithIppValue(
            ippX,
            0
          );
        else if (plane === "coronal")
          j = this.dicomViewersActiveSamePlane[i].findFirstSliceWithIppValue(
            ippY,
            1
          );
        else if (plane === "axial")
          j = this.dicomViewersActiveSamePlane[i].findFirstSliceWithIppValue(
            ippZ,
            2
          );
        // Update slices for synchronized viewers
        if (j >= 0) this.dicomViewersActiveSamePlane[i].runTool("openimage", j);
      }
    }
  };

  // Return the color for an icon based on whether its associated tool is active
  colorIcon = (tool) => {
    return this.state.toolActive === tool ? activeColor : iconColor;
  };

  // React component render method
  render() {
    // Destructure classes from props
    const { classes } = this.props;

    // CSS class for primary text in the list item
    const primaryClass = { primary: classes.listItemText };

    // Icon size constants
    const iconSize = "1.2rem";
    const iconSizeSmall = "1.0rem";

    // Check if the current DICOM viewer is open
    const isOpen = this.props.isOpen[this.props.activeDcmIndex];

    // Check if a DICOMDIR is available
    const isDicomdir = this.props.dicomdir !== null;

    // Flag to indicate if multiple files are loaded in the DICOM viewer
    this.isMultipleFiles = false;

    // Check if the DICOM viewer reference is undefined
    if (this.dicomViewersRefs[this.props.activeDcmIndex] === undefined) {
      this.isMultipleFiles = false;
    } else {
      // Check if files are not null and determine if multiple files are present
      if (this.dicomViewersRefs[this.props.activeDcmIndex].files !== null)
        this.isMultipleFiles =
          this.dicomViewersRefs[this.props.activeDcmIndex].files.length > 1;
      else this.isMultipleFiles = false;
    }

    // State variables
    const openMenu = this.state.openMenu;
    const openImageEdit = this.state.openImageEdit;
    const openTools = this.state.openTools;
    const visibleMainMenu = this.state.visibleMainMenu;
    const visibleHeader = this.state.visibleHeader;
    const visibleSettings = this.state.visibleSettings;
    const visibleAbout = this.state.visibleAbout;
    const visibleMeasure = this.state.visibleMeasure;
    const visibleToolbox = this.state.visibleToolbox;
    const visibleDicomdir = this.state.visibleDicomdir;
    const visibleFileManager = this.state.visibleFileManager;
    const visibleClearMeasureDlg = this.state.visibleClearMeasureDlg;
    const visibleZippedFileDlg = this.state.visibleZippedFileDlg;
    const visibleDownloadZipDlg = this.state.visibleDownloadZipDlg;
    const visibleOpenMultipleFilesDlg = this.state.visibleOpenMultipleFilesDlg;
    const visibleLayout = Boolean(this.state.anchorElLayout);
    const visibleVolumeBuilding = this.state.visibleVolumeBuilding;
    const visibleMprOrthogonal = this.state.visibleMprOrthogonal;
    const visibleMprCoronal = this.state.visibleMprCoronal;
    const visibleMprSagittal = this.state.visibleMprSagittal;
    const visibleMprAxial = this.state.visibleMprAxial;
    const visibleExplorer = this.state.visibleExplorer;
    const visibleReferenceLines = this.state.visibleReferenceLines;
    const visibleSeriesLink = this.state.visibleSeriesLink;
    const visibleToolsPanel = Boolean(this.state.anchorElToolsPanel);
    const mprMenu = this.state.mprMenu && this.mprPlane !== "";

    // Get the active DICOM viewer
    const dcmViewer = this.getActiveDcmViewer();

    // Maximum slice index
    const sliceMax = this.state.sliceMax;

    return (
      <div>
        {/* React component rendering an AppBar */}
        <AppBar className={classes.appBar} position="static" elevation={0}>
          {/* Toolbar with dense variant */}
          <Toolbar variant="dense">
            {/* Menu button */}
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={this.toggleMainMenu}
            >
              <MenuIcon />
            </IconButton>
            {/* Render the AppBar title */}
            {this.appBarTitle(classes, isOpen, dcmViewer)}

            {/* Spacer to push items to the right */}
            <div className={classes.grow} />

            {/* Show About button if not open and not a DICOMDIR */}
            {!isOpen && !isDicomdir ? (
              <IconButton onClick={this.showAbout}>
                <Icon
                  path={mdiInformationOutline}
                  size={iconSize}
                  color={iconColor}
                />
              </IconButton>
            ) : null}

            {isOpen &&
            dcmViewer &&
            dcmViewer.numberOfFrames !== undefined &&
            dcmViewer.numberOfFrames > 1 ? (
              <Tooltip title="Cine Player">
                <IconButton onClick={this.cinePlayer}>
                  <Icon path={mdiVideo} size={iconSize} color={iconColor} />
                </IconButton>
              </Tooltip>
            ) : null}

            {/* Reset Image button if open */}
            {isOpen ? (
              <Tooltip title="Reset Image">
                <IconButton onClick={this.resetImage}>
                  <Icon path={mdiRefresh} size={iconSize} color={iconColor} />
                </IconButton>
              </Tooltip>
            ) : null}

            {/* Tools button if open */}
            {isOpen ? (
              <Tooltip title="Tools">
                <IconButton onClick={this.handleToolsPanel}>
                  <Icon path={mdiTools} size={iconSize} color={iconColor} />
                </IconButton>
              </Tooltip>
            ) : null}

            {/* Save Screenshot button if open */}
            {isOpen ? (
              <Tooltip title="Save Screenshot">
                <IconButton color="inherit" onClick={this.saveShot}>
                  <Icon path={mdiCamera} size={iconSize} color={iconColor} />
                </IconButton>
              </Tooltip>
            ) : null}

            {/* Measurements button if open */}
            {isOpen ? (
              <Tooltip title="Measurements">
                <IconButton color="inherit" onClick={this.toggleMeasure}>
                  <Icon path={mdiFileCad} size={iconSize} color={iconColor} />
                </IconButton>
              </Tooltip>
            ) : null}

            {/* Dicom Header button if open and the file is DICOM */}
            {isOpen && dcmViewer && dcmViewer.isDicom ? (
              <Tooltip title="Dicom Header">
                <IconButton color="inherit" onClick={this.toggleHeader}>
                  <Icon
                    path={mdiFileDocument}
                    size={iconSize}
                    color={iconColor}
                  />
                </IconButton>
              </Tooltip>
            ) : null}

            {/* DICOMDIR button if DICOMDIR is available */}
            {isDicomdir ? (
              <Tooltip title="DICOMDIR">
                <IconButton color="inherit" onClick={this.toggleDicomdir}>
                  <Icon
                    path={mdiFolderOpen}
                    size={iconSize}
                    color={iconColor}
                  />
                </IconButton>
              </Tooltip>
            ) : null}

            {/* Explorer button if open with multiple files or in MPR orthogonal view */}
            {(isOpen && this.isMultipleFiles) || visibleMprOrthogonal ? (
              <Tooltip title="Explorer">
                <IconButton color="inherit" onClick={this.toggleExplorer}>
                  <Icon
                    path={mdiAnimationOutline}
                    size={iconSize}
                    color={iconColor}
                  />
                </IconButton>
              </Tooltip>
            ) : null}

            {/* File Manager button if open */}
            {isOpen ? (
              <Tooltip title="Sandbox File Manager">
                <IconButton color="inherit" onClick={this.toggleFileManager}>
                  <Icon
                    path={mdiFileCabinet}
                    size={iconSize}
                    color={iconColor}
                  />
                </IconButton>
              </Tooltip>
            ) : null}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent" // Setting the variant of the Drawer to "persistent"
          open={visibleMainMenu} // Controlling the open state based on the value of visibleMainMenu
          style={{ position: "relative", zIndex: 1 }} // Applying inline styles to the Drawer, setting position and zIndex
          onClose={this.toggleMainMenu} // Assigning the toggleMainMenu function to handle the onClose event
        >
          <div className={classes.toolbar}>
            {/* Creating a container div with a class name of 'toolbar' */}
            <PerfectScrollbar>
              {/* Using the PerfectScrollbar component to enable scrollbar functionality */}
              <List dense={true}>
                {/* Creating a List component with the 'dense' prop set to true */}
                <ListItem button onClick={() => this.showAppBar()}>
                  {/* Creating a ListItem with a button, invoking the showAppBar function on click */}
                  <ListItemIcon>
                    {/* Rendering an icon on the ListItem */}
                    <MenuIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tool Bar" />
                  {/* Displaying text content with the primary label "Tool Bar" */}
                </ListItem>
                <ListItem button onClick={() => this.toggleFileManager()}>
                  {/* Creating a ListItem with a button, invoking the toggleFileManager function on click */}
                  <ListItemIcon>
                    {/* Rendering an icon using the Icon component with specific properties */}
                    <Icon
                      path={mdiFileCabinet}
                      size={iconSize}
                      color={iconColor}
                    />
                  </ListItemIcon>
                  <ListItemText classes={primaryClass} primary="File Manager" />
                  {/* Displaying text content with the primary label "File Manager" */}
                </ListItem>
                <ListItem button onClick={() => this.toggleOpenMenu()}>
                  {/* Creating another ListItem with a button, invoking the toggleOpenMenu function on click */}
                  <ListItemIcon>
                    {/* Rendering an icon using the Icon component with specific properties */}
                    <Icon
                      path={mdiFolderMultiple}
                      size={iconSize}
                      color={iconColor}
                    />
                  </ListItemIcon>
                  <ListItemText classes={primaryClass} primary="Open ..." />
                  {/* Displaying text content with the primary label "Open ..." */}
                  {openMenu ? <ExpandLess /> : <ExpandMore />}
                  {/* Displaying an ExpandLess or ExpandMore icon based on the value of the 'openMenu' state */}
                </ListItem>
                <Collapse in={openMenu} timeout="auto" unmountOnExit>
                  {/* Conditional rendering of a Collapse component based on the 'openMenu' state */}
                  <List dense={true} component="div">
                    {/* Creating a List component with dense styling and a div as the component */}
                    <ListItem
                      // Creating a ListItem component, typically used for items in a list
                      button
                      // Adding a button behavior to the ListItem, making it clickable
                      style={{ paddingLeft: 30 }}
                      // Applying styling to the ListItem, specifically adding left padding
                      onClick={() => this.showFileOpen()}
                      // Assigning the showFileOpen function to execute on click
                    >
                      {/* Creating a ListItem with a button, invoking the showFileOpen function on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiFolder}
                          // Setting the path for the icon, using the mdiFolder (folder) icon from the Material Design Icons library
                          size={"1.0rem"}
                          // Defining the size of the icon
                          color={iconColor}
                          // Specifying the color of the icon
                        />
                      </ListItemIcon>

                      <ListItemText
                        // Using ListItemText to display text content within the ListItem
                        classes={primaryClass}
                        // Applying custom styling to the text based on the primaryClass
                        primary={
                          <Typography
                            type="body1"
                            // Specifying the typography type for the text (body1 in this case)
                            style={{ fontSize: "0.80em", marginLeft: "-20px" }}
                            // Applying inline styles to the Typography component
                          >
                            File
                          </Typography>
                          // Setting the primary text content within a Typography component
                        }
                      />

                      {/* Displaying text content with the primary label "File" */}
                    </ListItem>
                    {isInputDirSupported() && !isMobile ? (
                      // Conditional rendering based on certain conditions using a ternary operator
                      <ListItem
                        // ListItem component representing an interactive list item
                        button
                        // Adding an onClick handler to respond to user clicks
                        style={{ paddingLeft: 30 }}
                        // Applying custom styling with a left padding of 30 pixels
                        onClick={() => this.showOpenFolder()}
                        // Handling the click event with the provided method showOpenFolder
                      >
                        <ListItemIcon>
                          {/* Rendering an icon using the Icon component with specific properties */}
                          <Icon
                            path={mdiFolderOpen}
                            // Using the Material Design Icons (MDI) path for an open folder
                            size={"1.0rem"}
                            // Setting the size of the icon
                            color={iconColor}
                            // Specifying the color of the icon
                          />
                        </ListItemIcon>
                        <ListItemText
                          // Using ListItemText to display text content within the ListItem
                          classes={primaryClass}
                          // Applying custom styling to the text based on the primaryClass
                          primary={
                            <Typography
                              type="body1"
                              // Specifying the typography type for the text (body1 in this case)
                              style={{
                                fontSize: "0.80em",
                                marginLeft: "-20px",
                              }}
                              // Applying inline styles to the Typography component
                            >
                              Folder
                              {/* Setting the primary text content within a Typography component */}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ) : null}
                    {/* // Rendering null when the condition (isInputDirSupported() && !isMobile) is false */}
                    {isInputDirSupported() && !isMobile ? (
                      // Conditional rendering based on certain conditions using a ternary operator
                      <ListItem
                        // ListItem component representing an interactive list item
                        button
                        // Adding an onClick handler to respond to user clicks
                        style={{ paddingLeft: 30 }}
                        // Applying custom styling with a left padding of 30 pixels
                        onClick={() => this.showOpenDicomdir()}
                        // Handling the click event with the provided method showOpenDicomdir
                      >
                        <ListItemIcon>
                          {/* Rendering an icon using the Icon component with specific properties */}
                          <Icon
                            path={mdiFolderOpen}
                            // Using the Material Design Icons (MDI) path for an open folder
                            size={"1.0rem"}
                            // Setting the size of the icon
                            color={iconColor}
                            // Specifying the color of the icon
                          />
                        </ListItemIcon>
                        <ListItemText
                          // Using ListItemText to display text content within the ListItem
                          classes={primaryClass}
                          // Applying custom styling to the text based on the primaryClass
                          primary={
                            <Typography
                              type="body1"
                              // Specifying the typography type for the text (body1 in this case)
                              style={{
                                fontSize: "0.80em",
                                marginLeft: "-20px",
                              }}
                              // Applying inline styles to the Typography component
                            >
                              DICOMDIR
                              {/* Setting the primary text content within a Typography component */}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ) : null}
                    {/* Rendering null when the condition (isInputDirSupported() && !isMobile) is false */}
                    <ListItem
                      // ListItem component representing an interactive list item
                      button
                      // Adding a button behavior to the ListItem for click events
                      style={{ paddingLeft: 30 }}
                      // Applying custom styling with a left padding of 30 pixels
                      onClick={() => this.showOpenUrl()}
                      // Handling the click event with the provided method showOpenUrl
                    >
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiWeb}
                          // Using the Material Design Icons (MDI) path for a web icon
                          size={"1.0rem"}
                          // Setting the size of the icon
                          color={iconColor}
                          // Specifying the color of the icon
                        />
                      </ListItemIcon>
                      <ListItemText
                        // Using ListItemText to display text content within the ListItem
                        classes={primaryClass}
                        // Applying custom styling to the text based on the primaryClass
                        primary={
                          <Typography
                            type="body1"
                            // Specifying the typography type for the text (body1 in this case)
                            style={{
                              fontSize: "0.80em",
                              marginLeft: "-20px",
                            }}
                            // Applying inline styles to the Typography component
                          >
                            URL
                            {/* Setting the primary text content within a Typography component */}
                          </Typography>
                        }
                      />
                      {/* Closing the ListItem component block */}
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem
                  // ListItem component representing an interactive list item
                  button
                  // Adding a button behavior to the ListItem for click events
                  onClick={() => this.clear()}
                  // Handling the click event with the provided method clear
                >
                  <ListItemIcon>
                    {/* Rendering an icon using the Icon component with specific properties */}
                    <Icon
                      path={mdiDelete}
                      // Using the Material Design Icons (MDI) path for a delete icon
                      size={iconSize}
                      // Setting the size of the icon
                      color={iconColor}
                      // Specifying the color of the icon
                    />
                  </ListItemIcon>
                  <ListItemText
                    // Using ListItemText to display text content within the ListItem
                    classes={primaryClass}
                    // Applying custom styling to the text based on the primaryClass
                    primary="Clear All"
                    // Setting the primary text content directly as a string
                  />
                  {/* Closing the ListItem component block */}
                </ListItem>

                {/* The Divider component, which is used to create a horizontal
                line to visually separate content. It serves as a visual
                break or divider between different sections or elements. */}
                <Divider />

                <ListItem
                  button
                  onClick={() => this.toggleMpr()}
                  disabled={!isOpen || this.mprPlane === ""}
                >
                  {/* Creating another ListItem with a button, invoking the toggleMpr function on click */}
                  <ListItemIcon>
                    {/* Rendering an icon using the Icon component with specific properties */}
                    <Icon
                      path={mdiAxisArrow}
                      size={iconSize}
                      color={iconColor}
                    />
                  </ListItemIcon>
                  <ListItemText classes={primaryClass} primary="3D MPR" />
                  {/* Displaying text content with the primary label "MPR" */}
                  {mprMenu ? <ExpandLess /> : <ExpandMore />}
                  {/* Conditional rendering of ExpandLess or ExpandMore icons based on the mprMenu state */}
                </ListItem>

                <Collapse in={mprMenu} timeout="auto" unmountOnExit>
                  {/* Creating a Collapse component with a conditionally rendered collapse effect */}
                  <List dense={true} component="div">
                    {/* Creating a List with dense styling and a div component */}
                    <ListItem
                      button
                      style={{ paddingLeft: 40 }}
                      onClick={() => this.mprOrthogonal()}
                    >
                      {/* Creating a ListItem with a button, invoking the mprOrthogonal function on click */}
                      {visibleMprOrthogonal ? (
                        <ListItemIcon style={{ marginLeft: "-10px" }}>
                          {/* Conditionally rendering an icon using the Icon component with specific properties */}
                          <Icon
                            path={mdiCheck}
                            size={"1.0rem"}
                            color={iconColor}
                          />
                        </ListItemIcon>
                      ) : null}
                      <ListItemText
                        style={
                          visibleMprOrthogonal
                            ? { marginLeft: "-7px" }
                            : { marginLeft: "40px" }
                        }
                        // Adjusting the left margin based on the visibility of MprOrthogonal
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Orthogonal
                          </Typography>
                        }
                        // Displaying text content with the primary label "Orthogonal"
                      />
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 40 }}
                      onClick={() => this.mprCoronal()}
                    >
                      {/* Creating a ListItem with a button, invoking the mprCoronal function on click */}
                      {visibleMprCoronal ? (
                        <ListItemIcon style={{ marginLeft: "-10px" }}>
                          {/* Conditionally rendering an icon using the Icon component with specific properties */}
                          <Icon
                            path={mdiCheck}
                            size={"1.0rem"}
                            color={iconColor}
                          />
                        </ListItemIcon>
                      ) : null}
                      <ListItemText
                        style={
                          visibleMprCoronal
                            ? { marginLeft: "-7px" }
                            : { marginLeft: "40px" }
                        }
                        // Adjusting the left margin based on the visibility of MprCoronal
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Coronal
                          </Typography>
                        }
                        // Displaying text content with the primary label "Coronal"
                      />
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 40 }}
                      onClick={() => this.mprSagittal()}
                    >
                      {/* Creating a ListItem with a button, invoking the mprSagittal function on click */}
                      {visibleMprSagittal ? (
                        <ListItemIcon style={{ marginLeft: "-10px" }}>
                          {/* Conditionally rendering an icon using the Icon component with specific properties */}
                          <Icon
                            path={mdiCheck}
                            size={"1.0rem"}
                            color={iconColor}
                          />
                        </ListItemIcon>
                      ) : null}
                      <ListItemText
                        style={
                          visibleMprSagittal
                            ? { marginLeft: "-7px" }
                            : { marginLeft: "40px" }
                        }
                        // Adjusting the left margin based on the visibility of MprSagittal
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Sagittal
                          </Typography>
                        }
                        // Displaying text content with the primary label "Sagittal"
                      />
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 40 }}
                      onClick={() => this.mprAxial()}
                    >
                      {/* Creating a ListItem with a button, invoking the mprAxial function on click */}
                      {visibleMprAxial ? (
                        <ListItemIcon style={{ marginLeft: "-10px" }}>
                          {/* Conditionally rendering an icon using the Icon component with specific properties */}
                          <Icon
                            path={mdiCheck}
                            size={"1.0rem"}
                            color={iconColor}
                          />
                        </ListItemIcon>
                      ) : null}
                      <ListItemText
                        style={
                          visibleMprAxial
                            ? { marginLeft: "-7px" }
                            : { marginLeft: "40px" }
                        }
                        // Adjusting the left margin based on the visibility of MprAxial
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Axial
                          </Typography>
                        }
                        // Displaying text content with the primary label "Axial"
                      />
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem
                  button
                  onClick={() => this.toggleImageEdit()}
                  disabled={!isOpen}
                >
                  {/* Creating a ListItem with a button, invoking the toggleImageEdit function on click */}
                  <ListItemIcon>
                    {/* Rendering an icon using the Icon component with specific properties */}
                    <Icon
                      path={mdiImageEdit}
                      size={iconSize}
                      color={iconColor}
                    />
                  </ListItemIcon>
                  <ListItemText classes={primaryClass} primary="Processing" />
                  {/* Displaying text content with the primary label "Processing" */}
                  {openImageEdit ? <ExpandLess /> : <ExpandMore />}
                  {/* Conditionally rendering an icon based on the state of openImageEdit */}
                </ListItem>

                <Collapse in={openImageEdit} timeout="auto" unmountOnExit>
                  {/* Creating a collapsible section with a condition based on the openImageEdit state */}
                  <List dense={true} component="div">
                    {/* Creating a list within the collapsed section */}
                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("Invert")}
                    >
                      {/* Creating a list item with a button, invoking the toolExecute function with "Invert" on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiInvertColors}
                          size={iconSize}
                          color={iconColor}
                        />
                      </ListItemIcon>
                      <ListItemText classes={primaryClass} primary="Invert" />
                      {/* Displaying text content with the primary label "Invert" */}
                    </ListItem>
                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toggleToolbox()}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toggleToolbox function on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiChartHistogram}
                          size={iconSize}
                          color={iconColor}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary="Histogram"
                      />
                      {/* Displaying text content with the primary label "Histogram" */}
                    </ListItem>
                  </List>
                </Collapse>

                <ListItem
                  button
                  onClick={() => this.toggleTools()}
                  disabled={!isOpen}
                >
                  {/* Creating a ListItem with a button, invoking the toggleTools function on click */}
                  <ListItemIcon>
                    {/* Rendering an icon using the Icon component with specific properties */}
                    <Icon path={mdiTools} size={iconSize} color={iconColor} />
                  </ListItemIcon>
                  <ListItemText classes={primaryClass} primary="Tools" />
                  {/* Displaying text content with the primary label "Tools" */}
                  {openTools ? <ExpandLess /> : <ExpandMore />}
                  {/* Displaying either an upward or downward arrow based on the openTools state */}
                </ListItem>
                {/* Tools  */}
                <Collapse in={openTools} timeout="auto" unmountOnExit>
                  {/* Applying a collapse effect based on the openTools state */}
                  <List dense={true} component="div">
                    {/* Creating a List component with dense styling */}
                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("notool")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "notool" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiCursorDefault}
                          size={iconSizeSmall}
                          color={this.colorIcon("notool")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            No Tool
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "No Tool" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("referencelines")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "referencelines" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiArrowSplitHorizontal}
                          size={iconSizeSmall}
                          color={
                            visibleReferenceLines ? activeColor : iconColor
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Reference Lines
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Reference Lines" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("serieslink")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "serieslink" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiVectorLink}
                          size={iconSizeSmall}
                          color={visibleSeriesLink ? activeColor : iconColor}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Link Series
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Link Series" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("Wwwc")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "Wwwc" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiArrowAll}
                          size={iconSize}
                          color={this.colorIcon("Wwwc")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            WW/WC
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "WW/WC" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("Pan")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "Pan" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiCursorPointer}
                          size={iconSize}
                          color={this.colorIcon("Pan")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Pan
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Pan" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("Zoom")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "Zoom" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiMagnify}
                          size={iconSize}
                          color={this.colorIcon("Zoom")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Zoom
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Zoom" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("Magnify")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "Magnify" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiCheckboxIntermediate}
                          size={iconSize}
                          color={this.colorIcon("Magnify")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Magnify
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Magnify" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("Length")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "Length" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiRuler}
                          size={iconSize}
                          color={this.colorIcon("Length")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Length
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Length" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("Probe")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "Probe" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiEyedropper}
                          size={iconSize}
                          color={this.colorIcon("Probe")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Probe
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Probe" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("Angle")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "Angle" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiAngleAcute}
                          size={iconSize}
                          color={this.colorIcon("Angle")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Angle
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Angle" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("EllipticalRoi")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "EllipticalRoi" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiEllipse}
                          size={iconSize}
                          color={this.colorIcon("EllipticalRoi")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Elliptical Roi
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Elliptical Roi" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("RectangleRoi")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "RectangleRoi" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiRectangle}
                          size={iconSize}
                          color={this.colorIcon("RectangleRoi")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Rectangle Roi
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Rectangle Roi" */}
                    </ListItem>

                    <ListItem
                      button
                      style={{ paddingLeft: 30 }}
                      onClick={() => this.toolExecute("FreehandRoi")}
                      disabled={!isOpen}
                    >
                      {/* Creating a ListItem with a button, invoking the toolExecute function with "FreehandRoi" as a parameter on click */}
                      <ListItemIcon>
                        {/* Rendering an icon using the Icon component with specific properties */}
                        <Icon
                          path={mdiGesture}
                          size={iconSize}
                          color={this.colorIcon("FreehandRoi")}
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={primaryClass}
                        primary={
                          <Typography
                            type="body1"
                            style={{ fontSize: "0.80em", marginLeft: "-23px" }}
                          >
                            Freehand Roi
                          </Typography>
                        }
                      />
                      {/* Displaying text content with the primary label "Freehand Roi" */}
                    </ListItem>
                  </List>
                </Collapse>
                <Divider />
                <ListItem
                  // ListItem component representing an interactive list item
                  button
                  // Adding a button behavior to the ListItem for click events
                  onClick={this.handleLayout}
                  // Handling the click event with the provided method handleLayout
                >
                  <ListItemIcon>
                    {/* Rendering an icon using the Icon component with specific properties */}
                    <Icon
                      path={mdiViewGridPlusOutline}
                      // Using the Material Design Icons (MDI) path for a grid layout icon
                      size={iconSize}
                      // Setting the size of the icon
                      color={iconColor}
                      // Specifying the color of the icon
                    />
                  </ListItemIcon>
                  <ListItemText
                    // Using ListItemText to display text content within the ListItem
                    classes={primaryClass}
                    // Applying custom styling to the text based on the primaryClass
                    primary="Layout"
                    // Setting the primary text content directly as a string
                  />
                  {/* Closing the ListItem component block */}
                </ListItem>
                <ListItem
                  // ListItem component representing an interactive list item
                  button
                  // Adding a button behavior to the ListItem for click events
                  onClick={() => this.showSettings()}
                  // Handling the click event with the provided method showSettings
                >
                  <ListItemIcon>
                    {/* Rendering an icon using the Icon component with specific properties */}
                    <Icon
                      path={mdiCog}
                      // Using the Material Design Icons (MDI) path for a cog/settings icon
                      size={iconSize}
                      // Setting the size of the icon
                      color={iconColor}
                      // Specifying the color of the icon
                    />
                  </ListItemIcon>
                  <ListItemText
                    // Using ListItemText to display text content within the ListItem
                    classes={primaryClass}
                    // Applying custom styling to the text based on the primaryClass
                    primary="Settings"
                    // Setting the primary text content directly as a string
                  />
                  {/* Closing the ListItem component block */}
                </ListItem>
              </List>

              {this.isMultipleFiles || mprMenu ? (
                /* Conditional rendering based on whether there are multiple files or the MPR menu is open */
                <div>
                  {/* Starting a new container */}
                  <Divider />
                  {/* Displaying a horizontal divider */}
                  <div align="center">
                    {/* Aligning the content to the center */}
                    <IconButton
                      onClick={this.listOpenFilesFirstFrame}
                      size="small"
                    >
                      {/* Creating an IconButton with a specific icon and invoking the listOpenFilesFirstFrame function on click */}
                      <Icon
                        path={mdiSkipBackward}
                        size={"1.0rem"}
                        color={iconColor}
                      />
                      {/* Displaying an icon button with the Skip Backward icon */}
                    </IconButton>

                    <IconButton
                      onClick={this.listOpenFilesPreviousFrame}
                      size="small"
                    >
                      {/* Creating an IconButton with a specific icon and invoking the listOpenFilesPreviousFrame function on click */}
                      <Icon
                        path={mdiSkipPrevious}
                        size={"1.0rem"}
                        color={iconColor}
                      />
                      {/* Displaying an icon button with the Skip Previous icon */}
                    </IconButton>

                    <IconButton
                      onClick={this.listOpenFilesScrolling}
                      size="small"
                    >
                      {/* Creating an IconButton with a dynamic icon based on the state, invoking the listOpenFilesScrolling function on click */}
                      <Icon
                        path={
                          this.state.listOpenFilesScrolling ? mdiPause : mdiPlay
                        }
                        size={"1.0rem"}
                        color={iconColor}
                      />
                      {/* Displaying an icon button with either the Pause or Play icon based on the state */}
                    </IconButton>

                    <IconButton
                      onClick={this.listOpenFilesNextFrame}
                      size="small"
                    >
                      {/* Creating an IconButton, invoking the listOpenFilesNextFrame function on click */}
                      <Icon
                        path={mdiSkipNext}
                        size={"1.0rem"}
                        color={iconColor}
                      />
                      {/* Displaying an icon button with the Skip Next icon */}
                    </IconButton>

                    <IconButton
                      onClick={this.listOpenFilesLastFrame}
                      size="small"
                    >
                      {/* Creating an IconButton, invoking the listOpenFilesLastFrame function on click */}
                      <Icon
                        path={mdiSkipForward}
                        size={"1.0rem"}
                        color={iconColor}
                      />
                      {/* Displaying an icon button with the Skip Forward icon */}
                    </IconButton>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    {/* Creating a div with centered text */}
                    <Typography type="body1" style={{ fontSize: "0.80em" }}>
                      {/* Creating a Typography component with specific styling */}
                      {`${this.state.sliceIndex + 1} / ${sliceMax}`}
                      {/* Displaying a string with the current slice index and total slices */}
                    </Typography>
                  </div>

                  <div style={{ width: "130px", margin: "auto" }}>
                    {/* Creating a div with a specific width and centered margin */}
                    {/* Create a Slider component */}
                    <Slider
                      /* Adjust the top margin of the Slider */
                      style={{ marginTop: "-4px" }}
                      /* Set the current value of the Slider */
                      value={this.state.sliceIndex}
                      /* Define the function to handle changes in the Slider value */
                      onChange={this.handleSliceChange}
                      /* Set the color of the Slider to secondary */
                      color="secondary"
                      /* Set the minimum value of the Slider */
                      min={0}
                      /* Set the maximum value of the Slider based on sliceMax variable */
                      max={sliceMax - 1}
                      /* Set the step size for the Slider based on sliceMax */
                      step={100 / sliceMax}
                    />
                  </div>
                </div>
              ) : null}
            </PerfectScrollbar>
          </div>
        </Drawer>
        {/* vertical bar */}
        {/* Create a Drawer component */}
        <Drawer
          /* Set the variant of the Drawer to "persistent" */
          variant="persistent"
          /* Set the anchor position of the Drawer to the right */
          anchor="right"
          /* Determine whether the Drawer is open or closed based on the visibleHeader state */
          open={visibleHeader}
          /* Define the function to be called when the Drawer is closed */
          onClose={this.toggleHeader}
        >
          {/* Conditional rendering: Display DicomHeader if visibleHeader is true, otherwise, display null */}
          {visibleHeader ? (
            /* Render the DicomHeader component with specified props */
            <DicomHeader
              dcmViewer={dcmViewer}
              classes={classes}
              color={iconColor}
            />
          ) : null}
        </Drawer>
        {/* Create a Drawer component */}
        <Drawer
          /* Set the variant of the Drawer to "persistent" */
          variant="persistent"
          /* Set the anchor position of the Drawer to the right */
          anchor="right"
          /* Determine whether the Drawer is open or closed based on the visibleMeasure state */
          open={visibleMeasure}
          /* Define the function to be called when the Drawer is closed */
          onClose={this.toggleMeasure}
        >
          {/* Add top margin to the content within the Drawer */}
          <div style={{ marginTop: "48px" }}>
            {/* Create a dense Toolbar component */}
            <Toolbar variant="dense">
              {/* Display a subtitle in the Toolbar */}
              <Typography variant="subtitle1" className={classes.title}>
                Measurements&nbsp;&nbsp;
              </Typography>
              {/* Create a flexible space in the Toolbar */}
              <div className={classes.grow} />
              {/* Create an IconButton to trigger the saveMeasure function */}
              <IconButton color="inherit" onClick={this.saveMeasure} edge="end">
                {/* Render an icon using the mdiContentSaveOutline path, specified size, and color */}
                <Icon
                  path={mdiContentSaveOutline}
                  size={iconSize}
                  color={iconColor}
                />
              </IconButton>
              {/* Create an IconButton to trigger the clearMeasure function */}
              <IconButton
                color="inherit"
                onClick={this.clearMeasure}
                edge="end"
              >
                {/* Render an icon using the mdiTrashCanOutline path, specified size, and color */}
                <Icon
                  path={mdiTrashCanOutline}
                  size={iconSize}
                  color={iconColor}
                />
              </IconButton>
            </Toolbar>
            {/* Conditional rendering: Display Measurements component if isOpen is true, otherwise, display null */}
            <div>
              {isOpen ? (
                /* Render the Measurements component with specified props */
                <Measurements
                  dcmViewer={dcmViewer}
                  toolRemove={this.toolRemove}
                  classes={classes}
                />
              ) : null}
            </div>
          </div>
        </Drawer>
        {/* Create a Drawer component */}
        <Drawer
          /* Set the variant of the Drawer to "persistent" */
          variant="persistent"
          /* Set the anchor position of the Drawer to the right */
          anchor="right"
          /* Determine whether the Drawer is open or closed based on the visibleToolbox state */
          open={visibleToolbox}
          /* Define the function to be called when the Drawer is closed */
          onClose={this.toggleToolbox}
        >
          {/* Add top margin to the content within the Drawer */}
          <div style={{ marginTop: "48px" }}>
            {/* Conditional rendering: Display Histogram component if isOpen is true, otherwise, display null */}
            <div>{isOpen ? <Histogram key={dcmViewer.filename} /> : null}</div>
          </div>
        </Drawer>
        {/* Create a Drawer component */}
        <Drawer
          /* Set the variant of the Drawer to "persistent" */
          variant="persistent"
          /* Set the anchor position of the Drawer dynamically based on the result of getSettingsDicomdirView() */
          anchor={getSettingsDicomdirView()}
          /* Determine whether the Drawer is open or closed based on the visibleDicomdir state */
          open={visibleDicomdir}
          /* Define the function to be called when the Drawer is closed */
          onClose={this.toggleDicomdir}
        >
          {/* Create a div to contain the content within the Drawer */}
          <div>
            {/* Nested div for conditional rendering: Display Dicomdir component if visibleDicomdir is true, otherwise, display null */}
            <div>
              {visibleDicomdir ? (
                /* Render the Dicomdir component with specified props */
                <Dicomdir
                  onOpenFile={this.handleOpenFileDicomdir}
                  onOpenFs={this.handleOpenSandboxFs}
                />
              ) : null}
            </div>
          </div>
        </Drawer>
        {/* Create a Drawer component */}
        <Drawer
          /* Set the variant of the Drawer to "persistent" */
          variant="persistent"
          /* Set the anchor position of the Drawer dynamically based on the result of getSettingsFsView() */
          anchor={getSettingsFsView()}
          /* Determine whether the Drawer is open or closed based on the visibleFileManager state */
          open={visibleFileManager}
          /* Define the function to be called when the Drawer is closed */
          onClose={this.toggleFileManager}
        >
          {/* Create a div to contain the content within the Drawer */}
          <div>
            {/* Nested div for conditional rendering: Display FsUI component if visibleFileManager is true, otherwise, display null */}
            <div>
              {visibleFileManager ? (
                /* Render the FsUI component with specified props */
                <FsUI
                  onOpen={this.handleOpenSandboxFs}
                  onOpenImage={this.handleOpenImage}
                  onOpenMultipleFilesCompleted={this.openMultipleFilesCompleted}
                  onOpenDicomdir={this.handleOpenFsDicomdir}
                  color={iconColor}
                />
              ) : null}
            </div>
          </div>
        </Drawer>
        {/* Conditionally render the Settings component if visibleSettings is true, otherwise, display null */}
        {visibleSettings ? <Settings onClose={this.hideSettings} /> : null}
        {/* Conditionally render the AboutDlg component if visibleAbout is true, otherwise, display null */}
        {visibleAbout ? <AboutDlg onClose={this.showAbout} /> : null}
        {/* Conditionally render the DownloadZipDlg component if visibleDownloadZipDlg is true, otherwise, display null */}
        {visibleDownloadZipDlg ? (
          <DownloadZipDlg onClose={this.hideDownloadZipDlg} url={this.url} />
        ) : null}
        {/* Conditionally render the OpenMultipleFilesDlg component if visibleOpenMultipleFilesDlg is true, otherwise, display null */}
        {visibleOpenMultipleFilesDlg ? (
          <OpenMultipleFilesDlg
            onClose={this.hideOpenMultipleFilesDlg}
            files={this.files}
            origin={"local"}
          />
        ) : null}
        <Dialog
          open={visibleClearMeasureDlg}
          onClose={this.hideClearMeasureDlg}
        >
          {/* Dialog component with open state and onClose handler */}
          <DialogTitle>
            {"Are you sure to remove all the measurements?"}
          </DialogTitle>
          {/* Dialog title with a confirmation message */}
          <DialogActions>
            {/* Dialog actions, typically containing buttons */}
            <Button onClick={this.hideClearMeasureDlg}>Cancel</Button>
            {/* Button to cancel the action */}
            <Button onClick={this.confirmClearMeasureDlg} autoFocus>
              Ok
            </Button>
            {/* Button to confirm the action, set as autoFocus for convenience */}
          </DialogActions>
        </Dialog>
        <Dialog open={visibleZippedFileDlg} onClose={this.hideZippedFileDlg}>
          {/* Dialog component with open state and onClose handler */}
          <DialogTitle>
            {
              "This is a zipped file, would you import it into the sandbox file system?"
            }
          </DialogTitle>
          {/* Dialog title with a confirmation message */}
          <DialogActions>
            {/* Dialog actions, typically containing buttons */}
            <Button onClick={this.hideZippedFileDlg}>Cancel</Button>
            {/* Button to cancel the action */}
            <Button onClick={this.confirmZippedFileDlg} autoFocus>
              Ok
            </Button>
            {/* Button to confirm the action, set as autoFocus for convenience */}
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.visibleOpenUrl}>
          {/* Dialog component with open state */}
          <DialogTitle>{"Open URL"}</DialogTitle>
          {/* Dialog title for opening a URL */}
          <DialogContent>
            {/* Dialog content with instructions and a text field */}
            <DialogContentText>
              Insert a URL to download a DICOM or image file:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="id-open-url"
              inputRef={(input) => (this.openUrlField = input)}
              fullWidth
            />
          </DialogContent>
          {/* Dialog actions, typically containing buttons */}
          <DialogActions>
            <Button onClick={() => this.hideOpenUrl(false)}>Cancel</Button>
            {/* Button to cancel the action */}
            <Button onClick={() => this.hideOpenUrl(true)} autoFocus>
              Ok
            </Button>
            {/* Button to confirm the action, set as autoFocus for convenience */}
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.visibleMessage}>
          {/* Dialog component with open state */}
          <DialogTitle>{this.state.titleMessage}</DialogTitle>
          {/* Dialog title, dynamically set based on state */}
          <DialogContent>
            {/* Dialog content, dynamically set based on state */}
            <DialogContentText>{this.state.textMessage}</DialogContentText>
          </DialogContent>
          {/* Dialog actions, typically containing buttons */}
          <DialogActions>
            <Button onClick={() => this.setState({ visibleMessage: false })}>
              Cancel
            </Button>
            {/* Button to close the dialog */}
          </DialogActions>
        </Dialog>
        <Popover
          // Popover component with specific properties
          id={"id-layout"}
          // Unique ID for the Popover
          open={visibleLayout}
          // Open state, controlled by the 'visibleLayout' variable
          anchorEl={this.state.anchorElLayout}
          // The element to which the popover is anchored
          onClose={this.closeLayout}
          // Callback function to handle the close event
          anchorOrigin={{
            // Specifies where the anchor element's origin is positioned
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            // Specifies where the popover's transform origin is positioned
            vertical: "center",
            horizontal: "left",
          }}
        >
          {/* Content of the Popover, in this case, a 'LayoutTool' component */}
          <LayoutTool
            // Props passed to the 'LayoutTool' component
            row={this.props.layout[0] - 1}
            col={this.props.layout[1] - 1}
            onChange={this.changeLayout}
            // Event handler to handle layout changes
          />
        </Popover>
        {/* Opening tag of the Popover component */}
        <Popover
          id={"id-tools"} // Unique identifier for the Popover
          open={visibleToolsPanel} // Boolean indicating whether the Popover is open or closed
          anchorEl={this.state.anchorElToolsPanel} // The anchor element to which the Popover is attached
          onClose={this.closeToolsPanel} // Callback function to be executed when the Popover is closed
          anchorOrigin={{
            vertical: "bottom", // Vertical alignment of the Popover relative to the anchor
            horizontal: "right", // Horizontal alignment of the Popover relative to the anchor
          }}
          transformOrigin={{
            vertical: "top", // Vertical alignment of the Popover relative to its origin
            horizontal: "center", // Horizontal alignment of the Popover relative to its origin
          }}
        >
          {/* Content of the Popover */}
          <ToolsPanel
            toolActive={this.state.toolActive} // Current active tool
            referenceLines={visibleReferenceLines} // Visibility status of reference lines
            seriesLink={visibleSeriesLink} // Status of series linking
            toolExecute={this.toolExecute} // Function to execute tools
            onChange={this.changeLayout} // Callback function for layout changes
          />
        </Popover>
        {/* Notification: Volume building, wait please */}
        {/* Opening tag of the Snackbar component */}
        <Snackbar
          anchorOrigin={{
            vertical: "top", // Vertical position of the Snackbar
            horizontal: "center", // Horizontal position of the Snackbar
          }}
          open={visibleVolumeBuilding} // Boolean indicating whether the Snackbar is open or closed
          autoHideDuration={6000} // Duration for the Snackbar to auto-hide in milliseconds
          message="Volume building, wait please ..." // Message content to be displayed in the Snackbar
        />
        {/* Creating a <div> element with an inline style */}
        <div style={{ height: "calc(100vh - 48px)" }}>
          {/* Rendering the result of the buildLayoutGrid function */}
          {this.buildLayoutGrid()}
        </div>
        {/* The Explorer component interacts with file, allowing the user to select
        series and passing callbacks such as onSelectSeries and color */}
        {/* Creating a persistent right-sided Drawer component */}
        <Drawer
          variant="persistent"
          anchor="right"
          open={visibleExplorer}
          onClose={this.toggleExplorer}
        >
          {/* Outer container <div> */}
          <div>
            {/* Inner <div> */}
            <div>
              {/* Conditional rendering of the Explorer component based on the visibility state */}
              {visibleExplorer ? (
                <Explorer
                  explorer={this.explorer}
                  onSelectSeries={this.explorerOnSelectSeries}
                  color={iconColor}
                />
              ) : null}
            </div>
          </div>
        </Drawer>
        <div>
          {/* // Creating an input element of type "file" */}
          <input
            // Setting the id attribute to "file_open"
            type="file"
            // Applying inline styles to hide the input element
            id="file_open"
            style={{ display: "none" }}
            // Creating a reference to the input element using React ref
            ref={this.fileOpen}
            // Attaching an event handler for the "change" event
            onChange={(e) => this.handleOpenLocalFs(e.target.files)}
            // Allowing users to select multiple files
            multiple
          />
        </div>
        <div>
          {/* Creating an input element of type "file" */}
          <input
            // Setting the type attribute to "file"
            type="file"
            // Assigning the id attribute as "file_dicomdir"
            id="file_dicomdir"
            // Applying inline styles to hide the input element
            style={{ display: "none" }}
            // Creating a reference to the input element using React ref
            ref={this.openDicomdir}
            // Attaching an event handler for the "change" event
            onChange={(e) => this.handleOpenDicomdir(e.target.files)}
            // Adding webkitdirectory, mozdirectory, and directory attributes to allow directory selection
            webkitdirectory=""
            mozdirectory=""
            directory=""
            // Allowing users to select multiple files
            multiple
          />
        </div>

        <div>
          {/* Creating an input element of type "file" */}
          <input
            // Setting the type attribute to "file"
            type="file"
            // Assigning the id attribute as "file_folder"
            id="file_folder"
            // Applying inline styles to hide the input element
            style={{ display: "none" }}
            // Creating a reference to the input element using React ref
            ref={this.openFolder}
            // Attaching an event handler for the "change" event
            onChange={(e) => this.handleOpenFolder(e.target.files)}
            // Adding webkitdirectory, mozdirectory, and directory attributes to allow directory selection
            webkitdirectory=""
            mozdirectory=""
            directory=""
            // Allowing users to select multiple files
            multiple
          />
        </div>
      </div>
    );
  }
}

// Defining a function called mapStateToProps, which is commonly used in React Redux
const mapStateToProps = (state) => {
  // Returning an object that maps specific properties from the Redux state to props
  return {
    // Mapping the localFileStore property from the state to the localFileStore prop
    localFileStore: state.localFileStore,
    // Mapping the files property from the state to the files prop
    files: state.files,
    // Mapping the series property from the state to the series prop
    series: state.series,
    // Mapping the isOpen property from the state to the isOpen prop
    isOpen: state.isOpen,
    // Mapping the tool property from the state to the tool prop
    tool: state.tool,
    // Mapping the activeDcmIndex property from the state to the activeDcmIndex prop
    activeDcmIndex: state.activeDcmIndex,
    // Mapping the explorerActivePatientIndex property from the state to the explorerActivePatientIndex prop
    explorerActivePatientIndex: state.explorerActivePatientIndex,
    // Mapping the explorerActiveStudyIndex property from the state to the explorerActiveStudyIndex prop
    explorerActiveStudyIndex: state.explorerActiveStudyIndex,
    // Mapping the explorerActiveSeriesIndex property from the state to the explorerActiveSeriesIndex prop
    explorerActiveSeriesIndex: state.explorerActiveSeriesIndex,
    // Mapping the measurements property from the state to the measurements prop
    measurements: state.measurements,
    // Mapping the layout property from the state to the layout prop
    layout: state.layout,
    // Mapping the dicomdir property from the state to the dicomdir prop
    dicomdir: state.dicomdir,
    // Mapping the fsZippedFile property from the state to the fsZippedFile prop
    fsZippedFile: state.fsZippedFile,
  };
};

// Defining a function called mapDispatchToProps, commonly used in React Redux
const mapDispatchToProps = (dispatch) => {
  // Returning an object that maps action creators to props
  return {
    // Mapping the clearingStore action creator to the clearingStore prop
    clearingStore: () => dispatch(clearStore()),
    // Mapping the setLocalFileStore action creator to the setLocalFileStore prop
    setLocalFileStore: (file) => dispatch(localFileStore(file)),
    // Mapping the toolStore action creator to the toolStore prop
    toolStore: (tool) => dispatch(dcmTool(tool)),
    // Mapping the isOpenStore action creator to the isOpenStore prop
    isOpenStore: (value) => dispatch(dcmIsOpen(value)),
    // Mapping the setActiveDcm action creator to the setActiveDcm prop
    setActiveDcm: (dcm) => dispatch(activeDcm(dcm)),
    // Mapping the setActiveDcmIndex action creator to the setActiveDcmIndex prop
    setActiveDcmIndex: (index) => dispatch(activeDcmIndex(index)),
    // Mapping the setActiveMeasurements action creator to the setActiveMeasurements prop
    setActiveMeasurements: (measurements) =>
      dispatch(activeMeasurements(measurements)),
    // Mapping the setLayoutStore action creator to the setLayoutStore prop
    setLayoutStore: (row, col) => dispatch(setLayout(row, col)),
    // Mapping the setDicomdirStore action creator to the setDicomdirStore prop
    setDicomdirStore: (dicomdir) => dispatch(setDicomdir(dicomdir)),
    // Mapping the setFsZippedFile action creator to the setFsZippedFile prop
    setFsZippedFile: (file) => dispatch(setZippedFile(file)),
    // Mapping the setVolumeStore action creator to the setVolumeStore prop
    setVolumeStore: (file) => dispatch(setVolume(file)),
    // Mapping the setFilesStore action creator to the setFilesStore prop
    setFilesStore: (files) => dispatch(filesStore(files)),
    // Mapping the setExplorerActiveSeriesIndex action creator to the setExplorerActiveSeriesIndex prop
    setExplorerActiveSeriesIndex: (index) =>
      dispatch(explorerActiveSeriesIndex(index)),
  };
};

// Connecting the App component to the Redux store, applying styles, and exporting the connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));

/*--------- EnD -----------*/
