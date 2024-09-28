import React, { PureComponent } from "react";
import Icon from "@mdi/react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

/**
 * The @mdi/js library specifically provides a JavaScript implementation of Material Design Icons,
 * allowing developers to easily use these icons in their projects
 *
 */
import {
  mdiAngleAcute,
  mdiArrowAll,
  mdiArrowSplitHorizontal,
  mdiCheckboxIntermediate,
  mdiCursorDefault,
  mdiCursorPointer,
  mdiEllipse,
  mdiEyedropper,
  mdiGesture,
  mdiMagnify,
  mdiRectangle,
  mdiRuler,
  mdiVectorLink,
} from "@mdi/js";

const styleTable = {
  borderCollapse: "collapse",
  width: "140px", // Slightly increased width
  height: "140px", // Slightly increased height
  backgroundColor: "#F5F5F5", // Light background color
};

const styleTableTd = {
  width: "46px", // Adjusted width for slightly larger cells
  height: "46px", // Adjusted height for slightly larger cells
  padding: "6px", // Increased padding for spacing
  border: "1px solid #E0E0E0", // Subtle border color
  borderRadius: "8px", // Rounded corners
};

const iconSize = "1.5rem"; // Slightly larger icon size
const iconColor = "#333"; // Darker icon color for contrast
const activeColor = "#4CAF50"; // Green active color

class ToolsPanel extends PureComponent {
  constructor(props) {
    super(props);
    // Create a reference for the table DOM element
    this.tableRef = React.createRef();
  }

  componentDidMount() {
    // Lifecycle method invoked after the component has been inserted into the DOM
    // This can be used for additional setup or interactions after initial render
  }

  // Function to determine the icon color based on the active tool
  colorIcon = (tool) => {
    // Return the activeColor if the tool matches the active tool, otherwise return iconColor
    return this.props.toolActive === tool ? activeColor : iconColor;
  };

  render() {
    return (
      <div>
        <table style={styleTable} ref={this.tableRef}>
          <tbody>
            <tr>
              <td style={styleTableTd}>
                {/* Tooltip for providing additional information on hover */}
                <Tooltip title="No Tool">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("notool")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiCursorDefault} // Path to the desired icon from the mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("notool")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>

              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Reference Lines">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("referencelines")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiArrowSplitHorizontal} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={
                        this.props.referenceLines ? activeColor : iconColor
                      } // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>

              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Link Series">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("serieslink")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiVectorLink} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.props.seriesLink ? activeColor : iconColor} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="WW/WC">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("Wwwc")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiArrowAll} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("Wwwc")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>

              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Pan">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("Pan")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiCursorPointer} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("Pan")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>

              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Zoom">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("Zoom")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiMagnify} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("Zoom")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Magnify">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("Magnify")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiCheckboxIntermediate} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("Magnify")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>

              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Length">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("Length")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiRuler} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("Length")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>

              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Probe">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("Probe")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiEyedropper} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("Probe")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Angle">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("Angle")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiAngleAcute} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("Angle")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>

              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Elliptical Roi">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("EllipticalRoi")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiEllipse} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("EllipticalRoi")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>

              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Rectangle Roi">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("RectangleRoi")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiRectangle} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("RectangleRoi")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td style={styleTableTd}>
                {/* Tooltip providing additional information on hover */}
                <Tooltip title="Freehand Roi">
                  {/* IconButton representing a clickable button */}
                  <IconButton
                    color="inherit" // Inherit color from parent (typically defined by theme)
                    onClick={() => this.props.toolExecute("FreehandRoi")} // Click event handler
                  >
                    {/* Icon component with specific path, size, and color */}
                    <Icon
                      path={mdiGesture} // Path to the desired icon from mdi.js library
                      size={iconSize} // Size of the icon
                      color={this.colorIcon("FreehandRoi")} // Color of the icon based on active status
                    />
                  </IconButton>
                </Tooltip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default ToolsPanel;
