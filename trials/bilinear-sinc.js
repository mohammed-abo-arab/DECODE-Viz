        // Build interpolate planes between original planes using cubic and sinc interpolation
        for (let i = 0; i < intervals.length - 1; i++) {
          const step = intervals[i + 1] - intervals[i];
          for (let j = intervals[i] + 1; j < intervals[i + 1]; j++) {
            let p = new Int16Array(length);
            const w = (j - intervals[i]) / step;
            for (let k = 0; k < length - 1; k++) {
              if (isEdgePixel(k, length)) {
                // cubic interpolation for edge pixels
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

                p[k] = cubicInterpolate(p0, p1, p2, p3, w);
              } else {
                // sinc interpolation for non-edge pixels
                p[k] = sincInterpolate(
                  this.volume[intervals[i] - 1][k],
                  this.volume[intervals[i]][k],
                  this.volume[intervals[i] + 1][k],
                  this.volume[intervals[i] + 2][k],
                  w
                );
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

        // Cubic interpolation function
        function cubicInterpolate(p0, p1, p2, p3, t) {
          const a = p3 - p2 - p0 + p1;
          const b = p0 - p1 - a;
          const c = p2 - p0;
          const d = p1;

          return a * t * t * t + b * t * t + c * t + d;
        }

        // Sinc interpolation function
        function sincInterpolate(p0, p1, p2, p3, t) {
          const sinc = (x) => Math.sin(Math.PI * x) / (Math.PI * x);

          const a0 = sinc(t);
          const a1 = sinc(t - 1);
          const a2 = sinc(t - 2);
          const a3 = sinc(t - 3);

          return a0 * p0 + a1 * p1 + a2 * p2 + a3 * p3;
        }
      }