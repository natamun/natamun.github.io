initProjectLinkBlur();
initNavBurger();
if (!window.matchMedia('(pointer: coarse)').matches) {
  initHeroGlyphs();
}
typeTerminal();
initEmailCopy();
initRevealObserver('.about');
initRevealObserver('.timeline__item');
initRevealObserver('.skills');
initRevealObserver('.projects__stage');
initProjectsMobileDetail();

function initProjectLinkBlur() {
  document.querySelectorAll('.unit__detail-link').forEach((link) => {
    link.addEventListener('click', () => link.blur());
  });
}

function initNavBurger() {
  const navBurger = document.querySelector('.nav__burger');
  const navLinks = document.querySelector('.nav__links');

  navBurger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navBurger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navBurger.setAttribute('aria-expanded', 'false');
    });
  });
}

function typeTerminal() {
  const terminal = document.querySelector('.hero__terminal');
  if (!terminal) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  const start = () => {
    const CHAR_DELAY_RANGE = [50, 100];
    const CHAR_DELAY_STEP = 10;
    const LINE_DELAY = 120;
    const BACKSPACE_DELAY = 100;
    const TYPO_LINE = '$ whereaami';
    const TYPO_MISTAKE_PAUSE = 100;
    const TYPO_ERROR_PAUSE = 1000;

    const randomCharDelay = () => {
      const [min, max] = CHAR_DELAY_RANGE;
      const steps = Math.floor((max - min) / CHAR_DELAY_STEP);
      return min + Math.floor(Math.random() * (steps + 1)) * CHAR_DELAY_STEP;
    };

    const typeChars = (line, text, fromIndex, onDone) => {
      let i = fromIndex;
      const step = () => {
        if (i >= text.length) {
          onDone();
          return;
        }
        line.textContent += text[i];
        i++;
        setTimeout(step, randomCharDelay());
      };
      step();
    };

    const eraseChars = (line, toLength, onDone) => {
      const step = () => {
        if (line.textContent.length <= toLength) {
          onDone();
          return;
        }
        line.textContent = line.textContent.slice(0, -1);
        setTimeout(step, BACKSPACE_DELAY);
      };
      step();
    };

    const typeLocationTypo = (line, correctText, errorLine, onDone) => {
      let prefixLength = 0;
      while (
        prefixLength < TYPO_LINE.length &&
        prefixLength < correctText.length &&
        TYPO_LINE[prefixLength] === correctText[prefixLength]
      ) {
        prefixLength++;
      }

      typeChars(line, TYPO_LINE, 0, () => {
        setTimeout(() => {
          errorLine.classList.add('hero__terminal-error');
          errorLine.textContent = `> bash: ${TYPO_LINE.replace('$ ', '')}: command not found`;

          setTimeout(() => {
            errorLine.textContent = '';
            errorLine.classList.remove('hero__terminal-error');
            eraseChars(line, prefixLength, () => {
              typeChars(line, correctText, prefixLength, onDone);
            });
          }, TYPO_ERROR_PAUSE);
        }, TYPO_MISTAKE_PAUSE);
      });
    };

    const lines = [...terminal.querySelectorAll('p')];
    const originals = lines.map((line) => line.textContent);

    terminal.style.minHeight = `${terminal.offsetHeight}px`;
    terminal.style.width = `${terminal.offsetWidth}px`;

    lines.forEach((line) => {
      line.textContent = '';
    });

    let lineIndex = 0;
    let charIndex = 0;

    const typeNext = () => {
      if (lineIndex >= lines.length) {
        terminal.style.minHeight = '';
        terminal.style.width = '';
        return;
      }

      const text = originals[lineIndex];
      const line = lines[lineIndex];

      if (!text.startsWith('$')) {
        line.textContent = text;
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNext, LINE_DELAY);
        return;
      }

      if (charIndex === 0) {
        line.classList.add('is-active');

        if (text === '$ whereami' && lines[lineIndex + 1]) {
          typeLocationTypo(line, text, lines[lineIndex + 1], () => {
            line.classList.remove('is-active');
            lineIndex++;
            charIndex = 0;
            setTimeout(typeNext, LINE_DELAY);
          });
          return;
        }
      }

      if (charIndex < text.length) {
        line.textContent += text[charIndex];
        charIndex++;
        setTimeout(typeNext, randomCharDelay());
      } else {
        line.classList.remove('is-active');
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNext, LINE_DELAY);
      }
    };

    typeNext();
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    start();
  }
}

function initHeroGlyphs() {
  const container = document.querySelector('.hero__glyphs');
  if (!container) {
    return;
  }

  const CHARS = ['{', '[', '(', '#', '$', '|', '&', '*', '>', '=', '!', ';', '-', '?', ':', '/', '@'];
  const DENSITY = 3;
  const LIFETIME_RANGE = [5, 10];
  const SPEED_RANGE = [20, 40];
  const ROTATION_STEP = 30;
  const BOB_AMPLITUDE_RANGE = [10, 18];
  const BOB_DURATION_RANGE = [4, 7];
  const SPIN_DURATION_RANGE = [4, 12];

  const random = (min, max) => min + Math.random() * (max - min);

  const randomPointOnCircle = (radius) => {
    const angle = Math.random() * 2 * Math.PI;
    const r = radius * random(0.6, 1);
    return { x: (Math.cos(angle) * r).toFixed(1), y: (Math.sin(angle) * r).toFixed(1) };
  };

  const respawn = (glyph) => {
    const lifetime = random(...LIFETIME_RANGE);
    const angle = (Math.floor(Math.random() * 360) * Math.PI) / 180;
    const distance = random(...SPEED_RANGE) * lifetime;
    const rotationSteps = 360 / ROTATION_STEP;
    const rotation = Math.floor(Math.random() * rotationSteps) * ROTATION_STEP;

    glyph.style.left = `${Math.random() * 100}%`;
    glyph.style.top = `${Math.random() * 100}%`;
    glyph.style.setProperty('--rotation', `${rotation}deg`);
    glyph.style.setProperty('--drift-x', `${(Math.cos(angle) * distance).toFixed(1)}px`);
    glyph.style.setProperty('--drift-y', `${(Math.sin(angle) * distance).toFixed(1)}px`);

    glyph.style.animation = 'none';
    void glyph.offsetWidth;
    glyph.style.animation = `heroGlyphLife ${lifetime.toFixed(2)}s ease-in-out`;
  };

  const createGlyph = (char) => {
    const glyph = document.createElement('span');
    glyph.className = 'hero__glyph';

    const spin = document.createElement('span');
    spin.className = 'hero__glyph-spin';
    spin.style.animationDuration = `${random(...SPIN_DURATION_RANGE).toFixed(2)}s`;
    spin.style.animationDirection = Math.random() < 0.5 ? 'normal' : 'reverse';
    spin.style.animationDelay = `${-random(0, SPIN_DURATION_RANGE[1]).toFixed(2)}s`;

    const inner = document.createElement('span');
    inner.className = 'hero__glyph-inner';
    inner.textContent = char;

    const amplitude = random(...BOB_AMPLITUDE_RANGE);
    [1, 2, 3].forEach((n) => {
      const point = randomPointOnCircle(amplitude);
      inner.style.setProperty(`--bob-x${n}`, `${point.x}px`);
      inner.style.setProperty(`--bob-y${n}`, `${point.y}px`);
    });
    inner.style.animationDuration = `${random(...BOB_DURATION_RANGE).toFixed(2)}s`;
    inner.style.animationDelay = `${-random(0, BOB_DURATION_RANGE[1]).toFixed(2)}s`;

    spin.appendChild(inner);
    glyph.appendChild(spin);
    glyph.addEventListener('animationend', () => respawn(glyph));
    respawn(glyph);

    return glyph;
  };

  const pool = Array(DENSITY).fill(CHARS).flat().sort(() => Math.random() - 0.5);
  pool.forEach((char) => container.appendChild(createGlyph(char)));
}

function initEmailCopy() {
  const links = document.querySelectorAll('.js-copy-email');
  if (!links.length) {
    return;
  }

  const TOAST_DURATION = 2000;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  let toastTimeout;

  const showToast = (message) => {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), TOAST_DURATION);
  };

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!navigator.clipboard) {
        return;
      }

      event.preventDefault();
      const email = link.href.replace('mailto:', '');

      navigator.clipboard.writeText(email)
        .then(() => showToast(link.dataset.copiedMessage || 'Copied!'))
        .catch(() => {
          window.location.href = link.href;
        });
    });
  });
}

function initRevealObserver(selector) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  const REVEAL_THRESHOLD = 0.3;

  elements.forEach((el) => el.classList.add('is-observing'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.remove('is-observing');
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: REVEAL_THRESHOLD });

  elements.forEach((el) => observer.observe(el));
}

function initProjectsMobileDetail() {
  const units = document.querySelectorAll('.unit');
  if (!units.length) {
    return;
  }

  const MOBILE_QUERY = '(max-width: 1080px)';
  const mq = window.matchMedia(MOBILE_QUERY);

  const entries = [...units].map((unit) => {
    const bubble = unit.querySelector('.unit__bubble');
    const detail = unit.querySelector('.unit__detail');
    return { unit, bubble, detail, parent: detail.parentNode, next: detail.nextSibling };
  });

  const isOpen = (entry) => entry.detail.classList.contains('is-modal-open');

  const close = (entry) => {
    entry.detail.classList.remove('is-modal-open');
    entry.bubble.setAttribute('aria-expanded', 'false');
    entry.parent.insertBefore(entry.detail, entry.next);
  };

  const closeAll = () => {
    entries.forEach((entry) => {
      if (isOpen(entry)) {
        close(entry);
      }
    });
  };

  const open = (entry) => {
    closeAll();
    document.body.appendChild(entry.detail);
    entry.detail.classList.add('is-modal-open');
    entry.bubble.setAttribute('aria-expanded', 'true');
  };

  const toggle = (entry) => {
    if (!mq.matches) {
      return;
    }

    if (isOpen(entry)) {
      close(entry);
    } else {
      open(entry);
    }
  };

  entries.forEach((entry) => {
    entry.bubble.addEventListener('click', () => toggle(entry));
    entry.bubble.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
      toggle(entry);
    });
  });

  document.addEventListener('click', (event) => {
    if (!mq.matches) {
      return;
    }

    const openEntry = entries.find(isOpen);
    if (!openEntry) {
      return;
    }

    if (!openEntry.detail.contains(event.target) && !openEntry.bubble.contains(event.target)) {
      close(openEntry);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    const openEntry = entries.find(isOpen);
    if (openEntry) {
      close(openEntry);
    }
  });

  mq.addEventListener('change', closeAll);
}
