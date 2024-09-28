import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Checkbox from "@material-ui/core/Checkbox";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import IconButton from "@material-ui/core/IconButton";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  getSettingsSaveAs,
  setSettingsSaveAs,
  getSettingsSaveInto,
  setSettingsSaveInto,
  getSettingsDcmHeader,
  setSettingsDcmHeader,
  getSettingsOverlay,
  setSettingsOverlay,
  getSettingsFsView,
  setSettingsFsView,
  getSettingsDicomdirView,
  setSettingsDicomdirView,
  getSettingsMprInterpolation,
  setSettingsMprInterpolation,
} from "../functions";

// Define styles using the makeStyles hook from Material-UI
const useStyles = makeStyles((theme) => ({
  // Styling for the app bar component
  appBar: {
    position: "relative", // Set the app bar to be relatively positioned
  },

  // Styling for form control components
  formControl: {
    margin: theme.spacing(3), // Add spacing around the form control components
  },

  // Styling for form labels within the form control
  formLabel: {
    fontSize: "0.85em", // Set the font size of form labels
  },

  // Styling for radio controls (size is not a valid CSS property)
  radioControl: {
    size: "small", // Invalid CSS property; remove or replace with valid property
  },

  // Styling for the title component
  title: {
    marginLeft: theme.spacing(2), // Add left margin to the title
    flex: 1, // Allow the title to grow and take available space
    fontSize: "0.95em", // Set the font size of the title
  },
}));

/*// Define a transition component using React.forwardRef and the Slide transition from Material-UI
const Transition = React.forwardRef(function Transition(props, ref) {
  // Return a Slide transition with the specified direction and ref
  return <Slide direction="right" ref={ref} {...props} />;
})*/

// Functional component for the Settings dialog, receives onClose as a prop
const Settings = ({ onClose }) => {
  // Retrieve settings values from functions
  let saveAs = getSettingsSaveAs();
  let saveInto = getSettingsSaveInto();
  let exportAs = getSettingsDcmHeader();
  let overlay = getSettingsOverlay();
  let fsView = getSettingsFsView();
  let dicomdirView = getSettingsDicomdirView();
  let mprInterpolation = getSettingsMprInterpolation();

  //const isIndexedDB = false // 'indexedDB' in window

  // Event handler for changing the 'saveAs' setting
  const handleChangeSaveAs = (event) => {
    setState({ ...state, saveAs: event.target.value });
    setSettingsSaveAs(event.target.value);
  };

  // Event handler for changing the 'saveInto' setting
  const handleChangeSaveInto = (event) => {
    setState({ ...state, saveInto: event.target.value });
    setSettingsSaveInto(event.target.value);
  };

  // Event handler for changing the 'exportAs' setting
  const handleChangeExportAs = (event) => {
    setState({ ...state, exportAs: event.target.value });
    setSettingsDcmHeader(event.target.value);
  };

  // Event handler for changing the 'overlay' setting
  const handleChangeOverlay = (event) => {
    setState({ ...state, overlay: event.target.checked });
    setSettingsOverlay(event.target.checked);
  };

  // Event handler for changing the 'fsView' setting
  const handleChangeFsView = (event) => {
    setState({ ...state, fsView: event.target.value });
    setSettingsFsView(event.target.value);
  };

  // Event handler for changing the 'dicomdirView' setting
  const handleChangeDicomdirView = (event) => {
    setState({ ...state, dicomdirView: event.target.value });
    setSettingsDicomdirView(event.target.value);
  };

  // Event handler for changing the 'mprInterpolation' setting
  const handleChangeMprInterpolation = (event) => {
    setState({ ...state, mprInterpolation: event.target.value });
    setSettingsMprInterpolation(event.target.value);
  };

  const classes = useStyles();

  // State to manage changes in the settings
  const [state, setState] = React.useState({
    saveAs: saveAs,
    saveInto: saveInto,
    exportAs: exportAs,
    overlay: overlay,
    fsView: fsView,
    dicomdirView: dicomdirView,
    mprInterpolation: mprInterpolation,
  });

  return (
    <Dialog fullScreen open={true} onClose={onClose}>
      {" "}
      {/* TransitionComponent={Transition} */}
      {/* Material-UI AppBar component styling */}
      <AppBar className={classes.appBar} elevation={0}>
        {/* Toolbar for the AppBar with dense variant */}
        <Toolbar variant="dense">
          {/* IconButton for closing the Settings dialog */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose} // Event handler to close the dialog
            aria-label="close"
          >
            {/* CloseIcon used for the IconButton */}
            <CloseIcon />
          </IconButton>
          {/* Typography component for displaying the title "Settings" */}
          <Typography variant="h6" className={classes.title}>
            Settings
          </Typography>
        </Toolbar>
      </AppBar>
      <PerfectScrollbar>
        <div>
          {/*Container div for the checkbox related form control */}
          <div>
            {/* FormControl component grouping related form controls */}
            <FormControl component="fieldset" className={classes.formControl}>
              {/* FormControlLabel for associating a label with a form control */}
              <FormControlLabel
                // Checkbox component for toggling the overlay state
                control={
                  <Checkbox
                    checked={state.overlay} // Reflects the current overlay state
                    onChange={handleChangeOverlay} // Event handler for changing the overlay state
                    value="overlay" // Value associated with the checkbox
                    size="small" // Adjusts the size of the checkbox
                  />
                }
                label="Show overlay Information" // Text label associated with the checkbox
              />
            </FormControl>
          </div>
          {/* Container div for the radio group related form control */}
          <div>
            {/* FormControl component grouping related form controls */}
            <FormControl component="fieldset" className={classes.formControl}>
              {/* FormLabel providing a legend for the radio group */}
              <FormLabel component="legend" className={classes.formLabel}>
                Open sandbox file system from:
              </FormLabel>
              {/* RadioGroup for grouping related Radio components */}
              <RadioGroup
                size="small" // Adjusts the size of the Radio components in the group
                aria-label="filesystem" // ARIA label for accessibility
                name="filesystem" // Name of the radio group
                value={state.fsView} // Reflects the current file system view setting
                onChange={handleChangeFsView} // Event handler for changing the file system view setting
              >
                {/* FormControlLabel for associating a label with a Radio component */}
                <FormControlLabel
                  value="left" // Value associated with the radio option
                  control={<Radio size="small" />} // Radio component with small size
                  label="left" // Text label associated with the radio option
                />
                {/* Additional FormControlLabel elements for other radio options */}
                <FormControlLabel
                  value="right"
                  control={<Radio size="small" />}
                  label="right"
                />
                <FormControlLabel
                  value="bottom"
                  control={<Radio size="small" />}
                  label="bottom"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div>
            {/* Container for the radio group related to DICOMDIR panel settings */}
            <FormControl component="fieldset" className={classes.formControl}>
              {/* Label for the legend of the radio group */}
              <FormLabel component="legend" className={classes.formLabel}>
                Open DICOMDIR panel from:
              </FormLabel>
              {/* RadioGroup to group related Radio components */}
              <RadioGroup
                size="small" // Adjusts the size of the Radio components in the group
                aria-label="dicomdir" // ARIA label for accessibility
                name="dicomdir" // Name of the radio group
                value={state.dicomdirView} // Reflects the current DICOMDIR view setting
                onChange={handleChangeDicomdirView} // Event handler for changing the DICOMDIR view setting
              >
                {/* FormControlLabel for associating a label with a Radio component */}
                <FormControlLabel
                  value="left" // Value associated with the radio option
                  control={<Radio size="small" />} // Radio component with small size
                  label="left" // Text label associated with the radio option
                />
                {/* Additional FormControlLabel elements for other radio options */}
                <FormControlLabel
                  value="right"
                  control={<Radio size="small" />}
                  label="right"
                />
                <FormControlLabel
                  value="bottom"
                  control={<Radio size="small" />}
                  label="bottom"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Container div for the radio group related form control */}
          <div>
            {/* FormControl component grouping related form controls */}
            <FormControl component="fieldset" className={classes.formControl}>
              {/* FormLabel providing a legend for the radio group */}
              <FormLabel component="legend" className={classes.formLabel}>
                Save screenshot as:
              </FormLabel>
              {/* RadioGroup for grouping related Radio components */}
              <RadioGroup
                aria-label="saveas" // ARIA label for accessibility
                name="saveas" // Name of the radio group
                value={state.saveAs} // Reflects the current save-as option
                onChange={handleChangeSaveAs} // Event handler for changing the save-as option
              >
                {/* FormControlLabel for associating a label with a Radio component */}
                <FormControlLabel
                  value="jpeg" // Value associated with the radio option
                  control={<Radio size="small" />} // Radio component with small size
                  label="JPEG" // Text label associated with the radio option
                />
                {/* Additional FormControlLabel for another radio option */}
                <FormControlLabel
                  value="png"
                  control={<Radio size="small" />}
                  label="PNG"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Container div for the radio group related form control */}
          <div>
            {/* FormControl component grouping related form controls */}
            <FormControl component="fieldset" className={classes.formControl}>
              {/* FormLabel providing a legend for the radio group */}
              <FormLabel component="legend" className={classes.formLabel}>
                Save screenshot into:
              </FormLabel>
              {/* RadioGroup for grouping related Radio components */}
              <RadioGroup
                aria-label="saveinto" // ARIA label for accessibility
                name="saveinto" // Name of the radio group
                value={state.saveInto} // Reflects the current save-into option
                onChange={handleChangeSaveInto} // Event handler for changing the save-into option
              >
                {/* FormControlLabel for associating a label with a Radio component */}
                <FormControlLabel
                  value="local" // Value associated with the radio option
                  control={<Radio size="small" />} // Radio component with small size
                  label="local file system" // Text label associated with the radio option
                />
                {/* Additional FormControlLabel for another radio option */}
                <FormControlLabel
                  value="sandbox"
                  control={<Radio size="small" />}
                  label="sandbox file system"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Container div for the radio group related form control */}
          <div>
            {/* FormControl component grouping related form controls */}
            <FormControl component="fieldset" className={classes.formControl}>
              {/* FormLabel providing a legend for the radio group */}
              <FormLabel component="legend" className={classes.formLabel}>
                Export Dicom header as:
              </FormLabel>
              {/* RadioGroup for grouping related Radio components */}
              <RadioGroup
                aria-label="exportas" // ARIA label for accessibility
                name="exportas" // Name of the radio group
                value={exportAs} // Reflects the current export format setting
                onChange={handleChangeExportAs} // Event handler for changing the export format setting
              >
                {/* FormControlLabel for associating a label with a Radio component */}
                <FormControlLabel
                  value="json" // Value associated with the radio option
                  control={<Radio size="small" />} // Radio component with small size
                  label="JSON" // Text label associated with the radio option
                />
                {/* Additional FormControlLabel elements for other export format options */}
                <FormControlLabel
                  value="csv"
                  control={<Radio size="small" />}
                  label="CSV"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Container div for the radio group related to MPR interpolation method */}
          <div>
            {/* FormControl component grouping related form controls */}
            <FormControl component="fieldset" className={classes.formControl}>
              {/* FormLabel providing a legend for the radio group */}
              <FormLabel component="legend" className={classes.formLabel}>
                MPR interpolation method:
              </FormLabel>
              {/* RadioGroup for grouping related Radio components */}
              <RadioGroup
                aria-label="mprinterpolation" // ARIA label for accessibility
                name="mprinterpolation" // Name of the radio group
                value={mprInterpolation} // Reflects the current MPR interpolation setting
                onChange={handleChangeMprInterpolation} // Event handler for changing the MPR interpolation setting
              >
                {/* FormControlLabel for associating a label with a Radio component */}
                <FormControlLabel
                  value="no" // Value associated with the radio option
                  control={<Radio size="small" />} // Radio component with small size
                  label="No interpolation (duplicate planes)" // Text label associated with the radio option
                />
                {/* Additional FormControlLabel elements for other MPR interpolation options */}
                <FormControlLabel
                  value="weightedlinear"
                  control={<Radio size="small" />}
                  label="Weighted linear interpolation"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </PerfectScrollbar>
    </Dialog>
  );
};

export default Settings;
