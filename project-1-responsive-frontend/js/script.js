(() => {
  'use strict';

  /* ------------------------------------------------------------
     Mobile nav toggle
  ------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------
     Theme toggle (persisted so a returning visit keeps the choice)
  ------------------------------------------------------------ */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('focal-theme');

  if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('focal-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('focal-theme', 'dark');
    }
  });

  /* ------------------------------------------------------------
     FAQ accordion
  ------------------------------------------------------------ */
  document.querySelectorAll('.faq-question').forEach((question) => {
    const answer = question.nextElementSibling;
    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? '0px' : `${answer.scrollHeight}px`;
    });
  });

  /* ------------------------------------------------------------
     Focus timer
     A simple state machine: focus -> break -> focus, driven by
     setInterval. The ring's stroke-dashoffset is derived from
     the remaining fraction of the current phase.
  ------------------------------------------------------------ */
  const RING_CIRCUMFERENCE = 565.48;
  const BREAK_SECONDS = 5 * 60;
  const LONG_BREAK_SECONDS = 15 * 60;

  const timeEl = document.getElementById('timerTime');
  const labelEl = document.getElementById('timerLabel');
  const ringEl = document.getElementById('ringProgress');
  const startPauseBtn = document.getElementById('startPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const sessionCountEl = document.getElementById('sessionCount');
  const lengthButtons = document.querySelectorAll('.length-btn');

  const todayKey = () => `focal-sessions-${new Date().toDateString()}`;

  const state = {
    focusSeconds: 25 * 60,
    secondsLeft: 25 * 60,
    totalSeconds: 25 * 60,
    mode: 'focus', // 'focus' | 'break'
    running: false,
    intervalId: null,
    sessions: Number(localStorage.getItem(todayKey())) || 0,
  };

  sessionCountEl.textContent = state.sessions;

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateDisplay() {
    timeEl.textContent = formatTime(state.secondsLeft);
    labelEl.textContent = state.mode === 'focus' ? 'Focus' : 'Break';
    ringEl.classList.toggle('is-break', state.mode === 'break');

    const fraction = state.secondsLeft / state.totalSeconds;
    ringEl.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - fraction));
  }

  function tick() {
    if (state.secondsLeft > 0) {
      state.secondsLeft -= 1;
      updateDisplay();
      return;
    }

    if (state.mode === 'focus') {
      state.sessions += 1;
      localStorage.setItem(todayKey(), String(state.sessions));
      sessionCountEl.textContent = state.sessions;

      const isLongBreak = state.sessions % 4 === 0;
      state.mode = 'break';
      state.totalSeconds = isLongBreak ? LONG_BREAK_SECONDS : BREAK_SECONDS;
      state.secondsLeft = state.totalSeconds;
    } else {
      state.mode = 'focus';
      state.totalSeconds = state.focusSeconds;
      state.secondsLeft = state.totalSeconds;
    }
    updateDisplay();
  }

  function start() {
    state.running = true;
    startPauseBtn.textContent = 'Pause';
    state.intervalId = window.setInterval(tick, 1000);
  }

  function pause() {
    state.running = false;
    startPauseBtn.textContent = 'Start';
    window.clearInterval(state.intervalId);
  }

  function reset() {
    pause();
    state.mode = 'focus';
    state.totalSeconds = state.focusSeconds;
    state.secondsLeft = state.focusSeconds;
    updateDisplay();
  }

  startPauseBtn.addEventListener('click', () => {
    state.running ? pause() : start();
  });

  resetBtn.addEventListener('click', reset);

  lengthButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      lengthButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const minutes = Number(btn.dataset.minutes);
      state.focusSeconds = minutes * 60;
      reset();
    });
  });

  updateDisplay();
})();
