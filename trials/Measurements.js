// Import necessary dependencies
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import MeasureItem from "./MeasureItem";

// Define the Measurements component
class Measurements extends PureComponent {
  // Component state definition
  state = {
    visibleClearMeasureDlg: false,
  };

  // Method to show the clear measurement dialog
  showClearMeasureDlg = () => {
    this.setState({ visibleClearMeasureDlg: true });
  };

  // Method to hide the clear measurement dialog
  hideClearMeasureDlg = () => {
    this.setState({ visibleClearMeasureDlg: false });
  };

  // Method to confirm clearing measurements
  confirmClearMeasureDlg = () => {
    this.hideClearMeasureDlg();
    // Assuming this.dicomViewersRefs and runTool method are defined elsewhere
    this.dicomViewersRefs[this.props.activeDcmIndex].runTool("removetools");
  };

  // Render method for the component
  render() {
    // Render the list of MeasureItem components based on Redux state
    return (
      <div>
        <div>
          {this.props.measurements !== null
            ? this.props.measurements.map((item, index) => (
                <MeasureItem
                  item={item}
                  index={index}
                  toolRemove={this.props.toolRemove}
                  key={index}
                />
              ))
            : null}
        </div>

        {/* Clear Measurements Dialog */}
        <Dialog
          open={this.state.visibleClearMeasureDlg}
          onClose={this.hideClearMeasureDlg}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure to remove all the measurements?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.hideClearMeasureDlg}>Cancel</Button>
            <Button onClick={this.confirmClearMeasureDlg} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

// Map relevant state from the Redux store to component props
const mapStateToProps = (state) => {
  return {
    measurements: state.measurements,
  };
};

// Connect the component to the Redux store
export default connect(mapStateToProps)(Measurements);
