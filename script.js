import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4';
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';

// Configuration for theme and scrambling options
const config = {
  theme: 'dark',
  random: true,
};

// Characters used for scrambling
const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Pane for controlling theme and randomness
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

// Custom scrambling function
const scrambleText = (element, finalText, randomChars) => {
  const originalText = element.innerText;
  let iteration = 0;

  const scrambleInterval = setInterval(() => {
    element.innerText = originalText
      .split('')
      .map((char, index) => {
        if (index < iteration) {
          return finalText[index] || '';
        }
        return randomChars[Math.floor(Math.random() * randomChars.length)];
      })
      .join('');

    if (iteration >= finalText.length) {
      clearInterval(scrambleInterval);
      element.innerText = finalText; // Finalize text
    }
    iteration += 1; // Adjust iteration speed as needed
  }, 50); // Scrambling speed
};

// Scrambling effect on hover/focus
const links = document.querySelectorAll('main a');
const scramble = (event) => {
  const target = event.target.firstElementChild;

  if (!gsap.isTweening(target) && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    scrambleText(
      target,
      target.innerText, // Final text to display
      config.random ? defaultChars : target.innerText.replace(/\s/g, '') // Characters to scramble
    );
  }
};

for (const link of links) {
  link.addEventListener('pointerenter', scramble);
  link.addEventListener('focus', scramble);
}
