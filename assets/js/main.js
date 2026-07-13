// Étape suivante : switch FR/EN, animations au scroll.

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
