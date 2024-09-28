// React component for rendering a header item with a name and value
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const HeaderItem = ({ name, value }) => {
  return (
    // Material-UI ListItem component with dense layout
    <ListItem dense={true}>
      {/* ListItemText component to display primary (name) and secondary (value) text */}
      <ListItemText primary={name} secondary={value} />
    </ListItem>
  );
};

export default HeaderItem;
