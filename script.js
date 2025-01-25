import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4';
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';

// Configuration object
const config = {
  theme: 'dark',
  random: true,
};

// Characters for scrambling (default and random)
const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Pane for theme and randomness settings
const ctrl = new Pane({
  title: 'Config',
  expanded: true,
});

const update = () => {
  document.documentElement.dataset.theme = config.theme;
};

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update();

  document.startViewTransition(() => update());
};

ctrl.addBinding(config, 'random', { label: 'Random' });
ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
});

ctrl.on('change', sync);
update();

// Temporary text scrambling function
const temporaryScrambleText = (element, text, chars) => {
  const originalText = element.innerText;
  let iteration = 0;

  const scrambleInterval = setInterval(() => {
    element.innerText = originalText
      .split('')
      .map((char, i) => {
        if (i < iteration) {
          return text[i] || '';
        }
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    if (iteration >= text.length) {
      clearInterval(scrambleInterval);
      element.innerText = text; // Final state
    }
    iteration += 1; // Speed of scrambling
  }, 50);
};

// Apply scramble effect to links
const links = document.querySelectorAll('main a');
const scramble = (event) => {
  const target = event.target.firstElementChild;

  if (!gsap.isTweening(target) && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    temporaryScrambleText(
      target,
      target.innerText, // Final text
      config.random ? defaultChars : target.innerText.replace(/\s/g, '')
    );
  }
};

for (const link of links) {
  link.addEventListener('pointerenter', scramble);
  link.addEventListener('focus', scramble);
}
