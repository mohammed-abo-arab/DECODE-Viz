  mprBuildVolume = () => {
    // "For the specific case of dual-echo MR images select files with same EchoNumber tag of selected image.
    // see https://groups.google.com/forum/#!topic/comp.protocols.dicom/zh2TzgbjvdE
    const echoNumber = getDicomEchoNumber(
      this.dicomViewersRefs[this.props.activeDcmIndex].image
    );

    if (this.volume.length > 0 && echoNumber === this.echoNumber) return;

    this.t0 = performance.now();

    const files = this.dicomViewersRefs[0].files.filter((a) => {
      return a.series.echoNumber === echoNumber;
    });
    if (files.length < this.files.length) {
      // until mprMode is true temporary works on files with same EchoNumber
      this.echoNumber = echoNumber;
      this.dicomViewersRefs[this.props.activeDcmIndex].runTool(
        "setfiles",
        files
      );
    }

    const sliceIndex = this.state.sliceIndex;
    const xPixelSpacing = getDicomPixelSpacing(files[sliceIndex].image, 1);
    const spacingBetweenSlice = getDicomSpacingBetweenSlice(
      files[sliceIndex].image
    );
    const sliceThickness = getDicomSliceThickness(files[sliceIndex].image);
    const length = files[sliceIndex].image.getPixelData().length;
    const sliceLocation = getDicomSliceLocation(files[sliceIndex].image);

    this.volume = [];

    // see https://stackoverflow.com/questions/58412358/dicom-multiplanar-image-reconstruction
    this.mprData.zDim = Math.round(
      (files.length * spacingBetweenSlice) / xPixelSpacing
    );

    // If spacing between slices is less than slice thickness, the images are not optimal for 3D reconstruction.
    // Try an alternative algorithm based on slice distance.
    let zDimMethod2 = false;
    if (spacingBetweenSlice < sliceThickness && sliceLocation === undefined) {
      let max = files[sliceIndex].sliceDistance;
      let min = files[sliceIndex].sliceDistance;
      for (let i = 0; i < files.length; i++) {
        if (files[i].sliceDistance > max) max = files[i].sliceDistance;
        if (files[i].sliceDistance < min) min = files[i].sliceDistance;
      }
      this.mprData.zDim = Math.round(Math.abs(max - min) / xPixelSpacing);
      zDimMethod2 = true;
    }
    this.mprData.zStep = Math.round(this.mprData.zDim / files.length);

    if (files.length === this.mprData.zDim) {
      // slices contiguous
      for (let i = 0, len = files.length; i < len; i++) {
        this.volume.push(files[i].image.getPixelData());
      }
    } else if (files.length < this.mprData.zDim) {
      // gap between slices

      let emptyPlane = new Int16Array(length).fill(0);
      for (let i = 0, len = this.mprData.zDim; i < len; i++) {
        this.volume.push(emptyPlane);
      }

      let order = [];

      for (let i = 0; i < files.length; i++) {
        order.push({
          iFile: i,
          instanceNumber: files[i].instanceNumber,
          sliceDistance: files[i].sliceDistance,
          sliceLocation: files[i].sliceLocation,
        });
      }

      if (zDimMethod2) {
        // eliminate eventually duplicates
        order = order.reduce((previous, current) => {
          let object = previous.filter(
            (object) => object.sliceDistance === current.sliceDistance
          );
          if (object.length === 0) {
            previous.push(current);
          }
          return previous;
        }, []);

        order.sort((l, r) => {
          // return r.sliceDistance - l.sliceDistance
          return l.instanceNumber - r.instanceNumber;
        });
      } else {
        const reorder = files[0].sliceDistance < files[1].sliceDistance;
        // const reorder = files[sliceIndex].sliceLocation < files[1].sliceLocation
        if (reorder) {
          order.sort((l, r) => {
            return r.sliceDistance - l.sliceDistance;
            //return r.sliceLocation - l.sliceLocation
            // return r.instanceNumber - l.instanceNumber
          });
        } else {
          const isOnRows = getDicomImageXOnRows(files[sliceIndex].image);
          const reorder =
            Math.sign(files[0].sliceDistance) *
              Math.sign(files[0].sliceLocation) <
            0;
          if (reorder) {
            order.sort((l, r) => {
              if (isOnRows) return l.sliceDistance - r.sliceDistance;
              else return r.sliceDistance - l.sliceDistance;
            });
          }
        }
      }
      /*
      order.sort((l, r) => {
        return r.sliceDistance - l.sliceDistance
        // return l.instanceNumber - r.instanceNumber
      })  
      */

      this.mprData.instanceNumberOrder =
        files[order[0].iFile].instanceNumber <
        files[order[1].iFile].instanceNumber
          ? 1
          : -1;
      this.mprData.indexMax = files.length;

      let intervals = [0];
      this.volume[0] = files[order[0].iFile].image.getPixelData();
      this.volume[this.mprData.zDim - 1] =
        files[order[order.length - 1].iFile].image.getPixelData();
      const step = (this.mprData.zDim - 2) / (order.length - 2);
      let i = 0;
      for (let k = 1; k <= order.length - 2; k++) {
        i = Math.ceil(i + step);
        this.volume[i] = files[order[k].iFile].image.getPixelData(); // order[k-1].iFile
        intervals.push(i);
      }
      intervals.push(this.mprData.zDim - 1);

      const interpolationMethod = getSettingsMprInterpolation();

      if (interpolationMethod === "no") {
        // build missing planes without interpolation, simple duplicate
        for (let i = 0; i < intervals.length - 1; i++)
          for (let j = intervals[i] + 1; j <= intervals[i + 1] - 1; j++)
            this.volume[j] = this.volume[intervals[i + 1]];
      } else if (interpolationMethod === "weightedlinear") {
        // build the interpolate planes between original planes
        for (let i = 0; i < intervals.length - 1; i++) {
          const step = intervals[i + 1] - intervals[i];
          for (let j = intervals[i] + 1; j < intervals[i + 1]; j++) {
            let p = new Int16Array(length);
            const w = (j - intervals[i]) / step;
            for (let k = 0; k < length - 1; k++) {
              // simple linear interpolation
              // const p0 = this.volume[intervals[i]][k]
              // const p1 = this.volume[intervals[i+1]][k]
              // p[k] = (p0+p1)/2

              // weighted linear interpolation
              // const p0 = this.volume[intervals[i]][k] * (1 - w);
              // const p1 = this.volume[intervals[i + 1]][k] * w;
              // p[k] = p0 + p1;

              // weighted bilinear interpolation
              /*if (k-1 > 0 && k+1 < length) {
                const p0 = this.volume[intervals[i]][k] * (1-w) * 0.5 + this.volume[intervals[i]][k-1] * (1-w) * 0.25 + this.volume[intervals[i]][k+1] * (1-w) * 0.25
                const p1 = this.volume[intervals[i+1]][k] * w * 0.5 + this.volume[intervals[i+1]][k-1] * w * 0.25 + this.volume[intervals[i+1]][k+1] * w * 0.25
                p[k] = p0+p1
              } else if (k-1 < 0) {
                const p0 = this.volume[intervals[i]][k] * (1-w) * 0.75 + this.volume[intervals[i]][k+1] * (1-w) * 0.25
                const p1 = this.volume[intervals[i+1]][k] * w * 0.5 + this.volume[intervals[i+1]][k+1] * w * 0.25
                p[k] = p0+p1
              } else { // k+1 > length 
                const p0 = this.volume[intervals[i]][k] * (1-w) * 0.75 + this.volume[intervals[i]][k-1] * (1-w) * 0.25
                const p1 = this.volume[intervals[i+1]][k] * w * 0.5 + this.volume[intervals[i+1]][k-1] * w * 0.25
                p[k] = p0+p1
              }*/
              // sinc fun and it's interpolation
              function sinc(x) {
                if (x === 0) {
                  return 1.0;
                } else {
                  return Math.sin(Math.PI * x) / (Math.PI * x);
                }
              }
              // sinc interpolation
              let sumSinc = 0;
              for (let n = intervals[i]; n <= intervals[i + 1]; n++) {
                sumSinc += this.volume[n][k] * sinc(w - n);
              }
              p[k] = sumSinc;
            }

            this.volume[j] = p;
          }
        }
      }

      this.t1 = performance.now();
      console.log(
        `performance volume building: ${this.t1 - this.t0} milliseconds`
      );
    } else {
      // overlapping slices
      this.mprData.zStep = Math.round(files.length / this.mprData.zDim);
      for (let i = 0, len = this.mprData.zDim; i < len; i++) {
        const k = i * this.mprData.zStep;
        this.volume.push(files[k].image.getPixelData());
      }
    }

    const index = Math.round(files.length / 2);
    this.setState({ sliceIndex: index }, () => {
      if (this.state.visibleMprOrthogonal) {
        this.changeToOrthogonalView();
      } else if (this.state.visibleMprSagittal) {
        this.changeToSagittalView();
      } else if (this.state.visibleMprCoronal) {
        this.changeToCoronalView();
      } else {
        // axial
        this.changeToAxialView();
      }
    });
  };