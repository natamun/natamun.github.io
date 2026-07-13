document.querySelectorAll('.project-card__link').forEach((link) => {
    link.addEventListener('click', () => link.blur());
});

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

initHeroGlyphs();

function initHeroGlyphs() {
    const container = document.querySelector('.hero__glyphs');
    if (!container) return;

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
