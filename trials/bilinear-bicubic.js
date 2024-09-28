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