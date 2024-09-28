// Action Types
export const CLEAR_STORE = "CLEAR_STORE"; // Clears the entire store
export const LOCALFILE_STORE = "LOCALFILE_STORE"; // Stores a local file
export const FSFILE_STORE = "FSFILE_STORE"; // Stores a file from the file system (Typo corrected)
export const FILES_STORE = "FILES_STORE"; // Stores multiple files
export const SERIES_STORE = "SERIES_STORE"; // Stores series information
export const DCM_IS_OPEN = "DCM_IS_OPEN"; // Indicates whether a DICOM viewer is open
export const DCM_TOOL = "DCM_TOOL"; // Stores the active DICOM tool
export const ACTIVE_DCM_INDEX = "ACTIVE_DCM_INDEX"; // Stores the active DICOM index
export const ACTIVE_DCM = "ACTIVE_DCM"; // Stores the active DICOM instance
export const ACTIVE_MEASUREMENTS = "ACTIVE_MEASUREMENTS"; // Stores active measurements
export const EXPLORER_STORE = "EXPLORER_STORE"; // Stores explorer-related data
export const EXPLORER_ACTIVE_PATIENT_INDEX = "EXPLORER_ACTIVE_PATIENT_INDEX"; // Stores active patient index in explorer
export const EXPLORER_ACTIVE_STUDY_INDEX = "EXPLORER_ACTIVE_STUDY_INDEX"; // Stores active study index in explorer
export const EXPLORER_ACTIVE_SERIES_INDEX = "EXPLORER_ACTIVE_SERIES_INDEX"; // Stores active series index in explorer
export const LAYOUT = "LAYOUT"; // Stores layout configuration
export const DICOMDIR = "DICOMDIR"; // Stores DICOMDIR information
export const FSCURRENTDIR = "FSCURRENTDIR"; // Stores the current directory in the file system
export const FSCURRENTLIST = "FSCURRENTLIST"; // Stores the current list of files in the file system
export const FSZIPPEDFILE = "FSZIPPEDFILE"; // Stores zipped file information in the file system
export const FSREFRESH = "FSREFRESH"; // Triggers a refresh in the file system
export const VOLUME_STORE = "VOLUME_STORE"; // Stores volume-related information
export const DCMENABLETOOL_STORE = "DCMENABLETOOL_STORE"; // Stores the state of DICOM tools (enabled/disabled)

// Action Creators

// Clears the entire store
export const clearStore = () => ({
  type: CLEAR_STORE,
});

// Stores a local file
export const localFileStore = (file) => ({
  type: LOCALFILE_STORE,
  payload: file, // The local file data to be stored
});

// Stores a file from the file system
export const fsFileStore = (file) => ({
  type: FSFILE_STORE,
  payload: file, // The file from the file system to be stored
});

// Stores multiple files
export const filesStore = (files) => ({
  type: FILES_STORE,
  payload: files, // The array of files to be stored
});

// Stores series information
export const seriesStore = (series) => ({
  type: SERIES_STORE,
  payload: series, // The array of series to be stored
});

// Indicates whether a DICOM viewer is open
export const dcmIsOpen = (value) => ({
  type: DCM_IS_OPEN,
  payload: value, // The value indicating whether the viewer is open (true/false)
});

// Sets the active DICOM tool
export const dcmTool = (tool) => ({
  type: DCM_TOOL,
  payload: tool, // The DICOM tool to be set as active
});

// Sets the active DICOM index
export const activeDcmIndex = (index) => ({
  type: ACTIVE_DCM_INDEX,
  payload: index, // The index of the active DICOM in the collection
});

// Sets the active DICOM instance
export const activeDcm = (dcm) => ({
  type: ACTIVE_DCM,
  payload: dcm, // The active DICOM instance data
});

// Sets the active measurements
export const activeMeasurements = (measurements) => ({
  type: ACTIVE_MEASUREMENTS,
  payload: measurements, // The active measurements data
});

// Stores explorer-related data
export const explorer = (data) => ({
  type: EXPLORER_STORE,
  payload: data, // The explorer data to be stored
});

// Sets the active patient index in the explorer
export const explorerActivePatientIndex = (index) => ({
  type: EXPLORER_ACTIVE_PATIENT_INDEX,
  payload: index, // The active patient index
});

// Sets the active study index in the explorer
export const explorerActiveStudyIndex = (index) => ({
  type: EXPLORER_ACTIVE_STUDY_INDEX,
  payload: index, // The active study index
});

// Sets the active series index in the explorer
export const explorerActiveSeriesIndex = (index) => ({
  type: EXPLORER_ACTIVE_SERIES_INDEX,
  payload: index, // The active series index
});

// Sets the layout configuration of the application
export const setLayout = (row, col) => ({
  type: LAYOUT,
  payload: { row, col }, // The layout configuration, specified as {row, col}
});

// Stores DICOMDIR information
export const setDicomdir = (dicomdir) => ({
  type: DICOMDIR,
  payload: dicomdir, // The DICOMDIR data to be stored
});

// Sets the current directory in the file system
export const setFsCurrentDir = (dir) => ({
  type: FSCURRENTDIR,
  payload: dir, // The current directory in the file system
});

// Sets the current list of files in the file system
export const setFsCurrentList = (list) => ({
  type: FSCURRENTLIST,
  payload: list, // The current list of files in the file system
});

// Stores zipped file information in the file system
export const setZippedFile = (file) => ({
  type: FSZIPPEDFILE,
  payload: file, // The zipped file to be stored
});

// Triggers a refresh in the file system
export const doFsRefresh = () => ({
  type: FSREFRESH,
});

// Stores volume-related information
export const setVolume = (volume) => ({
  type: VOLUME_STORE,
  payload: volume, // The volume data to be stored
});

// Sets the state of DICOM tools (enable/disable)
export const setDcmEnableTool = (value) => ({
  type: DCMENABLETOOL_STORE,
  payload: value, // The value representing the state of DICOM tools (enabled/disabled)
});
