// PRESENTATION NAVIGATION, AUDIO, AUTO-FLIP DECK CAROUSEL & MOBILE CONTROLS SCRIPT

let currentSlide = 0;
let sfxEnabled = true;
let bgmEnabled = false;
let bgmInterval = null;

const slides = document.querySelectorAll('.slide');
const counter = document.getElementById('counter');
const drawerList = document.getElementById('drawer-list');
const totalSlides = slides.length;

// DECK STATES & AUTO-FLIP TIMERS
const deckStates = {};
const deckTimers = {};

// WEB AUDIO SYNTHESIZER FOR SOUND EFFECTS & BGM
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSoundEffect(type) {
  if (!sfxEnabled) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'slide') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'web') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'cheer') {
    [400, 500, 600, 800].forEach((freq) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);
      o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      o.start(now);
      o.stop(now + 0.4);
    });
  } else if (type === 'buzzer') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

// BGM CONTROL
function toggleBGM() {
  bgmEnabled = !bgmEnabled;
  const bgmBtn = document.getElementById('bgm-btn');

  if (bgmEnabled) {
    bgmBtn.textContent = '🎶 BGM ON';
    startBGMLoop();
  } else {
    bgmBtn.textContent = '🎵 BGM OFF';
    stopBGMLoop();
  }
}

function startBGMLoop() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  stopBGMLoop();

  const notes = [220, 261.63, 329.63, 440, 329.63, 261.63, 196, 246.94, 293.66, 392, 293.66, 246.94];
  let noteIdx = 0;

  bgmInterval = setInterval(() => {
    if (!bgmEnabled) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[noteIdx], audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);

    noteIdx = (noteIdx + 1) % notes.length;
  }, 220);
}

function stopBGMLoop() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

function toggleSFX() {
  sfxEnabled = !sfxEnabled;
  document.getElementById('sfx-btn').textContent = sfxEnabled ? '🔊 SFX ON' : '🔇 SFX OFF';
}

// INTERACTIVE CARD DECK CAROUSEL LOGIC WITH AUTO-FLIP
function initDecks() {
  document.querySelectorAll('.interactive-deck-wrapper').forEach((wrapper) => {
    const id = wrapper.id;
    deckStates[id] = 0;
    updateDeckView(id);

    // Auto-flip timer (every 3.5 seconds)
    startDeckAutoFlip(id);

    // Pause auto-flip on hover or touch
    wrapper.addEventListener('mouseenter', () => stopDeckAutoFlip(id));
    wrapper.addEventListener('mouseleave', () => startDeckAutoFlip(id));
    wrapper.addEventListener('touchstart', () => stopDeckAutoFlip(id), { passive: true });
  });
}

function startDeckAutoFlip(deckId) {
  stopDeckAutoFlip(deckId);
  deckTimers[deckId] = setInterval(() => {
    cycleDeck(deckId, 1, true);
  }, 3500);
}

function stopDeckAutoFlip(deckId) {
  if (deckTimers[deckId]) {
    clearInterval(deckTimers[deckId]);
    deckTimers[deckId] = null;
  }
}

function cycleDeck(deckId, direction, isAuto = false) {
  const wrapper = document.getElementById(deckId);
  if (!wrapper) return;

  // Only auto-flip if the slide containing this deck is active
  const slide = wrapper.closest('.slide');
  if (isAuto && slide && !slide.classList.contains('active')) {
    return;
  }

  const cards = wrapper.querySelectorAll('.deck-card');
  const count = cards.length;
  if (count === 0) return;

  deckStates[deckId] = (deckStates[deckId] + direction + count) % count;
  updateDeckView(deckId);

  if (!isAuto) {
    playSoundEffect('web');
  }
}

function updateDeckView(deckId) {
  const wrapper = document.getElementById(deckId);
  if (!wrapper) return;
  const cards = wrapper.querySelectorAll('.deck-card');
  const counterBadge = document.getElementById(`counter-${deckId}`);
  const count = cards.length;
  const activeIdx = deckStates[deckId];

  cards.forEach((card, idx) => {
    card.classList.remove('active', 'next', 'prev');
    if (idx === activeIdx) {
      card.classList.add('active');
    } else if (idx === (activeIdx + 1) % count) {
      card.classList.add('next');
    } else if (idx === (activeIdx - 1 + count) % count) {
      card.classList.add('prev');
    }
  });

  if (counterBadge) {
    counterBadge.textContent = `${activeIdx + 1} / ${count}`;
  }
}

// POPULATE SLIDE DRAWER
function buildSlideDrawer() {
  drawerList.innerHTML = '';
  slides.forEach((slide, index) => {
    const title = slide.getAttribute('data-title') || `Slide ${index + 1}`;
    const li = document.createElement('li');
    li.className = `drawer-item ${index === currentSlide ? 'active' : ''}`;
    li.textContent = `${index + 1}. ${title}`;
    li.onclick = () => {
      goToSlide(index);
      toggleMenu();
    };
    drawerList.appendChild(li);
  });
}

function toggleMenu() {
  const drawer = document.getElementById('slide-drawer');
  drawer.classList.toggle('open');
}

function updateSlideView() {
  slides.forEach((slide, index) => {
    if (index === currentSlide) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
  buildSlideDrawer();
  playSoundEffect('slide');
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlideView();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlideView();
  }
}

function goToSlide(slideIndex) {
  if (slideIndex >= 0 && slideIndex < totalSlides) {
    currentSlide = slideIndex;
    updateSlideView();
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => console.log(err));
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// MODAL HANDLERS
function openPollModal() {
  document.getElementById('poll-modal').classList.add('open');
}

function closePollModal() {
  document.getElementById('poll-modal').classList.remove('open');
}

function castVote(option) {
  const resultDiv = document.getElementById('vote-result');
  resultDiv.textContent = `✅ Vote recorded for: ${option}! Thanks for participating.`;
  playSoundEffect('cheer');
}

function openGameModal() {
  document.getElementById('game-modal').classList.add('open');
}

function closeGameModal() {
  document.getElementById('game-modal').classList.remove('open');
}

function openHelpModal() {
  document.getElementById('help-modal').classList.add('open');
}

function closeHelpModal() {
  document.getElementById('help-modal').classList.remove('open');
}

// KEYBOARD NAVIGATION CONTROLS
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePollModal();
    closeGameModal();
    closeHelpModal();
    document.getElementById('slide-drawer').classList.remove('open');
    return;
  }

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
    case 'PageDown':
      nextSlide();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'PageUp':
      prevSlide();
      break;
    case 'Home':
      goToSlide(0);
      break;
    case 'End':
      goToSlide(totalSlides - 1);
      break;
    case 'm':
    case 'M':
      toggleMenu();
      break;
    case 'f':
    case 'F':
      toggleFullscreen();
      break;
    case '?':
      openHelpModal();
      break;
  }
});

// TOUCH / SWIPE CONTROLS FOR MOBILE & MESSENGER BROWSER
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  const deckWrapper = e.target.closest('.interactive-deck-wrapper');
  if (deckWrapper && Math.abs(diffX) > 30) {
    if (diffX < 0) cycleDeck(deckWrapper.id, 1);
    if (diffX > 0) cycleDeck(deckWrapper.id, -1);
    return;
  }

  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
    if (diffX < 0) nextSlide();
    if (diffX > 0) prevSlide();
  }
}, { passive: true });

// INITIALIZE
initDecks();
updateSlideView();
