import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4';
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
gsap.registerPlugin(ScrambleTextPlugin);

const config = {
  theme: 'dark',
  random: true };


// Utilities for building random strings
// const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?~'
const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const ctrl = new Pane({
  title: 'Config',
  expanded: true });


const update = event => {
  document.documentElement.dataset.theme = config.theme;
};

const sync = event => {
  if (
  !document.startViewTransition ||
  event.target.controller.view.labelElement.innerText !== 'Theme')

  return update(event);
  document.startViewTransition(() => update(event));
};

ctrl.addBinding(config, 'random', {
  label: 'Random' });


ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark' } });



ctrl.on('change', sync);
update();

const links = document.querySelectorAll('main a');
const scramble = event => {
  const target = event.target.firstElementChild;
  if (!gsap.isTweening(target) && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    gsap.to(target, {
      duration: .8,
      ease: 'sine.in',
      scrambleText: {
        text: target.innerText,
        speed: 2,
        chars: config.random ? defaultChars : target.innerText.replace(/\s/g, '') } });


  }
};

for (const link of links) {
  link.addEventListener('pointerenter', scramble);
  link.addEventListener('focus', scramble);
}


