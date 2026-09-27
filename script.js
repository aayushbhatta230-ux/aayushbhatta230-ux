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
    duration: 2500,
    switchTime: 950,
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
    duration: 2400,
    switchTime: 900,
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
    duration: 2400,
    switchTime: 900,
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
    duration: 2400,
    switchTime: 900,
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
    duration: 2400,
    switchTime: 900,
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

    // ----------------------------------------------------------------------
    // READING MODEL — scroll first, travel only at the edge of a section.
    // A section pane is a document: the wheel, keyboard and swipe scroll it
    // from top to bottom. Only once the reader reaches that section's actual
    // end does the next screen transition begin. This is what keeps long
    // sections (Projects, About, Certificates) legible instead of launching a
    // full-screen animation on the very first scroll tick.
    // ----------------------------------------------------------------------
    const EDGE_SLACK = 2;   // px tolerance when testing for a scroll edge
    const EDGE_PUSH = 80;   // px of deliberate intent required past an edge
    let wheelLock = 0;      // cooldown window after a screen change
    let edgePush = 0;       // accumulated intent past the current edge

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const atBottom = () => window.scrollY >= maxScroll() - EDGE_SLACK;
    const atTop = () => window.scrollY <= EDGE_SLACK;

    const travel = (index) => {
      wheelLock = performance.now() + 1100;
      edgePush = 0;
      this.goToScreen(index);
    };

    // Mouse wheel / trackpad
    window.addEventListener('wheel', (e) => {
      if (this.isModalActive()) return;
      if (performance.now() < wheelLock) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 4) return;

      // Still content left to read in this direction? Then it's a page scroll.
      if ((delta > 0 && !atBottom()) || (delta < 0 && !atTop())) {
        edgePush = 0;
        return;
      }

      // Pinned to an edge — require a conscious push before moving on.
      edgePush += Math.abs(delta);
      if (edgePush < EDGE_PUSH) return;

      travel(delta > 0
        ? (this.currentScreen + 1) % this.totalScreens
        : (this.currentScreen - 1 + this.totalScreens) % this.totalScreens);
    }, { passive: true });

    // Keyboard: numbers jump, arrows read, edges travel
    window.addEventListener('keydown', (e) => {
      if (this.isModalActive()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;

      if (/^[1-6]$/.test(e.key)) {
        const target = Number(e.key) - 1;
        if (target < this.totalScreens && target !== this.currentScreen) {
          e.preventDefault();
          travel(target);
        }
        return;
      }

      if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: maxScroll(), behavior: 'smooth' });
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (!atBottom()) return; // native scroll does the work
        e.preventDefault();
        travel((this.currentScreen + 1) % this.totalScreens);
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (!atTop()) return;
        e.preventDefault();
        travel((this.currentScreen - 1 + this.totalScreens) % this.totalScreens);
      }
    });

    // Touch: swipe travels, but only from a real edge and never mid-scroll
    let touchStartY = 0;
    let touchStartScroll = 0;

    window.addEventListener('touchstart', (e) => {
      if (this.isModalActive()) return;
      touchStartY = e.changedTouches[0].screenY;
      touchStartScroll = window.scrollY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (this.isModalActive()) return;
      if (performance.now() < wheelLock) return;

      const diffY = touchStartY - e.changedTouches[0].screenY;
      const scrolled = Math.abs(window.scrollY - touchStartScroll);
      if (Math.abs(diffY) < 70 || scrolled > 24) return; // that was a scroll, not a swipe

      if (diffY > 0 && atBottom()) {
        travel((this.currentScreen + 1) % this.totalScreens);
      } else if (diffY < 0 && atTop()) {
        travel((this.currentScreen - 1 + this.totalScreens) % this.totalScreens);
      }
    }, { passive: true });

    // Auto-travel: dwelling at the true bottom advances on its own — no extra
    // push or Next click required. Short (non-scrollable) sections are left
    // alone so they never skip past before being read.
    const AUTO_DWELL = 650;
    let bottomTimer = 0;
    const cancelAuto = () => {
      if (bottomTimer) {
        window.clearTimeout(bottomTimer);
        bottomTimer = 0;
      }
    };
    const armAuto = () => {
      cancelAuto();
      if (maxScroll() <= 4 || !atBottom()) return;
      bottomTimer = window.setTimeout(() => {
        bottomTimer = 0;
        if (this.isModalActive() || this.isTransitioning) return;
        if (performance.now() < wheelLock) {
          armAuto();
          return;
        }
        if (!atBottom() || maxScroll() <= 4) return;
        travel((this.currentScreen + 1) % this.totalScreens);
      }, AUTO_DWELL);
    };
    window.addEventListener('scroll', () => {
      if (this.isModalActive() || this.isTransitioning) {
        cancelAuto();
        return;
      }
      if (!atBottom() || maxScroll() <= 4) {
        cancelAuto();
        return;
      }
      if (!bottomTimer) armAuto();
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

    // Step 3: Touchdown near the START of the landing so it feels glued, not trailing
    setTimeout(() => {
      t.playTouchdown();
    }, t.switchTime + 900);

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

    // Update nav buttons (aria-current keeps assistive tech in sync too)
    this.navBtns.forEach((btn, i) => {
      const isActive = i === index;
      btn.classList.toggle('active', isActive);
      if (isActive) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
}


// ==========================================================================
// 3. THREE.JS ATMOSPHERIC LAYER
// ==========================================================================

function initThreeJS() {
  const canvas = document.getElementById('webgl-canvas');

  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Three.js canvas or library not found — falling back to the CSS atmosphere.');
    document.documentElement.classList.add('no-webgl');
    return;
  }

  // ==========================================================================
  // DEVICE PROFILE — one pass that decides how heavy this scene is allowed to be
  // ==========================================================================
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const shortEdge = Math.min(window.innerWidth, window.innerHeight);
  const lightDevice = coarsePointer || shortEdge < 720 || cores <= 4 || memory <= 4;

  const profile = lightDevice
    ? { dpr: 1.2, stars: 700, antialias: false, ripples: 2, grid: 22, trail: 96 }
    : { dpr: 1.75, stars: 1700, antialias: true, ripples: 3, grid: 30, trail: 128 };

  if (reduceMotion) profile.stars = Math.round(profile.stars * 0.45);

  // ==========================================================================
  // SCENES — orthographic backdrop (1 draw call) + a real 3D depth scene
  // ==========================================================================
  const bgScene = new THREE.Scene();
  const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  bgCamera.position.z = 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1400
  );
  camera.position.set(0, 0, 62);

  // --- RENDERER ---
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: profile.antialias,
    stencil: false,
    powerPreference: 'high-performance'
  });
  const maxDpr = Math.min(window.devicePixelRatio || 1, profile.dpr);
  renderer.setPixelRatio(maxDpr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (THREE.sRGBEncoding && 'outputEncoding' in renderer) {
    renderer.outputEncoding = THREE.sRGBEncoding;
  }
  renderer.autoClear = false;

  // ==========================================================================
  // LAYER 1 — POINTER TRAIL TEXTURE
  // A tiny canvas painted with soft blobs and slowly faded, sampled by the
  // backdrop shader. It makes the entire background react to the cursor for
  // the price of a 128px 2D draw.
  // ==========================================================================
  const trailCanvas = document.createElement('canvas');
  trailCanvas.width = trailCanvas.height = profile.trail;
  const trailCtx = trailCanvas.getContext('2d');
  trailCtx.fillStyle = '#000000';
  trailCtx.fillRect(0, 0, profile.trail, profile.trail);

  const trailTexture = new THREE.CanvasTexture(trailCanvas);
  trailTexture.minFilter = THREE.LinearFilter;
  trailTexture.magFilter = THREE.LinearFilter;
  trailTexture.generateMipmaps = false;

  let trailDirty = true;

  function paintTrail(nx, ny, strength) {
    const size = profile.trail;
    const x = nx * size;
    const y = (1 - ny) * size;
    const radius = size * (0.09 + strength * 0.08);
    const gradient = trailCtx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255,255,255,0.55)');
    gradient.addColorStop(0.55, 'rgba(255,255,255,0.16)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    trailCtx.fillStyle = gradient;
    trailCtx.beginPath();
    trailCtx.arc(x, y, radius, 0, Math.PI * 2);
    trailCtx.fill();
    trailDirty = true;
  }

  function fadeTrail() {
    trailCtx.globalCompositeOperation = 'destination-out';
    trailCtx.fillStyle = 'rgba(0,0,0,0.05)';
    trailCtx.fillRect(0, 0, profile.trail, profile.trail);
    trailCtx.globalCompositeOperation = 'source-over';
    trailDirty = true;
  }

  // ==========================================================================
  // LAYER 2 — BACKDROP SHADER
  // Nebula fbm + breathing core light + cursor keylight + pointer trail glow +
  // SDF dot grid + vignette + film grain + dithering. One quad, one draw call.
  // ==========================================================================
  const bgUniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uTrail: { value: trailTexture },
    uAspect: { value: window.innerWidth / window.innerHeight },
    uColorA: { value: new THREE.Color(0x05070f) },
    uColorB: { value: new THREE.Color(0x10233d) },
    uColorC: { value: new THREE.Color(0x35d6ff) },
    uIntensity: { value: 1.0 },
    uGrid: { value: profile.grid }
  };

  const bgMaterial = new THREE.ShaderMaterial({
    uniforms: bgUniforms,
    depthTest: false,
    depthWrite: false,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec2 uPointer;
      uniform sampler2D uTrail;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      uniform float uIntensity;
      uniform float uAspect;
      uniform float uGrid;

      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.5;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 4; i++) {
          v += amp * noise(p);
          p = rot * p * 2.03;
          amp *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        vec2 suv = (uv - 0.5) * vec2(uAspect, 1.0) + 0.5;

        // --- flowing nebula ---
        float t = uTime * 0.017;
        float n1 = fbm(suv * 1.55 + vec2(t * 1.5, -t * 0.9));
        float n2 = fbm(suv * 2.45 - vec2(t * 0.8, t * 1.15));
        float plasma = smoothstep(0.05, 0.95, n1 * 0.72 + n2 * 0.42);
        vec3 col = mix(uColorA, uColorB, plasma);
        col = mix(col, uColorC, smoothstep(0.58, 1.0, n2) * 0.34 * uIntensity);

        // --- breathing core light ---
        float cd = length((suv - vec2(0.68, 0.38)) * vec2(uAspect, 1.0));
        col += uColorB * exp(-cd * 2.7) * (0.5 + 0.16 * sin(uTime * 0.3)) * uIntensity;

        // --- cursor keylight + trail bloom ---
        vec2 lightUv = uPointer * 0.5 + 0.5;
        float pd = length((suv - lightUv) * vec2(uAspect, 1.0));
        col += uColorC * exp(-pd * pd * 6.5) * 0.24;
        float trail = texture2D(uTrail, uv).r;
        col += mix(uColorC, vec3(1.0), 0.2) * trail * 0.3;

        // --- SDF dot grid that swells where the pointer has been ---
        vec2 gridUv = fract(suv * uGrid) - 0.5;
        float dotMask = smoothstep(0.085 + trail * 0.15, 0.0, length(gridUv));
        col += vec3(0.7, 0.85, 1.0) * dotMask * (0.026 + trail * 0.26);

        // --- vignette, grain, dithering ---
        float vig = smoothstep(1.45, 0.33, length((uv - 0.5) * vec2(uAspect, 1.0)));
        col *= mix(0.42, 1.0, vig);
        col += (hash(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) * 0.05;
        col += (hash(gl_FragCoord.xy * 0.5) - 0.5) / 255.0 * 1.5;

        gl_FragColor = vec4(col, 1.0);
      }
    `
  });

  const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMaterial);
  bgQuad.frustumCulled = false;
  bgScene.add(bgQuad);

  // ==========================================================================
  // LAYER 3 — GPU STAR FIELD
  // Depth-of-field point cloud: size + alpha follow the distance to a focus
  // plane (the trick Phantom.land uses for volumetric depth), plus twinkle,
  // slow drift and cursor shear. All animation lives in the vertex shader.
  // ==========================================================================
  const starCount = profile.stars;
  const starPositions = new Float32Array(starCount * 3);
  const starSeeds = new Float32Array(starCount);
  const starSizes = new Float32Array(starCount);
  const starTints = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const idx = i * 3;
    // Shell distribution — keeps the centre of the frame clear for content
    const radius = 24 + Math.pow(Math.random(), 0.55) * 210;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starPositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[idx + 2] = radius * Math.cos(phi);

    starSeeds[i] = Math.random();
    starSizes[i] = 0.7 + Math.random() * 1.9;
    starTints[i] = Math.random();
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('aSeed', new THREE.BufferAttribute(starSeeds, 1));
  starGeometry.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
  starGeometry.setAttribute('aTint', new THREE.BufferAttribute(starTints, 1));

  const starUniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uPixelRatio: { value: maxDpr },
    uFocus: { value: 78.0 },
    uOpacity: { value: 0.85 },
    uColorCool: { value: new THREE.Color(0xdce8ff) },
    uColorWarm: { value: new THREE.Color(0x8fd8ff) }
  };

  const starMaterial = new THREE.ShaderMaterial({
    uniforms: starUniforms,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexShader: `
      attribute float aSeed;
      attribute float aSize;
      attribute float aTint;

      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uPixelRatio;
      uniform float uFocus;
      uniform float uOpacity;
      uniform vec3 uColorCool;
      uniform vec3 uColorWarm;

      varying float vAlpha;
      varying vec3 vColor;

      void main() {
        vec3 p = position;
        p.x += sin(uTime * 0.06 + aSeed * 6.2831) * 2.4;
        p.y += cos(uTime * 0.05 + aSeed * 4.1888) * 2.0;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);

        // cursor shear: closer stars react more strongly
        mv.xy += uPointer * (5.0 + aSeed * 9.0) * 0.32;

        float dist = max(-mv.z, 1.0);

        // depth of field — particles off the focus plane soften and dim
        float dof = 1.0 - clamp(abs(dist - uFocus) / 250.0, 0.0, 1.0);

        // twinkle
        float twinkle = 0.42 + 0.58 * sin(uTime * (1.1 + aSeed * 2.2) + aSeed * 22.0);

        vAlpha = uOpacity * dof * mix(0.32, 1.0, twinkle);
        vColor = mix(uColorCool, uColorWarm, aTint);

        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPixelRatio * (130.0 / dist) * (0.7 + dof * 0.6);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying float vAlpha;
      varying vec3 vColor;

      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float core = smoothstep(0.5, 0.05, d);
        float halo = smoothstep(0.5, 0.0, d) * 0.35;
        gl_FragColor = vec4(vColor, (core + halo) * vAlpha);
      }
    `
  });

  const starField = new THREE.Points(starGeometry, starMaterial);
  starField.frustumCulled = false;
  scene.add(starField);

  // ==========================================================================
  // LAYER 4 — WIREFRAME ENERGY CORE
  // A low-poly structure drifting behind the glass cards, relocating and
  // re-tinting per section. The glassmorphic cards blur it → instant depth.
  // ==========================================================================
  const coreGroup = new THREE.Group();

  const coreShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(9.2, 1),
    new THREE.MeshBasicMaterial({
      color: 0x8fd8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );

  const corePulse = new THREE.Mesh(
    new THREE.OctahedronGeometry(4.4, 0),
    new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );

  const coreRing = new THREE.Mesh(
    new THREE.TorusGeometry(13.4, 0.05, 3, 96),
    new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  coreRing.rotation.x = Math.PI * 0.42;
  coreRing.rotation.y = Math.PI * 0.18;

  coreGroup.add(coreShell, corePulse, coreRing);
  coreGroup.position.set(17, 3, -16);
  scene.add(coreGroup);

  // ==========================================================================
  // LAYER 5 — RIPPLE SHOCKWAVES
  // A small pool of camera-facing ring quads fired on clicks and section jumps.
  // ==========================================================================
  const rippleGeometry = new THREE.PlaneGeometry(1, 1);
  const ripples = [];

  for (let i = 0; i < profile.ripples; i++) {
    const rippleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 1 },
        uOpacity: { value: 0 },
        uColor: { value: new THREE.Color(0x6ee7ff) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float uProgress;
        uniform float uOpacity;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          float ring = smoothstep(0.1, 0.0, abs(d - uProgress));
          float fade = (1.0 - smoothstep(0.55, 1.0, uProgress)) * uOpacity;
          gl_FragColor = vec4(uColor, ring * fade * 0.85);
        }
      `
    });

    const rippleMesh = new THREE.Mesh(rippleGeometry, rippleMaterial);
    rippleMesh.visible = false;
    scene.add(rippleMesh);
    ripples.push({ mesh: rippleMesh, material: rippleMaterial, life: 0, duration: 1.15 });
  }

  function spawnRippleAt(clientX, clientY, colorHex, size) {
    if (reduceMotion || ripples.length === 0) return;

    camera.updateMatrixWorld();
    const ndcX = (clientX / window.innerWidth) * 2 - 1;
    const ndcY = -((clientY / window.innerHeight) * 2 - 1);
    const point = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
    const direction = point.sub(camera.position).normalize();
    const travel = -camera.position.z / (direction.z || -1);
    const worldPosition = camera.position.clone().add(direction.multiplyScalar(travel));

    const slot = ripples.find((entry) => !entry.mesh.visible) || ripples[0];
    slot.mesh.visible = true;
    slot.mesh.position.copy(worldPosition);
    slot.mesh.scale.setScalar(size);
    slot.material.uniforms.uColor.value.setHex(colorHex);
    slot.life = 0;
    slot.duration = 1.15;
  }

  // ==========================================================================
  // POINTER RIG — cursor, gyroscope and the interactive trail
  // ==========================================================================
  const pointer = { x: 0, y: 0 };
  const smoothPointer = { x: 0, y: 0 };
  let lastTrailPaint = 0;

  function updatePointer(clientX, clientY) {
    const nx = clientX / window.innerWidth;
    const ny = clientY / window.innerHeight;

    pointer.x = nx * 2 - 1;
    pointer.y = -(ny * 2 - 1);

    // backdrop expects top-down y, the star field follows the same sign
    bgUniforms.uPointer.value.set(pointer.x, ny * 2 - 1);

    if (!reduceMotion) {
      const now = performance.now();
      if (now - lastTrailPaint > 24) {
        lastTrailPaint = now;
        paintTrail(nx, ny, 0.55);
      }
    }
  }

  window.addEventListener('pointermove', (event) => {
    updatePointer(event.clientX, event.clientY);
  }, { passive: true });

  window.addEventListener('pointerdown', (event) => {
    updatePointer(event.clientX, event.clientY);
    const mood = SECTION_MOODS[activeSection] || SECTION_MOODS[0];
    spawnRippleAt(event.clientX, event.clientY, mood.ripple, 30);
  }, { passive: true });

  // Mobile: device orientation drives the parallax instead of the mouse
  window.addEventListener('deviceorientation', (event) => {
    if (event.gamma === null || event.beta === null) return;
    pointer.x = Math.max(-1, Math.min(1, event.gamma / 32));
    pointer.y = Math.max(-1, Math.min(1, -(event.beta - 45) / 32));
    bgUniforms.uPointer.value.set(pointer.x, -pointer.y);
  }, { passive: true });

  // ==========================================================================
  // SECTION MOODS — palette, camera dolly, core placement and ripple tint
  // ==========================================================================
  const SECTION_MOODS = [
    { colorA: new THREE.Color(0x05070f), colorB: new THREE.Color(0x10233d), colorC: new THREE.Color(0x35d6ff), intensity: 1.00, starOpacity: 0.90, core: [17, 3, -16], dolly: 0, ripple: 0x6ee7ff },  // Home
    { colorA: new THREE.Color(0x06070f), colorB: new THREE.Color(0x241a3d), colorC: new THREE.Color(0xb07cff), intensity: 0.86, starOpacity: 0.76, core: [-19, -2, -15], dolly: -4, ripple: 0xc084fc },  // Moments
    { colorA: new THREE.Color(0x04070e), colorB: new THREE.Color(0x07293a), colorC: new THREE.Color(0x22d3ee), intensity: 1.05, starOpacity: 0.95, core: [16, -5, -19], dolly: 3, ripple: 0x22d3ee },   // Projects
    { colorA: new THREE.Color(0x050810), colorB: new THREE.Color(0x1b2440), colorC: new THREE.Color(0x7dd3fc), intensity: 0.78, starOpacity: 0.70, core: [-16, 4, -13], dolly: -6, ripple: 0x7dd3fc },  // About
    { colorA: new THREE.Color(0x060710), colorB: new THREE.Color(0x2a2112), colorC: new THREE.Color(0xf2b544), intensity: 0.88, starOpacity: 0.80, core: [18, 5, -16], dolly: 2, ripple: 0xfbbf24 },   // Certificates
    { colorA: new THREE.Color(0x040610), colorB: new THREE.Color(0x0f2033), colorC: new THREE.Color(0x38bdf8), intensity: 0.72, starOpacity: 0.66, core: [0, -8, -22], dolly: -3, ripple: 0x38bdf8 }   // Contact
  ];

  let activeSection = 0;
  let punch = 0;              // 0..1 impulse fired on every section change

  const coreTarget = new THREE.Vector3(17, 3, -16);

  // A portrait phone squeezes the horizontal field of view, so the decorative
  // wireframe core would otherwise drift half off the left or right edge. Inset
  // it toward the middle on narrow viewports and leave wide screens untouched.
  function coreInset(aspect) {
    return Math.min(1, Math.max(0.3, aspect / 1.35));
  }

  // ...and it reads as a lighter accent when the screen is this narrow
  function coreScale(aspect) {
    return Math.min(1, Math.max(0.68, 0.68 + (aspect - 0.46) * 0.45));
  }

  let coreScaleFactor = 1;

  function applyCoreTarget(mood) {
    const aspect = camera.aspect || 1;
    const inset = coreInset(aspect);
    coreScaleFactor = coreScale(aspect);
    coreTarget.set(mood.core[0] * inset, mood.core[1], mood.core[2]);
  }

  function setActiveSection(index) {
    if (index < 0 || index >= SECTION_MOODS.length) return;

    activeSection = index;
    punch = 1;

    const mood = SECTION_MOODS[index];
    applyCoreTarget(mood);

    // Shockwave ring fired roughly where the wireframe core sits
    const rippleX = window.innerWidth * (0.5 + mood.core[0] / 90);
    spawnRippleAt(rippleX, window.innerHeight * 0.42, mood.ripple, 38);
  }

  setActiveSection(0);

  // --- OBSERVE SCREEN NAVIGATION ---
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.screen-pane').forEach((screen, index) => {
      if (screen.classList.contains('active')) {
        setActiveSection(index);
      }
    });
  });

  document.querySelectorAll('.screen-pane').forEach((screen) => {
    observer.observe(screen, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  // --- RESIZE (keeps camera aspect, backdrop aspect and point size in sync) ---
  let resolutionScale = 1;

  function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // rotation / resize changes the usable horizontal room for the core
    applyCoreTarget(SECTION_MOODS[activeSection] || SECTION_MOODS[0]);

    const dpr = Math.min(window.devicePixelRatio || 1, profile.dpr * resolutionScale);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);

    bgUniforms.uAspect.value = width / height;
    starUniforms.uPixelRatio.value = dpr;
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // ==========================================================================
  // RENDER LOOP — backdrop first, then the depth layers, plus a watchdog that
  // steps quality down the moment a device starts to struggle.
  // ==========================================================================
  const clock = new THREE.Clock();
  const lookTarget = new THREE.Vector3(0, 0, 0);
  const timeScale = reduceMotion ? 0.25 : 1;

  let paused = false;
  let frameCount = 0;
  let frameTime = 0;
  let qualityLevel = 0;   // 0 = full, 1 = softer, 2 = minimum

  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) clock.getDelta();
  });

  function degradeQuality() {
    if (qualityLevel >= 2) return;
    qualityLevel++;

    if (qualityLevel === 1) {
      document.documentElement.classList.add('perf-low');
      resolutionScale = 0.85;
      starGeometry.setDrawRange(0, Math.floor(starCount * 0.6));
    } else {
      resolutionScale = 0.72;
      starGeometry.setDrawRange(0, Math.floor(starCount * 0.4));
      coreShell.visible = false;
      coreRing.visible = false;
    }

    handleResize();
  }

  function animate() {
    requestAnimationFrame(animate);
    if (paused) return;

    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.getElapsedTime() * timeScale;

    // ---- smoothed pointer + decay of the section punch ----
    smoothPointer.x += (pointer.x - smoothPointer.x) * 0.05;
    smoothPointer.y += (pointer.y - smoothPointer.y) * 0.05;
    punch *= 0.94;

    const mood = SECTION_MOODS[activeSection] || SECTION_MOODS[0];

    // ---- camera rig: parallax + section dolly + punch kick ----
    const camX = smoothPointer.x * 3.4 + punch * 1.6;
    const camY = smoothPointer.y * 2.2 - punch * 1.2;
    camera.position.x += (camX - camera.position.x) * 0.03;
    camera.position.y += (camY - camera.position.y) * 0.03;
    camera.position.z += ((62 - mood.dolly - punch * 9) - camera.position.z) * 0.035;
    lookTarget.x += (smoothPointer.x * 1.2 - lookTarget.x) * 0.03;
    lookTarget.y += (smoothPointer.y * 0.8 - lookTarget.y) * 0.03;
    camera.lookAt(lookTarget);

    // ---- backdrop: palette grading, time and the pointer trail ----
    bgUniforms.uTime.value = elapsed;
    bgUniforms.uIntensity.value += (mood.intensity - bgUniforms.uIntensity.value) * 0.02;
    bgUniforms.uColorA.value.lerp(mood.colorA, 0.02);
    bgUniforms.uColorB.value.lerp(mood.colorB, 0.02);
    bgUniforms.uColorC.value.lerp(mood.colorC, 0.02);

    if (trailDirty && !reduceMotion) {
      fadeTrail();
      trailTexture.needsUpdate = true;
    }

    // ---- star field (twinkle + shear live entirely in the shader) ----
    starUniforms.uTime.value = elapsed;
    starUniforms.uPointer.value.set(smoothPointer.x, -smoothPointer.y);
    starUniforms.uOpacity.value += (mood.starOpacity - starUniforms.uOpacity.value) * 0.02;
    starField.rotation.y = elapsed * 0.008;
    starField.rotation.x = Math.sin(elapsed * 0.05) * 0.03;

    // ---- energy core: relocates, breathes and flashes on section change ----
    coreGroup.position.x += (coreTarget.x - coreGroup.position.x) * 0.02;
    coreGroup.position.y += (coreTarget.y - coreGroup.position.y) * 0.02;
    coreGroup.position.z += (coreTarget.z - coreGroup.position.z) * 0.02;
    coreGroup.scale.setScalar((1 + Math.sin(elapsed * 0.6) * 0.02 + punch * 0.08) * coreScaleFactor);
    coreGroup.rotation.y = elapsed * 0.07;
    coreShell.rotation.x = Math.sin(elapsed * 0.11) * 0.2;
    corePulse.rotation.y = -elapsed * 0.24;
    corePulse.rotation.z = elapsed * 0.16;
    coreRing.rotation.z = elapsed * 0.05;
    coreShell.material.opacity = 0.13 + punch * 0.14;
    corePulse.material.opacity = 0.2 + punch * 0.18;
    coreRing.material.opacity = 0.26 + punch * 0.16;

    // ---- ripple shockwaves ----
    for (let i = 0; i < ripples.length; i++) {
      const ripple = ripples[i];
      if (!ripple.mesh.visible) continue;

      ripple.life += dt;
      const progress = Math.min(ripple.life / ripple.duration, 1);
      ripple.material.uniforms.uProgress.value = progress;
      ripple.material.uniforms.uOpacity.value = 1 - progress;
      ripple.mesh.quaternion.copy(camera.quaternion);

      if (progress >= 1) ripple.mesh.visible = false;
    }

    // ---- draw: backdrop quad, then the 3D depth scene ----
    renderer.clear();
    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);

    // ---- quality watchdog ----
    frameCount++;
    frameTime += dt;
    if (frameCount >= 80) {
      const fps = frameCount / Math.max(frameTime, 0.001);
      if (fps < 42) degradeQuality();
      frameCount = 0;
      frameTime = 0;
    }
  }

  animate();

  // --- EXPOSE CONTROLLER ---
  window.aayush3D = {
    setSection: setActiveSection,
    pulse: (x, y, colorHex) => spawnRippleAt(x, y, colorHex || 0x6ee7ff, 30),
    profile: profile,
    scene: scene,
    bgScene: bgScene,
    camera: camera,
    renderer: renderer
  };

  console.log(
    '%c AAYUSH 3D ENVIRONMENT ONLINE ',
    'background:#050710;color:#22d3ee;padding:6px 12px;border:1px solid rgba(34,211,238,0.35);font-size:10px;'
  );
  console.log(
    `%c atmosphere tier: ${lightDevice ? 'lite' : 'full'} · ${starCount} stars · ${profile.trail}px trail`,
    'color:#64748b;font-size:10px;'
  );
}
// ==========================================================================
const PHOTO_DATA = [
  {
    title: "Candid Mirror Selfie",
    src: "assets/images/mirror_candid.png?v=v4"
  },
  {
    title: "Hills at Golden Hour",
    src: "assets/images/golden_sunset.png?v=v4"
  },
  {
    title: "Mountain Altitude",
    src: "assets/images/mountain_bw.png?v=v4"
  },
  {
    title: "Nature Trails",
    src: "assets/images/forest_nature.png?v=v4"
  },
  {
    title: "Spider-Man Portrait",
    src: "assets/images/spiderman.png?v=v4"
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

    // These are card-shaped controls (role="button"), so they answer the
    // keyboard exactly like a real button.
    item.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openLightbox(parseInt(item.getAttribute('data-index') || '0', 10));
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
    // Expose the inspector as a real control to keyboard and AT users.
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute(
      'aria-label',
      `Inspect credential: ${card.querySelector('.cert-name')?.innerText || 'certificate'}`
    );

    card.addEventListener('click', () => {
      const key = card.getAttribute('data-cert');
      if (key) openCert(key);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
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
<div>• <span class="cmd-hl">whoami</span> - Identity, in one line</div>
<div>• <span class="cmd-hl">stack</span> - Tools and languages I use</div>
<div>• <span class="cmd-hl">projects</span> - What I'm building</div>
<div>• <span class="cmd-hl">moments</span> - Where the photos live</div>
<div>• <span class="cmd-hl">certificates</span> - Verified achievements</div>
<div>• <span class="cmd-hl">contact</span> - Email & socials</div>
<div>• <span class="cmd-hl">goto 1-6</span> - Jump to a section</div>
<div>• <span class="cmd-hl">next</span> - Advance one section</div>
<div>• <span class="cmd-hl">github</span> - Open my GitHub</div>
<div>• <span class="cmd-hl">clear</span> - Clear terminal</div>
<div>• <span class="cmd-hl">exit</span> - Close terminal</div>`,

    whoami: () => `<div>Aayush Bhatta — builder of local-first software, competitive student, musician and athlete. Kathmandu, Nepal (UTC+5:45).</div>`,

    stack: () => `
<div>• Languages: Python, JavaScript, C++</div>
<div>• Systems: FastAPI, Ollama (Llama 3.2), Web Audio API</div>
<div>• Vision &amp; hardware: MediaPipe, ESP32, MPU-6050 (I²C)</div>
<div>• Front end: vanilla JS, React, Vite</div>`,

    moments: () => {
      if (window.origamiEngine) window.origamiEngine.goToScreen(1);
      return `<div>Opening Moments — five photos, filterable by eye only.</div>`;
    },

    goto: (args) => {
      const target = parseInt((args && args[0]) || '', 10);
      if (Number.isNaN(target) || target < 1 || target > 6) {
        return `<div>Usage: <span class="cmd-hl">goto 1-6</span> — 1 home, 2 moments, 3 projects, 4 about, 5 certificates, 6 contact.</div>`;
      }
      if (window.origamiEngine) window.origamiEngine.goToScreen(target - 1);
      return `<div>Opening section ${target}...</div>`;
    },

    github: () => {
      window.open('https://github.com/aayushbhatta230-ux', '_blank', 'noopener');
      return `<div>Opening github.com/aayushbhatta230-ux ...</div>`;
    },

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
    if (e.key !== 'Enter') return;

    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;

    const [name, ...args] = raw.toLowerCase().split(/\s+/);

    appendLog(`<div><span class="cmd-hl">aayush:~$</span> ${raw}</div>`);

    const command = commands[name];
    if (typeof command === 'function') {
      const result = command(args);
      if (result) appendLog(result);
    } else {
      appendLog(`<div>Command not found: '${name}'. Type <span class="cmd-hl">help</span>.</div>`);
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
      ring.style.width = '42px';
      ring.style.height = '42px';
      ring.style.borderColor = 'rgba(255, 255, 255, 0.25)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(255, 255, 255, 0.12)';
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
// 11. DEPTH PARALLAX SYSTEM (Cursor + Gyroscope)
// ==========================================================================
function initDepthParallax() {
  let px = 0, py = 0;   // target
  let cx = 0, cy = 0;   // current (smoothed)
  const strength = 12;   // max pixel shift
  const ease = 0.06;

  // Desktop: mouse
  window.addEventListener('mousemove', (e) => {
    px = ((e.clientX / window.innerWidth) - 0.5) * 2;
    py = ((e.clientY / window.innerHeight) - 0.5) * 2;
  }, { passive: true });

  // Mobile: device orientation (gyroscope tilt)
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null) px = Math.max(-1, Math.min(1, e.gamma / 30));
      if (e.beta !== null)  py = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    }, { passive: true });
  }

  // Assign depth layers to elements
  const layers = [
    { sel: '.hero-text-block', z: 1.0 },
    { sel: '.hero-photo-wrapper', z: -0.6 },
    { sel: '.section-title-wrap', z: 0.8 },
    { sel: '.moments-grid', z: -0.4 },
    { sel: '.projects-grid', z: -0.5 },
    { sel: '.about-grid', z: -0.3 },
    { sel: '.credentials-grid', z: -0.4 },
    { sel: '.contact-box', z: 0.5 },
    { sel: '.location-pill', z: 1.4 },
    { sel: '.hero-tags', z: 0.6 },
    { sel: '.screen-indicator', z: 0.3 },
  ];

  function tick() {
    cx += (px - cx) * ease;
    cy += (py - cy) * ease;

    layers.forEach(({ sel, z }) => {
      const els = document.querySelectorAll(sel);
      const dx = cx * strength * z;
      const dy = cy * strength * z * 0.6;
      els.forEach(el => {
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
    });

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ==========================================================================
// 12. READING PROGRESS — how far through the current section the reader is
// ==========================================================================
// Sections are read like documents, so the interface reports progress inside
// the current one and, at its end, quietly offers the next section. Nothing is
// ever hidden behind an interaction: this only observes scroll position.
function initSectionProgress() {
  const bar = document.getElementById('read-progress');
  const cue = document.querySelector('.scroll-cue');
  const nextBtn = document.getElementById('btn-next-screen');
  if (!bar) return;

  const panes = document.querySelectorAll('.screen-pane');
  let frame = 0;
  let lastKey = '';

  function measure() {
    frame = 0;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
    const key = `${Math.round(progress * 100)}|${max}`;
    if (key === lastKey) return;
    lastKey = key;

    bar.style.transform = `scaleX(${progress})`;
    document.documentElement.classList.toggle('at-section-end', progress > 0.985 && max > 0);
    if (cue) cue.classList.toggle('is-hidden', progress > 0.015 || max === 0);
    if (nextBtn) nextBtn.classList.toggle('is-ready', progress > 0.88);
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(measure);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(schedule);
    panes.forEach((pane) => ro.observe(pane));
  }

  // A new section means a new reading position
  const observer = new MutationObserver(schedule);
  panes.forEach((pane) => observer.observe(pane, { attributes: true, attributeFilter: ['class'] }));

  measure();
}

// ==========================================================================
// 13. ENTRANCE CHOREOGRAPHY — boot curtain, masked headlines, staggered cards
// ==========================================================================
function initBootSequence() {
  const overlay = document.getElementById('boot-overlay');
  if (!overlay) return;

  const statusEl = document.getElementById('boot-status');
  const steps = ['booting spatial engine', 'compiling shaders', 'calibrating atmosphere', 'ready'];
  let step = 0;

  const stepTimer = window.setInterval(() => {
    step = Math.min(step + 1, steps.length - 1);
    if (statusEl) statusEl.innerText = steps[step];
  }, 300);

  let finished = false;
  function finishBoot() {
    if (finished) return;
    finished = true;
    window.clearInterval(stepTimer);
    if (statusEl) statusEl.innerText = 'ready';
    overlay.classList.add('boot-done');
    window.setTimeout(() => { overlay.style.display = 'none'; }, 1400);
  }

  window.setTimeout(finishBoot, 1050);
  window.addEventListener('load', finishBoot, { once: true });
}

function initWordReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let wordIndex = 0;

  function makeWord(content) {
    const outer = document.createElement('span');
    outer.className = 'reveal-word';
    outer.style.setProperty('--wi', String(wordIndex % 12));
    wordIndex++;

    const inner = document.createElement('span');
    if (typeof content === 'string') {
      inner.textContent = content;
    } else {
      inner.appendChild(content);
    }

    outer.appendChild(inner);
    return outer;
  }

  document.querySelectorAll('.hero-heading, .section-title').forEach((heading) => {
    const fragment = document.createDocumentFragment();

    Array.from(heading.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach((chunk) => {
          if (chunk.trim() === '') {
            fragment.appendChild(document.createTextNode(chunk));
          } else {
            fragment.appendChild(makeWord(chunk));
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        fragment.appendChild(makeWord(node));
      }
    });

    heading.innerHTML = '';
    heading.appendChild(fragment);
  });
}

function initStaggerTargets() {
  [
    '.hero-tags',
    '.hero-buttons',
    '.hero-meta-rail',
    '.section-title-wrap',
    '.moments-grid',
    '.projects-grid',
    '.about-grid',
    '.credentials-grid',
    '.contact-links-grid',
    '.contact-closing'
  ].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.add('stagger'));
  });
}

// --------------------------------------------------------------------------
// 13b. ENTRANCE LIFECYCLE — one bounded pass, then guaranteed legibility
// --------------------------------------------------------------------------
// Every pane is "settled" (fully visible, no transforms) by default. The
// entrance animation runs only while `is-entering` is present, and that class
// is removed on a timer whether or not the animation frames ever ran. Content
// therefore can never be left mid-reveal or hidden — the failure mode of the
// previous scroll-linked reveal.
function initEntranceChoreography() {
  const panes = Array.from(document.querySelectorAll('.screen-pane'));
  if (!panes.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Longest possible entrance: 11 words × 24ms stagger + 580ms rise ≈ 844ms.
  // The class is always dropped at this deadline, so nothing stays hidden.
  const ENTRANCE_MS = 900;
  let timers = [];
  let currentPane = null;

  function settle(pane) {
    if (!pane) return;
    pane.classList.remove('is-entering');
    pane.classList.add('motion-settled');
  }

  function play(pane) {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];

    panes.forEach((other) => { if (other !== pane) settle(other); });
    if (!pane) return;

    if (reduceMotion) {
      settle(pane);
      return;
    }

    pane.classList.remove('motion-settled', 'is-entering');
    void pane.offsetWidth; // restart the keyframes from a clean slate
    pane.classList.add('is-entering');

    timers.push(window.setTimeout(() => settle(pane), ENTRANCE_MS));
  }

  panes.forEach((pane) => pane.classList.add('motion-settled'));

  const observer = new MutationObserver(() => {
    panes.forEach((pane) => {
      const isActive = pane.classList.contains('active');
      if (!isActive || pane === currentPane) return;
      currentPane = pane;
      play(pane);
    });
  });

  panes.forEach((pane) => observer.observe(pane, { attributes: true, attributeFilter: ['class'] }));

  currentPane = panes[0];
  window.setTimeout(() => play(panes[0]), 520);
}

// ==========================================================================
// 14. POINTER-TRACKING SPOTLIGHT ON CARDS
// ==========================================================================
function initCardSpotlight() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document
    .querySelectorAll('.project-card, .moment-item, .cert-card, .about-card, .contact-btn')
    .forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${(event.clientX - rect.left).toFixed(1)}px`);
        card.style.setProperty('--my', `${(event.clientY - rect.top).toFixed(1)}px`);
      }, { passive: true });
    });
}

// ==========================================================================
// 15. MAGNETIC BUTTONS
// ==========================================================================
function initMagneticUI() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const magneticItems = document.querySelectorAll(
    '.btn-main, .btn-sub, .screen-arrow-btn, .contact-btn, #nav-terminal-btn, .cert-view-btn'
  );

  magneticItems.forEach((item) => {
    item.classList.add('magnetic');

    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width || 1);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height || 1);
      item.style.transform = `translate3d(${(dx * 10).toFixed(2)}px, ${(dy * 7).toFixed(2)}px, 0)`;
    });

    item.addEventListener('pointerleave', () => {
      item.style.transform = '';
    });
  });
}

// ==========================================================================
// 16. SLIDING NAV INDICATOR
// ==========================================================================
function initNavPill() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  const pill = document.createElement('span');
  pill.className = 'nav-pill';
  navLinks.insertBefore(pill, navLinks.firstChild);

  const buttons = Array.from(navLinks.querySelectorAll('.nav-link-btn'));

  function movePill() {
    const active = navLinks.querySelector('.nav-link-btn.active');
    if (!active) {
      pill.style.opacity = '0';
      return;
    }

    const navRect = navLinks.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    pill.style.width = `${activeRect.width}px`;
    pill.style.transform = `translate3d(${(activeRect.left - navRect.left).toFixed(1)}px, 0, 0)`;
    pill.style.opacity = '1';
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => window.setTimeout(movePill, 40));
  });

  const observer = new MutationObserver(movePill);
  buttons.forEach((btn) => observer.observe(btn, { attributes: true, attributeFilter: ['class'] }));

  window.addEventListener('resize', movePill);
  window.addEventListener('load', movePill);

  movePill();
  window.setTimeout(movePill, 150);
}

// ==========================================================================
// 17. AURORA PARALLAX (colour layer drifting against cursor + gyroscope)
// ==========================================================================
function initAuroraParallax() {
  const aurora = document.querySelector('.bg-aurora');
  if (!aurora) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('pointermove', (event) => {
    targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetY = (event.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('deviceorientation', (event) => {
    if (event.gamma === null || event.beta === null) return;
    targetX = Math.max(-1, Math.min(1, event.gamma / 32));
    targetY = Math.max(-1, Math.min(1, -(event.beta - 45) / 32));
  }, { passive: true });

  function tick() {
    currentX += (targetX - currentX) * 0.045;
    currentY += (targetY - currentY) * 0.045;
    aurora.style.transform =
      `translate3d(${(-currentX * 26).toFixed(2)}px, ${(-currentY * 18).toFixed(2)}px, 0)`;
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ==========================================================================
// 18. LOCAL TIME — a small, honest signal that the site is a person's
// ==========================================================================
function initLocalTime() {
  const el = document.getElementById('local-time');
  if (!el) return;

  let formatter = null;
  try {
    formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kathmandu',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    formatter = null;
  }

  function render() {
    if (!formatter) {
      el.innerText = 'UTC+5:45';
      return;
    }
    el.innerText = `${formatter.format(new Date())} NPT`;
  }

  render();
  window.setInterval(render, 30000);
}

// ==========================================================================
// 19. SERVICE WORKER (Offline PWA & Homescreen Support)
// ==========================================================================
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          console.log('[PWA] ServiceWorker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker registration skipped/failed:', err);
        });
    });
  }
}

// ==========================================================================
// DOM READY INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // A WebGL failure must never take the rest of the interface down with it
  try {
    initThreeJS();
  } catch (error) {
    console.warn('Atmosphere layer skipped:', error);
    document.documentElement.classList.add('no-webgl');
  }

  window.origamiEngine = new OrigamiTransitionEngine();
  initLightbox();
  initCertificateModal();
  initTerminal();
  initJARVISWave();
  initCursor();
  initCardTilt();
  initEmailCopy();
  initSoundToggle();
  initDepthParallax();
  initSectionProgress();
  initLocalTime();
  initServiceWorker();

  // Keep the initially-active navigation entry announced correctly
  document.querySelector('.nav-link-btn.active')?.setAttribute('aria-current', 'true');

  // --- Motion & atmosphere layer (entrance, reveals, magnetism) ---
  initBootSequence();
  initStaggerTargets();
  initWordReveal();
  initEntranceChoreography();
  initCardSpotlight();
  initMagneticUI();
  initNavPill();
  initAuroraParallax();
});
