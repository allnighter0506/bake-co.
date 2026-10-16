'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const q = (selector, scope = document) => scope.querySelector(selector);
const qa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// The page is never blocked. Each loader belongs to a real pending image.
// Already-cached images skip it. Error and timeout paths always clear it.
qa('.image-shell').forEach(shell => {
  const img = q('img', shell);
  const loader = q('.bakery-loader', shell);
  const fallback = q('.image-fallback', shell);
  let timer;
  let pending = false;
  const finish = success => {
    pending = false;
    clearTimeout(timer);
    loader.hidden = true;
    shell.classList.remove('is-loading');
    shell.classList.toggle('is-error', !success);
    shell.setAttribute('aria-busy', 'false');
    fallback.hidden = success;
  };
  const start = () => {
    if (img.complete) { finish(img.naturalWidth > 0); return; }
    if (pending) return;
    pending = true;
    loader.hidden = false;
    shell.classList.add('is-loading');
    shell.setAttribute('aria-busy', 'true');
    timer = setTimeout(() => finish(false), 12000);
  };
  img.addEventListener('load', () => finish(true));
  img.addEventListener('error', () => finish(false));
  if (img.loading === 'lazy' && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { start(); observer.disconnect(); }
    }, { rootMargin: '250px' });
    observer.observe(shell);
  } else start();
});

// No hidden initial state: content remains visible if JS or observation fails.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!reduceMotion.matches) entry.target.classList.add('is-entering');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12 });
  qa('.reveal').forEach(element => revealObserver.observe(element));
  const coffeeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
  });
  coffeeObserver.observe(q('.coffee-section'));
}
document.addEventListener('visibilitychange', () => document.body.classList.toggle('motion-paused', document.hidden));

const menuButton = q('.menu-toggle');
const navigation = q('#main-nav');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
qa('a', navigation).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 601px)').addEventListener('change', closeMenu);

qa('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  qa('[data-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  qa('.product-card').forEach(card => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
    if (!card.hidden) count++;
  });
  q('.collection-count').textContent = `${count} little ${count === 1 ? 'pleasure' : 'pleasures'}`;
}));

const coffees = {
  cappuccino: 'A soft cloud of milk. A little coffee underneath. Lovely with the cinnamon slow-down.',
  espresso: 'A small cup with a big personality. Let the butter croissant keep it company.',
  latte: 'Long, mellow, and made for lingering. Try a strawberry daydream on the side.'
};
qa('[data-coffee]').forEach(button => button.addEventListener('click', () => {
  qa('[data-coffee]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  q('.coffee-description').textContent = coffees[button.dataset.coffee];
}));

const products = {
  croissant: {
    title: 'The butter croissant', symbol: 'pastry-croissant', colour: '#eaddc6',
    description: 'That first delicate crackle, then a tumble of golden crumbs. Our illustrated ode to the pastry that turns a coffee break into a small occasion.',
    pairing: 'A lovely pairing: a short espresso and a long, unhurried morning.'
  },
  cake: {
    title: 'Strawberry daydream', symbol: 'pastry-cake', colour: '#e9d9d5',
    description: 'Soft sponge, a blush of strawberry, and a generous daydream of cream. A little reminder that a slice of cake can be its own occasion.',
    pairing: 'A lovely pairing: a mellow latte, a second fork, and good company.'
  },
  bun: {
    title: 'The cinnamon slow-down', symbol: 'pastry-bun', colour: '#e1e3cd',
    description: 'A golden spiral of cinnamon-sweet comfort. Imagine pulling apart a soft swirl, finding a sunny seat, and leaving the next thing on your list for later.',
    pairing: 'A lovely pairing: a foamy cappuccino and a few pages of a good book.'
  }
};
const dialog = q('.product-dialog');
let lastProductButton;
qa('[data-product]').forEach(button => button.addEventListener('click', () => {
  const product = products[button.dataset.product];
  lastProductButton = button;
  q('#dialog-title').textContent = product.title;
  q('#dialog-description').textContent = product.description;
  q('#dialog-pairing').textContent = product.pairing;
  q('.dialog-art use').setAttribute('href', `#${product.symbol}`);
  q('.dialog-art').style.backgroundColor = product.colour;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  q('.dialog-close').focus();
}));
q('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  lastProductButton?.focus({ preventScroll: true });
});
q('.dialog-coffee').addEventListener('click', () => {
  dialog.close();
  requestAnimationFrame(() => {
    const heading = q('#coffee-heading');
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'start' });
  });
});

const treatButton = q('.treat-button');
const treatMessages = ['Good things take butter.', 'A little joy, just for you.', 'You deserve something sweet today.'];
let treatIndex = 0;
treatButton.addEventListener('click', () => {
  const reveal = treatButton.getAttribute('aria-expanded') !== 'true';
  treatButton.setAttribute('aria-expanded', String(reveal));
  treatButton.setAttribute('aria-label', reveal ? 'Cover the plate to replay your little treat' : 'Lift the lid to reveal your little treat');
  q('.treat-button-label').textContent = reveal ? 'A little more magic? Replay ↺' : 'Lift the lid ↗';
  q('#treat-message').textContent = reveal ? treatMessages[treatIndex++ % treatMessages.length] : 'A little mystery. A lovely possibility.';
  q('svg', treatButton).setAttribute('aria-label', reveal ? 'A golden croissant revealed on a serving plate' : 'An illustrated pastry under a serving dome');
});
q('#year').textContent = new Date().getFullYear();
