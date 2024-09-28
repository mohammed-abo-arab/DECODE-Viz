import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import packageJson from "../../package.json";

// About dialog component
const AboutDlg = ({ onClose }) => {
  // URL for the repository
  const urlRepository = "https://www.decodeitn.eu/";

  // Link element for the repository URL
  const linkRepository = (
    <Typography variant="body2">
      <Link href={urlRepository} target="_blank" style={{ color: "#666666" }}>
        https://www.decodeitn.eu/contact
      </Link>
    </Typography>
  );

  // Version information from package.json
  const version = (
    <Typography variant="body2" style={{ color: "#666666" }}>
      {packageJson.version}
    </Typography>
  );

  return (
    <div>
      {/* Dialog component to show About information */}
      <Dialog onClose={onClose} open={true}>
        {/* Dialog title with custom typography */}
        <DialogTitle onClose={onClose} disableTypography>
          <Typography variant="h6">
            About <strong>DECODE</strong> <strong>D</strong>icom{" "}
            <strong>V</strong>iewer
          </Typography>
        </DialogTitle>
        {/* Dialog content containing a list of information */}
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText
                primary="Repository URL:"
                secondary={linkRepository} // Displays the repository URL link
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Version:"
                secondary={version} // Displays the version information
              />
            </ListItem>
          </List>
        </DialogContent>
        {/* Dialog actions with a Close button */}
        <DialogActions>
          <Button
            autoFocus
            onClick={onClose}
            color="primary" // Set button color to primary for emphasis
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AboutDlg;
