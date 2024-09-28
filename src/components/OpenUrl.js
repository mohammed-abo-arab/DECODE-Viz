import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";

// Styles for layout and positioning
const styleUrl = {
  position: "relative",
  width: "98%",
};

const styleText = {
  width: "90%",
  padding: "15px",
};

const styleButton = {
  position: "absolute",
  right: "0px",
  top: "12px",
};

class OpenUrl extends PureComponent {
  constructor(props) {
    super(props);
    // Creating a ref to the TextField component
    this.urlField = React.createRef();
  }

  // onClick handler for the "get_app" button
  onClick = () => {
    // Triggering the onClose prop with true and the current URL value
    this.props.onClose(true, this.urlField.current.value);
  };

  render() {
    return (
      <div className="md-grid">
        {/* Toolbar component for a consistent UI look */}
        <Toolbar
          fixed
          // Close button with an icon and onClick handler
          nav={
            <Button icon onClick={() => this.props.onClose(false)}>
              close
            </Button>
          }
          title={"Open URL"}
        />
        <div style={styleUrl}>
          {/* TextField for inputting a URL */}
          <TextField
            fullWidth
            id="idUrl"
            ref={this.urlField}
            placeholder="URL"
            style={styleText}
            value="" // Initial value (can be controlled by state if needed)
          />
          {/* Button to trigger the onClick handler */}
          <Button icon style={styleButton} onClick={this.onClick}>
            get_app
          </Button>
        </div>
      </div>
    );
  }
}

export default OpenUrl;
