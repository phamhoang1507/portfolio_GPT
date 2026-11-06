(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  const messages = {
    vi: {
      'language.label': 'Chọn ngôn ngữ',
      'language.vi': 'Chuyển sang tiếng Việt',
      'language.en': 'Chuyển sang tiếng Anh',
      'language.changed': 'Đã chuyển sang tiếng Việt.',
      'theme.light': 'Chuyển sang giao diện sáng',
      'theme.dark': 'Chuyển sang giao diện tối',
      'menu.open': 'Mở menu điều hướng',
      'menu.close': 'Đóng menu điều hướng',
      'projects.count': 'Hiển thị {count} dự án',
      'projects.countOne': 'Hiển thị {count} dự án',
      'email.copied': 'Đã sao chép địa chỉ email.',
      'email.fallback': 'Bạn có thể gửi email tới {email}',
      'terminal.pause': 'Tạm dừng',
      'terminal.resume': 'Tiếp tục',
      'terminal.reduced': 'Giảm chuyển động',
      'terminal.pauseLabel': 'Tạm dừng mô phỏng terminal',
      'terminal.resumeLabel': 'Tiếp tục mô phỏng terminal',
      'terminal.reducedLabel': 'Hiệu ứng đã tắt theo tùy chọn giảm chuyển động',
      'terminal.init.modules': 'Khởi tạo các module...',
      'terminal.init.config': 'Đọc cấu hình module VPC',
      'terminal.init.providers': 'Khởi tạo provider plugins...',
      'terminal.init.ready': 'Terraform đã được khởi tạo cho lab.',
      'terminal.init.next': 'Bước tiếp theo: xem terraform plan',
      'terminal.init.note': 'Chỉ mô phỏng · Không kết nối AWS',
      'terminal.plan.read': 'Đọc cấu hình lab...',
      'terminal.plan.vpc': 'Cấu hình VPC và subnet',
      'terminal.plan.network': 'Sơ đồ mạng public / private',
      'terminal.plan.review': 'Kiểm tra thay đổi trước khi apply.',
      'terminal.plan.example': 'Kết quả plan chỉ dùng để minh họa.',
      'terminal.plan.note': 'Không thay đổi hạ tầng thực tế.',
      'terminal.compose.build': '[+] Build image của các dịch vụ',
      'terminal.compose.api': '[+] Container FastAPI đã khởi động',
      'terminal.compose.frontend': '[+] React dev server đã khởi động',
      'terminal.compose.database': '[+] Container MongoDB đã khởi động',
      'terminal.compose.flow': 'React -> FastAPI -> MongoDB',
      'terminal.compose.note': 'Stack phát triển · Kết quả mô phỏng'
    },
    en: {
      'language.label': 'Choose language',
      'language.vi': 'Switch to Vietnamese',
      'language.en': 'Switch to English',
      'language.changed': 'Language changed to English.',
      'theme.light': 'Switch to light mode',
      'theme.dark': 'Switch to dark mode',
      'menu.open': 'Open navigation menu',
      'menu.close': 'Close navigation menu',
      'projects.count': 'Showing {count} projects',
      'projects.countOne': 'Showing {count} project',
      'email.copied': 'Email address copied.',
      'email.fallback': 'You can email me at {email}',
      'terminal.pause': 'Pause',
      'terminal.resume': 'Resume',
      'terminal.reduced': 'Reduced motion',
      'terminal.pauseLabel': 'Pause terminal simulation',
      'terminal.resumeLabel': 'Resume terminal simulation',
      'terminal.reducedLabel': 'Animation disabled by your reduced motion preference',
      'terminal.init.modules': 'Initializing modules...',
      'terminal.init.config': 'Loading VPC module configuration',
      'terminal.init.providers': 'Initializing provider plugins...',
      'terminal.init.ready': 'Terraform initialized for this lab.',
      'terminal.init.next': 'Next step: inspect terraform plan',
      'terminal.init.note': 'Simulation only · No AWS connection',
      'terminal.plan.read': 'Reading lab configuration...',
      'terminal.plan.vpc': 'VPC and subnet configuration',
      'terminal.plan.network': 'Public / private network layout',
      'terminal.plan.review': 'Review changes before applying.',
      'terminal.plan.example': 'Plan output is illustrative only.',
      'terminal.plan.note': 'No infrastructure changes applied.',
      'terminal.compose.build': '[+] Building service images',
      'terminal.compose.api': '[+] FastAPI container started',
      'terminal.compose.frontend': '[+] React development server started',
      'terminal.compose.database': '[+] MongoDB container started',
      'terminal.compose.flow': 'React -> FastAPI -> MongoDB',
      'terminal.compose.note': 'Development stack · Simulated output'
    }
  };

  const validLanguage = (value) => value === 'vi' || value === 'en';
  let currentLanguage = 'vi';
  let savedLanguage = null;
  let requestedLanguage = null;
  try {
    const value = localStorage.getItem('portfolio-language');
    if (validLanguage(value)) savedLanguage = value;
  } catch {
    // Language selection remains available without browser storage.
  }
  try {
    const value = new URL(window.location.href).searchParams.get('lang');
    if (validLanguage(value)) requestedLanguage = value;
  } catch {
    // An embedded or restricted page can still use the language controls.
  }
  currentLanguage = requestedLanguage || savedLanguage || 'vi';

  function t(key, values = {}) {
    const text = messages[currentLanguage]?.[key] ?? messages.vi[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(values, name) ? String(values[name]) : match);
  }

  const catalog = window.PORTFOLIO_TRANSLATIONS || {};
  const translatedText = [...document.querySelectorAll('[data-i18n]')].map((element) => ({
    element,
    key: element.dataset.i18n,
    fallback: element.textContent
  }));
  const translatedAttributes = [];
  for (const name of ['aria-label', 'alt', 'content', 'title', 'placeholder']) {
    document.querySelectorAll(`[data-i18n-${name}]`).forEach((element) => {
      translatedAttributes.push({
        element,
        name,
        key: element.getAttribute(`data-i18n-${name}`),
        fallback: element.getAttribute(name) || ''
      });
    });
  }
  const languageSwitch = document.querySelector('.language-switch');
  const languageButtons = [...document.querySelectorAll('#language-switch button[data-language]')];
  const languageStatus = document.querySelector('#language-status');
  let refreshTerminalLanguage = () => {};

  function translateStaticContent() {
    translatedText.forEach(({ element, key, fallback }) => {
      element.textContent = catalog[currentLanguage]?.[key] ?? catalog.vi?.[key] ?? fallback;
    });
    translatedAttributes.forEach(({ element, name, key, fallback }) => {
      element.setAttribute(name, catalog[currentLanguage]?.[key] ?? catalog.vi?.[key] ?? fallback);
    });
  }

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
    const label = t(theme === 'dark' ? 'theme.light' : 'theme.dark');
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

  const menuButton = document.querySelector('#menu-toggle');
  const navigation = document.querySelector('#site-nav');
  const desktop = window.matchMedia('(min-width: 801px)');

  function syncMenuLabel() {
    if (!menuButton) return;
    menuButton.setAttribute('aria-label', t(menuButton.getAttribute('aria-expanded') === 'true' ? 'menu.close' : 'menu.open'));
  }

  function closeMenu(restoreFocus = false) {
    if (!menuButton || !navigation) return;
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    syncMenuLabel();
    if (restoreFocus) menuButton.focus();
  }

  menuButton?.addEventListener('click', () => {
    if (!navigation) return;
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    syncMenuLabel();
    navigation.classList.toggle('is-open', open);
  });
  navigation?.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  function outsideNavigation(event) {
    if (!navigation?.contains(event.target) && !menuButton?.contains(event.target) && !languageSwitch?.contains(event.target)) closeMenu();
  }
  document.addEventListener('click', outsideNavigation);
  document.addEventListener('focusin', outsideNavigation);
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

  function syncFilterStatus() {
    const count = projectCards.filter((card) => !card.hidden).length;
    if (filterStatus) filterStatus.textContent = t(count === 1 ? 'projects.countOne' : 'projects.count', { count });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.setAttribute('aria-pressed', String(selected));
        item.classList.toggle('is-active', selected);
      });
      projectCards.forEach((card) => {
        const categories = card.dataset.category.trim().split(/\s+/);
        card.hidden = filter !== 'all' && !categories.includes(filter);
      });
      syncFilterStatus();
    });
  });

  const copyButton = document.querySelector('#copy-email');
  const copyStatus = document.querySelector('#copy-status');
  let copyState = null;
  let copyRequest = 0;

  function syncCopyStatus() {
    if (!copyStatus || !copyState) return;
    copyStatus.textContent = t(copyState, { email: copyButton?.dataset.email || '' });
  }

  copyButton?.addEventListener('click', async () => {
    const email = copyButton.dataset.email;
    if (!email || !copyStatus) return;
    const request = ++copyRequest;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      if (request !== copyRequest) return;
      copyState = 'email.copied';
    } catch {
      if (request !== copyRequest) return;
      copyState = 'email.fallback';
    }
    syncCopyStatus();
  });

  function applyLanguage(language, { announce = false, persist = false, updateUrl = false } = {}) {
    currentLanguage = validLanguage(language) ? language : 'vi';
    root.lang = currentLanguage;
    root.dataset.language = currentLanguage;
    translateStaticContent();
    languageSwitch?.setAttribute('aria-label', t('language.label'));
    languageButtons.forEach((button) => {
      const selected = button.dataset.language === currentLanguage;
      button.setAttribute('aria-pressed', String(selected));
      const label = t(`language.${button.dataset.language}`);
      button.setAttribute('aria-label', button.dataset.language === 'vi' ? 'Tiếng Việt' : 'English');
      button.title = label;
    });
    applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
    syncMenuLabel();
    syncFilterStatus();
    syncCopyStatus();
    refreshTerminalLanguage();
    if (announce && languageStatus) languageStatus.textContent = t('language.changed');
    if (persist) {
      try {
        localStorage.setItem('portfolio-language', currentLanguage);
      } catch {
        // A language selection still works for this page session.
      }
    }
    if (updateUrl) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', currentLanguage);
        window.history.replaceState(window.history.state, '', url);
      } catch {
        // Storage and the controls can work without history access.
      }
    }
  }

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!validLanguage(button.dataset.language)) return;
      applyLanguage(button.dataset.language, { announce: true, persist: true, updateUrl: true });
    });
  });
  window.addEventListener('storage', (event) => {
    if (event.key === 'portfolio-theme' || event.key === null) {
      savedTheme = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
      applyTheme(savedTheme || (colorPreference.matches ? 'dark' : 'light'));
    }
    if (event.key === 'portfolio-language' || event.key === null) {
      applyLanguage(validLanguage(event.newValue) ? event.newValue : 'vi', { updateUrl: true });
    }
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const command = document.querySelector('#terminal-command');
  const output = document.querySelector('#terminal-output');
  const context = document.querySelector('#terminal-context');
  const terminalButton = document.querySelector('#terminal-toggle');
  if (command && output) {
    output.setAttribute('aria-hidden', 'true');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const scenes = [
      {
        context: '~/terraformCICD/staging',
        command: 'terraform init',
        lines: [
          ['terminal.init.modules', 'is-muted'],
          ['terminal.init.config', ''],
          ['terminal.init.providers', ''],
          ['terminal.init.ready', 'is-success'],
          ['terminal.init.next', ''],
          ['terminal.init.note', 'is-muted']
        ]
      },
      {
        context: '~/terraformCICD/staging',
        command: 'terraform plan',
        lines: [
          ['terminal.plan.read', 'is-muted'],
          ['terminal.plan.vpc', ''],
          ['terminal.plan.network', ''],
          ['terminal.plan.review', 'is-success'],
          ['terminal.plan.example', ''],
          ['terminal.plan.note', 'is-muted']
        ]
      },
      {
        context: '~/shop_tech',
        command: 'docker compose up --build',
        lines: [
          ['terminal.compose.build', 'is-muted'],
          ['terminal.compose.api', 'is-success'],
          ['terminal.compose.frontend', 'is-success'],
          ['terminal.compose.database', 'is-success'],
          ['terminal.compose.flow', ''],
          ['terminal.compose.note', 'is-muted']
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

    function appendLine([key, style]) {
      const line = document.createElement('div');
      line.className = `terminal-line${style ? ` ${style}` : ''}`;
      line.dataset.terminalLine = key;
      line.textContent = t(key);
      output.append(line);
    }

    function syncTerminalButton() {
      command.closest('.terminal')?.classList.toggle('is-paused', paused || reducedMotion.matches);
      if (!terminalButton) return;
      terminalButton.disabled = reducedMotion.matches;
      terminalButton.textContent = t(reducedMotion.matches ? 'terminal.reduced' : paused ? 'terminal.resume' : 'terminal.pause');
      terminalButton.setAttribute('aria-pressed', String(paused));
      terminalButton.setAttribute('aria-label', t(reducedMotion.matches
        ? 'terminal.reducedLabel'
        : paused ? 'terminal.resumeLabel' : 'terminal.pauseLabel'));
    }

    refreshTerminalLanguage = () => {
      syncTerminalButton();
      output.querySelectorAll('[data-terminal-line]').forEach((line) => {
        line.textContent = t(line.dataset.terminalLine);
      });
    };

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
      syncTerminalButton();
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
      syncTerminalButton();
      schedule();
    });
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', setMotion);
    window.addEventListener('pagehide', stopTimer);
    window.addEventListener('pageshow', schedule);
    setMotion();
  }

  applyLanguage(currentLanguage, { persist: Boolean(requestedLanguage) });
})();
