/**
 * AAYUSH BHATTA (@aayushifty) — CLIENT ENGINE
 * 3D Origami Page-Fold & Fly-Off Transition, Screen Shifting,
 * Web Audio Synthesizer, Three.js Atmosphere, Lightbox & Certificate Inspection.
 */

// ==========================================================================
// 1. WEB AUDIO SYNTHESIZER (Pure Code Synthesis)
// ==========================================================================
class CyberSoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientGain = null;
    this.isMuted = true;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio not supported", e);
    }
  }

  toggleAmbient() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isMuted) {
      this.startAmbient();
      this.isMuted = false;
      this.playChime(587.33); // D5 chime
      return true;
    } else {
      this.stopAmbient();
      this.isMuted = true;
      return false;
    }
  }

  startAmbient() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, now);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.035, now + 2.5);

    this.ambientOsc1 = this.ctx.createOscillator();
    this.ambientOsc1.type = 'sine';
    this.ambientOsc1.frequency.setValueAtTime(55, now);

    this.ambientOsc2 = this.ctx.createOscillator();
    this.ambientOsc2.type = 'triangle';
    this.ambientOsc2.frequency.setValueAtTime(110, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    this.ambientOsc1.connect(filter);
    this.ambientOsc2.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);

    this.ambientOsc1.start();
    this.ambientOsc2.start();
  }

  stopAmbient() {
    if (!this.ambientGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    setTimeout(() => {
      try {
        if (this.ambientOsc1) { this.ambientOsc1.stop(); this.ambientOsc1.disconnect(); }
        if (this.ambientOsc2) { this.ambientOsc2.stop(); this.ambientOsc2.disconnect(); }
      } catch (e) {}
    }, 800);
  }

  playTick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.03);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  playChime(freq = 523.25) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  // Authentic paper crease rustle sound
  playPaperFold() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.16);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2600, now);
      filter.Q.setValueAtTime(2.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.16);
    } catch (e) {}
  }

  // Aerodynamic wind whoosh for paper plane flight
  playWhoosh() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.65);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(1900, now + 0.3);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.65);
      filter.Q.setValueAtTime(3.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.65);
    } catch (e) {}
  }

  // 3D Cube Rotation sound: deep spatial sweep
  playCubeRotate() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.45);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.45);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  // Spatial Warp Zoom sound: futuristic ascending laser warp sweep
  playWarpZoom() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.4);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  // Tactile Page Peel rustle
  playPeelSound() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.22);
    } catch (e) {}
  }

  // Touchdown impact sound on landing arrival
  playTouchdown() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.35);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }
}

const Sound = new CyberSoundEngine();

// ==========================================================================
// 2. DYNAMIC 3D PAGE TRANSITION ENGINE (5 Creative Rotating Styles)
// ==========================================================================
// 2. DYNAMIC TAKE-OFF & LANDING TRANSITION ENGINE
// ==========================================================================
const CRAFTS = {
  aeroplane: {
    takeoff: `
      <svg viewBox="0 0 140 140" style="width: 130px; height: 130px; filter: drop-shadow(0 0 25px rgba(0,240,255,0.8));">
        <polygon points="70,10 130,115 70,95 10,115" fill="rgba(0, 240, 255, 0.95)" stroke="#ffffff" stroke-width="2" />
        <polygon points="70,10 70,95 10,115" fill="rgba(0, 180, 220, 0.75)" />
        <polygon points="70,10 130,115 70,95" fill="rgba(255, 255, 255, 0.9)" />
        <line x1="70" y1="10" x2="70" y2="95" stroke="#00f0ff" stroke-width="2" />
      </svg>
    `,
    landing: `
      <svg viewBox="0 0 160 120" style="width: 145px; height: 110px; filter: drop-shadow(0 0 30px rgba(168,85,247,0.85));">
        <polygon points="80,15 150,95 80,78 10,95" fill="rgba(168, 85, 247, 0.95)" stroke="#ffffff" stroke-width="2" />
        <polygon points="80,15 80,78 10,95" fill="rgba(130, 50, 210, 0.75)" />
        <polygon points="80,15 150,95 80,78" fill="rgba(255, 255, 255, 0.9)" />
        <circle cx="20" cy="95" r="5" fill="#00f0ff" />
        <circle cx="140" cy="95" r="5" fill="#00f0ff" />
        <circle cx="80" cy="80" r="4" fill="#ffffff" />
      </svg>
    `
  },
  cube: {
    takeoff: `
      <svg viewBox="0 0 140 140" style="width: 130px; height: 130px; filter: drop-shadow(0 0 25px rgba(0,240,255,0.7));">
        <polygon points="70,20 120,48 70,76 20,48" fill="rgba(0,240,255,0.4)" stroke="#00f0ff" stroke-width="2" />
        <polygon points="20,48 70,76 70,125 20,97" fill="rgba(0,180,220,0.6)" stroke="#00f0ff" stroke-width="2" />
        <polygon points="120,48 70,76 70,125 120,97" fill="rgba(0,240,255,0.7)" stroke="#00f0ff" stroke-width="2" />
      </svg>
    `,
    landing: `
      <svg viewBox="0 0 160 160" style="width: 140px; height: 140px; filter: drop-shadow(0 0 30px rgba(168,85,247,0.8));">
        <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(168,85,247,0.6)" stroke-width="2" stroke-dasharray="8 6" />
        <polygon points="80,30 125,56 80,82 35,56" fill="rgba(168,85,247,0.5)" stroke="#ffffff" stroke-width="2" />
        <polygon points="35,56 80,82 80,130 35,104" fill="rgba(120,40,200,0.7)" stroke="#ffffff" stroke-width="2" />
        <polygon points="125,56 80,82 80,130 125,104" fill="rgba(200,120,255,0.8)" stroke="#ffffff" stroke-width="2" />
      </svg>
    `
  },
  origami: {
    takeoff: `
      <svg viewBox="0 0 140 140" style="width: 130px; height: 130px; filter: drop-shadow(0 0 25px rgba(255,0,220,0.75));">
        <polygon points="70,15 88,52 125,70 88,88 70,125 52,88 15,70 52,52" fill="rgba(255,0,220,0.85)" stroke="#ffffff" stroke-width="2" />
      </svg>
    `,
    landing: `
      <svg viewBox="0 0 160 160" style="width: 145px; height: 145px; filter: drop-shadow(0 0 30px rgba(0,240,255,0.9));">
        <ellipse cx="80" cy="80" rx="22" ry="55" fill="rgba(0,240,255,0.6)" stroke="#ffffff" stroke-width="1.5" />
        <ellipse cx="80" cy="80" rx="55" ry="22" fill="rgba(168,85,247,0.6)" stroke="#ffffff" stroke-width="1.5" />
        <circle cx="80" cy="80" r="14" fill="#ffffff" />
      </svg>
    `
  },
  warp: {
    takeoff: `
      <svg viewBox="0 0 140 140" style="width: 130px; height: 130px; filter: drop-shadow(0 0 30px rgba(0,240,255,0.9));">
        <circle cx="70" cy="70" r="45" fill="none" stroke="#00f0ff" stroke-width="3" stroke-dasharray="12 8" />
        <circle cx="70" cy="70" r="25" fill="rgba(0,240,255,0.7)" />
      </svg>
    `,
    landing: `
      <svg viewBox="0 0 160 160" style="width: 140px; height: 140px; filter: drop-shadow(0 0 35px rgba(255,255,255,0.95));">
        <circle cx="80" cy="80" r="55" fill="none" stroke="#ffffff" stroke-width="3" />
        <circle cx="80" cy="80" r="30" fill="rgba(168,85,247,0.8)" />
        <polygon points="80,10 95,65 150,80 95,95 80,150 65,95 10,80 65,65" fill="rgba(0,240,255,0.7)" />
      </svg>
    `
  },
  peel: {
    takeoff: `
      <svg viewBox="0 0 140 140" style="width: 130px; height: 130px; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.6));">
        <rect x="25" y="25" width="90" height="90" rx="8" fill="rgba(15,22,35,0.85)" stroke="#00f0ff" stroke-width="2" />
        <line x1="38" y1="45" x2="102" y2="45" stroke="#cbd5e1" stroke-width="2" />
        <line x1="38" y1="65" x2="88" y2="65" stroke="#cbd5e1" stroke-width="2" />
      </svg>
    `,
    landing: `
      <svg viewBox="0 0 160 160" style="width: 140px; height: 140px; filter: drop-shadow(0 20px 40px rgba(0,240,255,0.5));">
        <rect x="30" y="30" width="100" height="100" rx="10" fill="rgba(12,17,28,0.9)" stroke="#a855f7" stroke-width="2" />
        <circle cx="80" cy="80" r="16" fill="rgba(0,240,255,0.6)" />
      </svg>
    `
  }
};

const TRANSITIONS = [
  {
    key: 'aeroplane',
    outClass: 'anim-plane-takeoff',
    inClass: 'anim-plane-landing',
    duration: 1550,
    switchTime: 750,
    playStart: () => {
      Sound.playPaperFold();
      setTimeout(() => Sound.playWhoosh(), 350);
    },
    playTouchdown: () => {
      Sound.playTouchdown();
    }
  },
  {
    key: 'cube',
    outClass: 'anim-cube-takeoff',
    inClass: 'anim-cube-landing',
    duration: 1450,
    switchTime: 700,
    playStart: () => {
      Sound.playCubeRotate();
    },
    playTouchdown: () => {
      Sound.playTouchdown();
    }
  },
  {
    key: 'origami',
    outClass: 'anim-origami-takeoff',
    inClass: 'anim-origami-landing',
    duration: 1450,
    switchTime: 700,
    playStart: () => {
      Sound.playPaperFold();
      setTimeout(() => Sound.playWhoosh(), 300);
    },
    playTouchdown: () => {
      Sound.playTouchdown();
    }
  },
  {
    key: 'warp',
    outClass: 'anim-warp-takeoff',
    inClass: 'anim-warp-landing',
    duration: 1450,
    switchTime: 700,
    playStart: () => {
      Sound.playWarpZoom();
    },
    playTouchdown: () => {
      Sound.playTouchdown();
    }
  },
  {
    key: 'peel',
    outClass: 'anim-peel-takeoff',
    inClass: 'anim-peel-landing',
    duration: 1450,
    switchTime: 700,
    playStart: () => {
      Sound.playPeelSound();
    },
    playTouchdown: () => {
      Sound.playTouchdown();
    }
  }
];

class OrigamiTransitionEngine {
  constructor() {
    this.screens = document.querySelectorAll('.screen-pane');
    this.totalScreens = this.screens.length;
    this.currentScreen = 0;
    this.isTransitioning = false;
    this.transitionIndex = 0;
    this.stageEl = document.getElementById('transition-stage');
    this.takeoffCraft = document.getElementById('takeoff-craft');
    this.landingCraft = document.getElementById('landing-craft');
    this.screenNumEl = document.getElementById('current-screen-num');
    this.navBtns = document.querySelectorAll('.nav-link-btn');
    this.dots = document.querySelectorAll('.screen-dots .dot');

    this.init();
  }

  init() {
    // Navigation link buttons
    this.navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.getAttribute('data-screen'), 10);
        this.goToScreen(target);
      });
    });

    // Brand and hero button triggers
    document.querySelectorAll('.nav-screen-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = parseInt(btn.getAttribute('data-screen'), 10);
        this.goToScreen(target);
      });
    });

    // Screen indicator dots
    this.dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.getAttribute('data-screen'), 10);
        this.goToScreen(target);
      });
    });

    // Next / Prev screen buttons
    const nextBtn = document.getElementById('btn-next-screen');
    const prevBtn = document.getElementById('btn-prev-screen');

    nextBtn?.addEventListener('click', () => {
      this.goToScreen((this.currentScreen + 1) % this.totalScreens);
    });

    prevBtn?.addEventListener('click', () => {
      this.goToScreen((this.currentScreen - 1 + this.totalScreens) % this.totalScreens);
    });

    // Mouse wheel / trackpad swipe
    let lastWheelTime = 0;
    window.addEventListener('wheel', (e) => {
      const now = performance.now();
      if (now - lastWheelTime < 1700) return; // Debounce transition for smooth completion
      if (this.isModalActive()) return;

      if (e.deltaY > 35) {
        lastWheelTime = now;
        this.goToScreen((this.currentScreen + 1) % this.totalScreens);
      } else if (e.deltaY < -35) {
        lastWheelTime = now;
        this.goToScreen((this.currentScreen - 1 + this.totalScreens) % this.totalScreens);
      }
    }, { passive: true });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (this.isModalActive()) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        this.goToScreen((this.currentScreen + 1) % this.totalScreens);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        this.goToScreen((this.currentScreen - 1 + this.totalScreens) % this.totalScreens);
      }
    });

    // Touch swipe for mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (this.isModalActive()) return;
      const touchEndY = e.changedTouches[0].screenY;
      const diffY = touchStartY - touchEndY;
      if (Math.abs(diffY) > 60) {
        if (diffY > 0) {
          this.goToScreen((this.currentScreen + 1) % this.totalScreens);
        } else {
          this.goToScreen((this.currentScreen - 1 + this.totalScreens) % this.totalScreens);
        }
      }
    }, { passive: true });
  }

  isModalActive() {
    return document.querySelector('.lightbox-backdrop.active, .cert-modal-backdrop.active, .terminal-modal-backdrop.active') !== null;
  }

  goToScreen(index) {
    if (this.isTransitioning || index === this.currentScreen || index < 0 || index >= this.totalScreens) {
      return;
    }

    this.isTransitioning = true;
    const outgoingScreen = this.screens[this.currentScreen];
    const incomingScreen = this.screens[index];

    // Select the next transition in rotation
    const t = TRANSITIONS[this.transitionIndex % TRANSITIONS.length];
    this.transitionIndex++;

    // Stage setup: trigger craft elements
    if (this.stageEl) {
      this.stageEl.className = `transition-stage active stage-${t.key}`;
      if (this.takeoffCraft && CRAFTS[t.key]) {
        this.takeoffCraft.innerHTML = CRAFTS[t.key].takeoff;
      }
      if (this.landingCraft && CRAFTS[t.key]) {
        this.landingCraft.innerHTML = CRAFTS[t.key].landing;
      }
    }

    // Step 1: Start outgoing take-off animation & sound
    t.playStart();
    outgoingScreen.classList.add(t.outClass);

    // Step 2: Switch active screen and trigger incoming landing approach
    setTimeout(() => {
      outgoingScreen.classList.remove('active', t.outClass);
      incomingScreen.classList.add('active', t.inClass);

      this.currentScreen = index;
      this.updateHUD(index);

      // Cleanly scroll viewport to top of new section
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, t.switchTime);

    // Step 3: Touchdown impact sound on landing arrival
    setTimeout(() => {
      t.playTouchdown();
    }, t.switchTime + 280);

    // Step 4: Completion: clean up stage and play arrival chime
    setTimeout(() => {
      incomingScreen.classList.remove(t.inClass);
      if (this.stageEl) {
        this.stageEl.className = 'transition-stage';
        if (this.takeoffCraft) this.takeoffCraft.innerHTML = '';
        if (this.landingCraft) this.landingCraft.innerHTML = '';
      }
      Sound.playChime(659.25);
      this.isTransitioning = false;
    }, t.duration);
  }

  updateHUD(index) {
    // Update number
    if (this.screenNumEl) {
      this.screenNumEl.innerText = String(index + 1).padStart(2, '0');
    }

    // Update nav buttons
    this.navBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
}


// ==========================================================================
// 3. THREE.JS BACKGROUND ATMOSPHERE
// ==========================================================================
function initThreeJS() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 75;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1,400 Subtle Stardust Particles
  const particleCount = 1400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color(0x00f0ff);
  const colorPurple = new THREE.Color(0xa855f7);
  const colorWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 220;
    positions[i + 1] = (Math.random() - 0.5) * 220;
    positions[i + 2] = (Math.random() - 0.5) * 180;

    const chosen = Math.random() > 0.65 ? colorCyan : (Math.random() > 0.5 ? colorPurple : colorWhite);
    colors[i] = chosen.r;
    colors[i + 1] = chosen.g;
    colors[i + 2] = chosen.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const particleMesh = new THREE.Points(geometry, material);
  scene.add(particleMesh);

  // Gentle Floating Wireframe Geometry
  const geoIcosahedron = new THREE.IcosahedronGeometry(14, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });
  const mesh1 = new THREE.Mesh(geoIcosahedron, wireMat);
  mesh1.position.set(45, -15, 10);
  scene.add(mesh1);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 30;
    camera.position.y = -targetY * 30;
    camera.lookAt(scene.position);

    particleMesh.rotation.y += 0.0005;
    mesh1.rotation.x += 0.003;
    mesh1.rotation.y += 0.004;

    renderer.render(scene, camera);
  }

  animate();
}

// ==========================================================================
// 4. PHOTO LIGHTBOX MODAL
// ==========================================================================
const PHOTO_DATA = [
  {
    title: "Kathmandu Valley",
    src: "assets/images/spiderman.png"
  },
  {
    title: "Hills at Golden Hour",
    src: "assets/images/golden_sunset.png"
  },
  {
    title: "Mountain Altitude",
    src: "assets/images/mountain_bw.png"
  },
  {
    title: "Nature Trails",
    src: "assets/images/forest_nature.png"
  },
  {
    title: "Late Night Coding",
    src: "assets/images/mirror_candid.png"
  }
];

let currentPhotoIndex = 0;

function initLightbox() {
  const backdrop = document.getElementById('lightbox-backdrop');
  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!backdrop) return;

  function openLightbox(index) {
    currentPhotoIndex = index;
    const data = PHOTO_DATA[index];

    imgEl.src = data.src;
    imgEl.alt = data.title;
    if (titleEl) titleEl.innerText = data.title;

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    Sound.playTick();
  }

  function closeLightbox() {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    Sound.playTick();
  }

  function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % PHOTO_DATA.length;
    openLightbox(currentPhotoIndex);
  }

  function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + PHOTO_DATA.length) % PHOTO_DATA.length;
    openLightbox(currentPhotoIndex);
  }

  document.querySelectorAll('.moment-item, .photo-card-tilt').forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index') || "0", 10);
      openLightbox(idx);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  nextBtn?.addEventListener('click', nextPhoto);
  prevBtn?.addEventListener('click', prevPhoto);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (!backdrop.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });
}

// ==========================================================================
// 5. CERTIFICATE INSPECTION MODAL
// ==========================================================================
const CERT_DATA = {
  nycmun2023: {
    title: "NYC MUN 2023 — Delegate of Switzerland (UNEP)",
    org: "United Nations in Nepal & National Youth Council Nepal",
    signatories: "Hon. Narayan Kaji Shrestha (Deputy Prime Minister & Minister of Home Affairs, Nepal), Hanaa Singer-Hamdy (UN Resident Coordinator, United Nations in Nepal), Surendra Basnet (Vice Chairperson, NYC Nepal), Fr. Augustine Thomas S.J. (Principal, St. Xavier's College).",
    desc: "Represented the Swiss Confederation as an official delegate in the United Nations Environment Programme (UNEP) at the First Iteration of the National Youth Council Model United Nations (June 10-13, 2023). Participated in multilateral negotiations and environmental resolution drafting.",
    date: "June 10–13, 2023"
  },
  mahakumbha2022: {
    title: "9th Annual MahaKumbha 2022 (Pre-Worlds) Championship",
    org: "Debate Network Nepal (DNN) & Brihaspati Vidhyasadan",
    signatories: "Executive Board of Debate Network Nepal (DNN) & Adjudication Core.",
    desc: "Certificate of Appreciation awarded for participating in the 9th Annual MahaKumbha National Schools Debating Championship (Pre-Worlds). Competed across parliamentary debate rounds on economics, law, and ethics under strict time limits.",
    date: "November 25–28, 2022"
  },
  munrecord: {
    title: "13 MUN Conferences Record (6× Best Delegate)",
    org: "Model United Nations Circuit (Nepal)",
    signatories: "Secretariats of 13 Convened MUN Conferences.",
    desc: "Demonstrated cumulative debating record across 13 Model United Nations conferences in Nepal, receiving 6× Best Delegate and 3× Outstanding Delegate awards in UNEP, DISEC, and specialized security councils.",
    date: "2022–2024 Cumulative"
  },
  hackathons: {
    title: "National Hackathons (BNKS, ICES & MBMC)",
    org: "Budhanilkantha School (BNKS) & ICES (Build Nepal)",
    signatories: "Faculty Advisors & Organizing Committees.",
    desc: "Competed in national hackathons building IoT transit sensor vehicles (KrishiTrust with MPU6050 vibration score & GPS RoadDNA), computer vision musical gesture apps (HandChord), and software prototypes under tight sprint deadlines.",
    date: "National Circuit"
  },
  nimhans: {
    title: "NIMHANS Digital Academy (2026) Certification",
    org: "NIMHANS Digital Academy",
    signatories: "Course Directors & Clinical Faculty, NIMHANS Digital Academy.",
    desc: "Completed certification in the Skills and Application of Cognitive Behavioral Therapy (CBT). Studied structured cognitive reframing, behavioral activation, and psychological resilience.",
    date: "Completed 2026"
  },
  leadership: {
    title: "School Captain & Prefect (2 Consecutive Years)",
    org: "Baba School, Kathmandu",
    signatories: "Principal & Student Council Governance Board.",
    desc: "Served 2 consecutive years as School Captain and Prefect at Baba School. Coordinated school events, inter-school athletics tournaments, and student mentorship.",
    date: "2 Years Leadership Tenure"
  }
};

function initCertificateModal() {
  const modal = document.getElementById('cert-modal');
  const closeBtn = document.getElementById('cert-modal-close');
  const titleEl = document.getElementById('cert-title');
  const orgEl = document.getElementById('cert-org');
  const sigEl = document.getElementById('cert-signatories');
  const descEl = document.getElementById('cert-desc');
  const dateEl = document.getElementById('cert-date');

  if (!modal) return;

  function openCert(key) {
    const data = CERT_DATA[key];
    if (!data) return;

    titleEl.innerText = data.title;
    orgEl.innerText = data.org;
    sigEl.innerText = data.signatories;
    descEl.innerText = data.desc;
    dateEl.innerText = `Date: ${data.date}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    Sound.playTick();
  }

  function closeCert() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    Sound.playTick();
  }

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-cert');
      if (key) openCert(key);
    });
  });

  closeBtn?.addEventListener('click', closeCert);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCert();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeCert();
    }
  });
}

// ==========================================================================
// 6. TERMINAL MODAL (⌘K)
// ==========================================================================
function initTerminal() {
  const modal = document.getElementById('terminal-modal');
  const input = document.getElementById('terminal-input');
  const log = document.getElementById('terminal-log');
  const closeBtn = document.getElementById('terminal-close-btn');
  const redDot = document.getElementById('terminal-red-dot');
  const triggerBtn = document.getElementById('nav-terminal-btn');

  if (!modal || !input || !log) return;

  function openTerminal() {
    modal.classList.add('active');
    input.focus();
    Sound.playTick();
  }

  function closeTerminal() {
    modal.classList.remove('active');
    Sound.playTick();
  }

  triggerBtn?.addEventListener('click', openTerminal);
  closeBtn?.addEventListener('click', closeTerminal);
  redDot?.addEventListener('click', closeTerminal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTerminal();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.classList.contains('active') ? closeTerminal() : openTerminal();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeTerminal();
    }
  });

  function appendLog(html) {
    const entry = document.createElement('div');
    entry.innerHTML = html;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  const commands = {
    help: () => `
<div>Available commands:</div>
<div>• <span class="cmd-hl">about</span> - Brief intro</div>
<div>• <span class="cmd-hl">projects</span> - What I'm building</div>
<div>• <span class="cmd-hl">next</span> - Navigate to next section</div>
<div>• <span class="cmd-hl">certificates</span> - Verified certifications & achievements</div>
<div>• <span class="cmd-hl">contact</span> - Email & socials</div>
<div>• <span class="cmd-hl">clear</span> - Clear terminal</div>
<div>• <span class="cmd-hl">exit</span> - Close terminal</div>`,

    about: () => `<div>Aayush Bhatta (@aayushifty) — Student, Developer, Athlete (Basketball), Musician (Singer & Guitarist), and Dancer from Kathmandu, Nepal.</div>`,

    next: () => {
      if (window.origamiEngine) {
        const next = (window.origamiEngine.currentScreen + 1) % window.origamiEngine.totalScreens;
        window.origamiEngine.goToScreen(next);
      }
      return `<div>Navigating to next section...</div>`;
    },

    fly: function() { return this.next(); },

    projects: () => `
<div>• JARVIS: Local voice and touch assistant running Llama 3.2.</div>
<div>• HandChord: Webcam hand gesture musical chord player.</div>
<div>• KrishiTrust: ESP32 produce shock monitoring vehicle prototype.</div>
<div>• TikTok @aayushifty: Creative tech experiments, guitar jams, and student lifestyle.</div>`,

    certificates: () => `
<div>• NYC MUN 2023: Delegate of Switzerland (UNEP) - Signed by Deputy PM & UN Resident Coordinator.</div>
<div>• 9th MahaKumbha 2022: National Schools Debating Championship.</div>
<div>• 13 MUN Conferences: 6× Best Delegate, 3× Outstanding Delegate.</div>
<div>• National Hackathons: BNKS, Build Nepal (ICES), MBMC IdeaX.</div>`,

    contact: () => `
<div>Email: aayushbhatta230@gmail.com</div>
<div>GitHub: github.com/aayushbhatta230-ux</div>
<div>TikTok: @aayushifty</div>`,

    clear: () => {
      log.innerHTML = '';
      return '';
    },

    exit: () => {
      closeTerminal();
      return '';
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim().toLowerCase();
      input.value = '';
      if (!val) return;

      appendLog(`<div><span class="cmd-hl">aayush:~$</span> ${val}</div>`);
      if (commands[val]) {
        const res = commands[val]();
        if (res) appendLog(res);
      } else {
        appendLog(`<div>Command not found: '${val}'. Type <span class="cmd-hl">help</span>.</div>`);
      }
    }
  });
}

// ==========================================================================
// 7. JARVIS WAVE OSCILLOSCOPE
// ==========================================================================
function initJARVISWave() {
  const canvas = document.getElementById('jarvis-wave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.offsetWidth || 300;
  let height = canvas.height = 50;

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth || 300;
    height = canvas.height = 50;
  });

  let phase = 0;

  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f0ff';

    ctx.beginPath();
    const sliceWidth = width / 50;
    let x = 0;

    for (let i = 0; i < 50; i++) {
      const v = Math.sin(i * 0.28 + phase) * Math.cos(i * 0.12 + phase * 0.6);
      const y = (height / 2) + v * (height * 0.35);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.stroke();
    phase += 0.04;
  }

  draw();
}

// ==========================================================================
// 8. CURSOR & CARD TILT
// ==========================================================================
function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  function render() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  document.querySelectorAll('a, button, .moment-item, .project-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '48px';
      ring.style.height = '48px';
      ring.style.borderColor = 'rgba(0, 240, 255, 0.8)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(0, 240, 255, 0.4)';
    });
  });
}

function initCardTilt() {
  const tiltCards = document.querySelectorAll('.photo-card-tilt, .project-card, .cert-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ==========================================================================
// 9. TOAST & EMAIL COPY
// ==========================================================================
function showToast(text) {
  const toast = document.getElementById('toast-msg');
  if (!toast) return;
  toast.innerText = text;
  toast.classList.add('show');
  Sound.playChime(659.25);
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function initEmailCopy() {
  const btn = document.getElementById('btn-copy-email');
  btn?.addEventListener('click', () => {
    navigator.clipboard.writeText('aayushbhatta230@gmail.com').then(() => {
      showToast('✓ Email copied: aayushbhatta230@gmail.com');
    }).catch(() => {
      showToast('aayushbhatta230@gmail.com');
    });
  });
}

// ==========================================================================
// 10. SOUND TOGGLE
// ==========================================================================
function initSoundToggle() {
  const btn = document.getElementById('btn-sound-toggle');
  btn?.addEventListener('click', () => {
    const isActive = Sound.toggleAmbient();
    btn.classList.toggle('active', isActive);
    showToast(isActive ? '🔊 Sound: Active' : '🔇 Sound: Muted');
  });
}

// ==========================================================================
// DOM READY INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  window.origamiEngine = new OrigamiTransitionEngine();
  initLightbox();
  initCertificateModal();
  initTerminal();
  initJARVISWave();
  initCursor();
  initCardTilt();
  initEmailCopy();
  initSoundToggle();
});
