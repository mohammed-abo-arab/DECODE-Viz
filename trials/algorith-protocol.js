// Calculate the z step for MPR
    this.mprData.zStep =
      files.length > 0 ? Math.round(this.mprData.zDim / files.length) : 1;

    // Build the volume based on the number of files and selected method
    if (files.length === this.mprData.zDim) {
      // Slices are contiguous
      for (let i = 0, len = files.length; i < len; i++) {
        this.volume.push(files[i].image.getPixelData());
      }
    } else if (files.length < this.mprData.zDim) {
      // Gap between slices

      // Initialize an empty plane
      let emptyPlane = new Int16Array(length).fill(0);
      for (let i = 0, len = this.mprData.zDim; i < len; i++) {
        this.volume.push(emptyPlane);
      }

      // Create an order array based on slice distance
      let order = files.map((file, i) => ({
        iFile: i,
        instanceNumber: file.instanceNumber,
        sliceDistance: file.sliceDistance,
        sliceLocation: file.sliceLocation,
      }));

      // Process order array based on the selected method
      if (zDimMethod2) {
        // Eliminate duplicates and sort by instance number
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
          return l.instanceNumber - r.instanceNumber;
        });
      } else {
        // Sort based on slice distance and orientation
        const reorder = files[0].sliceDistance < files[1].sliceDistance;
        if (reorder) {
          order.sort((l, r) => {
            return r.sliceDistance - l.sliceDistance;
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

      // Update MPR data based on the order
      this.mprData.instanceNumberOrder =
        files[order[0].iFile].instanceNumber <
        files[order[1].iFile].instanceNumber
          ? 1
          : -1;
      this.mprData.indexMax = files.length;

      // Create intervals for interpolation
      let intervals = [0];
      this.volume[0] = files[order[0].iFile].image.getPixelData();
      this.volume[this.mprData.zDim - 1] =
        files[order[order.length - 1].iFile].image.getPixelData();
      const step = (this.mprData.zDim - 2) / (order.length - 2);
      let i = 0;
      for (let k = 1; k <= order.length - 2; k++) {
        i = Math.ceil(i + step);
        this.volume[i] = files[order[k].iFile].image.getPixelData();
        intervals.push(i);
      }
      intervals.push(this.mprData.zDim - 1);

      const interpolationMethod = "weightedInterpolation"
	  
       {
        // Build interpolate planes between original planes using bicubic interpolation for edge pixels and bilinear interpolation for other pixels
        for (let i = 0; i < intervals.length - 1; i++) {
          const step = intervals[i + 1] - intervals[i];
          for (let j = intervals[i] + 1; j < intervals[i + 1]; j++) {
            let p = new Int16Array(length);
            const w = (j - intervals[i]) / step;
            for (let k = 0; k < length - 1; k++) {
              if (isEdgePixel(k, length)) {
                // bicubic interpolation for edge pixels
                const p0 = this.volume[intervals[i] - 1]
                  ? this.volume[intervals[i] - 1][k]
                  : this.volume[intervals[i]][k];
                const p1 = this.volume[intervals[i]][k];
                const p2 = this.volume[intervals[i] + 1]
                  ? this.volume[intervals[i] + 1][k]
                  : this.volume[intervals[i]][k];
                const p3 = this.volume[intervals[i] + 2]
                  ? this.volume[intervals[i] + 2][k]
                  : this.volume[intervals[i]][k];

                p[k] = bicubicInterpolate(p0, p1, p2, p3, w);
              } else {
                // weighted bilinear interpolation for non-edge pixels
                if (k - 1 > 0 && k + 1 < length) {
                  const p0 =
                    this.volume[intervals[i]][k] * (1 - w) * 0.5 +
                    this.volume[intervals[i]][k - 1] * (1 - w) * 0.25 +
                    this.volume[intervals[i]][k + 1] * (1 - w) * 0.25;
                  const p1 =
                    this.volume[intervals[i + 1]][k] * w * 0.5 +
                    this.volume[intervals[i + 1]][k - 1] * w * 0.25 +
                    this.volume[intervals[i + 1]][k + 1] * w * 0.25;
                  p[k] = p0 + p1;
                } else if (k - 1 < 0) {
                  const p0 =
                    this.volume[intervals[i]][k] * (1 - w) * 0.75 +
                    this.volume[intervals[i]][k + 1] * (1 - w) * 0.25;
                  const p1 =
                    this.volume[intervals[i + 1]][k] * w * 0.5 +
                    this.volume[intervals[i + 1]][k + 1] * w * 0.25;
                  p[k] = p0 + p1;
                } else {
                  const p0 =
                    this.volume[intervals[i]][k] * (1 - w) * 0.75 +
                    this.volume[intervals[i]][k - 1] * (1 - w) * 0.25;
                  const p1 =
                    this.volume[intervals[i + 1]][k] * w * 0.5 +
                    this.volume[intervals[i + 1]][k - 1] * w * 0.25;
                  p[k] = p0 + p1;
                }
              }
            }

            // Update the volume with the interpolated plane
            this.volume[j] = p;
          }
        }

        // Check if a pixel is an edge pixel
        function isEdgePixel(index, length) {
          return index === 0 || index === length - 1;
        }

        // Bicubic interpolation function
        function bicubicInterpolate(p0, p1, p2, p3, t) {
          const v0 = cubicInterpolate(p0, p1, p2, p3, t - 1);
          const v1 = cubicInterpolate(p0, p1, p2, p3, t);
          const v2 = cubicInterpolate(p0, p1, p2, p3, t + 1);
          const v3 = cubicInterpolate(p0, p1, p2, p3, t + 2);

          return cubicInterpolate(v0, v1, v2, v3, t);
        }

        // Cubic interpolation function
        function cubicInterpolate(p0, p1, p2, p3, t) {
          const a = p3 - p2 - p0 + p1;
          const b = p0 - p1 - a;
          const c = p2 - p0;
          const d = p1;

          return a * t * t * t + b * t * t + c * t + d;
        }
      }
    } 
	else {
      // Overlapping slices

      // Calculate z step for overlapping slices
      this.mprData.zStep = Math.round(files.length / this.mprData.zDim);

      // Initialize the volume array with zeros
      this.volume = Array(this.mprData.zDim)
        .fill(0)
        .map(() => new Int16Array(length));

      // Build the volume for overlapping slices
      for (let i = 0, len = this.mprData.zDim; i < len; i++) {
        const k = i * this.mprData.zStep;
        this.volume[i] = files[k].image.getPixelData();
      }
    }
