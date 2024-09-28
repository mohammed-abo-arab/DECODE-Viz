import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";

class OpenUrlDlg extends PureComponent {
  // Method to hide the dialog by triggering the onClose prop
  hide = () => {
    this.props.onClose();
  };

  // Method to cancel the download and hide the dialog
  cancel = () => {
    // Stop the ongoing download (using window.stop())
    window.stop();
    // Hide the dialog
    this.hide();
  };

  render() {
    return (
      <div>
        {/* Dialog component from Material-UI */}
        <Dialog
          open={true} // Open state controlled by the 'open' prop
          onClose={this.hide} // Method to handle the close event
          aria-labelledby="alert-dialog-title"
        >
          {/* Dialog title */}
          <DialogTitle id="alert-dialog-title">
            {"Downloading file ..."}
          </DialogTitle>
          {/* Dialog content, containing a LinearProgress component */}
          <DialogContent>
            <LinearProgress
              variant="determinate"
              value={this.props.progress} // Progress value controlled by the 'progress' prop
              color="secondary"
            />
          </DialogContent>
          {/* Dialog actions, including a Cancel button */}
          <DialogActions>
            <Button onClick={this.cancel}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default OpenUrlDlg;
