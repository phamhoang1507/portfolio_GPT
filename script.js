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
    // The controls remain usable when browser storage is restricted.
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#11191c' : '#f8f7f4');
    if (!themeButton) return;
    const label = theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
    themeButton.setAttribute('aria-label', label);
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    themeButton.title = label;
  }

  applyTheme(savedTheme || (colorPreference.matches ? 'dark' : 'light'));
  themeButton?.addEventListener('click', () => {
    savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(savedTheme);
    try {
      localStorage.setItem('portfolio-theme', savedTheme);
    } catch {
      // This selection is preserved for the current page session.
    }
  });
  colorPreference.addEventListener('change', (event) => {
    if (!savedTheme) applyTheme(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== 'portfolio-theme') return;
    savedTheme = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    applyTheme(savedTheme || (colorPreference.matches ? 'dark' : 'light'));
  });

  const menuButton = document.querySelector('#menu-toggle');
  const navigation = document.querySelector('#site-nav');
  const desktop = window.matchMedia('(min-width: 801px)');

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
    if (event.target instanceof Element && event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (!navigation?.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
  });
  document.addEventListener('focusin', (event) => {
    if (!navigation?.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
  });
  desktop.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });

  const navLinks = [...document.querySelectorAll('[data-nav]')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const sections = navLinks.map((link) => {
      const href = link.getAttribute('href');
      return href?.startsWith('#') ? document.getElementById(href.slice(1)) : null;
    }).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    [...new Set(sections)].forEach((section) => observer.observe(section));
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('.project-card[data-category]')];
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
        const categories = card.dataset.category.trim().split(/\s+/);
        card.hidden = filter !== 'all' && !categories.includes(filter);
        if (!card.hidden) visible += 1;
      });
      if (filterStatus) filterStatus.textContent = `Hiển thị ${visible} dự án`;
    });
  });

  const copyButton = document.querySelector('#copy-email');
  const copyStatus = document.querySelector('#copy-status');
  copyButton?.addEventListener('click', async () => {
    const email = copyButton.dataset.email;
    if (!email || !copyStatus) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = 'Đã sao chép địa chỉ email.';
    } catch {
      copyStatus.textContent = `Bạn có thể gửi email tới ${email}`;
    }
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const command = document.querySelector('#terminal-command');
  const output = document.querySelector('#terminal-output');
  const context = document.querySelector('#terminal-context');
  const terminalButton = document.querySelector('#terminal-toggle');
  if (!command || !output) return;

  output.setAttribute('aria-hidden', 'true');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [
    {
      context: '~/terraformCICD/staging',
      command: 'terraform init',
      lines: [
        ['Initializing modules...', 'is-muted'],
        ['Loading VPC module configuration', ''],
        ['Initializing provider plugins...', ''],
        ['Terraform initialized for this lab.', 'is-success'],
        ['Next step: inspect terraform plan', ''],
        ['Simulation only · No AWS connection', 'is-muted']
      ]
    },
    {
      context: '~/terraformCICD/staging',
      command: 'terraform plan',
      lines: [
        ['Reading lab configuration...', 'is-muted'],
        ['VPC and subnet configuration', ''],
        ['Public / private network layout', ''],
        ['Review changes before applying.', 'is-success'],
        ['Plan output is illustrative only.', ''],
        ['No infrastructure changes applied.', 'is-muted']
      ]
    },
    {
      context: '~/shop_tech',
      command: 'docker compose up --build',
      lines: [
        ['[+] Building service images', 'is-muted'],
        ['[+] FastAPI container started', 'is-success'],
        ['[+] React development server started', 'is-success'],
        ['[+] MongoDB container started', 'is-success'],
        ['React -> FastAPI -> MongoDB', ''],
        ['Development stack · Simulated output', 'is-muted']
      ]
    }
  ];

  let sceneIndex = 0;
  let characterIndex = 0;
  let lineIndex = 0;
  let phase = 'typing';
  let timer = null;
  let delay = 350;
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

  function prepareScene() {
    characterIndex = 0;
    lineIndex = 0;
    phase = 'typing';
    command.textContent = '';
    if (context) context.textContent = scenes[sceneIndex].context;
    output.replaceChildren();
  }

  function step() {
    const scene = scenes[sceneIndex];
    if (phase === 'typing') {
      characterIndex += 1;
      command.textContent = scene.command.slice(0, characterIndex);
      delay = 65;
      if (characterIndex >= scene.command.length) {
        phase = 'output';
        delay = 350;
      }
    } else if (phase === 'output') {
      appendLine(scene.lines[lineIndex]);
      lineIndex += 1;
      delay = 400;
      if (lineIndex >= scene.lines.length) {
        phase = 'next';
        delay = 4300;
      }
    } else {
      sceneIndex = (sceneIndex + 1) % scenes.length;
      prepareScene();
      delay = 600;
    }
    schedule();
  }

  function setMotion() {
    stopTimer();
    syncButton();
    sceneIndex = 0;
    if (reducedMotion.matches) {
      command.textContent = scenes[0].command;
      if (context) context.textContent = scenes[0].context;
      output.replaceChildren();
      scenes[0].lines.forEach(appendLine);
    } else {
      prepareScene();
      delay = 350;
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
