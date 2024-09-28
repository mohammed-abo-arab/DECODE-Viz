# DECODE-Viz: Web-Based Medical Imaging Analysis

## Overview

**DECODE-Viz** is an advanced web-based application designed for DICOM and Multiplanar Reconstruction (MPR) visualization, leveraging Progressive Web Application (PWA) technologies. This project addresses the challenges of cross-platform compatibility, integration capabilities, and high-resolution image reconstruction in medical imaging. The application is built using React.js and Cornerstone.js to ensure seamless DICOM image processing and a responsive user experience across multiple devices.

**Live Demo**: [DECODE-Viz](https://decode-viz.netlify.app/)

## Features

- **Modular Design**: DECODE-Viz is structured with modular components for enhanced DICOM and MPR visualization.
- **Cross-Browser Compatibility**: Fully compatible with major browsers including Chrome, Firefox, Safari, and Edge.
- **Progressive Web Application (PWA)**: Allows offline access and installation on various devices, providing a native app-like experience.
- **Advanced Interpolation Techniques**: Utilizes bicubic and weighted bilinear interpolation for accurate and detailed MPR reconstruction.
- **Comprehensive Toolset**: Includes tools for DICOM image manipulation such as magnification, angle measurement, and windowing.

## Architecture

DECODE-Viz employs a robust architecture that integrates the following components:

- **Frontend Framework**: Built with React.js for a component-based, scalable interface.
- **DICOM Image Processing**: Powered by Cornerstone.js, enabling sophisticated DICOM image analysis.
- **Data Storage**: Utilizes IndexedDB via Dexie for efficient, low-level data management in the browser.
- **Cross-Browser Compatibility**: Ensures optimal performance across various platforms, including desktops, tablets, and mobile devices.
