// Apply Sobel filters
        function applySobelFilters(volume, interval, k, length) {
          let sobelX = 0;
          let sobelY = 0;

          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              // Check boundaries to prevent undefined access
              const xIndex = interval + i;
              const yIndex = k + j;

              if (
                xIndex >= 0 &&
                xIndex < volume.length &&
                yIndex >= 0 &&
                yIndex < length &&
                volume[xIndex] && // Check if the row exists
                volume[xIndex][yIndex] !== undefined // Check if the value is defined
              ) {
                const pixelValue = volume[xIndex][yIndex];
                sobelX += pixelValue * sobelXFilter[i + 1][j + 1];
                sobelY += pixelValue * sobelYFilter[i + 1][j + 1];
              }
            }
          }

          return { sobelX, sobelY };
        }

        // Apply Sobel edge detection
        function applySobelEdgeDetection(volume, interval, k, length) {
          const threshold = 0.5; // Adjust the threshold as needed
          const { sobelX, sobelY } = applySobelFilters(
            volume,
            interval,
            k,
            length
          );
          const gradientMagnitude = Math.sqrt(
            sobelX * sobelX + sobelY * sobelY
          );

          return gradientMagnitude > threshold;
        }

        // Sobel X filter
        const sobelXFilter = [
          [-1, 0, 1],
          [-2, 0, 2],
          [-1, 0, 1],
        ];

        // Sobel Y filter
        const sobelYFilter = [
          [-1, -2, -1],
          [0, 0, 0],
          [1, 2, 1],
        ];

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

        // Your remaining code follows...
        // Build interpolate planes between original planes using bicubic interpolation for edge pixels and bilinear interpolation for other pixels
        for (let i = 0; i < intervals.length - 1; i++) {
          const step = intervals[i + 1] - intervals[i];
          for (let j = intervals[i] + 1; j < intervals[i + 1]; j++) {
            let p = new Int16Array(length);
            const w = (j - intervals[i]) / step;
            for (let k = 0; k < length - 1; k++) {
              // Apply Sobel edge detection
              const isEdge = applySobelEdgeDetection(
                this.volume,
                intervals[i],
                k,
                length
              );

              if (isEdge) {
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
		
		
		
		
======================================================
// optimized code (work good)

else if (interpolationMethod === "weightedlinear") {
        // Precompute Sobel filters
        // Sobel X filter
        const sobelXFilter = [
          [-1, 0, 1],
          [-2, 0, 2],
          [-1, 0, 1],
        ];

        // Sobel Y filter
        const sobelYFilter = [
          [-1, -2, -1],
          [0, 0, 0],
          [1, 2, 1],
        ];

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

        for (let i = 0; i < intervals.length - 1; i++) {
          const step = intervals[i + 1] - intervals[i];

          for (let j = intervals[i] + 1; j < intervals[i + 1]; j++) {
            const p = new Int16Array(length);
            const w = (j - intervals[i]) / step;

            for (let k = 0; k < length - 1; k++) {
              // Sobel edge detection
              const xIndex = intervals[i];
              const yIndex = k;

              const pixelValue = this.volume[xIndex][yIndex];
              const sobelX = pixelValue * sobelXFilter[1][1];
              const sobelY = pixelValue * sobelYFilter[1][1];

              // Bicubic interpolation for edge pixels
              const p0 = this.volume[xIndex - 1]?.[k] || this.volume[xIndex][k];
              const p1 = this.volume[xIndex][k];
              const p2 = this.volume[xIndex + 1]?.[k] || this.volume[xIndex][k];
              const p3 = this.volume[xIndex + 2]?.[k] || this.volume[xIndex][k];

              p[k] =
                sobelX === 0 && sobelY === 0
                  ? p1 // weighted bilinear interpolation for non-edge pixels
                  : bicubicInterpolate(p0, p1, p2, p3, w);
            }

            // Update the volume with the interpolated plane
            this.volume[j] = p;
          }
        }
      }
	  
	  
	  
=====
else if (interpolationMethod === "weightedlinear") {
        // Precompute Sobel filters
        // Sobel X filter
        const sobelXFilter = [
          [5, 0, -5],
          [1, 0, -1],
          [5, 0, -5],
        ];

        // Sobel Y filter
        const sobelYFilter = [
          [5, 1, 5],
          [0, 0, 0],
          [-5, -1, -5],
        ];

        for (let i = 0; i < intervals.length - 1; i++) {
          const step = intervals[i + 1] - intervals[i];

          for (let j = intervals[i] + 1; j < intervals[i + 1]; j++) {
            const p = new Int16Array(length);
            const w = (j - intervals[i]) / step;

            for (let k = 0; k < length - 1; k++) {
              // Sobel edge detection
              const xIndex = intervals[i];
              const yIndex = k;

              const pixelValue = this.volume[xIndex][yIndex];
              const sobelX = pixelValue * sobelXFilter[1][1];
              const sobelY = pixelValue * sobelYFilter[1][1];

              // Bicubic interpolation for edge pixels
              const p0 = this.volume[xIndex - 1]?.[k] || this.volume[xIndex][k];
              const p1 = this.volume[xIndex][k];
              const p2 = this.volume[xIndex + 1]?.[k] || this.volume[xIndex][k];
              const p3 = this.volume[xIndex + 2]?.[k] || this.volume[xIndex][k];

              // Bilinear interpolation for non-edge pixels
              const interpolatedValue = (1 - w) * p1 + w * p2;

              // Update the volume with the interpolated value
              p[k] =
                sobelX === 0 && sobelY === 0
                  ? bicubicInterpolate(p0, p1, p2, p3, w)
                  : interpolatedValue;
            }

            // Update the volume with the interpolated plane
            this.volume[j] = p;
          }
        }
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