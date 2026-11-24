// Product animations honor the visitor's reduced-motion preference.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('lottie-player').forEach(player => {
    const pause = () => {
      if (reducedMotion.matches && typeof player.pause === 'function') {
        player.seek('50%');
        player.pause();
      }
    };
    player.addEventListener('ready', pause);
    reducedMotion.addEventListener('change', () => reducedMotion.matches ? pause() : player.play?.());
  });
})();
