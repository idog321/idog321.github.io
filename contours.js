// Animated topographic contour lines
// Uses simplex noise + marching squares to generate real contour lines that never cross

(function () {
  'use strict';

  // ── Simplex Noise (2D + 3D) ──────────────────────────────────────────────
  // Attempt tiny, self-contained simplex noise based on Stefan Gustavson's work.

  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;
  const F3 = 1 / 3;
  const G3 = 1 / 6;

  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  // Build permutation table
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  (function seed() {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) {
      perm[i] = p[i & 255];
      permMod12[i] = perm[i] % 12;
    }
  })();

  function dot2(g, x, y) { return g[0]*x + g[1]*y; }
  function dot3(g, x, y, z) { return g[0]*x + g[1]*y + g[2]*z; }

  function noise3D(x, y, z) {
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = x - X0, y0 = y - Y0, z0 = z - Z0;

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0)      { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
      else if (x0 >= z0)  { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
      else                { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
    } else {
      if (y0 < z0)        { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
      else if (x0 < z0)   { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
      else                { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
    }

    const x1 = x0-i1+G3, y1 = y0-j1+G3, z1 = z0-k1+G3;
    const x2 = x0-i2+2*G3, y2 = y0-j2+2*G3, z2 = z0-k2+2*G3;
    const x3 = x0-1+3*G3, y3 = y0-1+3*G3, z3 = z0-1+3*G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;

    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if (t0 > 0) { t0 *= t0; n0 = t0*t0 * dot3(grad3[permMod12[ii+perm[jj+perm[kk]]]], x0, y0, z0); }
    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if (t1 > 0) { t1 *= t1; n1 = t1*t1 * dot3(grad3[permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]]], x1, y1, z1); }
    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if (t2 > 0) { t2 *= t2; n2 = t2*t2 * dot3(grad3[permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]]], x2, y2, z2); }
    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if (t3 > 0) { t3 *= t3; n3 = t3*t3 * dot3(grad3[permMod12[ii+1+perm[jj+1+perm[kk+1]]]], x3, y3, z3); }

    return 32 * (n0 + n1 + n2 + n3);
  }

  // ── Marching Squares ──────────────────────────────────────────────────────
  // Extract contour line segments from a scalar field at a given threshold.
  // Returns an array of [x1, y1, x2, y2] segments.

  function marchingSquares(field, cols, rows, threshold) {
    const segments = [];

    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const tl = field[j * cols + i];
        const tr = field[j * cols + i + 1];
        const br = field[(j + 1) * cols + i + 1];
        const bl = field[(j + 1) * cols + i];

        // Classification of corners (1 = above threshold)
        const code =
          (tl >= threshold ? 8 : 0) |
          (tr >= threshold ? 4 : 0) |
          (br >= threshold ? 2 : 0) |
          (bl >= threshold ? 1 : 0);

        if (code === 0 || code === 15) continue;

        // Linear interpolation helpers
        const lerp = (a, b) => (threshold - a) / (b - a);

        // Edge midpoints (interpolated)
        const top    = () => [i + lerp(tl, tr), j];
        const right  = () => [i + 1, j + lerp(tr, br)];
        const bottom = () => [i + lerp(bl, br), j + 1];
        const left   = () => [i, j + lerp(tl, bl)];

        switch (code) {
          case 1:  case 14: segments.push([...left(), ...bottom()]); break;
          case 2:  case 13: segments.push([...bottom(), ...right()]); break;
          case 3:  case 12: segments.push([...left(), ...right()]); break;
          case 4:  case 11: segments.push([...top(), ...right()]); break;
          case 6:  case 9:  segments.push([...top(), ...bottom()]); break;
          case 7:  case 8:  segments.push([...top(), ...left()]); break;
          case 5:
            segments.push([...left(), ...top()]);
            segments.push([...bottom(), ...right()]);
            break;
          case 10:
            segments.push([...top(), ...right()]);
            segments.push([...left(), ...bottom()]);
            break;
        }
      }
    }
    return segments;
  }

  // ── Chain segments into polylines for smoother rendering ───────────────────

  function chainSegments(segments) {
    if (segments.length === 0) return [];

    const lines = [];
    const used = new Uint8Array(segments.length);
    const EPS = 0.01;

    function close(a, b) {
      return Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS;
    }

    for (let s = 0; s < segments.length; s++) {
      if (used[s]) continue;
      used[s] = 1;

      const seg = segments[s];
      const line = [[seg[0], seg[1]], [seg[2], seg[3]]];

      let changed = true;
      while (changed) {
        changed = false;
        for (let i = 0; i < segments.length; i++) {
          if (used[i]) continue;
          const si = segments[i];
          const head = line[0];
          const tail = line[line.length - 1];

          if (close(tail, [si[0], si[1]])) {
            line.push([si[2], si[3]]);
            used[i] = 1; changed = true;
          } else if (close(tail, [si[2], si[3]])) {
            line.push([si[0], si[1]]);
            used[i] = 1; changed = true;
          } else if (close(head, [si[2], si[3]])) {
            line.unshift([si[0], si[1]]);
            used[i] = 1; changed = true;
          } else if (close(head, [si[0], si[1]])) {
            line.unshift([si[2], si[3]]);
            used[i] = 1; changed = true;
          }
        }
      }

      if (line.length >= 3) lines.push(line);
    }

    return lines;
  }

  // ── Main animation ────────────────────────────────────────────────────────

  const canvas = document.createElement('canvas');
  canvas.id = 'contour-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;width:100%;height:100%;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  // Grid resolution (lower = faster, higher = smoother lines)
  const CELL = 10;
  // Noise parameters
  const SCALE = 0.004;       // Spatial frequency
  const Z_SPEED = 0.00006;   // How fast the terrain evolves
  const NUM_LEVELS = 12;     // Number of contour levels
  const FPS = 24;

  let cols, rows, field;
  let w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    cols = Math.ceil(w / CELL) + 1;
    rows = Math.ceil(h / CELL) + 1;
    field = new Float32Array(cols * rows);
  }

  function buildField(z) {
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const px = i * CELL;
        const py = j * CELL;
        // Layered noise for more organic feel
        let v = noise3D(px * SCALE, py * SCALE, z);
        v += 0.5 * noise3D(px * SCALE * 2, py * SCALE * 2, z * 1.3);
        v += 0.25 * noise3D(px * SCALE * 4, py * SCALE * 4, z * 1.7);
        field[j * cols + i] = v;
      }
    }
  }

  function draw(z) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    // Get accent color from CSS
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const baseColor = isDark ? '255, 159, 10' : '255, 149, 0';

    // Find field range for even level distribution
    let min = Infinity, max = -Infinity;
    for (let i = 0; i < field.length; i++) {
      if (field[i] < min) min = field[i];
      if (field[i] > max) max = field[i];
    }

    const range = max - min;
    if (range < 0.001) { ctx.restore(); return; }

    for (let lev = 1; lev < NUM_LEVELS; lev++) {
      const threshold = min + (range * lev) / NUM_LEVELS;

      const segments = marchingSquares(field, cols, rows, threshold);
      const polylines = chainSegments(segments);

      // Vary opacity: lines near the middle of the range are slightly brighter
      const normLev = lev / NUM_LEVELS;
      const brightness = 0.5 + 0.5 * Math.sin(normLev * Math.PI);
      const alpha = isDark
        ? 0.06 + 0.1 * brightness
        : 0.04 + 0.08 * brightness;

      ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      for (const line of polylines) {
        ctx.beginPath();
        ctx.moveTo(line[0][0] * CELL, line[0][1] * CELL);
        for (let p = 1; p < line.length; p++) {
          ctx.lineTo(line[p][0] * CELL, line[p][1] * CELL);
        }
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // ── Animation loop ────────────────────────────────────────────────────────

  let lastFrame = 0;
  const interval = 1000 / FPS;
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;

    if (timestamp - lastFrame >= interval) {
      lastFrame = timestamp;
      const z = (timestamp - startTime) * Z_SPEED;
      buildField(z);
      draw(z);
    }

    requestAnimationFrame(animate);
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(animate);
})();
