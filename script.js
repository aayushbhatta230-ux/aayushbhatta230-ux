/**
 * AAYUSH BHATTA (@aayushifty) — NEXUS CLIENT ENGINE
 * 3D Cosmic Space, Paper Airplane Flight Engine, Web Audio Synthesizer,
 * 4D Chronometer, Card Tilt Physics, Terminal, Lightbox, and Verified Credentials Modal.
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
      console.warn("Web Audio API not supported", e);
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

    // Warm drone
    this.ambientOsc1 = this.ctx.createOscillator();
    this.ambientOsc1.type = 'sine';
    this.ambientOsc1.frequency.setValueAtTime(55, now); // A1

    // Sub-harmonic shimmer
    this.ambientOsc2 = this.ctx.createOscillator();
    this.ambientOsc2.type = 'triangle';
    this.ambientOsc2.frequency.setValueAtTime(110, now); // A2

    // Filter
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

  // Micro interaction sound effects
  playTick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.04);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
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
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {}
  }

  playCyberPulse() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + 0.35);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Aerodynamic wind whoosh for paper airplane flight
  playWhoosh() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.55);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.25);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.55);
      filter.Q.setValueAtTime(3.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.55);
    } catch (e) {}
  }
}

const Sound = new CyberSoundEngine();

// ==========================================================================
// 2. THREE.JS COSMIC PARTICLE SYSTEM (Background Atmosphere)
// ==========================================================================
function initThreeJS() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Cosmic Stars Particle System
  const particleCount = 1800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(0x00f0ff); // Cyan
  const color2 = new THREE.Color(0xa855f7); // Purple
  const color3 = new THREE.Color(0xffffff); // White

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 240;
    positions[i + 1] = (Math.random() - 0.5) * 240;
    positions[i + 2] = (Math.random() - 0.5) * 200;

    const mixedColor = Math.random() > 0.6 ? color1 : (Math.random() > 0.5 ? color2 : color3);
    colors[i] = mixedColor.r;
    colors[i + 1] = mixedColor.g;
    colors[i + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particleMesh = new THREE.Points(geometry, material);
  scene.add(particleMesh);

  // Floating Wireframe Geometric Polyhedra
  const geoIcosahedron = new THREE.IcosahedronGeometry(12, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const floatingMesh1 = new THREE.Mesh(geoIcosahedron, wireMaterial);
  floatingMesh1.position.set(40, -10, 20);
  scene.add(floatingMesh1);

  const geoTorus = new THREE.TorusGeometry(10, 2.5, 12, 36);
  const wireMaterial2 = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.1
  });
  const floatingMesh2 = new THREE.Mesh(geoTorus, wireMaterial2);
  floatingMesh2.position.set(-45, 20, 10);
  scene.add(floatingMesh2);

  // Mouse Parallax Physics
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0006;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0006;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 35;
    camera.position.y = -targetY * 35;
    camera.lookAt(scene.position);

    particleMesh.rotation.y += 0.0006;
    particleMesh.rotation.x += 0.0003;

    floatingMesh1.rotation.x += 0.004;
    floatingMesh1.rotation.y += 0.006;

    floatingMesh2.rotation.y += 0.005;
    floatingMesh2.rotation.z += 0.003;

    renderer.render(scene, camera);
  }

  animate();
}

// ==========================================================================
// 3. PAPER AIRPLANE FLIGHT & TRANSITION ENGINE (@jerrythewebdev inspired)
// ==========================================================================
class PaperPlaneFlightController {
  constructor() {
    this.glider = document.getElementById('interactive-glider');
    this.trailPath = document.getElementById('trail-path');
    this.isFlying = false;
    this.currentAnim = null;

    if (this.glider) {
      this.init();
    }
  }

  init() {
    // Docked floating motion
    this.dockX = window.innerWidth - 95;
    this.dockY = 88;
    this.updateDockPosition();

    window.addEventListener('resize', () => {
      if (!this.isFlying) {
        this.updateDockPosition();
      }
    });

    // Manual glider clicks
    this.glider.addEventListener('click', () => {
      this.launchAcrobaticFlight();
    });

    // Keyboard shortcut 'F'
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey) {
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          this.launchAcrobaticFlight();
        }
      }
    });

    // Launch button in nav
    const launchBtn = document.getElementById('btn-launch-plane');
    launchBtn?.addEventListener('click', () => {
      this.launchAcrobaticFlight();
    });

    // Hero launch button
    const heroPlaneBtn = document.getElementById('hero-plane-btn');
    heroPlaneBtn?.addEventListener('click', () => {
      this.launchAcrobaticFlight();
    });

    // Navigation triggers
    document.querySelectorAll('.nav-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const targetId = trigger.getAttribute('data-target') || trigger.getAttribute('href')?.replace('#', '');
        if (targetId) {
          e.preventDefault();
          this.flyToSection(targetId);
        }
      });
    });
  }

  updateDockPosition() {
    const isMobile = window.innerWidth <= 640;
    this.dockX = isMobile ? window.innerWidth - 65 : window.innerWidth - 110;
    this.dockY = isMobile ? 70 : 88;
    this.glider.style.transform = `translate3d(${this.dockX}px, ${this.dockY}px, 0px) rotate(15deg)`;
  }

  // Perform full navigation flight transition to section
  flyToSection(sectionId) {
    const targetEl = document.getElementById(sectionId);
    if (!targetEl) return;

    if (this.isFlying) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    this.isFlying = true;
    Sound.playWhoosh();

    const startX = this.dockX;
    const startY = this.dockY;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Organic swoop coordinates across the screen
    const midX = w * 0.35;
    const midY = h * 0.45;
    const sweepX = w * 0.15;
    const sweepY = h * 0.75;
    const endX = this.dockX;
    const endY = this.dockY;

    const startTime = performance.now();
    const duration = 1250; // ms

    // Simultaneously trigger smooth page scroll
    const navOffset = 80;
    const elementPosition = targetEl.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    const points = [];

    const animateFlight = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Cubic Bezier curve trajectory
      // B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
      const oneMinusT = 1 - t;
      const x = Math.pow(oneMinusT, 3) * startX +
                3 * Math.pow(oneMinusT, 2) * t * midX +
                3 * oneMinusT * Math.pow(t, 2) * sweepX +
                Math.pow(t, 3) * endX;

      const y = Math.pow(oneMinusT, 3) * startY +
                3 * Math.pow(oneMinusT, 2) * t * midY +
                3 * oneMinusT * Math.pow(t, 2) * sweepY +
                Math.pow(t, 3) * endY;

      // Calculate tangent angle for realistic banking & pitch
      const dx = (x - (this.lastX || startX));
      const dy = (y - (this.lastY || startY));
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      const bank = Math.sin(t * Math.PI) * 35; // 3D roll angle
      const scale = 1 + Math.sin(t * Math.PI) * 0.45;

      this.lastX = x;
      this.lastY = y;

      this.glider.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${angle}deg) rotateY(${bank}deg) scale(${scale})`;

      // Render glowing trail path
      points.push({ x: (x / w) * 1000, y: (y / h) * 1000 });
      if (points.length > 2) {
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          d += ` L ${points[i].x} ${points[i].y}`;
        }
        if (this.trailPath) {
          this.trailPath.setAttribute('d', d);
        }
      }

      if (t < 1) {
        requestAnimationFrame(animateFlight);
      } else {
        // Flight complete
        this.isFlying = false;
        Sound.playChime(659.25); // E5 landing chime
        this.updateDockPosition();

        // Fade out contrail
        setTimeout(() => {
          if (this.trailPath) {
            this.trailPath.setAttribute('d', '');
          }
        }, 400);
      }
    };

    requestAnimationFrame(animateFlight);
  }

  // Acrobatic loop flight around the screen
  launchAcrobaticFlight() {
    if (this.isFlying) return;
    this.isFlying = true;
    Sound.playWhoosh();

    const w = window.innerWidth;
    const h = window.innerHeight;
    const startX = this.dockX;
    const startY = this.dockY;

    const startTime = performance.now();
    const duration = 1400;
    const points = [];

    const animateLoop = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Majestic figure-8 loop across viewport
      const angleRad = t * Math.PI * 2;
      const loopRadiusX = w * 0.38;
      const loopRadiusY = h * 0.32;
      const centerX = w * 0.5;
      const centerY = h * 0.45;

      // Lissajous loop: x = sin(t), y = sin(2t)
      const x = (1 - t) * startX + t * (centerX + Math.sin(angleRad) * loopRadiusX);
      const y = (1 - t) * startY + t * (centerY + Math.sin(angleRad * 2) * (loopRadiusY * 0.7));

      const dx = (x - (this.lastX || startX));
      const dy = (y - (this.lastY || startY));
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      const bank = Math.sin(angleRad) * 45;
      const scale = 1.1 + Math.sin(t * Math.PI) * 0.35;

      this.lastX = x;
      this.lastY = y;

      this.glider.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${angle}deg) rotateY(${bank}deg) scale(${scale})`;

      points.push({ x: (x / w) * 1000, y: (y / h) * 1000 });
      if (points.length > 2 && this.trailPath) {
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          d += ` L ${points[i].x} ${points[i].y}`;
        }
        this.trailPath.setAttribute('d', d);
      }

      if (t < 1) {
        requestAnimationFrame(animateLoop);
      } else {
        this.isFlying = false;
        Sound.playChime(783.99); // G5 chime
        this.updateDockPosition();
        setTimeout(() => {
          if (this.trailPath) this.trailPath.setAttribute('d', '');
        }, 500);
      }
    };

    requestAnimationFrame(animateLoop);
  }
}

// ==========================================================================
// 4. 4D KATHMANDU CHRONOMETER (Real-Time Temporal Matrix)
// ==========================================================================
function initChronometer() {
  const timeEl = document.getElementById('chrono-time');
  const msEl = document.getElementById('chrono-ms');
  const barEl = document.getElementById('chrono-second-bar');

  if (!timeEl) return;

  function update() {
    const now = new Date();
    // Nepal Standard Time (UTC+5:45)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const npt = new Date(utc + (3600000 * 5.75));

    const hh = String(npt.getHours()).padStart(2, '0');
    const mm = String(npt.getMinutes()).padStart(2, '0');
    const ss = String(npt.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(npt.getMilliseconds() / 10)).padStart(2, '0');

    timeEl.innerText = `${hh}:${mm}:${ss}`;
    if (msEl) msEl.innerText = `.${ms}`;

    if (barEl) {
      const progress = ((npt.getSeconds() + npt.getMilliseconds() / 1000) / 60) * 100;
      barEl.style.width = `${progress}%`;
    }

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ==========================================================================
// 5. 3D CARD PERSPECTIVE TILT PHYSICS
// ==========================================================================
function initCardTilt() {
  const cards = document.querySelectorAll('.spatial-hero-card, .photo-card, .bento-box, .credential-pass-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt angle
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Set specular glare position
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseenter', () => {
      Sound.playTick();
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ==========================================================================
// 6. KINETIC TEXT ROTATOR WITH DECODE EFFECT
// ==========================================================================
function initTextRotator() {
  const el = document.getElementById('rotator-text');
  if (!el) return;

  const roles = [
    "Creative Technologist",
    "Competitive Athlete (Basketball • Football)",
    "Systems Engineer",
    "National Hackathon Builder",
    "TikTok Creator @aayushifty (20k+)",
    "Hardware & Robotics Prototyper"
  ];

  let roleIndex = 0;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

  function decodeEffect(targetText) {
    let iteration = 0;
    const interval = setInterval(() => {
      el.innerText = targetText
        .split("")
        .map((char, index) => {
          if (index < iteration) {
            return targetText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);
  }

  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    decodeEffect(roles[roleIndex]);
  }, 3500);
}

// ==========================================================================
// 7. PHOTO LIGHTBOX MODAL (THE 5 CURATED MOMENTS)
// ==========================================================================
const PHOTO_DATA = [
  {
    title: "Agility & Athletic Edge",
    tag: "Athletic Conditioning • Gym Stamina • Focus",
    src: "assets/images/spiderman.png",
    quote: "Relentless athletic stamina builds the baseline for deep, focused engineering execution.",
    story: "Channeling high-energy physical conditioning, gym stamina, and quick reflexes in Kathmandu. Daily training sharpens mental focus and fuels the stamina needed to build complex software and hardware architectures."
  },
  {
    title: "The Golden Horizon",
    tag: "Vision • Kathmandu Hills • Boundless Ambition",
    src: "assets/images/golden_sunset.png",
    quote: "Standing on the hills of Kathmandu, visualizing systems built locally with global scale.",
    story: "Captured overlooking the terraced valleys of Kathmandu during golden hour. A moment of quiet reflection, connecting local problem solving with scalable AI and hardware innovation."
  },
  {
    title: "Summit Mindset",
    tag: "Endurance • High Altitude • Composure",
    src: "assets/images/mountain_bw.png",
    quote: "Composure in the thin air, discipline on the field, precision in the terminal.",
    story: "Atmospheric mountain summit perspective reflecting high-altitude endurance and mental resilience under intense competitive pressure."
  },
  {
    title: "Wilderness & River Flow",
    tag: "Trail Sprints • River Sanctuary • Mental Clarity",
    src: "assets/images/forest_nature.png",
    quote: "Reconnecting with nature's rhythm to reset focus and engineer with renewed clarity.",
    story: "Trail sprints amid boulder rivers and pine forests across Nepal. Physical outdoor movement provides the ideal contrast to code, clearing the mind for creative breakthroughs."
  },
  {
    title: "Creator Frequency",
    tag: "Community • TikTok Creator @aayushifty • Authentic Persona",
    src: "assets/images/mirror_candid.png",
    quote: "Late training sessions, quick mirror checks, and continuous creation under @aayushifty.",
    story: "Authentic mirror capture representing creative freedom. Building an engaged community of 20,000+ followers on TikTok, sharing technology builds, lifestyle perspectives, and relatable humor."
  }
];

let currentPhotoIndex = 0;

function initLightbox() {
  const backdrop = document.getElementById('lightbox-backdrop');
  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const tagEl = document.getElementById('lightbox-tag');
  const quoteEl = document.getElementById('lightbox-quote');
  const storyEl = document.getElementById('lightbox-story');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!backdrop) return;

  function openLightbox(index) {
    currentPhotoIndex = index;
    const data = PHOTO_DATA[index];

    imgEl.src = data.src;
    imgEl.alt = data.title;
    titleEl.innerText = data.title;
    tagEl.innerText = data.tag;
    quoteEl.innerText = `"${data.quote}"`;
    storyEl.innerText = data.story;

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    Sound.playCyberPulse();
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

  // Bind to photo cards
  document.querySelectorAll('.photo-card, .spatial-hero-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index') || "0", 10);
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
// 8. VERIFIED CREDENTIALS & CERTIFICATION MODAL (#cert-modal)
// ==========================================================================
const CERT_DATA = {
  nycmun2023: {
    title: "NYC MUN 2023 — Delegate of Switzerland (UNEP)",
    org: "United Nations Nepal & National Youth Council Nepal",
    signatories: "Hon. Narayan Kaji Shrestha (Deputy Prime Minister & Minister of Home Affairs, Nepal), Hanaa Singer-Hamdy (UN Resident Coordinator, United Nations in Nepal), Surendra Basnet (Vice Chairperson, NYC Nepal), Fr. Augustine Thomas S.J. (Principal, St. Xavier's College).",
    desc: "Represented the Swiss Confederation as an official diplomatic delegate in the United Nations Environment Programme (UNEP) at the First Iteration of the National Youth Council Model United Nations (June 10-13, 2023). Engaged in multilateral resolution drafting on environmental governance and carbon reduction frameworks.",
    date: "June 10–13, 2023",
    recordId: "CERT-UN-NYC-2023-CH-UNEP"
  },
  mahakumbha2022: {
    title: "9th Annual MahaKumbha 2022 (Pre-Worlds) Championship",
    org: "Debate Network Nepal (DNN) & Brihaspati Vidhyasadan",
    signatories: "Executive Board of Debate Network Nepal (DNN) & Tournament Adjudication Core.",
    desc: "Awarded Certificate of Appreciation for participation in the 9th Annual MahaKumbha National Schools Debating Championship (Pre-Worlds). Competed across intensive parliamentary debate rounds addressing international economics, constitutional law, and technological ethics under strict time limits.",
    date: "November 25–28, 2022",
    recordId: "CERT-DNN-MK9-2022-NAT"
  },
  munrecord: {
    title: "13 MUN Assemblies Cumulative Delegation Record",
    org: "National & Regional MUN Circuits (Nepal)",
    signatories: "Secretariats of 13 Convened Model United Nations Assemblies.",
    desc: "Demonstrated cumulative mastery across 13 youth diplomatic assemblies in Nepal, securing 6× Best Delegate and 3× Outstanding Delegate honors. Specialized in crisis committees, UNEP environmental policy, DISEC disarmament, and the UN Human Rights Council.",
    date: "2022–2024 Cumulative",
    recordId: "RECORD-MUN-13CONF-6BD3OD"
  },
  hackathons: {
    title: "National Hackathon Circuit (BNKS, ICES & MBMC)",
    org: "Budhanilkantha School (BNKS) & ICES (Innovative Computer Engineering Students)",
    signatories: "Faculty Advisors & Hackathon Organizing Committees.",
    desc: "Active builder across national hackathon circuits. Developed sensor-based transit reliability platforms (KrishiTrust with MPU6050 vibration score & GPS RoadDNA), computer vision musical gesture interfaces (HandChord), and embedded IoT prototypes under rapid competition sprints.",
    date: "National Circuit",
    recordId: "DEV-HACKATHONS-NP-VERIFIED"
  },
  nimhans: {
    title: "NIMHANS Digital Academy (2026) Certification",
    org: "NIMHANS Digital Academy (National Institute of Mental Health and Neurosciences)",
    signatories: "Course Directors & Clinical Faculty, NIMHANS Digital Academy.",
    desc: "Completed certified training in the Skills and Application of Cognitive Behavioral Therapy (CBT). Explored structured cognitive reframing, behavioral activation, and psychological resilience mechanisms.",
    date: "Completed 2026",
    recordId: "CERT-NIMHANS-CBT-2026"
  },
  leadership: {
    title: "School Captain & Prefect (2 Consecutive Years)",
    org: "Baba School, Kathmandu",
    signatories: "Principal & Student Council Governance Board.",
    desc: "Served 2 consecutive years in student leadership as School Captain and Prefect. Coordinated school activities, inter-school athletic tournaments, and student mentorship initiatives.",
    date: "2 Years Leadership Tenure",
    recordId: "LEAD-BABA-CAPTAIN-2YR"
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

  function openCert(certKey) {
    const data = CERT_DATA[certKey];
    if (!data) return;

    titleEl.innerText = data.title;
    orgEl.innerText = data.org;
    sigEl.innerText = data.signatories;
    descEl.innerText = data.desc;
    dateEl.innerText = `Date: ${data.date} • ${data.recordId}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    Sound.playCyberPulse();
  }

  function closeCert() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    Sound.playTick();
  }

  document.querySelectorAll('.btn-inspect-cert, .credential-pass-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.getAttribute('data-cert');
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
// 9. INTERACTIVE COMMAND TERMINAL (⌘K / [~])
// ==========================================================================
function initTerminal() {
  const modal = document.getElementById('terminal-modal');
  const input = document.getElementById('terminal-input');
  const log = document.getElementById('terminal-log');
  const closeBtn = document.getElementById('terminal-close-btn');
  const redDot = document.getElementById('terminal-red-dot');
  const launchBtns = document.querySelectorAll('.btn-terminal-launch, #hero-terminal-btn');

  if (!modal || !input || !log) return;

  function openTerminal() {
    modal.classList.add('active');
    input.focus();
    Sound.playCyberPulse();
  }

  function closeTerminal() {
    modal.classList.remove('active');
    Sound.playTick();
  }

  launchBtns.forEach(btn => btn.addEventListener('click', openTerminal));
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
    if (e.key === '`' && !e.shiftKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      modal.classList.contains('active') ? closeTerminal() : openTerminal();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeTerminal();
    }
  });

  function appendLog(html) {
    const entry = document.createElement('div');
    entry.className = 'terminal-entry';
    entry.innerHTML = html;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  const commands = {
    help: () => `
<div class="cmd-list">
  <div><span class="cmd-highlight">about</span>        - Summary of Aayush Bhatta (@aayushifty)</div>
  <div><span class="cmd-highlight">athlete</span>      - Athletic background, sports & physical discipline</div>
  <div><span class="cmd-highlight">fly</span>          - Launch the aerodynamic paper airplane glider</div>
  <div><span class="cmd-highlight">credentials</span>  - Verified certificates, MUN & tournament record</div>
  <div><span class="cmd-highlight">projects</span>     - Systems, AI agents & hackathon prototypes</div>
  <div><span class="cmd-highlight">jarvis</span>       - JARVIS autonomous computer companion telemetry</div>
  <div><span class="cmd-highlight">skills</span>       - Technical stack & engineering proficiencies</div>
  <div><span class="cmd-highlight">photos</span>       - Curated moments & visual story exhibits</div>
  <div><span class="cmd-highlight">contact</span>      - Official transmission links & email</div>
  <div><span class="cmd-highlight">clear</span>        - Clear terminal screen</div>
  <div><span class="cmd-highlight">exit</span>         - Close terminal session</div>
</div>`,

    about: () => `
<div><strong style="color:#00f0ff;">Aayush Bhatta</strong> (@aayushifty)</div>
<div>Location: Kathmandu, Nepal • 27.7172° N, 85.3240° E</div>
<div>Discipline: Creative Technologist, Systems Builder & Competitive Athlete.</div>
<div>Building autonomous computer agents, responsive hardware, and creative tech media.</div>`,

    athlete: () => `
<div><strong style="color:#fbbf24;">⚡ Athletic Profile & Discipline</strong></div>
<div>• Basketball: High court IQ, transition speed, and spatial playmaking.</div>
<div>• Football: High-tempo stamina, competitive teamwork, and agility.</div>
<div>• Trail Sprints: High-altitude endurance conditioning across Kathmandu valley hills.</div>
<div>• Philosophy: Physical fitness directly underpins relentless engineering focus.</div>`,

    fly: () => {
      window.flightController?.launchAcrobaticFlight();
      return `<div style="color:#facc15;">✈ Aerodynamic paper glider launched! Watch the skies...</div>`;
    },

    credentials: () => `
<div><strong style="color:#a855f7;">★ Verified Tournament & Credential Record:</strong></div>
<div>1. NYC MUN 2023: Delegate of Switzerland (UNEP) — Signed by Deputy PM & UN Resident Coordinator.</div>
<div>2. 9th MahaKumbha 2022: National Schools Debating Championship (Pre-Worlds).</div>
<div>3. 13 MUN Assemblies: 6× Best Delegate, 3× Outstanding Delegate honors.</div>
<div>4. National Hackathons: BNKS National Hackathon, Build Nepal Hackathon (ICES), MBMC IdeaX.</div>
<div>5. NIMHANS Digital Academy: Cognitive Behavioral Therapy (CBT) Certification.</div>
<div>6. School Leadership: 2-Year School Captain & Prefect (Baba School).</div>`,

    jarvis: () => `
<div><strong style="color:#00f0ff;">JARVIS Autonomous Companion (v0.2.0)</strong></div>
<div>• Core: Local Llama 3.2 via Ollama (100% private execution).</div>
<div>• Interface: High-fps screen mirroring & low-latency touch/voice bridge.</div>
<div>• Speech: British neural TTS engine & Web Speech API pipeline.</div>
<div>• Tunnel: Instant Cloudflare zero-trust network tunnel.</div>
<div>• Repo: github.com/aayushbhatta230-ux/jarvis-ai-agent</div>`,

    projects: () => `
<div><strong>Featured Systems:</strong></div>
<div>• <a href="https://github.com/aayushbhatta230-ux/jarvis-ai-agent" target="_blank" style="color:#00f0ff;">jarvis-ai-agent</a>: Autonomous voice/touch OS assistant.</div>
<div>• <a href="https://github.com/aayushbhatta230-ux/handchord" target="_blank" style="color:#00f0ff;">handchord</a>: MediaPipe hand tracking computer vision musical synthesizer.</div>
<div>• <a href="https://github.com/aayushbhatta230-ux/KrishiPath" target="_blank" style="color:#00f0ff;">KrishiPath / KrishiTrust</a>: Agricultural transit shock telemetry & MPU6050 scoring.</div>`,

    skills: () => `
<div><strong>Engineering Stack:</strong></div>
<div>• Languages: Python, JavaScript, HTML5/CSS3, C++ (Arduino/ESP32)</div>
<div>• AI/CV: Ollama, Llama 3.2, MediaPipe, SpeechRecognition, Neural TTS</div>
<div>• Hardware: Arduino Uno, ESP32, MPU6050, HX711, HC-SR04, GPS</div>
<div>• Web/3D: Three.js, WebGL, Web Audio API, React, Vite, Canvas API</div>`,

    photos: () => `
<div><strong>Visual Exhibits:</strong></div>
<div>01. Agility & Athletic Edge (Spider-Man suit fitness)</div>
<div>02. The Golden Horizon (Kathmandu valley sunset)</div>
<div>03. Summit Mindset (Mountain summit endurance)</div>
<div>04. Wilderness Sanctuary (Pine river trail runs)</div>
<div>05. Creator Frequency (Late builds & workouts @aayushifty)</div>`,

    contact: () => `
<div>Email: <a href="mailto:aayushbhatta230@gmail.com" style="color:#00f0ff;">aayushbhatta230@gmail.com</a></div>
<div>GitHub: <a href="https://github.com/aayushbhatta230-ux" target="_blank" style="color:#00f0ff;">github.com/aayushbhatta230-ux</a></div>
<div>TikTok: <a href="https://www.tiktok.com/@aayushifty" target="_blank" style="color:#fe2c55;">tiktok.com/@aayushifty</a></div>
<div>Instagram: <a href="https://instagram.com/aayushifty" target="_blank" style="color:#38bdf8;">instagram.com/aayushifty</a></div>`,

    clear: () => {
      log.innerHTML = '';
      return '';
    },

    exit: () => {
      closeTerminal();
      return 'Session closed.';
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim().toLowerCase();
      input.value = '';

      if (!val) return;

      appendLog(`<div><span class="prompt-symbol">aayush@system:~$</span> ${val}</div>`);

      if (commands[val]) {
        const result = commands[val]();
        if (result) appendLog(result);
      } else {
        appendLog(`<div style="color: #f87171;">Command not found: '${val}'. Type <span class="cmd-highlight">help</span> for available commands.</div>`);
      }
    }
  });
}

// ==========================================================================
// 10. MAGNETIC CURSOR SYSTEM
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

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }

  requestAnimationFrame(renderCursor);

  // Magnetic hover effects on interactives
  const interactives = document.querySelectorAll('a, button, .photo-card, .bento-box, .credential-pass-card, .interactive-glider');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'rgba(0, 240, 255, 0.8)';
      ring.style.backgroundColor = 'rgba(0, 240, 255, 0.06)';
    });

    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(0, 240, 255, 0.4)';
      ring.style.backgroundColor = 'transparent';
    });
  });
}

// ==========================================================================
// 11. JARVIS SIMULATED WAVEFORM OSCILLOSCOPE
// ==========================================================================
function initJARVISWave() {
  const canvas = document.getElementById('jarvis-wave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.offsetWidth || 300;
  let height = canvas.height = 70;

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth || 300;
    height = canvas.height = 70;
  });

  let phase = 0;

  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';

    ctx.beginPath();
    const sliceWidth = width / 60;
    let x = 0;

    for (let i = 0; i < 60; i++) {
      const v = Math.sin(i * 0.25 + phase) * Math.cos(i * 0.1 + phase * 0.5);
      const y = (height / 2) + v * (height * 0.32);

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
// 12. TOAST NOTIFICATIONS & EMAIL COPY
// ==========================================================================
function showToast(text) {
  const toast = document.getElementById('toast-msg');
  if (!toast) return;
  toast.innerText = text;
  toast.classList.add('show');
  Sound.playChime(659.25);
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function initEmailCopy() {
  const btn = document.getElementById('btn-copy-email');
  if (!btn) return;

  btn.addEventListener('click', () => {
    navigator.clipboard.writeText('aayushbhatta230@gmail.com').then(() => {
      showToast('✓ Verified email copied: aayushbhatta230@gmail.com');
    }).catch(() => {
      showToast('aayushbhatta230@gmail.com');
    });
  });
}

// ==========================================================================
// 13. SOUND TOGGLE BUTTON BINDING
// ==========================================================================
function initSoundToggle() {
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    const isActive = Sound.toggleAmbient();
    const label = soundBtn.querySelector('.sound-label');

    if (isActive) {
      soundBtn.classList.add('active');
      if (label) label.innerText = 'AUDIO: ON';
      showToast('🔊 Ambient Soundscape Active');
    } else {
      soundBtn.classList.remove('active');
      if (label) label.innerText = 'AUDIO: OFF';
      showToast('🔇 Audio Muted');
    }
  });
}

// ==========================================================================
// INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  window.flightController = new PaperPlaneFlightController();
  initChronometer();
  initCardTilt();
  initTextRotator();
  initLightbox();
  initCertificateModal();
  initTerminal();
  initCursor();
  initJARVISWave();
  initEmailCopy();
  initSoundToggle();
});
