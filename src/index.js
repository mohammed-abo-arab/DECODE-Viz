import React from "react";
import ReactDOM from "react-dom";
import "./index.css"; // Import global CSS
import App from "./App"; // Main App component
// import * as serviceWorker from "./serviceWorker"; // Previously used service worker import (commented out)
import WebFontLoader from "webfontloader"; // Web font loader for custom fonts
import { Provider } from "react-redux"; // Redux Provider to make the store available to the app
import store from "./store"; // Redux store
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles"; // Material-UI theme provider and theme creation

// Load custom fonts from Google Fonts
WebFontLoader.load({
  google: {
    families: ["Roboto:300,400,500,700", "Material Icons"],
  },
});

// Create a custom theme for Material-UI components
const theme = createTheme({
  overrides: {
    MuiFormControlLabel: {
      label: {
        fontSize: "0.85em", // Smaller font size for form control labels
      },
    },
    MuiFormLabel: {
      root: {
        "&$focused": {
          color: "#CCCCCC", // Lighter color for focused form labels
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#004d40", // Dark green color for primary theme
    },
    secondary: {
      main: "#888888", // Gray color for secondary theme
    },
    type: "dark", // Dark theme overall
  },
});

// Render the React application, wrapped in Redux Provider and Material-UI Theme Provider
ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root") // Attach the app to the root div in index.html
);

// Service Worker registration for enabling offline capabilities
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js") // Register the service worker
      .then((registration) => {
        console.log("Service worker registered:", registration); // Log success
      })
      .catch((error) => {
        console.log("Service worker registration failed:", error); // Log failure
      });
  });
}
