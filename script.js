/**
 * ASTRA // NEXUS CLIENT ENGINE — Aayush Bhatta (@aayushifty)
 * 3D WebGL Space, Web Audio Synthesizer, Card Tilt Physics, Terminal, and Lightbox
 */

// ==========================================================================
// 1. WEB AUDIO SYNTHESIZER (No external audio files needed!)
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
    this.ambientGain.gain.exponentialRampToValueAtTime(0.04, now + 2.5);

    // Warm deep drone
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
      gain.gain.setValueAtTime(0.06, now);
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
}

const Sound = new CyberSoundEngine();

// ==========================================================================
// 2. THREE.JS 3D INTERACTIVE WEBGL BACKGROUND
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
// 3. 3D CARD PERSPECTIVE TILT PHYSICS
// ==========================================================================
function initCardTilt() {
  const cards = document.querySelectorAll('.spatial-hero-card, .photo-card, .bento-box');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt angle
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

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
// 4. KINETIC TEXT ROTATOR WITH DECODE EFFECT
// ==========================================================================
function initTextRotator() {
  const el = document.getElementById('rotator-text');
  if (!el) return;

  const roles = [
    "AI Systems Engineer",
    "National Debater (MahaKumbha '22)",
    "TikTok Creator @aayushifty (20k+)",
    "UI/UX Technologist",
    "UNEP Delegate (NYC MUN '23)",
    "Hardware & Robotics Builder"
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
// 5. CINEMATIC 3D PHOTO LIGHTBOX MODAL (THE 5 PHOTOS)
// ==========================================================================
const PHOTO_DATA = [
  {
    title: "Spider-Man Protocol",
    tag: "Athletic • Resilience • Spider-Man Compression Suit",
    src: "assets/images/spiderman.png",
    quote: "With great engineering curiosity comes the responsibility to build what matters.",
    story: "Channeling intense superhero discipline, physical fitness, and mental stamina in Kathmandu. A reminder to stay agile, fearless, and always ready to swing into complex challenges."
  },
  {
    title: "The Golden Horizon",
    tag: "Vision • Sunset Valley • Kathmandu Hills",
    src: "assets/images/golden_sunset.png",
    quote: "Standing at the edge of the sunset, looking toward the horizon of artificial intelligence.",
    story: "Captured overlooking the terraced valleys of Kathmandu during golden hour. A moment of quiet reflection, visualizing scalable platforms, local AI models, and national impact."
  },
  {
    title: "MahaKumbha Monolith",
    tag: "Discourse • 9th MahaKumbha • B&W Summit",
    src: "assets/images/mountain_bw.png",
    quote: "Words forge reality; structured logic refines truth.",
    story: "Atmospheric perspective reflecting competitive parliamentary debate. Competed in the 9th Annual MahaKumbha 2022 (Pre-Worlds) by Debate Network Nepal, testing argumentation under intense national scrutiny."
  },
  {
    title: "Wilderness & River Flow",
    tag: "Nature • Pine Valley • Grounding",
    src: "assets/images/forest_nature.png",
    quote: "Reconnecting with nature's raw algorithms to stay sharp in modern software design.",
    story: "Exploring Nepal's boulder-strewn rivers and forest sanctuaries. Nature offers the ultimate contrast to high-density code and deep neural nets, restoring creative energy."
  },
  {
    title: "Creator Frequency",
    tag: "Culture • TikTok Creator • Digital Identity",
    src: "assets/images/mirror_candid.png",
    quote: "Bridging tech, youth culture, and viral aesthetics under @aayushifty.",
    story: "Candid mirror capture representing creative freedom. Creator of @aayushifty, publishing tech insights, lifestyle perspectives, and connecting with over 20,000+ minds across Nepal."
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

  // Bind to cards
  document.querySelectorAll('.photo-card, .spatial-hero-card').forEach((card, i) => {
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
// 6. INTERACTIVE CYBER TERMINAL CONSOLE (⌘K / [~])
// ==========================================================================
function initTerminal() {
  const modal = document.getElementById('terminal-modal');
  const openBtns = document.querySelectorAll('.btn-terminal-launch, #hero-terminal-btn');
  const closeBtn = document.getElementById('terminal-close-btn');
  const redDot = document.getElementById('terminal-red-dot');
  const inputEl = document.getElementById('terminal-input');
  const logEl = document.getElementById('terminal-log');

  if (!modal || !inputEl) return;

  function openTerminal() {
    modal.classList.add('active');
    inputEl.focus();
    Sound.playCyberPulse();
  }

  function closeTerminal() {
    modal.classList.remove('active');
    Sound.playTick();
  }

  openBtns.forEach(btn => btn.addEventListener('click', openTerminal));
  closeBtn?.addEventListener('click', closeTerminal);
  redDot?.addEventListener('click', closeTerminal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTerminal();
  });

  window.addEventListener('keydown', (e) => {
    // ⌘K or Ctrl+K or ~
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.classList.contains('active') ? closeTerminal() : openTerminal();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeTerminal();
    }
  });

  // Command Parser
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = inputEl.value.trim();
      inputEl.value = '';
      if (!raw) return;

      appendLog(`aayush@multiverse:~$ ${raw}`, 'prompt-symbol');
      handleCommand(raw.toLowerCase());
      Sound.playTick();
    }
  });

  function appendLog(html, className = '') {
    const div = document.createElement('div');
    if (className) div.className = className;
    div.innerHTML = html;
    logEl.appendChild(div);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function handleCommand(cmd) {
    const parts = cmd.split(' ');
    const main = parts[0];

    switch (main) {
      case 'help':
        appendLog(`
Available Commands:
  <span class="cmd-highlight">about</span>      - Who is Aayush Bhatta (@aayushifty)?
  <span class="cmd-highlight">skills</span>     - AI, UI/UX, WebGL, Full-Stack engineering stack
  <span class="cmd-highlight">projects</span>   - Highlighted systems (JARVIS, HandChord, KrishiPath)
  <span class="cmd-highlight">photos</span>     - Open the 3D Holographic Gallery
  <span class="cmd-highlight">jarvis</span>     - Inspect the autonomous AI companion telemetry
  <span class="cmd-highlight">debate</span>     - 9th MahaKumbha 2022 parliamentary debate record
  <span class="cmd-highlight">mun</span>        - NYC MUN 2023 Switzerland UNEP delegate record
  <span class="cmd-highlight">music</span>      - Synthesize an 8-bit cyber chord progression
  <span class="cmd-highlight">contact</span>    - Transmission channels & handles
  <span class="cmd-highlight">clear</span>      - Clear terminal log
  <span class="cmd-highlight">exit</span>       - Close terminal window
        `);
        break;

      case 'about':
        appendLog(`
<span class="info-msg">Aayush Bhatta (@aayushifty):</span>
Technologist, UI/UX Designer, National Debater, and Content Creator based in Kathmandu, Nepal.
Active builder in national hackathons (Build Nepal, BNKS, MBMC IdeaX), delegate in NYC MUN 2023 (UNEP),
and creator of autonomous agents, vision-based synthesizers, and agritech telemetry.
        `);
        break;

      case 'skills':
        appendLog(`
<span class="success-msg">● CORE STACK:</span>
Python, PyTorch, Ollama (Llama 3.2), OpenCV, MediaPipe
JavaScript, TypeScript, Three.js, WebGL, Web Audio API, CSS3
Windows OS Automation (Win32, PyAutoGUI, SAPI), Cloudflare Tunnels
UI/UX Prototyping, Motion Design, Public Diplomacy, Parliamentary Debating
        `);
        break;

      case 'projects':
        appendLog(`
<span class="cmd-highlight">1. JARVIS AI Agent</span> - Local-first autonomous PC companion & iPhone remote mirror.
<span class="cmd-highlight">2. HandChord</span> - Computer vision webcam musical instrument via MediaPipe & Web Audio.
<span class="cmd-highlight">3. KrishiPath</span> - Transit shock monitoring and reliability analytics for agriculture.
Type <span class="info-msg">jarvis</span> to inspect the companion.
        `);
        break;

      case 'jarvis':
        appendLog(`
<span class="info-msg">JARVIS v0.2.0 Telemetry:</span>
  Status: ONLINE • Sub-second Local Neural TTS
  Tunnel: Cloudflare Quick Tunnel (Unlimited Bandwidth)
  Companion: iPhone 15 Touchpad & Frame Mirroring Active
  Voice: Edge-TTS en-GB-RyanNeural British Voice
  Github: github.com/aayushbhatta230-ux/jarvis-ai-agent
        `);
        break;

      case 'photos':
        appendLog(`<span class="success-msg">Triggering 3D Lightbox Gallery...</span>`);
        setTimeout(() => {
          closeTerminal();
          const firstCard = document.querySelector('.photo-card');
          if (firstCard) firstCard.click();
        }, 500);
        break;

      case 'debate':
        appendLog(`
<span class="info-msg">9th Annual MahaKumbha 2022 (Pre-Worlds):</span>
  Organized by: Debate Network Nepal (DNN) & Brihaspati Vidhyasadan
  Format: Parliamentary Debating Championship
  Track: High-pressure national argumentative rounds testing logic & rebuttal.
        `);
        break;

      case 'mun':
        appendLog(`
<span class="info-msg">NYC MUN 2023 (UN Nepal & National Youth Council):</span>
  Committee: United Nations Environment Programme (UNEP)
  Representation: Official Delegate of Switzerland
  Signatories: Deputy Prime Minister of Nepal & UN Resident Coordinator.
        `);
        break;

      case 'music':
        appendLog(`<span class="success-msg">Synthesizing cyber chord sequence via Web Audio API...</span>`);
        Sound.init();
        if (Sound.ctx) {
          const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
          notes.forEach((freq, idx) => {
            setTimeout(() => Sound.playChime(freq), idx * 160);
          });
        }
        break;

      case 'contact':
        appendLog(`
<span class="cmd-highlight">Transmission Channels:</span>
  TikTok: <a href="https://www.tiktok.com/@aayushifty" target="_blank" style="color: #fe2c55;">@aayushifty</a>
  GitHub: <a href="https://github.com/aayushbhatta230-ux" target="_blank" style="color: var(--cyan-glow);">github.com/aayushbhatta230-ux</a>
  Email: <span class="info-msg">aayushbhatta230@gmail.com</span>
        `);
        break;

      case 'clear':
        logEl.innerHTML = '';
        break;

      case 'exit':
      case 'quit':
        closeTerminal();
        break;

      default:
        appendLog(`Command not recognized: '<span style="color: #fe2c55;">${cmd}</span>'. Type <span class="cmd-highlight">help</span> for commands.`);
    }
  }
}

// ==========================================================================
// 7. MAGNETIC CURSOR & FOLLOW RING
// ==========================================================================
function initMagneticCursor() {
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
  });

  function lerpCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  // Hover triggers
  const interactives = document.querySelectorAll('a, button, .photo-card, .spatial-hero-card, .bento-box');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ==========================================================================
// 8. AUDIO WAVEFORM VISUALIZER SIMULATOR (JARVIS Card)
// ==========================================================================
function initWaveform() {
  const canvas = document.getElementById('jarvis-wave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let phase = 0;

  function renderWave() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00f0ff';
    ctx.beginPath();

    const w = canvas.width;
    const h = canvas.height;
    const mid = h / 2;

    for (let x = 0; x < w; x++) {
      const y = mid + Math.sin(x * 0.04 + phase) * Math.cos(x * 0.02 + phase) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    phase += 0.05;
    requestAnimationFrame(renderWave);
  }
  renderWave();
}

// ==========================================================================
// 9. COPY CLIPBOARD TOAST HELPER
// ==========================================================================
function initCopyToast() {
  const copyBtn = document.getElementById('btn-copy-email');
  const toast = document.getElementById('toast-msg');

  if (!copyBtn || !toast) return;

  copyBtn.addEventListener('click', () => {
    const email = "aayushbhatta230@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      toast.innerText = `✓ Copied ${email} to clipboard!`;
      toast.classList.add('show');
      Sound.playChime(659.25);
      setTimeout(() => toast.classList.remove('show'), 3500);
    });
  });
}

// ==========================================================================
// 10. SOUND TOGGLE BUTTON BINDING
// ==========================================================================
function initSoundToggle() {
  const btn = document.getElementById('btn-sound-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isPlaying = Sound.toggleAmbient();
    if (isPlaying) {
      btn.classList.add('sound-active');
      btn.querySelector('.sound-label').innerText = "AUDIO: ON";
    } else {
      btn.classList.remove('sound-active');
      btn.querySelector('.sound-label').innerText = "AUDIO: OFF";
    }
  });
}

// ==========================================================================
// BOOTSTRAP INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initCardTilt();
  initTextRotator();
  initLightbox();
  initTerminal();
  initMagneticCursor();
  initWaveform();
  initCopyToast();
  initSoundToggle();
});
