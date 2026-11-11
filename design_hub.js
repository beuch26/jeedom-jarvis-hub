(function() {
  'use strict';

  // Prevent duplicate execution collision
  if (window.__knx_design_hub_loaded) {
    if (window.__knx_orb_anim_id) cancelAnimationFrame(window.__knx_orb_anim_id);
  }
  window.__knx_design_hub_loaded = true;

// ==========================================================================
  // J.A.R.V.I.S. 3D NEURAL PARTICLE CLOUD ENGINE (FIBONACCI SPHERICAL LATTICE)
  // Continuous AI Thinking Simulation (Harmonic Surface Wave Ripples)
  // Dynamic Cognitive Interaction: Standby / Listening / Speaking States
  // ==========================================================================
    var orbAnimId = null;
    var jarvisFaceImg = null;

    // Preload digital cyber face asset
    (function preloadJarvisFace() {
      if (typeof Image !== 'undefined') {
        jarvisFaceImg = new Image();
        jarvisFaceImg.crossOrigin = 'anonymous';
        jarvisFaceImg.src = 'data/custom/jarvis_face.png?v=2';
      }
    })();

  // J.A.R.V.I.S. BIOMETRIC PHOTOREALISTIC NEURAL MATRIX ENGINE (VERSION 9.5 PRO)
  // Multi-scale Halftone & Code Matrix Synthesis + Clair-Obscur Anatomical Rig
  // Pixel-perfect eyes (iris fibers, pupil, catchlights, eyelid curve) & mouth articulation
  // Autonomous saccadic gaze, breathing kinematics, interactive cursor tracking & speech lip-sync
  // ==========================================================================
  var jarvisBioMatrixInit = false;

  function initJarvisNeuralOrb() {
    const canvas = document.getElementById('knx-jarvis-orb');
    if (!canvas) return;

    const W = 205;
    const H = 165;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Bloom offscreen buffer
    const bloomCanvas = document.createElement('canvas');
    bloomCanvas.width = Math.floor(W / 2);
    bloomCanvas.height = Math.floor(H / 2);
    const bloomCtx = bloomCanvas.getContext('2d');

    const MAP_W = 240;
    const MAP_H = 300;
    const baseSkinMap = new Float32Array(MAP_W * MAP_H);
    const depthMap = new Float32Array(MAP_W * MAP_H);
    const organicNoiseMap = new Float32Array(MAP_W * MAP_H);

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = MAP_W;
    srcCanvas.height = MAP_H;
    const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });

    // Anatomical Rig Coordinates (normalized [-1..1])
    const RIG = {
      leftEyeX: -0.178,
      leftEyeY: -0.055,
      rightEyeX: 0.178,
      rightEyeY: -0.055,
      eyeRadiusX: 0.078,
      eyeRadiusY: 0.036,
      noseX: 0.0,
      noseY: 0.110,
      mouthX: 0.0,
      mouthY: 0.268,
      mouthW: 0.168
    };

    const bioState = {
      cellSize: 2.8,
      bloomStrength: 0.50,
      contrast: 1.30,
      headYaw: 0,
      headPitch: 0,
      headRoll: 0,
      gazeX: 0,
      gazeY: 0,
      saccadeX: 0,
      saccadeY: 0,
      nextSaccade: 1.0,
      browRaise: 0,
      microSmile: 0,
      blink: 0,
      nextBlink: 2.0,
      mouthOpen: 0,
      mouthWide: 0,
      audioEnergy: 0,
      time: 0,
      mouseX: 0,
      mouseY: 0,
      hasMouse: false
    };

    // Dynamic Biometric Matrix Palette: reflects live home state
    function getLivePalette() {
      const pwr = parseFloat(state.linkyInstant) || 0;
      if (pwr >= 7.0) {
        // Red Alert (Sur-puissance critique / Délestage imminent)
        return { bg: '#120406', dim: [110, 20, 20], mid: [239, 68, 68], bright: [255, 225, 225] };
      } else if (pwr >= 4.5 || state.heating === 1) {
        // Amber Warm (Forte charge / Chauffe active)
        return { bg: '#0d0802', dim: [95, 52, 12], mid: [245, 158, 11], bright: [255, 248, 220] };
      }
      // Classic Jarvis Electric Cyan (Nominal)
      return { bg: '#04101e', dim: [14, 74, 118], mid: [56, 189, 248], bright: [232, 250, 255] };
    }

    const CODE_GLYPHS = ['.', ':', '1', 'I', '!', '0', 'l', '5', 'S', '6', '3', '9', '8', '0', '8', 'B'];

    function gauss(x, y, cx, cy, sx, sy) {
      const dx = (x - cx) / sx;
      const dy = (y - cy) / sy;
      return Math.exp(-0.5 * (dx * dx + dy * dy));
    }

    function smoothstep(edge0, edge1, x) {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    }

    function hash2D(ix, iy) {
      const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
      return n - Math.floor(n);
    }

    function noise2D(x, y) {
      const ix = Math.floor(x);
      const iy = Math.floor(y);
      const fx = x - ix;
      const fy = y - iy;
      const ux = fx * fx * (3 - 2 * fx);
      const uy = fy * fy * (3 - 2 * fy);
      const a = hash2D(ix, iy);
      const b = hash2D(ix + 1, iy);
      const c = hash2D(ix, iy + 1);
      const d = hash2D(ix + 1, iy + 1);
      return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    }

    function fbm(x, y) {
      let v = 0;
      let amp = 0.5;
      for (let i = 0; i < 3; i++) {
        v += amp * noise2D(x, y);
        x *= 2.03;
        y *= 2.01;
        amp *= 0.5;
      }
      return v;
    }

    // Initialize organic noise
    for (let py = 0; py < MAP_H; py++) {
      for (let px = 0; px < MAP_W; px++) {
        organicNoiseMap[py * MAP_W + px] = fbm(px * 0.08, py * 0.08);
      }
    }

    // 1. Build Base Skin & 3D Depth Field
    function buildBaseSkinAndDepth(photoImg) {
      let photoData = null;
      if (photoImg && photoImg.width > 0) {
        try {
          srcCtx.fillStyle = '#000';
          srcCtx.fillRect(0, 0, MAP_W, MAP_H);
          const iw = photoImg.width || 640;
          const ih = photoImg.height || 800;
          const scale = Math.max(MAP_W / iw, MAP_H / ih);
          const dw = iw * scale;
          const dh = ih * scale;
          const ox = (MAP_W - dw) * 0.5;
          const oy = (MAP_H - dh) * 0.42;
          srcCtx.drawImage(photoImg, ox, oy, dw, dh);
          photoData = srcCtx.getImageData(0, 0, MAP_W, MAP_H).data;
        } catch (e) {
          photoData = null;
        }
      }

      const heightField = new Float32Array(MAP_W * MAP_H);

      for (let py = 0; py < MAP_H; py++) {
        const ny = (py / MAP_H) * 2.0 - 1.0;
        for (let px = 0; px < MAP_W; px++) {
          const nx = (px / MAP_W) * 2.0 - 1.0;
          const idx = py * MAP_W + px;

          const centerDamp = smoothstep(0.0, 0.08, Math.abs(nx));
          const x = nx + (organicNoiseMap[idx] - 0.5) * 0.006 * centerDamp;
          const y = ny;
          const ax = Math.sqrt(x * x + 0.00025);

          let faceHalfWidth = 0.58;
          if (y < -0.06) {
            const t = Math.max(0, (-0.06 - y) / 0.54);
            faceHalfWidth *= Math.pow(Math.max(0.01, 1.0 - t * t * 0.94), 0.68);
          } else if (y < 0.10) {
            faceHalfWidth += 0.016 * Math.sin(((y + 0.06) / 0.16) * Math.PI);
          } else {
            const t = Math.min(1.22, (y - 0.10) / 0.48);
            faceHalfWidth *= Math.max(0.02, 1.0 - 0.54 * Math.pow(t, 1.38) - 0.36 * Math.pow(t, 2.5));
          }

          const normX = ax / Math.max(0.04, faceHalfWidth);
          if (normX > 1.06 || y < -0.62 || y > 0.60) {
            heightField[idx] = 0;
            depthMap[idx] = 0;
            continue;
          }

          const headCylinder = Math.sqrt(Math.max(0, 1.0 - Math.min(1.0, normX * normX * 0.92)));
          const verticalDome = Math.sqrt(Math.max(0, 1.0 - Math.min(1.0, Math.pow(y / 0.63, 2) * 0.90)));
          let z = headCylinder * verticalDome * 0.72;

          z += gauss(x, y, 0, -0.26, 0.28, 0.18) * 0.20;
          z += gauss(x, y, 0, -0.11, 0.055, 0.065) * 0.085;

          z -= gauss(ax, y, 0.178, -0.055, 0.098, 0.052) * 0.115;
          z -= gauss(ax, y, 0.112, -0.065, 0.042, 0.036) * 0.048;

          const noseW = 0.023 + Math.max(0, (y + 0.14) * 0.048);
          if (y > -0.18 && y < 0.17) {
            const bridgeProfile = smoothstep(-0.18, -0.05, y) * smoothstep(0.16, 0.08, y);
            z += Math.exp(-(x * x) / (noseW * noseW * 1.4)) * bridgeProfile * 0.21;
            z += gauss(x, y, 0, 0.0, 0.072, 0.115) * 0.075;
          }
          z += gauss(x, y, 0, RIG.noseY, 0.040, 0.034) * 0.24;
          z += gauss(ax, y, 0.054, RIG.noseY + 0.020, 0.026, 0.021) * 0.10;
          z -= gauss(ax, y, 0.036, RIG.noseY + 0.035, 0.018, 0.011) * 0.115;

          z += gauss(ax, y, 0.195, 0.032, 0.145, 0.112) * 0.165;
          z += gauss(ax, y, 0.145, 0.145, 0.135, 0.125) * 0.135;
          z += gauss(ax, y, 0.115, 0.285, 0.115, 0.110) * 0.075;

          z += gauss(ax, y, 0.022, 0.190, 0.018, 0.028) * 0.028;
          z -= gauss(x, y, 0, 0.190, 0.020, 0.028) * 0.018;
          z -= gauss(x, y, 0, 0.342, 0.085, 0.020) * 0.07;
          z += gauss(x, y, 0, 0.415, 0.082, 0.048) * 0.14;

          z += (organicNoiseMap[idx] - 0.5) * 0.004 * centerDamp;

          heightField[idx] = Math.max(0, z);
          depthMap[idx] = Math.max(0, Math.min(1.2, z * 1.15));
        }
      }

      const lx = 0.0, ly = -0.34, lz = 0.94;
      for (let py = 1; py < MAP_H - 1; py++) {
        const ny = (py / MAP_H) * 2.0 - 1.0;
        for (let px = 1; px < MAP_W - 1; px++) {
          const nx = (px / MAP_W) * 2.0 - 1.0;
          const idx = py * MAP_W + px;
          const z = heightField[idx];
          if (z <= 0.001) {
            baseSkinMap[idx] = 0;
            continue;
          }

          const dzdx = (heightField[idx + 1] - heightField[idx - 1]) * 18.0;
          const dzdy = (heightField[idx + MAP_W] - heightField[idx - MAP_W]) * 18.0;
          const invLen = 1.0 / Math.sqrt(dzdx * dzdx + dzdy * dzdy + 1.0);
          const normNx = -dzdx * invLen;
          const normNy = -dzdy * invLen;
          const normNz = invLen;

          const diff = Math.max(0, normNx * lx + normNy * ly + normNz * lz);
          const specAngle = Math.max(0, normNx * 0.0 + normNy * -0.18 + normNz * 0.98);
          const spec = Math.pow(specAngle, 24.0) * 0.38;

          const ax = Math.sqrt(nx * nx + 0.00025);
          let ao = 1.0;
          ao -= gauss(ax, ny, 0.112, -0.065, 0.042, 0.034) * 0.24;
          ao -= gauss(nx, ny, 0, RIG.noseY + 0.042, 0.052, 0.017) * 0.72;
          ao -= gauss(ax, ny, 0.036, RIG.noseY + 0.035, 0.019, 0.010) * 0.85;
          ao -= gauss(nx, ny, 0, 0.340, 0.072, 0.017) * 0.36;

          const edgeNoise = (organicNoiseMap[idx] - 0.5) * 0.075;
          const radialDist = Math.hypot(ax / 0.54, (ny - 0.02) / 0.58);
          const softVignette = smoothstep(1.06, 0.42, radialDist + edgeNoise * 0.55);
          const lateralFalloff = Math.pow(Math.max(0, 1.0 - Math.pow((ax + edgeNoise * 0.45) / 0.56, 1.85)), 1.75);
          const verticalFalloff = smoothstep(-0.56, -0.26, ny + edgeNoise) * smoothstep(0.55, 0.30, ny - edgeNoise);

          let lum = (diff * 0.88 + spec) * Math.max(0, ao) * lateralFalloff * verticalFalloff * (0.35 + 0.65 * softVignette);

          lum += gauss(nx, ny, 0, -0.02, 0.042, 0.095) * 0.24;
          lum += gauss(nx, ny, 0, RIG.noseY, 0.038, 0.032) * 0.46;
          lum += gauss(ax, ny, 0.150, 0.035, 0.095, 0.078) * 0.26;
          lum += gauss(ax, ny, 0.135, 0.175, 0.110, 0.095) * 0.19;
          lum += gauss(ax, ny, 0.105, 0.295, 0.095, 0.080) * 0.11;
          lum += gauss(nx, ny, 0, 0.410, 0.066, 0.038) * 0.21;

          if (photoData) {
            const p = idx * 4;
            const photoL = (0.299 * photoData[p] + 0.587 * photoData[p + 1] + 0.114 * photoData[p + 2]) / 255.0;
            const eyeSafeZone = Math.max(
              gauss(nx, ny, RIG.leftEyeX, RIG.leftEyeY, 0.110, 0.060),
              gauss(nx, ny, RIG.rightEyeX, RIG.rightEyeY, 0.110, 0.060)
            );
            const mouthSafeZone = gauss(nx, ny, RIG.mouthX, RIG.mouthY, 0.19, 0.075);
            const blendPhoto = (1.0 - Math.min(1.0, eyeSafeZone + mouthSafeZone)) * 0.30 * lateralFalloff * verticalFalloff;
            lum = lum * (1.0 - blendPhoto) + Math.pow(photoL, 1.30) * 1.10 * blendPhoto;
          }

          baseSkinMap[idx] = Math.max(0, Math.min(1.25, lum));
        }
      }
    }

    buildBaseSkinAndDepth(null);

    // Load local offline portrait texture to enrich micro-details
    const portraitImg = new Image();
    portraitImg.onload = function() {
      buildBaseSkinAndDepth(portraitImg);
    };
    portraitImg.src = 'data/custom/jarvis_portrait.jpg';

    // 2. Real-Time Dynamic Anatomical Face Synthesizer
    function sampleAnimatedFace(nx, ny) {
      const breath = Math.sin(bioState.time * 1.85) * 0.011;
      const roll = bioState.headRoll * 0.085;
      const cosR = Math.cos(roll);
      const sinR = Math.sin(roll);
      const rx = nx * cosR - (ny - 0.10) * sinR;
      const ry = (nx * sinR + (ny - 0.10) * cosR) + 0.06 - breath;

      const dMapX = Math.max(0, Math.min(MAP_W - 1, Math.floor((rx * 0.5 + 0.5) * (MAP_W - 1))));
      const dMapY = Math.max(0, Math.min(MAP_H - 1, Math.floor((ry * 0.5 + 0.5) * (MAP_H - 1))));
      const depth = depthMap[dMapY * MAP_W + dMapX];

      const yaw = bioState.headYaw * 0.13;
      const pitch = bioState.headPitch * 0.10;
      const perspective = 1.0 + rx * yaw * 0.40 + ry * pitch * 0.24;

      const fx = rx * perspective - yaw * (0.30 + depth * 0.88);
      const fy = ry * perspective - pitch * (0.30 + depth * 0.78);

      if (fx < -0.98 || fx > 0.98 || fy < -0.98 || fy > 0.98) return 0;

      let skinSampleY = fy;
      if (fy > RIG.mouthY && bioState.mouthOpen > 0.01) {
        const jawMask = gauss(fx, fy, 0, RIG.mouthY + 0.18, 0.28, 0.22);
        skinSampleY -= bioState.mouthOpen * 0.055 * jawMask;
      }

      const mapX = (fx * 0.5 + 0.5) * (MAP_W - 1);
      const mapY = (skinSampleY * 0.5 + 0.5) * (MAP_H - 1);
      if (mapX < 1 || mapX >= MAP_W - 2 || mapY < 1 || mapY >= MAP_H - 2) return 0;

      const x0 = Math.floor(mapX), y0 = Math.floor(mapY);
      const tx = mapX - x0, ty = mapY - y0;
      const bIdx = y0 * MAP_W + x0;
      let lum = (baseSkinMap[bIdx] * (1 - tx) + baseSkinMap[bIdx + 1] * tx) * (1 - ty) +
                (baseSkinMap[bIdx + MAP_W] * (1 - tx) + baseSkinMap[bIdx + MAP_W + 1] * tx) * ty;

      if (lum <= 0.001) return 0;

      const afx = Math.abs(fx);

      // Eyebrows
      const browArchY = -0.138 - bioState.browRaise * 0.018 - 0.018 * Math.sin(Math.min(1.0, Math.max(0, (afx - 0.07) / 0.21)) * Math.PI);
      const browShadow = gauss(afx, fy, 0.182, browArchY, 0.095, 0.010);
      lum *= (1.0 - browShadow * 0.62);
      lum += gauss(afx, fy, 0.195, browArchY + 0.020, 0.078, 0.012) * 0.16;

      // Eyes + Eyelids + Pupil + Gaze
      const eyeCX = fx < 0 ? RIG.leftEyeX : RIG.rightEyeX;
      const eyeCY = RIG.leftEyeY;
      const edx = (afx - Math.abs(eyeCX)) / RIG.eyeRadiusX;
      const edy = (fy - eyeCY) / RIG.eyeRadiusY;

      if (Math.abs(edx) < 1.15 && Math.abs(edy) < 1.55) {
        const outerLift = (afx - Math.abs(eyeCX)) * 0.15;
        const openUpper = -0.88 + 0.76 * edx * edx - outerLift;
        const openLower = 0.80 - 0.62 * edx * edx - outerLift * 0.5;

        const closedLine = 0.20 - 0.14 * edx * edx - outerLift * 0.6;
        const upperCurve = openUpper * (1.0 - bioState.blink) + closedLine * bioState.blink;
        const lowerCurve = openLower * (1.0 - bioState.blink * 0.35) + closedLine * (bioState.blink * 0.35);

        const creaseCurve = upperCurve - 0.44 * (1.0 - bioState.blink * 0.55);
        lum *= (1.0 - gauss(edx, edy, 0, creaseCurve, 0.85, 0.11) * 0.58);

        if (edy > creaseCurve && edy < upperCurve) {
          const lidDome = Math.sin(((edy - creaseCurve) / Math.max(0.05, upperCurve - creaseCurve)) * Math.PI);
          const horizLid = Math.max(0, 1.0 - edx * edx * 0.9);
          lum = lum * 0.55 + (0.42 + 0.24 * bioState.blink) * lidDome * horizLid;
        }

        if (Math.abs(edx) < 1.0 && edy >= upperCurve && edy <= lowerCurve && bioState.blink < 0.94) {
          const gazeShiftX = bioState.gazeX * 0.020;
          const gazeShiftY = bioState.gazeY * 0.011;
          const irisX = (fx - eyeCX - gazeShiftX) / 0.033;
          const irisY = (fy - eyeCY - gazeShiftY) / 0.033;
          const rIris = Math.hypot(irisX, irisY);

          const lashShadow = smoothstep(upperCurve, upperCurve + 0.45, edy);

          if (rIris < 1.0) {
            if (rIris < 0.34) {
              lum = 0.002;
            } else if (rIris > 0.78) {
              const limbalT = smoothstep(0.78, 0.96, rIris);
              lum = 0.28 * (1.0 - limbalT) + 0.015 * limbalT;
            } else {
              const angle = Math.atan2(irisY, irisX);
              const fibers = 0.5 + 0.5 * Math.sin(angle * 26.0);
              const lowerGlow = smoothstep(-0.20, 0.80, irisY) * 0.54;
              lum = (0.40 + fibers * 0.26 + lowerGlow) * lashShadow;
            }

            const catch1 = Math.hypot(irisX + 0.24, irisY + 0.24);
            const catch2 = Math.hypot(irisX - 0.24, irisY - 0.22);
            if (catch1 < 0.34) {
              lum = Math.max(lum, smoothstep(0.34, 0.08, catch1) * 1.65);
            } else if (catch2 < 0.19) {
              lum = Math.max(lum, smoothstep(0.19, 0.04, catch2) * 1.05);
            }
          } else {
            const scleraVignette = Math.max(0.18, 1.0 - edx * edx * 0.62);
            lum = 0.60 * scleraVignette * lashShadow;
          }
        }

        const distToLash = Math.abs(edy - upperCurve);
        if (Math.abs(edx) < 1.03 && distToLash < 0.18) {
          const lashIntensity = (1.0 - distToLash / 0.18) * Math.max(0, 1.0 - Math.pow(edx, 4) * 0.55);
          lum *= (1.0 - lashIntensity * 0.93);
        }

        if (Math.abs(edx) < 0.94 && edy > lowerCurve && edy <= lowerCurve + 0.22) {
          const rimT = 1.0 - (edy - lowerCurve) / 0.22;
          const horizFade = Math.max(0, 1.0 - edx * edx);
          lum = Math.max(lum, rimT * horizFade * 0.84 * (1.0 - bioState.blink * 0.6));
        }
      }

      // Mouth & Articulated Lips
      const mouthWidth = RIG.mouthW * (1.0 + (bioState.mouthWide - 0.25) * 0.14 * bioState.mouthOpen + bioState.microSmile * 0.04);
      const mx = (fx - RIG.mouthX) / mouthWidth;
      const my = fy - RIG.mouthY;

      if (Math.abs(mx) < 1.22 && my > -0.075 && my < 0.115) {
        const horizEnv = Math.max(0, 1.0 - mx * mx);
        const smileLift = -bioState.microSmile * 0.010 * mx * mx;
        const cupidWave = 0.009 * Math.cos(mx * Math.PI * 1.85) * Math.exp(-mx * mx * 2.8);

        const halfGap = bioState.mouthOpen * 0.032 * Math.pow(horizEnv, 0.85);
        const upperLipInnerY = cupidWave + smileLift - halfGap * 0.35;
        const lowerLipInnerY = cupidWave + smileLift + halfGap * 1.15;

        if (my >= upperLipInnerY && my <= lowerLipInnerY && Math.abs(mx) < 0.98 && halfGap > 0.002) {
          const teethZone = smoothstep(upperLipInnerY + 0.014, upperLipInnerY + 0.002, my) * Math.exp(-mx * mx * 2.5);
          lum = 0.02 + teethZone * 0.26 * Math.min(1.0, bioState.mouthOpen * 2.2);
        } else if (my < upperLipInnerY && my > upperLipInnerY - 0.036 * horizEnv) {
          const tUpper = (upperLipInnerY - my) / Math.max(0.005, 0.036 * horizEnv);
          const lipShade = Math.sin(tUpper * Math.PI);
          lum = lum * (1.0 - horizEnv * 0.65) + 0.14 * lipShade * horizEnv;
        } else if (my > lowerLipInnerY && my < lowerLipInnerY + 0.046 * horizEnv) {
          const tLower = (my - lowerLipInnerY) / Math.max(0.005, 0.046 * horizEnv);
          const lowerDome = Math.sin(tLower * Math.PI);
          const glossHighlight = Math.exp(-mx * mx * 3.8) * Math.exp(-Math.pow(tLower - 0.42, 2) * 10.0);
          lum = lum * (1.0 - horizEnv * 0.5) + (0.34 * lowerDome + 0.58 * glossHighlight) * horizEnv;
        }

        const slitDist = Math.min(Math.abs(my - upperLipInnerY), Math.abs(my - lowerLipInnerY));
        if (slitDist < 0.008 && Math.abs(mx) < 1.02) {
          const slitDark = (1.0 - slitDist / 0.008) * Math.max(0, 1.0 - Math.pow(mx, 4) * 0.7);
          lum *= (1.0 - slitDark * 0.92);
        }
      }

      const dynamicLight = 1.0 + fx * (-yaw * 0.95) + fy * (-pitch * 0.55);
      return Math.max(0, lum * dynamicLight);
    }

    // Grid Initialization (Cell size 2.8 for maximum sharpness on 205x165)
    const cell = bioState.cellSize;
    const cols = Math.ceil(W / cell);
    const rows = Math.ceil(H / cell);
    const cellSeeds = new Float32Array(cols * rows);
    for (let i = 0; i < cellSeeds.length; i++) {
      cellSeeds[i] = Math.random();
    }

    const rowBandMask = new Float32Array(rows);
    for (let r = 0; r < rows; r++) {
      rowBandMask[r] = 0.92 + 0.08 * noise2D(0.35, r * 0.35);
    }

    const rainDrops = [];
    for (let c = 0; c < cols; c++) {
      rainDrops.push({
        y: Math.random() * rows,
        speed: 0.14 + Math.random() * 0.38,
        len: 8 + Math.floor(Math.random() * 16),
        strength: 0.25 + Math.random() * 0.55
      });
    }

    // Interactive cursor tracking on terminal
    const terminalEl = document.getElementById('knx-jarvis-terminal');
    if (terminalEl && !jarvisBioMatrixInit) {
      terminalEl.addEventListener('mousemove', function(e) {
        const rect = terminalEl.getBoundingClientRect();
        bioState.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        bioState.mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        bioState.hasMouse = true;
      });
      terminalEl.addEventListener('mouseleave', function() {
        bioState.hasMouse = false;
      });
      jarvisBioMatrixInit = true;
    }

    let lastTick = performance.now();

    function renderBioMatrix(now) {
      const dt = Math.min(0.05, (now - lastTick) / 1000);
      lastTick = now;
      bioState.time += dt;
      const t = bioState.time;

      const term = document.getElementById('knx-jarvis-terminal');
      const isSpeaking = term && term.classList.contains('jarvis-speaking');
      const isListening = term && term.classList.contains('jarvis-listening');

      // 1. Autonomous Saccades & Head Posture
      if (t > bioState.nextSaccade) {
        bioState.saccadeX = (Math.random() - 0.5) * 0.55;
        bioState.saccadeY = (Math.random() - 0.5) * 0.35;
        bioState.nextSaccade = t + 0.6 + Math.random() * 2.2;
      }

      const autoYaw = (Math.sin(t * 0.72) * 0.36 + Math.cos(t * 1.18) * 0.20);
      const autoPitch = (Math.sin(t * 0.54 + 1.2) * 0.24 + Math.sin(t * 1.45) * 0.12);
      const autoRoll = Math.sin(t * 0.48 + 0.6) * 0.30;

      const targetYaw = bioState.hasMouse ? bioState.mouseX * 0.6 + autoYaw * 0.3 : autoYaw;
      const targetPitch = bioState.hasMouse ? bioState.mouseY * 0.5 + autoPitch * 0.3 : autoPitch;
      const targetRoll = autoRoll;

      bioState.headYaw += (targetYaw - bioState.headYaw) * 4.2 * dt;
      bioState.headPitch += (targetPitch - bioState.headPitch) * 4.2 * dt;
      bioState.headRoll += (targetRoll - bioState.headRoll) * 3.6 * dt;

      const targetGazeX = isListening ? 0 : (bioState.hasMouse ? bioState.mouseX * 0.8 : (bioState.saccadeX + autoYaw * 0.4));
      const targetGazeY = isListening ? -0.05 : (bioState.hasMouse ? bioState.mouseY * 0.7 : (bioState.saccadeY + autoPitch * 0.35));
      bioState.gazeX += (targetGazeX - bioState.gazeX) * 12.0 * dt;
      bioState.gazeY += (targetGazeY - bioState.gazeY) * 12.0 * dt;

      // Natural Eyelid Blink
      if (t > bioState.nextBlink) {
        const phase = (t - bioState.nextBlink) / 0.16;
        if (phase < 1.0) {
          bioState.blink = Math.pow(Math.sin(phase * Math.PI), 0.75);
        } else {
          bioState.blink = 0;
          bioState.nextBlink = t + 2.2 + Math.random() * 3.5;
        }
      }

      // Micro-expressions
      bioState.browRaise = isListening ? 0.45 : (0.15 * Math.sin(t * 0.85));
      bioState.microSmile = isListening ? 0.35 : (0.20 + 0.15 * Math.sin(t * 0.65));

      // Speech Mouth Articulation
      let targetOpen = 0;
      let targetWide = 0;
      if (isSpeaking) {
        const st = t * 14.5;
        const syll = Math.max(0, Math.sin(st) * 0.55 + Math.sin(st * 0.43) * 0.5 + Math.cos(st * 1.7) * 0.35);
        const pause = Math.sin(t * 2.7) > -0.65 ? 1.0 : 0.05;
        targetOpen = Math.min(0.95, syll * pause);
        targetWide = Math.max(0, Math.sin(st * 0.6)) * 0.65 * pause;
      } else if (isListening) {
        targetOpen = 0.28;
      }

      bioState.mouthOpen += (targetOpen - bioState.mouthOpen) * 18 * dt;
      bioState.mouthWide += (targetWide - bioState.mouthWide) * 14 * dt;

      // Rain drops advancement
      for (let c = 0; c < cols; c++) {
        const drop = rainDrops[c];
        drop.y += drop.speed * (0.45 + (isSpeaking ? 0.4 : 0));
        if (drop.y - drop.len > rows) {
          drop.y = -Math.random() * 12;
        }
      }

      // 2. Clear canvas & Render Matrix Grid (with dynamic alert palette)
      const JARVIS_PALETTE = getLivePalette();
      ctx.fillStyle = JARVIS_PALETTE.bg;
      ctx.fillRect(0, 0, W, H);

      // Perfectly scaled to fill width (~195px) comfortably without empty side gaps
      const portraitW = W * 1.38;
      const portraitH = portraitW / 0.94;
      const centerX = W * 0.5;
      const centerY = H * 0.46;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '600 5px "JetBrains Mono", monospace';

      const tick = Math.floor(t * 9);
      const numGlyphs = CODE_GLYPHS.length;

      for (let c = 0; c < cols; c++) {
        const px = c * cell + cell * 0.5;
        const nx = (px - centerX) / (portraitW * 0.5);
        const drop = rainDrops[c];

        for (let r = 0; r < rows; r++) {
          const py = r * cell + cell * 0.5;
          const ny = (py - centerY) / (portraitH * 0.5);
          const cellIdx = r * cols + c;
          const seed = cellSeeds[cellIdx];

          const rawLum = sampleAnimatedFace(nx, ny);
          let faceLum = rawLum > 0.005 ? Math.pow(rawLum, bioState.contrast) * 1.25 : 0;

          const highlightSmooth = smoothstep(0.25, 0.70, faceLum);
          faceLum *= (rowBandMask[r] * (1.0 - highlightSmooth) + highlightSmooth);

          // Subtle ambient rain strictly outside face
          const distDrop = drop.y - r;
          let rainLum = 0;
          if (distDrop >= 0 && distDrop < drop.len) {
            rainLum = (1.0 - distDrop / drop.len) * drop.strength;
          }
          const distFromCenter = Math.hypot(nx / 0.62, ny / 0.66);
          const outsideMask = smoothstep(0.78, 1.18, distFromCenter);
          const ambientRain = rainLum * 0.14 * outsideMask * Math.exp(-nx * nx * 0.45);

          const totalLum = faceLum > 0.022 ? faceLum : ambientRain * (seed > 0.52 ? 1.0 : 0.0);
          if (totalLum < 0.028) continue;

          const clamped = Math.min(1.0, totalLum);

          let cr, cg, cb, alpha;
          if (totalLum > 0.76) {
            cr = JARVIS_PALETTE.bright[0];
            cg = JARVIS_PALETTE.bright[1];
            cb = JARVIS_PALETTE.bright[2];
            alpha = Math.min(1.0, 0.82 + clamped * 0.18);
          } else if (totalLum > 0.28) {
            const tVal = (totalLum - 0.28) / 0.48;
            cr = Math.round(JARVIS_PALETTE.mid[0] + (JARVIS_PALETTE.bright[0] - JARVIS_PALETTE.mid[0]) * tVal);
            cg = Math.round(JARVIS_PALETTE.mid[1] + (JARVIS_PALETTE.bright[1] - JARVIS_PALETTE.mid[1]) * tVal);
            cb = Math.round(JARVIS_PALETTE.mid[2] + (JARVIS_PALETTE.bright[2] - JARVIS_PALETTE.mid[2]) * tVal);
            alpha = 0.48 + clamped * 0.50;
          } else {
            const tVal = totalLum / 0.28;
            cr = Math.round(JARVIS_PALETTE.dim[0] + (JARVIS_PALETTE.mid[0] - JARVIS_PALETTE.dim[0]) * tVal);
            cg = Math.round(JARVIS_PALETTE.dim[1] + (JARVIS_PALETTE.mid[1] - JARVIS_PALETTE.dim[1]) * tVal);
            cb = Math.round(JARVIS_PALETTE.dim[2] + (JARVIS_PALETTE.mid[2] - JARVIS_PALETTE.dim[2]) * tVal);
            alpha = 0.20 + clamped * 0.58;
          }

          ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + alpha.toFixed(2) + ')';

          const dither = (seed - 0.5) * 0.24;
          const halftoneBlend = smoothstep(0.48, 0.72, totalLum + dither);

          if (halftoneBlend > 0.5) {
            // High-density Halftone micro-quads for photorealistic lighting
            const step = cell * 0.48;
            const dotSz = Math.max(1.1, cell * (0.28 + 0.10 * halftoneBlend) * Math.pow(clamped, 0.72));
            const half = dotSz * 0.5;
            ctx.fillRect(px - step * 0.5 - half, py - step * 0.5 - half, dotSz, dotSz);
            ctx.fillRect(px + step * 0.5 - half, py - step * 0.5 - half, dotSz * 0.94, dotSz * 0.94);
            ctx.fillRect(px - step * 0.5 - half, py + step * 0.5 - half, dotSz * 0.94, dotSz * 0.94);
            if (totalLum > 0.58 || seed > 0.20) {
              ctx.fillRect(px + step * 0.5 - half, py + step * 0.5 - half, dotSz, dotSz);
            }
          } else if (totalLum < 0.16) {
            const s = Math.max(1.0, cell * 0.22);
            ctx.fillRect(px - s * 0.5, py - s * 0.5, s, s * (seed > 0.52 ? 1.75 : 1.0));
          } else {
            // Condensed numeric code glyphs
            const glyphIdx = seed > 0.95
              ? (Math.floor(seed * 100) + tick) % numGlyphs
              : Math.min(numGlyphs - 1, Math.floor(clamped * (numGlyphs - 1)));
            const ch = CODE_GLYPHS[glyphIdx];
            ctx.fillText(ch, px, py);
          }
        }
      }

      // 3. Bloom Glow Pass
      if (bioState.bloomStrength > 0.02) {
        try {
          bloomCtx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
          bloomCtx.filter = 'blur(4px) brightness(1.25)';
          bloomCtx.drawImage(canvas, 0, 0, bloomCanvas.width, bloomCanvas.height);

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = bioState.bloomStrength * (0.45 + (isSpeaking ? 0.2 : 0));
          ctx.drawImage(bloomCanvas, 0, 0, W, H);
          ctx.restore();
        } catch (err) {}
      }

      orbAnimId = requestAnimationFrame(renderBioMatrix);
    }

    if (orbAnimId) cancelAnimationFrame(orbAnimId);
    renderBioMatrix(performance.now());
  }
  // 3D Particle Cloud for the Startup Boot Sequence
  function animateBootParticleCloud(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    const NUM_BOOT = 750;
    const particles = [];
    for (let i = 0; i < NUM_BOOT; i++) {
      const phi = Math.acos(-1 + (2 * i) / NUM_BOOT);
      const theta = Math.sqrt(NUM_BOOT * Math.PI) * phi;
      particles.push({ phi, theta, speed: 0.9 + Math.random() * 0.4 });
    }

    let angle = 0;
    const startTime = Date.now();

    function drawBoot() {
      const elapsed = Date.now() - startTime;
      if (elapsed > 1400) return;

      ctx.clearRect(0, 0, W, H);
      angle += 0.035;
      const progress = Math.min(1, elapsed / 1300);
      const currentRadius = 30 + progress * 75;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      for (let i = 0; i < NUM_BOOT; i++) {
        const p = particles[i];
        const wave = Math.sin(p.phi * 5 + p.theta * 4 + elapsed * 0.008) * 12;
        const r = currentRadius + wave;

        const x = r * Math.sin(p.phi) * Math.cos(p.theta);
        const y = r * Math.cos(p.phi);
        const z = r * Math.sin(p.phi) * Math.sin(p.theta);

        const xRot = x * cos - z * sin;
        const zRot = z * cos + x * sin;

        const fov = 240;
        const scale = fov / (fov + zRot);
        const px = cx + xRot * scale;
        const py = cy + y * scale;

        const alpha = Math.min(1, Math.max(0.15, (zRot + r) / (r * 1.8))) * (1 - progress * 0.6);
        ctx.fillStyle = (zRot > 20 && Math.random() < 0.08) ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 240, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.8, 1.8 * scale), 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(drawBoot);
    }
    drawBoot();
  }

// --- CORE DOMOTIC LOGIC ---

  // Command IDs mapped to the user's real plugins & devices
  const CMDS = {
    // Weather Plugin ([Météo][Meteo])
    TEMP_EXT: 68,
    CONDITION_TEXT: 77,
    CONDITION_NUM: 78,
    HUMIDITY_EXT: 69,
    PRESSURE: 70,
    WIND: 71,
    RAIN_ACCUM: 79,
    TEMP_MIN: 75,
    TEMP_MAX: 76,
    SUNRISE: 74,
    SUNSET: 73,
    // Master Lights
    ALL_OFF: 805,
    JOUR_OFF: 806,
    // All 8 Physical Shutters (Up / Down)
    SHUTTERS_OPEN: [37, 39, 41, 43, 45, 47, 49, 51],
    SHUTTERS_CLOSE: [38, 40, 42, 44, 46, 48, 50, 52],
    // Floor Heating (Maison - Plain-pied)
    HEAT_STATE: 870,
    HEAT_ON: 871,
    HEAT_OFF: 872,
    // Enedis Linky Telemetry
    LINKY_POWER_INSTANT: 344, // Consommation horaire (kW)
    LINKY_CONSO_DAY: 341,     // Consommation Jour (kWh)
    LINKY_CONSO_MONTH: 342,   // Consommation Mois (kWh)
    // Portail Thomson Swip / Guardian
    GATE_TOGGLE: 882,
    // Presence Foyer via Freebox Ultra
    PRESENCE_MATTHIEU: 878,
    PRESENCE_FANNY: 879,
    PRESENCE_MAISON: 880,
    // Roborock S7 Pro Ultra
    ROBOROCK_START: 1229,
    ROBOROCK_RETURN_BASE: 1232,
    ROBOROCK_IS_CLEANING: 1243,
    ROBOROCK_BATTERY: 1242,
    ROBOROCK_STATE: 1240
  };

  // State store with reliable live defaults from real sensors
  const state = {
    // Weather
    tempExt: '10.1',
    conditionText: 'Météo en direct',
    conditionNum: 1063,
    tempMin: '3.2',
    tempMax: '14.2',
    humidityExt: '86',
    wind: '6.5',
    pressure: '1022',
    rainAccum: '0.1',
    sunrise: '07h26',
    sunset: '17h20',
    // Energy / Linky
    linkyInstant: '0.37',
    linkyDay: '4.6',
    linkyMonth: '161',
    // Foyer Presence
    presenceMatthieu: 1,
    presenceFanny: 0,
    presenceMaison: 1,
    // Heating
    heating: 0,
    // Roborock Vacuum
    vacuumCleaning: 0,
    vacuumBattery: 58,
    vacuumState: 'Prêt'
  };

  // Module state hoisted to top level of IIFE (prevents TDZ ReferenceErrors)
  let familyTasks = [];
  let currentCalFilter = 'all';
  let calendarEvents = [];
  let editingTaskId = null;

  function getWeatherSvg(code, text) {
    const t = (text || '').toLowerCase();
    if (t.includes('pluie') || t.includes('averse') || t.includes('bruine')) {
      return `<svg class="knx-weather-main-icon" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="16" y1="13" x2="16" y2="21"></line>
        <line x1="8" y1="13" x2="8" y2="21"></line>
        <line x1="12" y1="15" x2="12" y2="23"></line>
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
      </svg>`;
    } else if (t.includes('orage') || t.includes('éclair')) {
      return `<svg class="knx-weather-main-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>`;
    } else if (t.includes('neige')) {
      return `<svg class="knx-weather-main-icon" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line>
      </svg>`;
    } else if (t.includes('nuag') || t.includes('couvert')) {
      return `<svg class="knx-weather-main-icon" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      </svg>`;
    } else {
      return `<svg class="knx-weather-main-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
    }
  }

  function formatSunTime(raw) {
    if (!raw) return '--:--';
    let s = String(raw).trim();
    if (s.length === 3) s = '0' + s;
    if (s.length === 4) return s.substring(0, 2) + 'h' + s.substring(2);
    return s;
  }

    // ==========================================================================
  // J.A.R.V.I.S. MARK VII STARTUP BOOT ANIMATION (MAISON 3D HUD)
  // ==========================================================================
  function triggerJarvisBootSequence() {
    // Ensure native Jeedom spinner is neutralized
    const jLoader = document.getElementById('div_jeedomLoading');
    if (jLoader) jLoader.style.display = 'none';

    // Run only once per browser session so switching between tabs is instantaneous
    if (sessionStorage.getItem('knx_jarvis_boot_played') === '1') {
      return;
    }
    sessionStorage.setItem('knx_jarvis_boot_played', '1');

    // 1. Create full-screen scanline and 3D Neural Particle Cloud canvas
    const overlay = document.createElement('div');
    overlay.className = 'jarvis-boot-overlay';
    overlay.innerHTML = `
      <div class="jarvis-boot-scanline"></div>
      <canvas id="jarvis-boot-sphere-canvas" width="360" height="360" class="jarvis-boot-canvas"></canvas>
    `;
    document.body.appendChild(overlay);
    const bootCanvas = document.getElementById('jarvis-boot-sphere-canvas');
    if (bootCanvas) animateBootParticleCloud(bootCanvas);
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 1250);

    // 2. Add entry flare to HUD cards
    const cards = [
      document.getElementById('knx-linky-card'),
      document.getElementById('knx-hud-card'),
      document.getElementById('knx-jarvis-terminal'),
      document.getElementById('knx-dock-container'),
      document.querySelector('.knx-nav-capsule')
    ];
    cards.forEach((c, idx) => {
      if (c) {
        c.classList.add('jarvis-boot-anim');
        setTimeout(() => c.classList.remove('jarvis-boot-anim'), 1100);
      }
    });

    // 3. Play sci-fi startup sound
    if (window.playJarvisBoot) {
      window.playJarvisBoot();
    }

    // 4. Scramble number decode animation for Linky & Weather
    const linkyEl = document.getElementById('knx-linky-instant');
    const weatherEl = document.getElementById('knx-temp-val');
    const targetLinky = parseFloat(state.linkyInstant) || 0.93;
    const targetTemp = parseFloat(state.tempExt) || 18.3;

    let step = 0;
    const scrambleInterval = setInterval(() => {
      step++;
      if (linkyEl) {
        const rand = (Math.random() * targetLinky * 1.5).toFixed(2);
        linkyEl.textContent = rand;
      }
      if (weatherEl) {
        const randT = (10 + Math.random() * 15).toFixed(1);
        weatherEl.textContent = randT;
      }
      if (step >= 8) {
        clearInterval(scrambleInterval);
        if (linkyEl) linkyEl.textContent = state.linkyInstant;
        if (weatherEl) weatherEl.textContent = state.tempExt;
      }
    }, 55);

    // 5. Terminal Boot Typing Message
    const voiceStatus = document.getElementById('knx-jarvis-voice-status');
    if (voiceStatus) {
      voiceStatus.textContent = '« INITIALISATION J.A.R.V.I.S. MARK VII... »';
      voiceStatus.style.color = '#00f0ff';
      setTimeout(() => {
        voiceStatus.textContent = '« SYSTÈMES DOMOTIQUES OPÉRATIONNELS »';
        setTimeout(() => {
          voiceStatus.textContent = 'COMMANDE VOCALE : PRÊT';
          voiceStatus.style.color = '#38bdf8';
        }, 2200);
      }, 1200);
    }
  }

  
  // Linky Arc Reactor 10-Segment Dynamic LED Bar
  function updateLinkyArcBar(kwVal) {
    const container = document.getElementById('knx-linky-segments');
    if (!container) return;
    const segments = container.querySelectorAll('.knx-arc-segment');
    const maxKw = 9.0; // Abonnement Linky 9 kVA
    const activeCount = Math.min(10, Math.max(1, Math.ceil((kwVal / maxKw) * 10)));

    segments.forEach((seg, idx) => {
      seg.className = 'knx-arc-segment';
      if (idx < activeCount) {
        if (kwVal >= 7.0) {
          seg.classList.add('active-red');
        } else if (kwVal >= 4.5) {
          seg.classList.add('active-amber');
        } else {
          seg.classList.add('active-cyan');
        }
      }
    });
  }
function initHub() {
    const isPlan = window.location.search.indexOf('p=plan') !== -1;
    const isPlan4 = window.location.search.indexOf('plan_id=4') !== -1;
    const isPlan9 = window.location.search.indexOf('plan_id=9') !== -1;

    // On Plan 9 (Energy), do NOT mount the HUD (Linky & Weather cards) to avoid superposition!
    if (isPlan9) {
      initFamilyHubModal();
      return;
    }

    let container = document.getElementById('knx-design-hub');
    if (!container) {
      container = document.createElement('div');
      container.id = 'knx-design-hub';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <!-- Linky Telemetry Card (Top-Left) -->
      <div class="knx-linky-card" id="knx-linky-card">
        <div class="knx-card-header" id="knx-linky-toggle" title="Toucher pour réduire / agrandir">
          <div class="knx-linky-title">
            <svg style="width:13px;height:13px;color:#fbbf24;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Linky
          </div>
          <span class="knx-collapsed-preview" id="knx-linky-mini">${state.linkyInstant} kW</span>
          <button type="button" class="knx-linky-hist-chip" id="knx-linky-hist-btn" title="Ouvrir les graphiques d'énergie Linky">
            <svg style="width:10px;height:10px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <span>Conso</span>
          </button>
          <button type="button" class="knx-card-toggle-btn" aria-label="Toggle">
            <svg class="knx-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
        </div>

        <div class="knx-card-body">
          <div class="knx-linky-main knx-linky-clickable" id="knx-linky-instant-box" title="Toucher pour voir l'historique de puissance (kW)">
            <div class="knx-linky-val-row">
              <span class="knx-linky-power-val" id="knx-linky-instant">${state.linkyInstant}</span>
              <span class="knx-linky-power-unit">kW</span>
            </div>
            <div class="knx-linky-hint">Puissance instantanée soutirée</div>
            <div class="knx-arc-power-bar" id="knx-linky-segments" title="Niveau de consommation électrique">
              <span class="knx-arc-segment active-cyan"></span>
              <span class="knx-arc-segment active-cyan"></span>
              <span class="knx-arc-segment active-cyan"></span>
              <span class="knx-arc-segment"></span>
              <span class="knx-arc-segment"></span>
              <span class="knx-arc-segment"></span>
              <span class="knx-arc-segment"></span>
              <span class="knx-arc-segment"></span>
              <span class="knx-arc-segment"></span>
              <span class="knx-arc-segment"></span>
            </div>
          </div>

          <div class="knx-linky-grid">
            <div class="knx-linky-cell knx-linky-clickable" id="knx-linky-day-box" title="Toucher pour voir l'historique jour (kWh)">
              <span class="knx-linky-label">Aujourd'hui</span>
              <span class="knx-linky-val"><span id="knx-linky-day">${state.linkyDay}</span> <small>kWh</small></span>
            </div>
            <div class="knx-linky-cell knx-linky-clickable" id="knx-linky-month-box" title="Toucher pour voir l'historique mois (kWh)">
              <span class="knx-linky-label">Ce Mois</span>
              <span class="knx-linky-val"><span id="knx-linky-month">${state.linkyMonth}</span> <small>kWh</small></span>
            </div>
          </div>

          <!-- Presence Foyer Status Pill -->
          <div class="knx-presence-row" id="knx-presence-pill" style="margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
            <span style="color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 5px;">
              <svg style="width: 12px; height: 12px; opacity: 0.7;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Foyer
            </span>
            <span id="knx-presence-status" style="font-weight: 500; display: inline-flex; align-items: center; gap: 5px; color: #4ade80;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #4ade80; display: inline-block;"></span>
              <span id="knx-presence-names">Matthieu &amp; Fanny</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Weather HUD (Top-Right) -->
      <div class="knx-hud-card" id="knx-hud-card">
        <div class="knx-card-header" id="knx-weather-toggle" title="Toucher pour réduire / agrandir">
          <div class="knx-hud-title">
            <svg style="width:13px;height:13px;color:#38bdf8;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            Météo
          </div>
          <span class="knx-collapsed-preview" id="knx-weather-mini">${state.tempExt}°C</span>
          <button type="button" class="knx-card-toggle-btn" aria-label="Toggle">
            <svg class="knx-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
        </div>

        <div class="knx-card-body">
          <span class="knx-weather-condition-badge" id="knx-cond-badge">
            <svg style="width:12px;height:12px;flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            <span id="knx-cond-text">${state.conditionText}</span>
          </span>

          <div class="knx-hero-temp-row">
            <div class="knx-temp-block">
              <div>
                <span class="knx-hero-temp" id="knx-temp-val">${state.tempExt}</span>
                <span style="font-size:20px; color:#38bdf8; font-weight:700; margin-left:2px;">°C</span>
              </div>
              <div class="knx-minmax-row">
                <span class="knx-temp-min" title="Température minimum">
                  <svg style="width:12px;height:12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="7 13 12 18 17 13"/><line x1="12" y1="6" x2="12" y2="18"/></svg>
                  <span id="knx-min-val">${state.tempMin}°</span>
                </span>
                <span>•</span>
                <span class="knx-temp-max" title="Température maximum">
                  <svg style="width:12px;height:12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="17 11 12 6 7 11"/><line x1="12" y1="18" x2="12" y2="6"/></svg>
                  <span id="knx-max-val">${state.tempMax}°</span>
                </span>
              </div>
            </div>
            <div class="knx-weather-icon-wrapper" id="knx-icon-wrapper">
              ${getWeatherSvg(state.conditionNum, state.conditionText)}
            </div>
          </div>

          <!-- 4-Metrics Grid (100% Distinct Sci-Fi Instrument Icons) -->
          <div class="knx-hud-grid">
            <!-- 1. Air Moisture / Hygrometer Dial -->
            <div class="knx-grid-cell" title="Taux d'humidité relative de l'air">
              <svg class="knx-cell-icon" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 15.5l7-7"/><circle cx="9.5" cy="9.5" r="1.2" fill="#38bdf8"/><circle cx="14.5" cy="14.5" r="1.2" fill="#38bdf8"/></svg>
              <div class="knx-cell-content">
                <span class="knx-cell-label">Humidité</span>
                <span class="knx-cell-val"><span id="knx-hum-val">${state.humidityExt}</span>%</span>
              </div>
            </div>

            <!-- 2. Wind Anemometer -->
            <div class="knx-grid-cell" title="Vitesse du vent">
              <svg class="knx-cell-icon" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>
              <div class="knx-cell-content">
                <span class="knx-cell-label">Vent</span>
                <span class="knx-cell-val"><span id="knx-wind-val">${state.wind}</span>km/h</span>
              </div>
            </div>

            <!-- 3. Barometer Pressure Gauge -->
            <div class="knx-grid-cell" title="Pression atmosphérique barométrique">
              <svg class="knx-cell-icon" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><path d="M12 3v1M12 20v1M4 12H3M21 12h-1"/></svg>
              <div class="knx-cell-content">
                <span class="knx-cell-label">Pression</span>
                <span class="knx-cell-val"><span id="knx-press-val">${state.pressure}</span>hPa</span>
              </div>
            </div>

            <!-- 4. Rain Gauge Pluviometer Vial (mm accumulation) -->
            <div class="knx-grid-cell" title="Précipitations accumulées au pluviomètre">
              <svg class="knx-cell-icon" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2h10"/><path d="M8 2v13a4 4 0 0 0 8 0V2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h2"/></svg>
              <div class="knx-cell-content">
                <span class="knx-cell-label">Pluie</span>
                <span class="knx-cell-val"><span id="knx-rain-val">${state.rainAccum}</span>mm</span>
              </div>
            </div>
          </div>

          <!-- Sun Schedule -->
          <div class="knx-sun-strip">
            <div class="knx-sun-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/></svg>
              <span>Lever</span>
              <span class="knx-sun-time" id="knx-sunrise-val">${state.sunrise}</span>
            </div>
            <span>•</span>
            <div class="knx-sun-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/></svg>
              <span>Coucher</span>
              <span class="knx-sun-time" id="knx-sunset-val">${state.sunset}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Master Control Dock (Anti-Wrap Compact Oval Pills) -->
      <div class="knx-dock-container" id="knx-dock-container">
        <button type="button" class="knx-dock-btn btn-danger" id="btn-all-off" title="Éteindre toutes les lumières de la maison">
          <svg class="knx-dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          Tout OFF
        </button>

        <button type="button" class="knx-dock-btn btn-jour" id="btn-jour-off" title="Éteindre séjour / salon / cuisine">
          <svg class="knx-dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          Jour OFF
        </button>

        <button type="button" class="knx-dock-btn btn-shutter" id="btn-shutters-open" title="Ouvrir tous les volets roulants">
          <svg class="knx-dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="18 15 12 9 6 15"/><line x1="12" y1="9" x2="12" y2="21"/></svg>
          Ouvrir Volets
        </button>

        <button type="button" class="knx-dock-btn btn-shutter" id="btn-shutters-close" title="Fermer tous les volets roulants">
          <svg class="knx-dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 12 15 18 9"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Fermer Volets
        </button>

        <button type="button" class="knx-dock-btn btn-heat" id="btn-heat-sol" title="Chauffage au Sol (Marche / Arrêt)">
          <svg class="knx-dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
          Chauffage
        </button>

        <button type="button" class="knx-dock-btn btn-gate" id="btn-gate-toggle" title="Commande Portail">
          <svg class="knx-dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="7" y1="15" x2="7" y2="19"/><line x1="17" y1="15" x2="17" y2="19"/><line x1="12" y1="10" x2="12" y2="19"/></svg>
          Portail
        </button>

        <button type="button" class="knx-dock-btn btn-vacuum" id="btn-vacuum-toggle" title="Roborock S7 Pro Ultra - Démarrer / Retour Base">
          <svg class="knx-dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3"/><path d="M12 18v3"/></svg>
          <span id="knx-vacuum-btn-text">Robot 58%</span>
        </button>
      </div>

      <!-- J.A.R.V.I.S. Neural Core (Bottom-Left) -->
      <div class="knx-jarvis-terminal hud-panel hud-brackets" id="knx-jarvis-terminal">
        <!-- Top Status Bar -->
        <div class="knx-terminal-header">
          <div class="knx-terminal-title-wrap">
            <span class="knx-core-pulse-dot"></span>
            <span class="knx-terminal-title">J.A.R.V.I.S.</span>
            <span class="knx-terminal-sub">DOMOTIC CORE</span>
          </div>
          <div class="knx-terminal-clock" id="knx-jarvis-clock">--:--:--</div>
          <button type="button" class="knx-card-toggle-btn" id="knx-term-collapse-btn" aria-label="Réduire / Agrandir" title="Toucher pour réduire / agrandir">
            <svg class="knx-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
        </div>

        <!-- Center: 3D Neural Particle Sphere (The AI Mind) -->
        <div class="knx-neural-hero-stage" id="knx-terminal-hero-stage">
          <canvas id="knx-jarvis-orb" width="200" height="165" class="knx-terminal-orb-canvas"></canvas>
          <div class="knx-orb-glow-ring"></div>
        </div>

        <!-- Bottom: Interactive Voice Protocol Bar -->
        <div class="knx-voice-bar" id="knx-voice-bar" role="button" tabindex="0" title="Activer la commande vocale (Micro)" onclick="if(window.knxToggleVoice){window.knxToggleVoice(event);}">
          <div class="knx-voice-bar-inner">
            <div class="knx-mic-circle" id="knx-mic-badge-trigger">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="knx-mic-svg">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
              </svg>
            </div>
            <div class="knx-voice-text">
              <div class="knx-voice-status" id="knx-jarvis-voice-status">VOCAL : PRÊT</div>
              <div class="knx-voice-sub" id="knx-ai-voice-status-sub">CLIQUEZ POUR PARLER</div>
            </div>
            <div class="knx-voice-wave">
              <span class="v-bar"></span>
              <span class="v-bar"></span>
              <span class="v-bar"></span>
              <span class="v-bar"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    
    // Rain animation intentionally removed for clean legibility

    bindActions();
    syncNavPosition();
    window.addEventListener('resize', syncNavPosition);
    initFamilyHubModal();
    fetchValues();
    triggerJarvisBootSequence();
    initJarvisNeuralOrb();
  }

  function syncNavPosition() {
    const nav = document.querySelector('.knx-nav-wrapper');
    if (!nav) return;
    if (nav.parentElement !== document.body) {
      document.body.appendChild(nav);
    }
    nav.style.top = '60px';
  }

  function bindActions() {
    // Helper to open Jeedom history modal
    function openHistoryModal(cmdId, title) {
      const cleanTitle = title || 'Historique';
      if (typeof jeeDialog !== 'undefined' && jeeDialog.dialog) {
        jeeDialog.dialog({
          id: 'md_cmdHistory',
          title: cleanTitle,
          contentUrl: 'index.php?v=d&modal=cmd.history&id=' + cmdId
        });
        // Remove ugly [Aucun][Compte Enedis]...
        let checks = 0;
        const timer = setInterval(() => {
          checks++;
          const titleEl = document.querySelector('.md_cmdHistory .jeeDialogTitle span.title');
          if (titleEl) {
            titleEl.textContent = cleanTitle;
          }
          if (checks > 25) clearInterval(timer);
        }, 120);
      } else {
        window.location.href = 'index.php?v=d&p=plan&plan_id=9';
      }
    }

    const linkyHistBtn = document.getElementById('knx-linky-hist-btn');
    if (linkyHistBtn) {
      linkyHistBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        window.location.href = 'index.php?v=d&p=plan&plan_id=9';
      });
    }

    const instantBox = document.getElementById('knx-linky-instant-box');
    if (instantBox) {
      instantBox.addEventListener('click', function(e) {
        e.stopPropagation();
        openHistoryModal(CMDS.LINKY_POWER_INSTANT, 'Puissance Instantanée Linky (kW)');
      });
    }

    const dayBox = document.getElementById('knx-linky-day-box');
    if (dayBox) {
      dayBox.addEventListener('click', function(e) {
        e.stopPropagation();
        openHistoryModal(CMDS.LINKY_CONSO_DAY, 'Consommation Quotidienne Linky (kWh)');
      });
    }

    const monthBox = document.getElementById('knx-linky-month-box');
    if (monthBox) {
      monthBox.addEventListener('click', function(e) {
        e.stopPropagation();
        openHistoryModal(CMDS.LINKY_CONSO_MONTH, 'Consommation Mensuelle Linky (kWh)');
      });
    }

    // Collapsible Card Toggles
    const linkyCard = document.getElementById('knx-linky-card');
    const linkyToggle = document.getElementById('knx-linky-toggle');
    if (linkyToggle && linkyCard) {
      if (localStorage.getItem('knx_linky_collapsed') === '1') {
        linkyCard.classList.add('collapsed');
      }
      linkyToggle.addEventListener('click', function(e) {
        linkyCard.classList.toggle('collapsed');
        localStorage.setItem('knx_linky_collapsed', linkyCard.classList.contains('collapsed') ? '1' : '0');
      });
    }

    const hudCard = document.getElementById('knx-hud-card');
    const hudToggle = document.getElementById('knx-weather-toggle');
    if (hudToggle && hudCard) {
      if (localStorage.getItem('knx_hud_collapsed') === '1') {
        hudCard.classList.add('collapsed');
      }
      hudToggle.addEventListener('click', function(e) {
        hudCard.classList.toggle('collapsed');
        localStorage.setItem('knx_hud_collapsed', hudCard.classList.contains('collapsed') ? '1' : '0');
      });
    }


    // J.A.R.V.I.S. Terminal Collapse Handler
    const termEl = document.getElementById('knx-jarvis-terminal');
    const termCollapseBtn = document.getElementById('knx-term-collapse-btn');
    function toggleTerminalCollapse() {
      if (!termEl) return;
      termEl.classList.toggle('collapsed');
      localStorage.setItem('knx_term_collapsed', termEl.classList.contains('collapsed') ? '1' : '0');
      if (window.playJarvisHaptic) window.playJarvisHaptic();
    }
    if (termCollapseBtn) termCollapseBtn.addEventListener('click', toggleTerminalCollapse);
    if (termEl && localStorage.getItem('knx_term_collapsed') === '1') {
      termEl.classList.add('collapsed');
    }

    // Live Military HUD Clock & Date in Terminal
    function updateJarvisClock() {
      const clockEl = document.getElementById('knx-jarvis-clock');
      const dateEl = document.getElementById('knx-jarvis-date');
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      if (clockEl) clockEl.textContent = `${h}:${m}:${s}`;

      if (dateEl) {
        const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
        const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
        dateEl.textContent = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;
      }
    }
    setInterval(updateJarvisClock, 1000);
    updateJarvisClock();

    // ==========================================================================
    // REAL J.A.R.V.I.S. VOICE RECOGNITION & COMMAND INTENT PARSER
    // Web Speech API (SpeechRecognition / webkitSpeechRecognition)
    // ==========================================================================
    let recognition = null;
    let isListening = false;

    function handleVoiceCommand(rawText) {
      const text = (rawText || '').toLowerCase().trim();
      console.log('[J.A.R.V.I.S. Voice Command Received]:', text);

      // 1. Volets roulants
      if (text.includes('ferme') && (text.includes('volet') || text.includes('store'))) {
        if (typeof jeedom !== 'undefined' && jeedom.cmd && CMDS.SHUTTERS_CLOSE) {
          CMDS.SHUTTERS_CLOSE.forEach(id => jeedom.cmd.execute({ id: id }));
        }
        speakJarvis("Fermeture de tous les volets roulants en cours, monsieur.");
        if (window.showToast) window.showToast("Volets : Fermeture générale demandée");
        return;
      }
      if ((text.includes('ouvre') || text.includes('ouvrir')) && (text.includes('volet') || text.includes('store'))) {
        if (typeof jeedom !== 'undefined' && jeedom.cmd && CMDS.SHUTTERS_OPEN) {
          CMDS.SHUTTERS_OPEN.forEach(id => jeedom.cmd.execute({ id: id }));
        }
        speakJarvis("Ouverture de tous les volets roulants demandée.");
        if (window.showToast) window.showToast("Volets : Ouverture générale demandée");
        return;
      }

      // 2. Lumières / Extinction
      if (text.includes('éteins tout') || text.includes('éteindre tout') || text.includes('tout éteindre') || text.includes('extinction') || text.includes('dodo') || text.includes('bonne nuit')) {
        if (typeof jeedom !== 'undefined' && jeedom.cmd && CMDS.ALL_OFF) {
          jeedom.cmd.execute({ id: CMDS.ALL_OFF });
        }
        speakJarvis("Extinction générale de la maison effectuée. Bonne nuit, monsieur.");
        if (window.showToast) window.showToast("Extinction générale envoyée");
        return;
      }
      if (text.includes('jour') && (text.includes('éteins') || text.includes('coupe') || text.includes('off'))) {
        if (typeof jeedom !== 'undefined' && jeedom.cmd && CMDS.JOUR_OFF) {
          jeedom.cmd.execute({ id: CMDS.JOUR_OFF });
        }
        speakJarvis("Extinction de la partie jour effectuée.");
        if (window.showToast) window.showToast("Partie Jour éteinte");
        return;
      }

      // 3. Portail Swip 500
      if (text.includes('portail')) {
        if (typeof jeedom !== 'undefined' && jeedom.cmd && CMDS.GATE_TOGGLE) {
          jeedom.cmd.execute({ id: CMDS.GATE_TOGGLE });
        }
        fetch('hub_api.php?action=toggle_gate').catch(() => {});
        speakJarvis("Ordre transmis au portail motorisé.");
        if (window.showToast) window.showToast("Portail actionné !");
        return;
      }

      // 4. Roborock S7 Pro Ultra
      if (text.includes('aspirateur') || text.includes('roborock') || text.includes('nettoie') || text.includes('robot')) {
        if (text.includes('base') || text.includes('arrête') || text.includes('retour') || text.includes('stop')) {
          if (typeof jeedom !== 'undefined' && jeedom.cmd && CMDS.ROBOROCK_RETURN_BASE) {
            jeedom.cmd.execute({ id: CMDS.ROBOROCK_RETURN_BASE });
          }
          speakJarvis("Retour à la base de charge pour le robot Roborock.");
          if (window.showToast) window.showToast("Roborock : Retour Base");
          return;
        } else {
          if (typeof jeedom !== 'undefined' && jeedom.cmd && CMDS.ROBOROCK_START) {
            jeedom.cmd.execute({ id: CMDS.ROBOROCK_START });
          }
          speakJarvis("Démarrage du nettoyage par le robot Roborock.");
          if (window.showToast) window.showToast("Roborock : Nettoyage démarré");
          return;
        }
      }

      // 5. Chauffage au sol
      if (text.includes('chauffage')) {
        const isHeating = state.heating === 1;
        const targetCmd = isHeating ? CMDS.HEAT_OFF : CMDS.HEAT_ON;
        if (typeof jeedom !== 'undefined' && jeedom.cmd && targetCmd) {
          jeedom.cmd.execute({ id: targetCmd });
        }
        state.heating = isHeating ? 0 : 1;
        updateHeatButtonUI(state.heating);
        speakJarvis(state.heating === 1 ? "Le chauffage au sol est désormais activé." : "Le chauffage au sol est désormais éteint.");
        return;
      }

      // 6. Météo & Climat
      if (text.includes('météo') || text.includes('température') || text.includes('quel temps') || text.includes('degrés')) {
        const temp = state.tempExt || '18';
        const hum = state.humidityExt || state.humidity || '76';
        const vent = state.wind || '10';
        speakJarvis("Il fait actuellement " + temp + " degrés dehors avec " + hum + " pourcent d'humidité et un vent de " + vent + " kilomètres par heure.");
        return;
      }

      // 7. Énergie & Puissance
      if (text.includes('énergie') || text.includes('puissance') || text.includes('conso') || text.includes('linky') || text.includes('watt')) {
        const kw = state.linkyInstant || '0.9';
        speakJarvis("La puissance instantanée soutirée est de " + kw + " kilowatts.");
        return;
      }

      // 8. Salutations / Identité
      if (text.includes('bonjour') || text.includes('jarvis') || text.includes('salut') || text.includes('qui es-tu') || text.includes('tu es là')) {
        speakJarvis("Bonjour monsieur. Tous les systèmes domotiques de la résidence sont en ligne et opérationnels.");
        return;
      }

      // 9. Traitement général
      speakJarvis("Ordre reçu : " + text + ". Exécution en cours, monsieur.");
    }

    

        window.testJarvisVoice = function(customPhrase) {
    const phrase = customPhrase || 'statut de la maison';
    const voiceStatus = document.getElementById('knx-jarvis-voice-status');
    const voiceSubStatus = document.getElementById('knx-ai-voice-status-sub');
    const voiceBar = document.getElementById('knx-voice-bar');
    const term = document.getElementById('knx-jarvis-terminal');
    if (window.playJarvisHaptic) window.playJarvisHaptic();
    if (term) term.classList.add('jarvis-listening');
    if (voiceBar) voiceBar.classList.add('is-listening');
    if (voiceStatus) {
      voiceStatus.textContent = '« ' + phrase.toUpperCase() + ' »';
      voiceStatus.style.color = '#00f0ff';
    }
    if (voiceSubStatus) {
      voiceSubStatus.textContent = 'TEST VOCAL EN COURS...';
      voiceSubStatus.style.color = '#00f0ff';
    }
    setTimeout(() => {
      if (term) term.classList.remove('jarvis-listening');
      if (voiceBar) voiceBar.classList.remove('is-listening');
      handleVoiceCommand(phrase);
    }, 1200);
  };

  window.knxToggleVoice = function(e) {
    if (e) {
      try { e.preventDefault(); e.stopPropagation(); } catch(err){}
    }
    toggleVoiceRecognition();
  };

  function toggleVoiceRecognition() {
    const voiceBar = document.getElementById('knx-voice-bar');
    const voiceStatus = document.getElementById('knx-jarvis-voice-status');
    const voiceSubStatus = document.getElementById('knx-ai-voice-status-sub');
    const term = document.getElementById('knx-jarvis-terminal');

    if (window.playJarvisHaptic) window.playJarvisHaptic();

    if (!isListening) {
      // Immediate visual feedback on click
      isListening = true;
      if (term) term.classList.add('jarvis-listening');
      if (voiceBar) voiceBar.classList.add('is-listening');
      if (voiceStatus) {
        voiceStatus.textContent = '🔴 ÉCOUTE EN COURS...';
        voiceStatus.style.color = '#ff3366';
      }
      if (voiceSubStatus) {
        voiceSubStatus.textContent = "PARLEZ... J'ÉCOUTE";
        voiceSubStatus.style.color = '#ff3366';
      }

      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        if (voiceStatus) {
          voiceStatus.textContent = '⚠️ MICRO NON SUPPORTÉ';
          voiceStatus.style.color = '#fbbf24';
        }
        if (voiceSubStatus) {
          voiceSubStatus.textContent = 'UTILISEZ CHROME OU EDGE';
        }
        setTimeout(() => {
          isListening = false;
          if (term) term.classList.remove('jarvis-listening');
          if (voiceBar) voiceBar.classList.remove('is-listening');
          if (voiceStatus) {
            voiceStatus.textContent = 'VOCAL : PRÊT';
            voiceStatus.style.color = '#00f0ff';
          }
          if (voiceSubStatus) {
            voiceSubStatus.textContent = 'CLIQUEZ POUR PARLER';
            voiceSubStatus.style.color = 'rgba(255,255,255,0.5)';
          }
        }, 3500);
        return;
      }

      try {
        if (!recognition) {
          recognition = new SpeechRec();
          recognition.lang = 'fr-FR';
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;

          recognition.onstart = function() {
            isListening = true;
            if (term) term.classList.add('jarvis-listening');
            if (voiceBar) voiceBar.classList.add('is-listening');
            if (voiceStatus) {
              voiceStatus.textContent = '🔴 ÉCOUTE EN COURS...';
              voiceStatus.style.color = '#ff3366';
            }
            if (voiceSubStatus) {
              voiceSubStatus.textContent = 'PARLEZ MAINTENANT';
              voiceSubStatus.style.color = '#ff3366';
            }
          };

          recognition.onresult = function(event) {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              transcript += event.results[i][0].transcript;
            }
            transcript = transcript.trim();
            if (voiceStatus && transcript) {
              voiceStatus.textContent = '« ' + transcript.toUpperCase() + ' »';
              voiceStatus.style.color = '#00f0ff';
            }
            if (event.results[event.results.length - 1].isFinal) {
              isListening = false;
              if (term) term.classList.remove('jarvis-listening');
              if (voiceBar) voiceBar.classList.remove('is-listening');
              handleVoiceCommand(transcript);
            }
          };

          recognition.onerror = function(event) {
            console.warn('[J.A.R.V.I.S.] Speech error:', event.error);
            isListening = false;
            if (term) term.classList.remove('jarvis-listening');
            if (voiceBar) voiceBar.classList.remove('is-listening');
            if (voiceStatus) {
              if (event.error === 'not-allowed') {
                voiceStatus.textContent = '⚠️ MICRO BLOQUÉ (AUTORISER)';
              } else if (event.error === 'no-speech') {
                voiceStatus.textContent = '⚠️ AUCUNE PAROLE ENTENDUE';
              } else {
                voiceStatus.textContent = '⚠️ ERREUR : ' + event.error.toUpperCase();
              }
              voiceStatus.style.color = '#fbbf24';
            }
            if (voiceSubStatus) {
              voiceSubStatus.textContent = 'CLIQUEZ POUR RÉESSAYER';
            }
            setTimeout(() => {
              if (!isListening && voiceStatus) {
                voiceStatus.textContent = 'VOCAL : PRÊT';
                voiceStatus.style.color = '#00f0ff';
                if (voiceSubStatus) voiceSubStatus.textContent = 'CLIQUEZ POUR PARLER';
              }
            }, 3000);
          };

          recognition.onend = function() {
            if (isListening) {
              isListening = false;
              if (term) term.classList.remove('jarvis-listening');
              if (voiceBar) voiceBar.classList.remove('is-listening');
            }
          };
        }

        recognition.start();
      } catch (err) {
        console.warn('[J.A.R.V.I.S.] Recognition trigger exception:', err);
      }
    } else {
      isListening = false;
      try { if (recognition) recognition.stop(); } catch(e){}
      if (term) term.classList.remove('jarvis-listening');
      if (voiceBar) voiceBar.classList.remove('is-listening');
      if (voiceStatus) {
        voiceStatus.textContent = 'VOCAL : PRÊT';
        voiceStatus.style.color = '#00f0ff';
      }
      if (voiceSubStatus) {
        voiceSubStatus.textContent = 'CLIQUEZ POUR PARLER';
      }
    }
  }

    const btnOff = document.getElementById('btn-all-off');
    if (btnOff) {
      btnOff.addEventListener('click', function() {
        if (typeof jeedom !== 'undefined' && jeedom.cmd) {
          jeedom.cmd.execute({ id: CMDS.ALL_OFF });
          showToast('Extinction générale de la maison envoyée');
        }
      });
    }

        // Lights JOUR OFF
    const btnJour = document.getElementById('btn-jour-off');
    if (btnJour) {
      btnJour.addEventListener('click', function() {
        if (typeof jeedom !== 'undefined' && jeedom.cmd) {
          jeedom.cmd.execute({ id: CMDS.JOUR_OFF });
          showToast('Extinction de la partie jour envoyée');
        }
      });
    }

    // Shutters OPEN (8 physical shutters)
    const btnShutterOpen = document.getElementById('btn-shutters-open');
    if (btnShutterOpen) {
      btnShutterOpen.addEventListener('click', function() {
        if (typeof jeedom !== 'undefined' && jeedom.cmd) {
          CMDS.SHUTTERS_OPEN.forEach((id) => jeedom.cmd.execute({ id: id }));
          showToast('Ouverture de tous les volets roulants demandée');
        }
      });
    }

    // Shutters CLOSE (8 physical shutters)
    const btnShutterClose = document.getElementById('btn-shutters-close');
    if (btnShutterClose) {
      btnShutterClose.addEventListener('click', function() {
        if (typeof jeedom !== 'undefined' && jeedom.cmd) {
          CMDS.SHUTTERS_CLOSE.forEach((id) => jeedom.cmd.execute({ id: id }));
          showToast('Fermeture de tous les volets roulants demandée');
        }
      });
    }

    // Gate Swip 500 Toggle (Direct Thomson Cloud & Jeedom Cmd)
    const btnGate = document.getElementById('btn-gate-toggle');
    if (btnGate) {
      btnGate.addEventListener('click', function() {
        if (typeof jeedom !== 'undefined' && jeedom.cmd) {
          jeedom.cmd.execute({ id: CMDS.GATE_TOGGLE });
        }
        fetch('hub_api.php?action=toggle_gate')
          .then(r => r.json())
          .then(res => {
            if (res && res.success) {
              showToast('Portail actionné !');
            } else if (res && res.error) {
              showToast(res.error);
            }
          })
          .catch(() => {});
      });
    }

    // Floor Heating Toggle (PAC Plancher Chauffant)
    const btnHeat = document.getElementById('btn-heat-sol');
    if (btnHeat) {
      btnHeat.addEventListener('click', function() {
        if (typeof jeedom !== 'undefined' && jeedom.cmd) {
          const targetCmd = state.heating === 1 ? CMDS.HEAT_OFF : CMDS.HEAT_ON;
          jeedom.cmd.execute({ id: targetCmd });
          state.heating = state.heating === 1 ? 0 : 1;
          updateHeatButtonUI(state.heating);
          showToast(state.heating === 1 ? 'Chauffage au sol activé' : 'Chauffage au sol éteint');
        }
      });
    }

    // Roborock S7 Pro Ultra Toggle (Démarrer / Retour Base)
    const btnVacuum = document.getElementById('btn-vacuum-toggle');
    if (btnVacuum) {
      btnVacuum.addEventListener('click', function() {
        if (typeof jeedom !== 'undefined' && jeedom.cmd) {
          const isCleaning = state.vacuumCleaning === 1;
          const targetCmd = isCleaning ? CMDS.ROBOROCK_RETURN_BASE : CMDS.ROBOROCK_START;
          jeedom.cmd.execute({ id: targetCmd });
          showToast(isCleaning ? 'Roborock : Retour à la base demandé' : 'Roborock : Démarrage du nettoyage');
        }
      });
    }
  }

  function updateVacuumButtonUI() {
    const btn = document.getElementById('btn-vacuum-toggle');
    const label = document.getElementById('knx-vacuum-btn-text');
    if (!btn || !label) return;

    const isCleaning = state.vacuumCleaning === 1;
    const batt = state.vacuumBattery !== null ? `${state.vacuumBattery}%` : '';

    if (isCleaning) {
      btn.classList.add('is-cleaning');
      label.textContent = batt ? `Robot Nettoyage (${batt})` : 'Robot Nettoyage';
      btn.title = `Roborock S7 Pro Ultra - En nettoyage (${state.vacuumState || ''}) - Cliquer pour renvoyer à la base`;
    } else {
      btn.classList.remove('is-cleaning');
      label.textContent = batt ? `Robot ${batt}` : 'Robot';
      btn.title = `Roborock S7 Pro Ultra - ${state.vacuumState || 'Prêt'} - Cliquer pour démarrer`;
    }
  }

  function updateHeatButtonUI(isOn) {
    const btn = document.getElementById('btn-heat-sol');
    if (!btn) return;
    if (isOn === 1) {
      btn.classList.add('is-heating');
      btn.title = 'Chauffage au sol actif (PAC en marche) - Cliquer pour éteindre';
    } else {
      btn.classList.remove('is-heating');
      btn.title = 'Chauffage au sol inactif - Cliquer pour activer';
    }
  }

  // ==========================================================================
  // J.A.R.V.I.S. TRUE SYNTHESIZER & ARRIVAL WELCOME ENGINE
  // Web Speech API + Web Audio API Stark Harmonic Chime
  // ==========================================================================
  function speakJarvis(phrase, onEnd) {
    if (!phrase) return;
    const voiceStatus = document.getElementById('knx-jarvis-voice-status');
    const termEl = document.getElementById('knx-jarvis-terminal');

    if (voiceStatus) {
      voiceStatus.textContent = '« ' + phrase.toUpperCase() + ' »';
      voiceStatus.style.color = '#00f0ff';
    }
    if (termEl) termEl.classList.add('jarvis-speaking');

    // 1. Play Stark chime immediately
    if (window.playJarvisChime) {
      window.playJarvisChime();
    }

    // 2. Web Speech API: MUST be invoked SYNCHRONOUSLY within the user gesture event loop
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utter = new SpeechSynthesisUtterance(phrase);
        utter.lang = 'fr-FR';
        utter.rate = 1.05;
        utter.pitch = 0.95;

        const voices = window.speechSynthesis.getVoices();
        const frVoice = voices.find(v => v.lang && v.lang.startsWith('fr') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Thomas') || v.name.includes('Henri') || v.name.includes('Paul') || v.localService));
        if (frVoice) utter.voice = frVoice;

        utter.onend = function() {
          if (voiceStatus) {
            voiceStatus.textContent = 'COMMANDE VOCALE : EN VEILLE';
            voiceStatus.style.color = '#38bdf8';
          }
          if (termEl) termEl.classList.remove('jarvis-speaking');
          if (typeof onEnd === 'function') onEnd();
        };

        utter.onerror = function(err) {
          console.warn('[J.A.R.V.I.S. Speech Error]', err);
          if (voiceStatus) {
            voiceStatus.textContent = 'COMMANDE VOCALE : PRÊT';
            voiceStatus.style.color = '#38bdf8';
          }
          if (termEl) termEl.classList.remove('jarvis-speaking');
          if (typeof onEnd === 'function') onEnd();
        };

        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn('[J.A.R.V.I.S. Speech Exception]', e);
        if (typeof onEnd === 'function') onEnd();
      }
    } else {
      setTimeout(() => {
        if (voiceStatus) {
          voiceStatus.textContent = 'COMMANDE VOCALE : PRÊT';
          voiceStatus.style.color = '#38bdf8';
        }
        if (termEl) termEl.classList.remove('jarvis-speaking');
        if (typeof onEnd === 'function') onEnd();
      }, 3500);
    }
  }
  window.speakJarvis = speakJarvis;

  // Arrival Welcome with 45s Delay (Time to park & walk through front door)
  let prevPresenceMaisonState = null;
  let welcomeTimer = null;
  let welcomeCountdownInterval = null;

  function checkArrivalWelcome() {
    const currentMaison = state.presenceMaison;
    const m = state.presenceMatthieu === 1;
    const f = state.presenceFanny === 1;

    const storedMaison = localStorage.getItem('knx_last_presence_maison');
    const lastWelcomeTs = parseInt(localStorage.getItem('knx_last_welcome_ts') || '0', 10);
    const now = Date.now();

    if (prevPresenceMaisonState === null) {
      prevPresenceMaisonState = storedMaison !== null ? parseInt(storedMaison, 10) : currentMaison;
    }

    // Transition: House was empty (0), and now someone arrived (1)!
    if (prevPresenceMaisonState === 0 && currentMaison === 1 && (now - lastWelcomeTs > 600000)) {
      localStorage.setItem('knx_last_welcome_ts', now.toString());

      let whoName = 'Matthieu';
      if (m && !f) whoName = 'Matthieu';
      else if (!m && f) whoName = 'Fanny';
      else if (m && f) whoName = 'Matthieu et Fanny';

      let countdown = 45;
      const statusEl = document.getElementById('knx-jarvis-voice-status');

      console.log('[J.A.R.V.I.S.] Arrival detected for ' + whoName + '! Starting 45s tempo...');
      if (statusEl) {
        statusEl.textContent = '« ARRIVÉE ' + whoName.toUpperCase() + ' // ACCUEIL DANS ' + countdown + 's »';
        statusEl.style.color = '#00f0ff';
      }

      if (welcomeCountdownInterval) clearInterval(welcomeCountdownInterval);
      welcomeCountdownInterval = setInterval(function() {
        countdown--;
        const el = document.getElementById('knx-jarvis-voice-status');
        if (el && countdown > 0) {
          el.textContent = '« ARRIVÉE ' + whoName.toUpperCase() + ' // ACCUEIL DANS ' + countdown + 's »';
        }
        if (countdown <= 0) {
          clearInterval(welcomeCountdownInterval);
          welcomeCountdownInterval = null;
        }
      }, 1000);

      if (welcomeTimer) clearTimeout(welcomeTimer);
      welcomeTimer = setTimeout(function() {
        const phrase = "Bonjour " + whoName + ", bienvenue à la maison. Systèmes activés.";
        speakJarvis(phrase);
      }, 45000);
    }

    prevPresenceMaisonState = currentMaison;
    localStorage.setItem('knx_last_presence_maison', currentMaison.toString());
  }

  function updatePresenceUI() {
    const elNames = document.getElementById('knx-presence-names');
    const elStatus = document.getElementById('knx-presence-status');
    const termFoyerVal = document.getElementById('knx-term-foyer-val');

    const m = state.presenceMatthieu === 1;
    const f = state.presenceFanny === 1;

    let text = 'Maison vide';
    let termText = 'MAISON VIDE';
    let color = '#94a3b8';
    let dotColor = '#94a3b8';

    if (m && f) {
      text = 'Matthieu & Fanny';
      termText = 'MATTHIEU & FANNY';
      color = '#4ade80';
      dotColor = '#4ade80';
    } else if (m) {
      text = 'Matthieu présent';
      termText = 'MATTHIEU PRÉSENT';
      color = '#38bdf8';
      dotColor = '#38bdf8';
    } else if (f) {
      text = 'Fanny présente';
      termText = 'FANNY PRÉSENTE';
      color = '#f472b6';
      dotColor = '#f472b6';
    }

    if (elNames) elNames.textContent = text;
    if (elStatus) {
      elStatus.style.color = color;
      const dot = elStatus.querySelector('span');
      if (dot) dot.style.background = dotColor;
    }
    if (termFoyerVal) termFoyerVal.textContent = termText;

    checkArrivalWelcome();
  }

  function showToast(msg) {
    let toast = document.getElementById('knx-hub-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'knx-hub-toast';
      toast.className = 'knx-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  function getVal(cmdId, callback) {
    if (typeof jeedom !== 'undefined' && jeedom.cmd && jeedom.cmd.execute) {
      jeedom.cmd.execute({
        id: cmdId,
        success: function(val) {
          callback(val);
        },
        error: function() {
          // ignore silent
        }
      });
    }
  }

  function fetchValues() {
    // Temperature Ext
    getVal(CMDS.TEMP_EXT, (v) => {
      const val = parseFloat(v);
      if (!isNaN(val)) {
        state.tempExt = val.toFixed(1);
        const el = document.getElementById('knx-temp-val');
        if (el) el.textContent = state.tempExt;
        const mini = document.getElementById('knx-weather-mini');
        if (mini) mini.textContent = `${state.tempExt}°C`;
      }
    });

    // Condition Text
    getVal(CMDS.CONDITION_TEXT, (v) => {
      if (v) {
        state.conditionText = String(v).trim();
        const el = document.getElementById('knx-cond-text');
        if (el) el.textContent = state.conditionText;
        const iconWrapper = document.getElementById('knx-icon-wrapper');
        if (iconWrapper) iconWrapper.innerHTML = getWeatherSvg(state.conditionNum, state.conditionText);
      }
    });

    // Min / Max Temp
    getVal(CMDS.TEMP_MIN, (v) => {
      const val = parseFloat(v);
      if (!isNaN(val)) {
        state.tempMin = val.toFixed(1);
        const el = document.getElementById('knx-min-val');
        if (el) el.textContent = state.tempMin + '°';
      }
    });
    getVal(CMDS.TEMP_MAX, (v) => {
      const val = parseFloat(v);
      if (!isNaN(val)) {
        state.tempMax = val.toFixed(1);
        const el = document.getElementById('knx-max-val');
        if (el) el.textContent = state.tempMax + '°';
      }
    });

    // Humidity
    getVal(CMDS.HUMIDITY_EXT, (v) => {
      const val = parseInt(v, 10);
      if (!isNaN(val)) {
        state.humidityExt = val;
        const el = document.getElementById('knx-hum-val');
        if (el) el.textContent = state.humidityExt;
      }
    });

    // Pressure
    getVal(CMDS.PRESSURE, (v) => {
      const val = parseInt(v, 10);
      if (!isNaN(val)) {
        state.pressure = val;
        const el = document.getElementById('knx-press-val');
        if (el) el.textContent = state.pressure;
      }
    });

    // Wind
    getVal(CMDS.WIND, (v) => {
      const val = parseFloat(v);
      if (!isNaN(val)) {
        state.wind = val.toFixed(1);
        const el = document.getElementById('knx-wind-val');
        if (el) el.textContent = state.wind;
      }
    });

    // Rain
    getVal(CMDS.RAIN_ACCUM, (v) => {
      const val = parseFloat(v);
      if (!isNaN(val)) {
        state.rainAccum = val.toFixed(1);
        const el = document.getElementById('knx-rain-val');
        if (el) el.textContent = state.rainAccum;
      }
    });

    // Sun times
    getVal(CMDS.SUNRISE, (v) => {
      if (v) {
        state.sunrise = formatSunTime(v);
        const el = document.getElementById('knx-sunrise-val');
        if (el) el.textContent = state.sunrise;
      }
    });
    getVal(CMDS.SUNSET, (v) => {
      if (v) {
        state.sunset = formatSunTime(v);
        const el = document.getElementById('knx-sunset-val');
        if (el) el.textContent = state.sunset;
      }
    });

    // Floor Heating State
    getVal(CMDS.HEAT_STATE, (v) => {
      state.heating = parseInt(v, 10) || 0;
      updateHeatButtonUI(state.heating);
    });

    // Linky Power Instant
    getVal(CMDS.LINKY_POWER_INSTANT, (v) => {
      const val = parseFloat(v);
      if (!isNaN(val)) {
        state.linkyInstant = val.toFixed(2);
        const el = document.getElementById('knx-linky-instant');
        if (el) el.textContent = state.linkyInstant;
        const mini = document.getElementById('knx-linky-mini');
        if (mini) mini.textContent = state.linkyInstant + ' kW';
        updateLinkyArcBar(val);
      }
    });

    getVal(CMDS.LINKY_CONSO_DAY, (v) => {
      const val = parseFloat(v);
      if (!isNaN(val)) {
        state.linkyDay = val.toFixed(1);
        const el = document.getElementById('knx-linky-day');
        if (el) el.textContent = state.linkyDay;
      }
    });

    getVal(CMDS.LINKY_CONSO_MONTH, (v) => {
      const val = parseFloat(v);
      if (!isNaN(val)) {
        state.linkyMonth = Math.round(val);
        const el = document.getElementById('knx-linky-month');
        if (el) el.textContent = state.linkyMonth;
      }
    });

    // Presence Foyer Live Telemetry
    getVal(CMDS.PRESENCE_MATTHIEU, (v) => {
      state.presenceMatthieu = parseInt(v, 10) || 0;
      updatePresenceUI();
    });
    getVal(CMDS.PRESENCE_FANNY, (v) => {
      state.presenceFanny = parseInt(v, 10) || 0;
      updatePresenceUI();
    });
    getVal(CMDS.PRESENCE_MAISON, (v) => {
      state.presenceMaison = parseInt(v, 10) || 0;
      updatePresenceUI();
    });

    // Roborock Vacuum Live Telemetry
    getVal(CMDS.ROBOROCK_IS_CLEANING, (v) => {
      state.vacuumCleaning = parseInt(v, 10) || 0;
      updateVacuumButtonUI();
    });
    getVal(CMDS.ROBOROCK_BATTERY, (v) => {
      const val = parseInt(v, 10);
      if (!isNaN(val)) state.vacuumBattery = val;
      updateVacuumButtonUI();
    });
    getVal(CMDS.ROBOROCK_STATE, (v) => {
      if (v) state.vacuumState = String(v).trim();
      updateVacuumButtonUI();
    });
  }

  // Hook Jeedom WebSocket / Comet push updates for true real-time reactive sync
  function hookComet() {
    if (typeof $('body') !== 'undefined' && $('body').on) {
      $('body').on('jeedom::cmd::update', function(_event, _options) {
        if (!_options || !_options.cmd_id) return;
        const cid = parseInt(_options.cmd_id, 10);
        const val = _options.value;

        if (cid === CMDS.TEMP_EXT) {
          const v = parseFloat(val);
          if (!isNaN(v)) {
            state.tempExt = v.toFixed(1);
            const el = document.getElementById('knx-temp-val');
            if (el) el.textContent = state.tempExt;
            const mini = document.getElementById('knx-weather-mini');
            if (mini) mini.textContent = `${state.tempExt}°C`;
          }
        } else if (cid === CMDS.HEAT_STATE) {
          state.heating = parseInt(val, 10) || 0;
          updateHeatButtonUI(state.heating);
        } else if (cid === CMDS.LINKY_POWER_INSTANT) {
          const v = parseFloat(val);
          if (!isNaN(v)) {
            state.linkyInstant = v.toFixed(2);
            const el = document.getElementById('knx-linky-instant');
            if (el) el.textContent = state.linkyInstant;
            const mini = document.getElementById('knx-linky-mini');
            if (mini) mini.textContent = state.linkyInstant + ' kW';
            updateLinkyArcBar(v);
          }
        } else if (cid === CMDS.LINKY_CONSO_DAY) {
          const v = parseFloat(val);
          if (!isNaN(v)) {
            state.linkyDay = v.toFixed(1);
            const el = document.getElementById('knx-linky-day');
            if (el) el.textContent = state.linkyDay;
          }
        } else if (cid === CMDS.PRESENCE_MATTHIEU) {
          state.presenceMatthieu = parseInt(val, 10) || 0;
          updatePresenceUI();
        } else if (cid === CMDS.PRESENCE_FANNY) {
          state.presenceFanny = parseInt(val, 10) || 0;
          updatePresenceUI();
        } else if (cid === CMDS.PRESENCE_MAISON) {
          state.presenceMaison = parseInt(val, 10) || 0;
          updatePresenceUI();
        } else if (cid === CMDS.ROBOROCK_IS_CLEANING) {
          state.vacuumCleaning = parseInt(val, 10) || 0;
          updateVacuumButtonUI();
        } else if (cid === CMDS.ROBOROCK_BATTERY) {
          const v = parseInt(val, 10);
          if (!isNaN(v)) state.vacuumBattery = v;
          updateVacuumButtonUI();
        } else if (cid === CMDS.ROBOROCK_STATE) {
          if (val) state.vacuumState = String(val).trim();
          updateVacuumButtonUI();
        }
      });
    }
  }


  // --------------------------------------------------------------------------
  // TABLET AUDIO ANNOUNCEMENTS (SPEECH SYNTHESIS)
  // Dedicated to living room wall tablet - Never wakes up kids in their rooms
  // --------------------------------------------------------------------------
  function speakTablet(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'fr-FR';
      utter.rate = 1.0;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('[Tablet Speech]', e);
    }
  }

  function checkTabletAnnouncements() {
    fetch('hub_api.php?action=get_announcements')
      .then(r => r.json())
      .then(data => {
        if (data && data.announcements && data.announcements.length > 0) {
          data.announcements.forEach(msg => {
            speakTablet(msg);
            showToast('📢 ' + msg);
          });
        }
      })
      .catch(() => {});
  }
  function startPolling() {
    setInterval(fetchValues, 30000);
    setInterval(checkTabletAnnouncements, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initHub();
      hookComet();
      startPolling();
    });
  } else {
    initHub();
    hookComet();
    startPolling();
  }

  /* ==========================================================================
     FAMILY PLANNING, GOOGLE CALENDAR, TO-DO LIST & VOICE MODULE
     ========================================================================== */
  function initFamilyHubModal() {
    if (document.getElementById('knx-family-hub-modal')) return;

    const overlay = document.createElement('div');
    overlay.className = 'knx-hub-modal-overlay';
    overlay.id = 'knx-family-hub-modal';

    const now = new Date();
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const dateStr = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;

    overlay.innerHTML = `
      <div class="knx-hub-modal knx-hub-modal-box">
        <!-- Header -->
        <div class="knx-hub-header">
          <div class="knx-hub-title-wrap">
            <div class="knx-hub-icon-badge" style="width:42px;height:42px;min-width:42px;max-width:42px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(168,85,247,0.18);border:1px solid rgba(168,85,247,0.35);color:#c084fc;flex-shrink:0;">
              <svg style="width:22px;height:22px;max-width:22px;max-height:22px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div>
              <h2 class="knx-hub-title">Planning &amp; Tâches du Foyer</h2>
              <p class="knx-hub-subtitle">${dateStr} &bull; Maison connectée Triors</p>
            </div>
          </div>
          <button type="button" class="knx-hub-close-btn" id="knx-hub-close-btn" title="Fermer (Échap)">&times;</button>
        </div>

        <!-- Body: Two-column grid -->
        <div class="knx-hub-body">
          <!-- Left Column: Google Agenda & Household Reminders -->
          <div class="knx-agenda-section">
            <div class="knx-section-heading" style="color: #c084fc;">
              <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Agenda Partagé</span>
            </div>

            <!-- Filter Pills -->
            <div class="knx-agenda-filter-bar">
              <span class="knx-agenda-pill active" data-who="all">🌐 Tous</span>
              <span class="knx-agenda-pill pill-fanny" data-who="Fanny">👩 Fanny</span>
              <span class="knx-agenda-pill pill-matthieu" data-who="Matthieu">👨 Matthieu</span>
              <div class="knx-agenda-actions">
                <button type="button" class="knx-agenda-config-btn" id="knx-cal-config-toggle" title="Configurer les liens Google Agenda">⚙️ iCal</button>
                <button type="button" class="knx-agenda-config-btn" id="knx-cal-refresh-btn" title="Actualiser les événements">🔄</button>
              </div>
            </div>

            <!-- Hidden iCal Config Panel -->
            <div class="knx-cal-config-panel" id="knx-cal-config-panel">
              <div class="knx-cal-config-row">
                <label class="knx-cal-config-label">👨 Lien iCal Google Matthieu :</label>
                <input type="text" class="knx-cal-config-input" id="knx-cal-url-matthieu" placeholder="https://calendar.google.com/calendar/ical/.../basic.ics">
              </div>
              <div class="knx-cal-config-row">
                <label class="knx-cal-config-label">👩 Lien iCal Google Fanny :</label>
                <input type="text" class="knx-cal-config-input" id="knx-cal-url-fanny" placeholder="https://calendar.google.com/calendar/ical/.../basic.ics">
              </div>
              <button type="button" class="knx-cal-save-btn" id="knx-cal-save-btn">Enregistrer &amp; Synchroniser</button>
            </div>

            <!-- Dynamic Events Container -->
            <div class="knx-agenda-events-list" id="knx-agenda-events-container">
              <div style="font-size:12px;color:#94a3b8;padding:8px 0;">Chargement des événements...</div>
            </div>

            <!-- Household Reminders (Compact 2x2 Grid) -->
            <div class="knx-section-heading" style="color: #94a3b8; margin-top: 10px;">
              <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span>Rappels du Foyer</span>
            </div>

            <div class="knx-reminders-grid">
              <div class="knx-reminder-card trash-yellow">
                <div class="knx-reminder-icon">🟡</div>
                <div class="knx-reminder-info">
                  <div class="knx-reminder-title">Bac Jaune (Tri)</div>
                  <div class="knx-reminder-desc">Mercredi soir</div>
                </div>
              </div>
              <div class="knx-reminder-card trash-grey">
                <div class="knx-reminder-icon">🗑️</div>
                <div class="knx-reminder-info">
                  <div class="knx-reminder-title">Bac Noir (Ordures)</div>
                  <div class="knx-reminder-desc">Lundi soir</div>
                </div>
              </div>
              <div class="knx-reminder-card sun">
                <div class="knx-reminder-icon">☀️</div>
                <div class="knx-reminder-info">
                  <div class="knx-reminder-title">Volets Solaires</div>
                  <div class="knx-reminder-desc">Auto lever / coucher</div>
                </div>
              </div>
              <div class="knx-reminder-card kids">
                <div class="knx-reminder-icon">🎒</div>
                <div class="knx-reminder-info">
                  <div class="knx-reminder-title">Théia &amp; Nolan</div>
                  <div class="knx-reminder-desc">08h30 - 16h30</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive To-Do List -->
          <div class="knx-todo-section">
            <div class="knx-section-heading" style="color: #38bdf8;">
              <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              <span>To-Do List &amp; Courses Partagées</span>
            </div>

            <!-- Filter Pills (Categories) -->
            <div class="knx-todo-filter-bar">
              <span class="knx-todo-pill active" data-cat="all">Toutes</span>
              <span class="knx-todo-pill" data-cat="Maison">🏠 Maison</span>
              <span class="knx-todo-pill" data-cat="Courses">🛒 Courses</span>
              <span class="knx-todo-pill" data-cat="Entretien">🔧 Entretien</span>
              <span class="knx-todo-pill" data-cat="Urgent">⚡ Urgent</span>
            </div>

            <!-- Filter Pills (Assignee) -->
            <div class="knx-todo-filter-bar" style="margin-top:-6px; margin-bottom: 2px;">
              <span class="knx-todo-who-pill active" data-who="all">Tous</span>
              <span class="knx-todo-who-pill pill-matthieu" data-who="Matthieu">👨 Matthieu</span>
              <span class="knx-todo-who-pill pill-fanny" data-who="Fanny">👩 Fanny</span>
            </div>

            <!-- Input Bar -->
            <div class="knx-todo-bar">
              <div class="knx-todo-input-row">
                <input type="text" class="knx-todo-input" id="knx-todo-new-text" placeholder="Ajouter une tâche ou course...">
                <button type="button" class="knx-voice-btn" id="knx-voice-btn" title="Dicter à la voix (Micro tablette)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <button type="button" class="knx-todo-add-btn" id="knx-todo-add-btn">+ Ajouter</button>
              </div>
              <div class="knx-todo-options-row" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span style="font-size:11px;color:#94a3b8;">Pour :</span>
                <select class="knx-todo-cat-select" id="knx-todo-new-cat">
                  <option value="Maison">🏠 Maison</option>
                  <option value="Courses">🛒 Courses</option>
                  <option value="Entretien">🔧 Entretien</option>
                  <option value="Urgent">⚡ Urgent</option>
                </select>
                <select class="knx-todo-cat-select" id="knx-todo-new-who">
                  <option value="Tous">👥 Pour Tous</option>
                  <option value="Matthieu">👨 Matthieu</option>
                  <option value="Fanny">👩 Fanny</option>
                </select>
                <span style="font-size:11px;color:#94a3b8;margin-left:auto;">Par :</span>
                <select class="knx-todo-cat-select" id="knx-todo-author-select" title="Qui crée la tâche">
                  <option value="Matthieu">👨 Matthieu</option>
                  <option value="Fanny">👩 Fanny</option>
                </select>
              </div>
            </div>

            <!-- Task Items Container -->
            <div class="knx-todo-list" id="knx-todo-items-container">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="knx-hub-footer">
          <div class="knx-todo-stats" id="knx-todo-stats">Chargement des tâches...</div>
          <button type="button" class="knx-telegram-push-btn" id="knx-telegram-push-btn" title="Envoyer la to-do list sur Telegram">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.63 3.73-.53.36-1.02.54-1.45.53-.48-.01-1.4-.27-2.09-.49-.84-.27-1.51-.42-1.45-.88.03-.24.38-.49 1.04-.75 4.09-1.78 6.82-2.95 8.19-3.52 3.9-1.63 4.71-1.91 5.24-1.92.12 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.21-.05.47z"/></svg>
            <span>Envoyer sur Telegram</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close handlers
    document.getElementById('knx-hub-close-btn').addEventListener('click', closeFamilyHub);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeFamilyHub();
    });

    // Author selection persistence
    const authorSel = document.getElementById('knx-todo-author-select');
    if (authorSel) {
      const savedAuthor = localStorage.getItem('knx_current_author') || 'Matthieu';
      authorSel.value = savedAuthor;
      authorSel.addEventListener('change', function() {
        localStorage.setItem('knx_current_author', this.value);
      });
    }

    // Category Filter Pills
    overlay.querySelectorAll('.knx-todo-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        overlay.querySelectorAll('.knx-todo-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        currentTodoCatFilter = this.getAttribute('data-cat') || 'all';
        const catSel = document.getElementById('knx-todo-new-cat');
        if (catSel && currentTodoCatFilter !== 'all') catSel.value = currentTodoCatFilter;
        renderFamilyTasks();
      });
    });

    // Assignee Filter Pills
    overlay.querySelectorAll('.knx-todo-who-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        overlay.querySelectorAll('.knx-todo-who-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        currentTodoWhoFilter = this.getAttribute('data-who') || 'all';
        const whoSel = document.getElementById('knx-todo-new-who');
        if (whoSel && currentTodoWhoFilter !== 'all') whoSel.value = currentTodoWhoFilter;
        renderFamilyTasks();
      });
    });

    document.getElementById('knx-todo-add-btn').addEventListener('click', handleAddTask);
    document.getElementById('knx-todo-new-text').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleAddTask();
    });

    document.getElementById('knx-telegram-push-btn').addEventListener('click', sendTelegramTasks);

    // Agenda Filter Pills
    overlay.querySelectorAll('.knx-agenda-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        overlay.querySelectorAll('.knx-agenda-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        currentCalFilter = this.getAttribute('data-who') || 'all';
        fetchCalendarEvents();
      });
    });

    // Toggle config iCal
    const configPanel = document.getElementById('knx-cal-config-panel');
    document.getElementById('knx-cal-config-toggle').addEventListener('click', function() {
      configPanel.classList.toggle('open');
      if (configPanel.classList.contains('open')) {
        loadCalendarConfig();
      }
    });

    // Refresh btn
    document.getElementById('knx-cal-refresh-btn').addEventListener('click', function() {
      fetchCalendarEvents(true);
      showToast('Actualisation de l\'agenda...');
    });

    // Save config btn
    document.getElementById('knx-cal-save-btn').addEventListener('click', saveCalendarConfig);

    initVoiceRecognition();

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeFamilyHub();
      }
    });

    fetchFamilyTasks();
    fetchCalendarEvents();
  }

  function openFamilyHub() {
    const modal = document.getElementById('knx-family-hub-modal');
    if (modal) {
      modal.classList.add('open');
      fetchFamilyTasks();
      fetchCalendarEvents();
    }
  }

  function closeFamilyHub() {
    const modal = document.getElementById('knx-family-hub-modal');
    if (modal) modal.classList.remove('open');
  }

  window.openFamilyHub = openFamilyHub;
  window.closeFamilyHub = closeFamilyHub;

  // --------------------------------------------------------------------------
  // GOOGLE CALENDAR FUNCTIONS
  // --------------------------------------------------------------------------
  function fetchCalendarEvents(refresh = false) {
    const container = document.getElementById('knx-agenda-events-container');
    if (!container) return;

    const url = 'hub_api.php?action=get_calendar' + (refresh ? '&refresh=1' : '');
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data && data.events) {
          calendarEvents = data.events;
          renderCalendarEvents();
        }
      })
      .catch(err => {
        console.warn('[Calendar API error]', err);
        container.innerHTML = '<div style="font-size:12px;color:#f87171;padding:8px 0;">Erreur de synchronisation Google Agenda.</div>';
      });
  }

  function renderCalendarEvents() {
    const container = document.getElementById('knx-agenda-events-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = calendarEvents.filter(ev => {
      if (currentCalFilter === 'all') return true;
      return (ev.who || '').toLowerCase() === currentCalFilter.toLowerCase() || (ev.who === 'Foyer');
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="font-size:12px;color:#94a3b8;padding:16px 0;text-align:center;">Aucun événement prévu.</div>';
      return;
    }

    filtered.slice(0, 15).forEach(ev => {
      const card = document.createElement('div');
      card.className = 'knx-agenda-card';

      let day = '??';
      let month = '???';
      if (ev.start && ev.start.formatted_date) {
        const parts = ev.start.formatted_date.split('-');
        if (parts.length === 3) {
          day = parts[2];
          const mIdx = parseInt(parts[1], 10) - 1;
          const shortMonths = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEP', 'OCT', 'NOV', 'DÉC'];
          month = shortMonths[mIdx] || parts[1];
        }
      }

      const who = ev.who || 'Foyer';
      let timeStr = 'Journée entière';
      if (ev.start && !ev.start.is_all_day && ev.start.formatted_time) {
        timeStr = ev.start.formatted_time;
        if (ev.end && !ev.end.is_all_day && ev.end.formatted_time && ev.end.formatted_time !== ev.start.formatted_time) {
          let durStr = '';
          if (ev.start.timestamp && ev.end.timestamp && ev.end.timestamp > ev.start.timestamp) {
            const diffMins = Math.round((ev.end.timestamp - ev.start.timestamp) / 60);
            if (diffMins > 0) {
              if (diffMins < 60) {
                durStr = ` (${diffMins} min)`;
              } else {
                const hrs = Math.floor(diffMins / 60);
                const rem = diffMins % 60;
                durStr = rem > 0 ? ` (${hrs}h${rem.toString().padStart(2, '0')})` : ` (${hrs}h)`;
              }
            }
          }
          timeStr = `${ev.start.formatted_time} - ${ev.end.formatted_time}${durStr}`;
        }
      }
      const locStr = ev.location ? ` &bull; 📍 ${escapeHtml(ev.location)}` : '';

      card.innerHTML = `
        <div class="knx-agenda-date-badge">
          <span class="knx-agenda-date-day">${day}</span>
          <span class="knx-agenda-date-month">${month}</span>
        </div>
        <div class="knx-agenda-info">
          <div class="knx-agenda-event-title" title="${escapeHtml(ev.summary)}">${escapeHtml(ev.summary)}</div>
          <div class="knx-agenda-event-meta">
            <span class="knx-who-badge ${who}">${who}</span>
            <span class="knx-agenda-event-details" title="${timeStr}${locStr}">🕒 ${timeStr}${locStr}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function loadCalendarConfig() {
    fetch('hub_api.php?action=get_calendar_urls')
      .then(r => r.json())
      .then(data => {
        if (data && data.urls) {
          const m = document.getElementById('knx-cal-url-matthieu');
          const f = document.getElementById('knx-cal-url-fanny');
          if (m && data.urls.matthieu) m.value = data.urls.matthieu;
          if (f && data.urls.fanny) f.value = data.urls.fanny;
        }
      })
      .catch(err => console.warn('[Calendar config load error]', err));
  }

  function saveCalendarConfig() {
    const m = document.getElementById('knx-cal-url-matthieu');
    const f = document.getElementById('knx-cal-url-fanny');
    const btn = document.getElementById('knx-cal-save-btn');

    const urls = {
      matthieu: m ? m.value.trim() : '',
      fanny: f ? f.value.trim() : ''
    };

    if (btn) btn.textContent = 'Enregistrement...';

    fetch('hub_api.php?action=save_calendar_urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: urls })
    })
      .then(r => r.json())
      .then(data => {
        if (btn) btn.textContent = '✓ Enregistré !';
        showToast('Liens Google Agenda sauvegardés !');
        setTimeout(() => {
          if (btn) btn.textContent = 'Enregistrer & Synchroniser';
          document.getElementById('knx-cal-config-panel').classList.remove('open');
          fetchCalendarEvents(true);
        }, 1200);
      })
      .catch(err => {
        if (btn) btn.textContent = 'Erreur';
        showToast('Erreur lors de la sauvegarde');
      });
  }

  // --------------------------------------------------------------------------
  // VOICE RECOGNITION (WEB SPEECH API)
  // --------------------------------------------------------------------------
  function initVoiceRecognition() {
    const voiceBtn = document.getElementById('knx-voice-btn');
    const input = document.getElementById('knx-todo-new-text');
    if (!voiceBtn || !input) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      voiceBtn.title = 'Micro non supporté par ce navigateur';
      voiceBtn.style.opacity = '0.5';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    let isListening = false;

    voiceBtn.addEventListener('click', function() {
      if (isListening) {
        recognition.stop();
        return;
      }
      try {
        recognition.start();
      } catch (e) {
        console.warn('[Voice Recognition]', e);
      }
    });

    recognition.onstart = function() {
      isListening = true;
      voiceBtn.classList.add('listening');
      input.placeholder = '🎙️ Parlez maintenant...';
      showToast('Micro actif : dictez votre tâche');
    };

    recognition.onresult = function(event) {
      if (event.results && event.results[0] && event.results[0][0]) {
        const text = event.results[0][0].transcript;
        input.value = text;
        input.focus();
        showToast(`Dicté : "${text}"`);
      }
    };

    recognition.onerror = function(event) {
      console.warn('[Voice error]', event.error);
      isListening = false;
      voiceBtn.classList.remove('listening');
      input.placeholder = 'Ajouter une tâche ou course...';
    };

    recognition.onend = function() {
      isListening = false;
      voiceBtn.classList.remove('listening');
      input.placeholder = 'Ajouter une tâche ou course...';
    };
  }

  // --------------------------------------------------------------------------
  // TO-DO LIST FUNCTIONS & INLINE EDITING
  // --------------------------------------------------------------------------
  function fetchFamilyTasks() {
    fetch('hub_api.php?action=get_todo')
      .then(r => r.json())
      .then(data => {
        if (data && data.tasks) {
          familyTasks = data.tasks;
          renderFamilyTasks();
        }
      })
      .catch(err => console.warn('[Hub API error]', err));
  }

  let currentTodoCatFilter = 'all';
  let currentTodoWhoFilter = 'all';

  function renderFamilyTasks() {
    const container = document.getElementById('knx-todo-items-container');
    if (!container) return;

    container.innerHTML = '';
    let pendingCount = 0;
    let doneCount = 0;

    familyTasks.forEach(t => {
      if (t.done) doneCount++;
      else pendingCount++;
    });

    const filteredTasks = familyTasks.filter(task => {
      const catMatch = (currentTodoCatFilter === 'all' || task.category === currentTodoCatFilter);
      const whoMatch = (currentTodoWhoFilter === 'all' || task.who === currentTodoWhoFilter || (currentTodoWhoFilter !== 'all' && task.who === 'Tous'));
      return catMatch && whoMatch;
    });

    if (filteredTasks.length === 0) {
      container.innerHTML = '<div style="font-size:12px;color:#94a3b8;padding:24px 0;text-align:center;">Aucune tâche dans cette sélection.</div>';
    }

    filteredTasks.forEach(task => {
      const item = document.createElement('div');
      item.className = 'knx-todo-item' + (task.done ? ' done' : '');
      const cat = task.category || 'Maison';
      const who = task.who || 'Tous';

      // Inline edit mode for this task
      if (editingTaskId === task.id) {
        item.innerHTML = `
          <div class="knx-todo-checkbox" data-id="${task.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span class="knx-todo-tag ${cat}">${cat}</span>
          <div class="knx-todo-edit-wrap">
            <input type="text" class="knx-todo-edit-input" id="knx-edit-input-${task.id}" value="${escapeHtml(task.text)}">
            <select class="knx-todo-edit-select" id="knx-edit-cat-${task.id}">
              <option value="Maison" ${cat === 'Maison' ? 'selected' : ''}>🏠 Maison</option>
              <option value="Courses" ${cat === 'Courses' ? 'selected' : ''}>🛒 Courses</option>
              <option value="Entretien" ${cat === 'Entretien' ? 'selected' : ''}>🔧 Entretien</option>
              <option value="Urgent" ${cat === 'Urgent' ? 'selected' : ''}>⚡ Urgent</option>
            </select>
            <select class="knx-todo-edit-select" id="knx-edit-who-${task.id}">
              <option value="Tous" ${who === 'Tous' ? 'selected' : ''}>👥 Tous</option>
              <option value="Matthieu" ${who === 'Matthieu' ? 'selected' : ''}>👨 Matthieu</option>
              <option value="Fanny" ${who === 'Fanny' ? 'selected' : ''}>👩 Fanny</option>
            </select>
            <button type="button" class="knx-todo-edit-save" data-id="${task.id}">✓</button>
            <button type="button" class="knx-todo-edit-cancel" data-id="${task.id}">&times;</button>
          </div>
        `;
      } else {
        const whoBadge = (who && who !== 'Tous') ? `<span class="knx-todo-who ${who}">${who}</span>` : '';
        item.innerHTML = `
          <div class="knx-todo-checkbox" data-id="${task.id}" title="Marquer comme fait / à faire">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span class="knx-todo-tag ${cat}">${cat}</span>
          ${whoBadge}
          <span class="knx-todo-text" title="${escapeHtml(task.text)}">${escapeHtml(task.text)}</span>
          <div class="knx-todo-actions">
            <button type="button" class="knx-todo-action-btn edit" data-id="${task.id}" title="Modifier">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button type="button" class="knx-todo-action-btn delete" data-id="${task.id}" title="Supprimer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        `;
      }

      container.appendChild(item);
    });

    // Bind event handlers on task items
    container.querySelectorAll('.knx-todo-checkbox').forEach(cb => {
      cb.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.getAttribute('data-id');
        toggleFamilyTask(id);
      });
    });

    container.querySelectorAll('.knx-todo-action-btn.delete').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.getAttribute('data-id');
        deleteFamilyTask(id);
      });
    });

    container.querySelectorAll('.knx-todo-action-btn.edit').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        editingTaskId = parseInt(this.getAttribute('data-id'), 10) || this.getAttribute('data-id');
        renderFamilyTasks();
      });
    });

    container.querySelectorAll('.knx-todo-edit-save').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.getAttribute('data-id');
        const textInput = document.getElementById(`knx-edit-input-${id}`);
        const catSelect = document.getElementById(`knx-edit-cat-${id}`);
        const whoSelect = document.getElementById(`knx-edit-who-${id}`);
        if (!textInput || !textInput.value.trim()) return;

        const newText = textInput.value.trim();
        const newCat = catSelect ? catSelect.value : 'Maison';
        const newWho = whoSelect ? whoSelect.value : 'Tous';

        const task = familyTasks.find(t => t.id == id);
        if (task) {
          task.text = newText;
          task.category = newCat;
          task.who = newWho;
          editingTaskId = null;
          renderFamilyTasks();

          const author = localStorage.getItem('knx_current_author') || 'Matthieu';
          fetch('hub_api.php?action=edit_todo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, text: newText, category: newCat, who: newWho, author: author })
          })
          .then(r => r.json())
          .then(data => showToast('Tâche mise à jour !'))
          .catch(err => console.warn('[Edit task error]', err));
        }
      });
    });

    container.querySelectorAll('.knx-todo-edit-cancel').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        editingTaskId = null;
        renderFamilyTasks();
      });
    });

    // Update footer stats
    const statsEl = document.getElementById('knx-todo-stats');
    if (statsEl) {
      statsEl.innerHTML = `${pendingCount} tâche${pendingCount > 1 ? 's' : ''} à faire &bull; ${doneCount} terminée${doneCount > 1 ? 's' : ''}`;
    }

    // Update navigation badge if present
    const navBadge = document.getElementById('knx-nav-todo-badge');
    if (navBadge) {
      if (pendingCount > 0) {
        navBadge.textContent = pendingCount;
        navBadge.style.display = 'inline-flex';
      } else {
        navBadge.style.display = 'none';
      }
    }
  }

  function handleAddTask() {
    const input = document.getElementById('knx-todo-new-text');
    const catSelect = document.getElementById('knx-todo-new-cat');
    const whoSelect = document.getElementById('knx-todo-new-who');
    const authorSelect = document.getElementById('knx-todo-author-select');

    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    const cat = catSelect ? catSelect.value : 'Maison';
    const who = whoSelect ? whoSelect.value : 'Tous';
    const author = authorSelect ? authorSelect.value : (localStorage.getItem('knx_current_author') || 'Matthieu');

    input.value = '';

    fetch('hub_api.php?action=add_todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, category: cat, who: who, author: author })
    })
      .then(r => r.json())
      .then(data => {
        if (data && data.task) {
          familyTasks.unshift(data.task);
          renderFamilyTasks();
          showToast(`Tâche ajoutée pour ${who} !`);
        }
      })
      .catch(err => console.warn('[Add task error]', err));
  }

  function toggleFamilyTask(id) {
    const task = familyTasks.find(t => t.id == id);
    if (!task) return;
    task.done = !task.done;
    renderFamilyTasks();

    const author = localStorage.getItem('knx_current_author') || 'Matthieu';
    fetch('hub_api.php?action=edit_todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, done: task.done, author: author })
    })
      .then(r => r.json())
      .then(data => {
        if (task.done) showToast('Tâche marquée comme terminée !');
      })
      .catch(err => console.warn('[Toggle task error]', err));
  }

  function deleteFamilyTask(id) {
    familyTasks = familyTasks.filter(t => t.id != id);
    renderFamilyTasks();

    fetch('hub_api.php?action=delete_todo&id=' + encodeURIComponent(id))
      .then(r => r.json())
      .then(data => showToast('Tâche supprimée'))
      .catch(err => console.warn('[Delete task error]', err));
  }

  function sendTelegramTasks() {
    const btn = document.getElementById('knx-telegram-push-btn');
    if (btn) btn.classList.add('loading');

    fetch('hub_api.php?action=send_telegram')
      .then(r => r.json())
      .then(data => {
        if (btn) btn.classList.remove('loading');
        if (data && data.status === 'ok') {
          showToast(`✓ To-do list envoyée à ${data.sent_to || 'Telegram'} !`);
        } else {
          showToast('Erreur : ' + (data.message || 'Échec d\'envoi'));
        }
      })
      .catch(err => {
        if (btn) btn.classList.remove('loading');
        showToast('Erreur lors de l\'envoi Telegram');
      });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     VOLETS ROULANTS 3D HOUSE PLAN OVERLAY & SLIDERS (0-100%)
     Keeps the 3D floor plan 100% visible with pins on all 8 windows/doors!
     ========================================================================== */
  const SHUTTER_COORDS = {
    'chambre_theia':     { x: 71, y: 14, label: 'Ch. Théia' },
    'chambre_nolan':     { x: 76, y: 43, label: 'Ch. Nolan' },
    'chambre_parent':    { x: 52, y: 38, label: 'Ch. Parent' },
    'salon_grande_baie': { x: 44, y: 62, label: 'Gde Baie Salon' },
    'salon_petite_baie': { x: 44, y: 86, label: 'Pte Baie Salon' },
    'cuisine_baie':      { x: 58, y: 63, label: 'Baie Cuisine' },
    'cuisine_fenetre':   { x: 72, y: 68, label: 'Fen. Cuisine' },
    'bureau':            { x: 76, y: 92, label: 'Bureau' }
  };

  let activeShutterPinId = null;
  let voletsCurrentView = 'plan'; // 'plan' or 'grid'

  window.openVoletsHub = function() {
    window.location.href = 'index.php?v=d&p=plan&plan_id=11';
  };

})();
