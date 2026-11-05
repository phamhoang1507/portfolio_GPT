(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');
  const themeButton = document.querySelector('#theme-toggle');
  const colorPreference = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme = null;

  try {
    const value = localStorage.getItem('portfolio-theme');
    if (value === 'light' || value === 'dark') savedTheme = value;
  } catch {
    // Theme switching remains available when browser storage is restricted.
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111310' : '#f5f6f0');
    if (themeButton) {
      const label = theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
      themeButton.setAttribute('aria-label', label);
      themeButton.title = label;
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  applyTheme(savedTheme || (colorPreference.matches ? 'dark' : 'light'));
  themeButton?.addEventListener('click', () => {
    savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(savedTheme);
    try {
      localStorage.setItem('portfolio-theme', savedTheme);
    } catch {
      // The selected theme still lasts for the current page session.
    }
  });
  colorPreference.addEventListener('change', (event) => {
    if (!savedTheme) applyTheme(event.matches ? 'dark' : 'light');
  });

  const menuButton = document.querySelector('#menu-toggle');
  const navigation = document.querySelector('#site-nav');
  const desktop = window.matchMedia('(min-width: 761px)');

  function closeMenu(restoreFocus = false) {
    if (!menuButton || !navigation) return;
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Mở menu điều hướng');
    if (restoreFocus) menuButton.focus();
  }

  menuButton?.addEventListener('click', () => {
    if (!navigation) return;
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Đóng menu điều hướng' : 'Mở menu điều hướng');
    navigation.classList.toggle('is-open', open);
  });
  navigation?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (!navigation?.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
  });
  desktop.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('[data-category]')];
  const filterStatus = document.querySelector('#filter-status');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let visible = 0;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.setAttribute('aria-pressed', String(selected));
        item.classList.toggle('is-active', selected);
      });
      projectCards.forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
        if (!card.hidden) visible += 1;
      });
      if (filterStatus) filterStatus.textContent = `Đang hiển thị ${visible} dự án.`;
    });
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const command = document.querySelector('#terminal-command');
  const output = document.querySelector('#terminal-output');
  const terminalButton = document.querySelector('#terminal-toggle');
  if (!command || !output) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [
    {
      command: 'terraform apply',
      lines: [
        ['Reading current infrastructure state...', 'is-muted'],
        ['Plan: 3 to add, 0 to change, 0 to destroy.', ''],
        ['aws_instance.app: Creating...', ''],
        ['aws_s3_bucket.assets: Creating...', ''],
        ['Apply complete! Resources: 3 added.', 'is-success'],
        ['Environment: staging · Infrastructure ready', 'is-muted']
      ]
    },
    {
      command: 'docker compose up --build',
      lines: [
        ['[+] Building multi-stage images', 'is-muted'],
        ['✔ api       Built', 'is-success'],
        ['✔ frontend  Built', 'is-success'],
        ['✔ mongodb   Started', 'is-success'],
        ['api  | Application startup complete.', ''],
        ['[+] Stack ready · React / FastAPI / MongoDB', 'is-success']
      ]
    }
  ];

  let sceneIndex = 0;
  let characterIndex = 0;
  let lineIndex = 0;
  let phase = 'typing';
  let timer = null;
  let delay = 300;
  let paused = false;

  function stopTimer() {
    window.clearTimeout(timer);
    timer = null;
  }

  function appendLine([text, style]) {
    const line = document.createElement('div');
    line.className = `terminal-line${style ? ` ${style}` : ''}`;
    line.textContent = text;
    output.append(line);
  }

  function syncButton() {
    command.closest('.terminal')?.classList.toggle('is-paused', paused || reducedMotion.matches);
    if (!terminalButton) return;
    terminalButton.disabled = reducedMotion.matches;
    terminalButton.textContent = reducedMotion.matches ? 'Giảm chuyển động' : paused ? 'Tiếp tục' : 'Tạm dừng';
    terminalButton.setAttribute('aria-pressed', String(paused));
    terminalButton.setAttribute('aria-label', reducedMotion.matches
      ? 'Hiệu ứng đã tắt theo tùy chọn giảm chuyển động'
      : paused ? 'Tiếp tục mô phỏng terminal' : 'Tạm dừng mô phỏng terminal');
  }

  function schedule() {
    stopTimer();
    if (!paused && !document.hidden && !reducedMotion.matches) timer = window.setTimeout(step, delay);
  }

  function step() {
    const scene = scenes[sceneIndex];
    if (phase === 'typing') {
      characterIndex += 1;
      command.textContent = scene.command.slice(0, characterIndex);
      delay = 65;
      if (characterIndex >= scene.command.length) {
        phase = 'output';
        delay = 400;
      }
    } else if (phase === 'output') {
      appendLine(scene.lines[lineIndex]);
      lineIndex += 1;
      delay = 420;
      if (lineIndex >= scene.lines.length) {
        phase = 'next';
        delay = 4200;
      }
    } else {
      sceneIndex = (sceneIndex + 1) % scenes.length;
      characterIndex = 0;
      lineIndex = 0;
      phase = 'typing';
      command.textContent = '';
      output.replaceChildren();
      delay = 600;
    }
    schedule();
  }

  function setMotion() {
    stopTimer();
    syncButton();
    if (reducedMotion.matches) {
      command.textContent = scenes[0].command;
      output.replaceChildren();
      scenes[0].lines.forEach(appendLine);
    } else {
      sceneIndex = 0;
      characterIndex = 0;
      lineIndex = 0;
      phase = 'typing';
      delay = 300;
      command.textContent = '';
      output.replaceChildren();
      schedule();
    }
  }

  terminalButton?.addEventListener('click', () => {
    paused = !paused;
    syncButton();
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', setMotion);
  window.addEventListener('pagehide', stopTimer);
  window.addEventListener('pageshow', schedule);
  setMotion();
})();
