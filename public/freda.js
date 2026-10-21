/* Freda at the foot of the page. The logo waits for her with its mark
   missing; when the footer comes fully into view she runs in from the left,
   skids to a stop at "Manual", climbs onto it, walks along the links,
   leaping the gaps, and jumps into the mark's place. Her body is the logo's
   own pixels (the mark is Nik's drawing of her); her limbs are the app's rig,
   number for number (FredaPuppet.swift), drawn as strokes, and she moves the
   way its canvas animated her: keyframes with anticipation, squash, stretch
   and overshoot. Reduced Motion, or no script: the logo is simply whole. */
(function () {
  'use strict';
  var foot = document.querySelector('.footer');
  var logo = foot && foot.querySelector('.footer-inner > img');
  var fine = foot && foot.querySelector('.fine');
  if (!logo || !fine || !('IntersectionObserver' in window) || !document.fonts) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var PI = Math.PI, sin = Math.sin, cos = Math.cos;

  /* Her rig in body units: the body's box is 100 wide, y runs down, the
     ground is at y = 136, and (45, 136), between her feet, is where she stands. */
  var G = 136, HIP_L = [29, 91], HIP_R = [61.5, 90], SH_L = [13, 64], SH_R = [70, 47];
  var LEG = 47, ARM = 62, FOOT = 19, LIMB = 5.4;
  var HAND_L = [-19, 115], HAND_R = armR(58.9);
  /* Both hands thrown up, swung back and flung forward, in her body's frame. */
  var UP = [[6, -12], armR(-70)], BACK = [[-22, 106], armR(104)], FWD = [[98, 40], [116, 36]];
  /* The app's medium gait, bouncier, and a run for coming in. T is one stride, in seconds. */
  var WALK = { T: 0.42, S: 13, lift: 14, bob: 8, lean: 3, swing: 40, fs: 0.5, reach: 0.93, sq: 0.08 };
  var RUN = { T: 0.28, S: 28, lift: 22, bob: 7, lean: 13, swing: 55, fs: 0.3, reach: 0.62, sq: 0.06 };
  /* The app's dust puffs, a little quicker: [direction, distance, rise, radius, life, delay]. */
  var IMPACT = [[-1, 36, 10, 12, 0.42, 0], [-1, 54, 3, 9, 0.46, 0.02], [-1, 24, 22, 8, 0.38, 0.03],
                [1, 36, 10, 12, 0.42, 0], [1, 54, 3, 9, 0.46, 0.02], [1, 24, 22, 8, 0.38, 0.03]];
  var SKID = [[-1, 16, 7, 8, 0.36, 0], [-1, 26, 2, 6, 0.4, 0.02], [0.4, 10, 15, 6, 0.34, 0.03]];
  /* Inside her outer ring, in the page's paper, so her far limbs don't show between the rings. */
  var FILL = 'M13.1 95.6L21.1 94L31.8 90.3L41.2 88.8L53 88.5L69.3 90L76.2 89.8L83 86.8L92.3 79L94.4 75.9L95 72.8' +
    'L94.4 69.9L92.5 67.2L80.1 57.1L69.7 51.2L65.2 47.9L61.8 43.6L59.4 37.9L58.6 33.8L58.9 26.7L63.2 14.3L63.9 10.3' +
    'L63 6.3L59.2 5L54.8 6L50.3 8.7L42.7 17.3L22.6 37.3L19.3 42.2L17 47L11.9 63.3L5.6 80.4L5.2 86.2L6.3 91.1L9.1 94.8Z';

  function armR(deg) { var a = deg * PI / 180; return [SH_R[0] + 60 * cos(a), SH_R[1] + 60 * sin(a)]; }
  function lerp(a, b, w) { return a + (b - a) * w; }
  function lerpPt(a, b, w) { return [lerp(a[0], b[0], w), lerp(a[1], b[1], w)]; }
  function clamp(w) { return w < 0 ? 0 : w > 1 ? 1 : w; }
  var EASE = {
    lin: function (w) { return w; },
    in: function (w) { return w * w; },
    out: function (w) { return 1 - (1 - w) * (1 - w); },
    io: function (w) { return w * w * (3 - 2 * w); }
  };
  function io(w) { return EASE.io(clamp(w)); }
  /* Keyframes, the way the canvas animated her: [time, value, ease into this key (io if none)]. */
  function track(keys, t) {
    if (t <= keys[0][0]) return keys[0][1];
    for (var i = 1; i < keys.length; i++) {
      var a = keys[i - 1], b = keys[i];
      if (t < b[0]) return lerp(a[1], b[1], EASE[b[2] || 'io']((t - a[0]) / (b[0] - a[0])));
    }
    return keys[keys.length - 1][1];
  }
  function f(v) { return v.toFixed(1); }

  function pose() {
    return { x: 0, y: 0, rot: 0, sx: 1, sy: 1, fl: [HIP_L[0], G, 0], fr: [HIP_R[0], G, 0],
             hl: HAND_L, hr: HAND_R, bow: -1, limbs: 1, grip: 0 };
  }
  /* Where a point of her drawing is once the pose has squashed, tilted and shifted her about her feet. */
  function onBody(p, q) {
    var x = (q[0] - 45) * p.sx, y = (q[1] - G) * p.sy, a = p.rot * PI / 180;
    return [45 + p.x + x * cos(a) - y * sin(a), G + p.y + x * sin(a) + y * cos(a)];
  }
  /* Arms hanging at rest, carried along with her body. */
  function rest(p) { p.hl = onBody(p, HAND_L); p.hr = onBody(p, HAND_R); return p; }
  /* Squashed or stretched to sy, keeping roughly her volume. */
  function squash(p, sy) { p.sy = sy; p.sx = 1 + (1 - sy) * 0.8; return p; }
  /* Both hands w of the way to a pair of places on her body (UP, BACK, FWD). */
  function reach(p, to, w) { p.hl = lerpPt(p.hl, onBody(p, to[0]), w); p.hr = lerpPt(p.hr, onBody(p, to[1]), w); return p; }
  /* Squash and turn her about B, a point of her drawing, instead of about her feet. */
  function about(p, B) {
    var dx = (B[0] - 45) * p.sx, dy = (B[1] - G) * p.sy, a = p.rot * PI / 180;
    p.x = B[0] - 45 - (dx * cos(a) - dy * sin(a));
    p.y = B[1] - G - (dx * sin(a) + dy * cos(a));
    return p;
  }
  function blend(a, b, w) {
    var p = {};
    for (var key in a) {
      p[key] = typeof a[key] === 'number' ? lerp(a[key], b[key], w)
        : a[key].map(function (v, i) { return lerp(v, b[key][i], w); });
    }
    return p;
  }

  /* One foot through a stride: planted and sliding back, then lifted and swung forward. */
  function leg(u, st) {
    var w, S = st.S;
    if (u < st.fs) {
      w = u / st.fs;
      return [S * (1 - 2 * w), w > 0.8 ? -15 * (w - 0.8) : 0,
              w < 0.18 ? -14 * (1 - w / 0.18) : w > 0.8 ? 80 * (w - 0.8) : 0];
    }
    w = (u - st.fs) / (1 - st.fs);
    return [S * (2 * io(w) - 1), -3 * (1 - w) - st.lift * sin(PI * w),
            w < 0.4 ? 16 + 30 * w : lerp(28, -14, io((w - 0.4) / 0.6))];
  }
  function gait(st, t) {
    var u = t / st.T % 1, ph = 2 * PI * u, p = pose(), s = st.sq * cos(2 * ph - 0.35);
    var a = leg(u, st), b = leg((u + 0.5) % 1, st), lean = st.lean;
    p.y = -st.bob * (0.5 - 0.5 * cos(2 * ph - 0.35));
    p.rot = lean; p.sy = 1 - s; p.sx = 1 + 0.7 * s; p.bow = 1;
    p.fl = [HIP_L[0] + a[0] + lean / 2, G + a[1], a[2]];
    p.fr = [HIP_R[0] + b[0] + lean / 2, G + b[1], b[2]];
    var r = st.reach * ARM, sl = onBody(p, SH_L), sr = onBody(p, SH_R);
    var al = (lean - 30 - st.swing * cos(ph)) * PI / 180, ar = (lean + 18 + st.swing * cos(ph)) * PI / 180;
    p.hl = [sl[0] + r * sin(al), sl[1] + r * cos(al)];
    p.hr = [sr[0] + r * sin(ar), sr[1] + r * cos(ar)];
    return p;
  }
  /* Body units a second at which her planted foot stays put. */
  function speed(st) { return 2 * st.S / (st.fs * st.T); }

  /* A rubber-hose limb: one curve whose slack bows to one side. u < 1 draws it back into her body. */
  function limb(H, A, L, side, foot, u) {
    A = lerpPt(H, A, u); L *= u;
    var vx = A[0] - H[0], vy = A[1] - H[1], d = Math.hypot(vx, vy) || 1e-6;
    var de = Math.min(d, 0.97 * L), h = 2 * side * Math.sqrt(Math.max(0, 0.375 * de * (L - de))) / d;
    var s = 'M' + f(H[0]) + ' ' + f(H[1]) + 'Q' + f(H[0] + vx / 2 - vy * h) + ' ' + f(H[1] + vy / 2 + vx * h) +
            ' ' + f(A[0]) + ' ' + f(A[1]);
    if (foot != null) s += 'L' + f(A[0] + FOOT * u * cos(foot * PI / 180)) + ' ' + f(A[1] + FOOT * u * sin(foot * PI / 180));
    return s;
  }

  var k, svg, body, limbs, puffs;   // k: px per body unit, so that her body is exactly the logo's mark
  var lag, was, vel;                // her hands' follow-through, and where her feet were last frame

  /* Her hands trail her body: when it brakes, leaps or lands they swing on and spring back.
     Each hand is a spring of its own stiffness (rad/s), so the two settle out of step. */
  function follow(at, dt, grip) {
    if (grip || !was || !dt) { lag = [[0, 0, 0, 0, 26], [0, 0, 0, 0, 32]]; was = at; vel = null; return; }
    var v = [(at[0] - was[0]) / dt, (at[1] - was[1]) / dt];
    var a = vel ? [(v[0] - vel[0]) / dt, (v[1] - vel[1]) / dt] : [0, 0];
    was = at; vel = v;
    lag.forEach(function (s) {
      for (var i = 0; i < 2; i++) {
        s[2 + i] += (-a[i] - s[4] * s[4] * s[i] - 0.7 * s[4] * s[2 + i]) * dt;
        s[i] = Math.max(-6, Math.min(6, s[i] + s[2 + i] * dt));
      }
    });
  }

  /* The puffs thrown up at x, y (px) by something that happened t0 seconds into a move; s sizes them. */
  function dust(t, t0, x, y, spec, s) {
    var q = k * s, out = [];
    spec.forEach(function (d) {
      var w = (t - t0 - d[5]) / d[4], e = 1 - Math.pow(1 - w, 3);
      if (w >= 0 && w <= 1) out.push([x + d[0] * d[1] * e * q, y - d[2] * e * q, (2 + (d[3] - 2) * e) * q, 0.92 * Math.pow(1 - w, 1.4)]);
    });
    return out;
  }

  function draw(p, at, dt, cloud) {
    var u = p.limbs, i, d;
    follow(at, dt, p.grip > 0.5);
    var hl = [p.hl[0] + lag[0][0] * u / k, p.hl[1] + lag[0][1] * u / k];
    var hr = [p.hr[0] + lag[1][0] * u / k, p.hr[1] + lag[1][1] * u / k];
    svg.style.transform = 'translate(' + (at[0] - 115 * k).toFixed(2) + 'px,' + (at[1] - 186 * k).toFixed(2) + 'px)';
    svg.setAttribute('stroke-width', LIMB * u);
    body.setAttribute('transform', 'translate(' + f(45 + p.x) + ' ' + f(G + p.y) + ') rotate(' + f(p.rot) +
      ') scale(' + p.sx.toFixed(3) + ' ' + p.sy.toFixed(3) + ') translate(-45 -136)');
    limbs[0].setAttribute('d', limb(onBody(p, HIP_L), p.fl, LEG, -1, p.fl[2], u));
    limbs[1].setAttribute('d', limb(onBody(p, HIP_R), p.fr, LEG, -1, p.fr[2], u));
    limbs[2].setAttribute('d', limb(onBody(p, SH_L), hl, ARM, 1, null, u));
    limbs[3].setAttribute('d', limb(onBody(p, SH_R), hr, ARM, p.bow, null, u));
    for (i = 0; i < puffs.length; i++) {
      d = cloud && cloud[i];
      puffs[i].setAttribute('r', d ? f(d[2] / k) : 0);
      if (d) {
        puffs[i].setAttribute('cx', f(45 + (d[0] - at[0]) / k));
        puffs[i].setAttribute('cy', f(G + (d[1] - at[1]) / k));
        puffs[i].setAttribute('opacity', d[3].toFixed(2));
      }
    }
  }

  /* Her body is the logo image itself, cut to the mark: 189 of its px are her 100 units. */
  function build() {
    var holder = document.createElement('div');
    holder.innerHTML = '<svg class="freda" aria-hidden="true" viewBox="-70 -50 240 210" width="' + f(240 * k) +
      '" height="' + f(210 * k) + '"><clipPath id="freda-mark"><path d="M0 0H82V30.7H102.6V105.8H0Z"/></clipPath>' +
      '<path class="limb"/><path class="limb"/><path class="limb"/><g><path class="paper" d="' + FILL + '"/>' +
      '<image href="' + (logo.currentSrc || logo.src) + '" width="422.75" height="105.82" clip-path="url(#freda-mark)"/>' +
      '</g><path class="limb"/><g class="dust">' + new Array(15).join('<circle r="0"/>') + '</g></svg>';
    svg = holder.firstChild;
    body = svg.querySelector('g');
    limbs = svg.querySelectorAll('.limb');
    puffs = svg.querySelectorAll('.dust circle');
    foot.appendChild(svg);
  }

  function finish() {
    removeEventListener('resize', finish);
    foot.classList.remove('freda-away');
    if (svg) { svg.remove(); svg = null; }
  }

  function start() {
    var box = foot.getBoundingClientRect(), mark = logo.getBoundingClientRect();
    var ox = box.left + foot.clientLeft, oy = box.top + foot.clientTop;   // her svg sits inside the footer's border
    var links = [].slice.call(foot.querySelectorAll('nav a'));
    function rect(el) { var r = el.getBoundingClientRect(); return { l: r.left - ox, r: r.right - ox, t: r.top - oy }; }
    /* Inter: a 0.969 em ascent in a 1.21 em line, with half the leading either side. */
    function baseline(el) {
      var cs = getComputedStyle(el), fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight) || 1.21 * fs;
      return rect(el).t + (lh - 1.21 * fs) / 2 + 0.969 * fs;
    }
    function local(q, at) { return [45 + (q[0] - at[0]) / k, G + (q[1] - at[1]) / k]; }
    k = mark.height * 0.945 / 100;
    var top = rect(links[0]).t;
    var row = links.filter(function (a) { return Math.abs(rect(a).t - top) < 2; }).map(rect);
    var below = links.filter(function (a) { return rect(a).t > top + 2; })[0] || fine;
    var floor = baseline(below);                               // she runs in along the line under the links
    var ledge = baseline(links[0]) - 0.727 * parseFloat(getComputedStyle(links[0]).fontSize);   // and walks on their capitals
    var home = [mark.left - ox + 45 * k, mark.top - oy + G * k];
    var segs = [];

    /* One move: d seconds long, at(t) gives her pose, where her feet are and any dust; the pose
       eases over from the last move's in its first b seconds. */
    function seg(d, at, b) { if (d > 0.001) segs.push({ d: d, at: at, b: b }); }
    function walk(st, x0, x1, y) {
      var v = speed(st) * k;
      if (x1 - x0 > 1) seg((x1 - x0) / v, function (t) { return [gait(st, t), [x0 + v * t, y]]; }, 0.15);
    }
    /* Standing and breathing, tilted rot degrees (negative leans back: looking up). */
    function still(t, rot) { var p = pose(); p.rot = rot; return rest(squash(p, 1 + 0.015 * sin(2 * PI * t / 1.1))); }
    /* The wind-up before a jump: down into a crouch, arms swung behind. */
    function windUp(w, rot) { var p = pose(); p.rot = rot; p.y = 5 * w; return reach(rest(squash(p, 1 - 0.19 * w)), BACK, w); }
    /* Airborne, w from takeoff to touchdown: stretched as she leaves, round at the top with her
       knees up, stretched again reaching down to land, arms thrown up. */
    function air(w, rot0, rot1) {
      var p = pose(), tuck = track([[0, 0, 'lin'], [0.35, 28, 'out'], [0.6, 26, 'lin'], [1, -2]], w);
      p.rot = track([[0, rot0, 'lin'], [0.5, 0], [1, rot1]], w); p.bow = 1;
      squash(p, track([[0, 1.25, 'lin'], [0.35, 1, 'out'], [0.7, 1, 'lin'], [1, 1.1, 'in']], w));
      p.fl = [HIP_L[0] + 4, G - tuck, 0.85 * tuck]; p.fr = [HIP_R[0] + 2, G - 0.85 * tuck, 0.65 * tuck];
      return reach(rest(p), UP, track([[0, 0.4, 'lin'], [0.25, 1, 'out'], [1, 0.8]], w));
    }
    /* Touchdown at x, y: a hard squash that springs back past round and settles, in a puff of dust. */
    function land(t, x, y, s, rot0) {
      var p = pose();
      squash(p, track([[0, 0.77, 'lin'], [0.05, 0.78, 'lin'], [0.17, 1.07, 'out'], [0.29, 0.97], [0.42, 1]], t));
      p.rot = track([[0, rot0, 'lin'], [0.12, 3], [0.26, -1], [0.42, 0]], t);
      return [reach(rest(p), UP, track([[0, 0.8, 'lin'], [0.15, 0, 'out']], t)), [x, y], dust(t, 0, x, y, IMPACT, s)];
    }
    /* From one word's edge to the next: a peek over, a wind-up, the leap, the landing. */
    function leap(x0, x1, y) {
      var h = Math.max(18, 0.38 * (x1 - x0)), AIR = 0.5;
      seg(0.22, function (t) {
        var teeter = 2.5 * sin(2 * PI * t / 0.16) * clamp((t - 0.06) / 0.06);
        return [reach(still(t, track([[0, 3, 'lin'], [0.1, 10], [0.22, 7]], t) + teeter), BACK, 0.35), [x0, y]];
      }, 0.12);
      seg(0.2, function (t) { var w = io(t / 0.2); return [windUp(w, lerp(7, -6, w)), [x0, y]]; }, 0.08);
      seg(AIR, function (t) { var w = t / AIR; return [air(w, 14, -6), [lerp(x0, x1, w), y - 4 * h * w * (1 - w)]]; }, 0.04);
      seg(0.42, function (t) { return land(t, x1, y, 0.8, -6); }, 0.03);
    }

    var m = row[0], xa = m.l - 56 * k, hang = ledge + 100 * k, xl = m.l + 9;
    var grips = [[m.l + 2, ledge], [m.l + 7, ledge]];
    var v = speed(RUN) * k, BRAKE = 0.28, xs = xa - v * BRAKE / 2;
    function braking(t) { var s = Math.min(t, BRAKE); return xs + v * s - v * s * s / (2 * BRAKE); }

    /* In from off the left edge at a run; */
    walk(RUN, -ox - 30, xs, floor);
    /* heels down, sliding to a stop at the foot of "Manual" in a spray of dust; */
    seg(0.44, function (t) {
      var p = pose(), brace = track([[0, 0, 'lin'], [0.06, 1, 'out'], [BRAKE, 1, 'lin'], [0.4, 0]], t), cloud = [];
      p.rot = track([[0, 13, 'lin'], [0.06, -18, 'out'], [BRAKE, -14, 'lin'], [0.37, 5], [0.44, 0]], t);
      p.y = 4 * brace; p.bow = lerp(-1, 1, brace);
      squash(p, track([[0, 1, 'lin'], [0.06, 0.88, 'out'], [BRAKE, 0.92, 'lin'], [0.36, 1.06], [0.44, 1]], t));
      p.fl = [HIP_L[0] + 18 * brace, G, -16 * brace]; p.fr = [HIP_R[0] + 12 * brace, G, -16 * brace];
      [0.02, 0.09, 0.16, 0.23].forEach(function (te) { cloud = cloud.concat(dust(t, te, braking(te) + 8, floor, SKID, 1)); });
      return [reach(rest(p), FWD, brace), [braking(t), floor], cloud];
    }, 0.06);
    /* she looks up at it, winds up, */
    seg(0.32, function (t) { return [still(t, track([[0, 0, 'lin'], [0.15, -10], [0.32, -9]], t)), [xa, floor]]; }, 0.1);
    seg(0.17, function (t) { var w = io(t / 0.17); return [windUp(w, lerp(-9, -4, w)), [xa, floor]]; }, 0.06);
    /* leaps for the top of the word, */
    seg(0.26, function (t) {
      var w = t / 0.26, at = [xa + 3 * w, lerp(floor, hang - 3 * k, EASE.out(w))], p = pose();
      var tuck = track([[0, 0, 'lin'], [0.15, 14, 'out'], [0.26, 8]], t);
      p.rot = 8; p.bow = 1;
      squash(p, track([[0, 1.22, 'lin'], [0.26, 1.03]], t));
      p.fl = [HIP_L[0] - 6, G - tuck, 22]; p.fr = [HIP_R[0] - 3, G - 0.6 * tuck, 14];
      reach(rest(p), UP, 1 - w);
      p.hl = lerpPt(p.hl, local(grips[0], at), io(w)); p.hr = lerpPt(p.hr, local(grips[1], at), io(w));
      return [p, at];
    }, 0.04);
    /* catches it and scrambles, legs going like a bicycle, */
    seg(0.42, function (t) {
      var ph = 2 * PI * t / 0.14, a = Math.min(1, t / 0.08), p = pose();
      var at = [xa + 3, track([[0, hang - 3 * k, 'lin'], [0.07, hang + 2.5 * k], [0.15, hang]], t) - 1.2 * k * a * Math.abs(sin(ph / 2))];
      p.rot = track([[0, 8, 'lin'], [0.07, 12], [0.15, 8]], t) + 3 * a * sin(ph / 2); p.bow = 1; p.grip = 1;
      squash(p, track([[0, 1.03, 'lin'], [0.06, 0.9, 'out'], [0.16, 1]], t));
      p.fl = [HIP_L[0] + 3 + 9 * a * cos(ph), G - 9 - 8 * a * sin(ph), 20 + 14 * sin(ph)];
      p.fr = [HIP_R[0] + 3 - 9 * a * cos(ph), G - 9 + 8 * a * sin(ph), 20 - 14 * sin(ph)];
      p.hl = local(grips[0], at); p.hr = local(grips[1], at);
      return [p, at];
    }, 0.05);
    /* heaves herself up and over, */
    seg(0.26, function (t) {
      var p = pose(), hold = 1 - io((t - 0.12) / 0.12), tuck = track([[0, 6, 'lin'], [0.12, 30, 'out'], [0.26, 4]], t);
      var at = [track([[0, xa + 3, 'lin'], [0.08, xa + 3, 'lin'], [0.24, xl], [0.26, xl, 'lin']], t),
                track([[0, hang, 'lin'], [0.22, ledge - 5 * k, 'out'], [0.26, ledge, 'in']], t)];
      p.rot = track([[0, 8, 'lin'], [0.1, 18], [0.22, 2], [0.26, 0]], t); p.bow = 1; p.grip = hold > 0.99 ? 1 : 0;
      squash(p, track([[0, 1, 'lin'], [0.08, 0.88], [0.18, 1.1, 'out'], [0.26, 1.02]], t));
      p.fl = [HIP_L[0] + 8, G - tuck, 0.8 * tuck]; p.fr = [HIP_R[0] + 6, G - 0.75 * tuck, 0.6 * tuck];
      rest(p);
      p.hl = lerpPt(p.hl, local(grips[0], at), hold); p.hr = lerpPt(p.hr, local(grips[1], at), hold);
      return [p, at];
    }, 0.05);
    /* and lands on top. */
    seg(0.42, function (t) { return land(t, xl, ledge, 0.5, 0); }, 0.03);

    /* Along the links: to each one's edge and over the gap, until she is under the mark. */
    var x = xl;
    for (var i = 0; i < row.length; i++) {
      var end = row[i].r - 5, next = row[i + 1];
      if (home[0] <= end || !next || home[0] < next.l + 9) { walk(WALK, x, Math.min(end, home[0]), ledge); x = Math.max(x, Math.min(end, home[0])); break; }
      var x1 = Math.max(next.l + 10, Math.min(home[0] - 18, next.l + 32));
      walk(WALK, x, end, ledge); leap(end, x1, ledge); x = x1;
    }

    /* There she looks up at the gap in the logo, winds up and springs into it, folding her arms
       and legs away, and lands in the mark's place with a plop that rocks and settles. */
    seg(0.36, function (t) { return [still(t, track([[0, 0, 'lin'], [0.16, -10], [0.36, -9]], t)), [x, ledge]]; }, 0.15);
    seg(0.22, function (t) { var w = io(t / 0.22); return [windUp(w, lerp(-9, 0, w)), [x, ledge]]; }, 0.08);
    seg(0.42, function (t) {
      var p = air(t / 0.84, 6, 0);
      p.limbs = track([[0, 1, 'lin'], [0.34, 0, 'in']], t);
      return [p, [lerp(x, home[0], io(t / 0.42)), track([[0, ledge, 'lin'], [0.25, home[1] - 14, 'out'], [0.42, home[1], 'in']], t)]];
    }, 0.04);
    seg(0.52, function (t) {
      var p = pose(); p.limbs = 0;
      squash(p, track([[0, 0.8, 'lin'], [0.04, 0.8, 'lin'], [0.13, 1.12, 'out'], [0.22, 0.95], [0.31, 1.03], [0.39, 0.99], [0.46, 1]], t));
      p.rot = track([[0, 0, 'lin'], [0.07, 5, 'out'], [0.18, -3.5], [0.29, 2], [0.39, -1], [0.46, 0]], t);
      return [about(p, [50, 100]), home];
    }, 0.02);

    var n = 0, t = 0, then = null, last = null, from = null, r0 = segs[0].at(0);
    build();
    draw(r0[0], r0[1], 0, r0[2]);
    addEventListener('resize', finish);
    requestAnimationFrame(function tick(now) {
      if (!svg) return;
      var dt = then === null ? 0 : Math.min(0.05, (now - then) / 1000);
      then = now; t += dt;
      while (n < segs.length && t >= segs[n].d) { t -= segs[n].d; n++; from = last; }
      if (n === segs.length) return finish();
      var s = segs[n], r = s.at(t), p = from && t < s.b ? blend(from, r[0], io(t / s.b)) : r[0];
      draw(p, r[1], dt, r[2]); last = p;
      requestAnimationFrame(tick);
    });
  }

  foot.classList.add('freda-away');
  var seen = new IntersectionObserver(function (es) {
    if (es[0].intersectionRatio < 0.98) return;
    seen.disconnect();
    Promise.all([document.fonts.ready, logo.decode()]).then(start, finish);
  }, { threshold: 1 });
  seen.observe(fine);
})();
