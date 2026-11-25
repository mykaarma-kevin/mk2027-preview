// Product animations honor the visitor's reduced-motion preference.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('lottie-player:not([data-iceberg-player])').forEach(player => {
    const pause = () => {
      if (reducedMotion.matches && typeof player.pause === 'function') {
        player.seek('50%');
        player.pause();
      }
    };
    player.addEventListener('ready', pause);
    reducedMotion.addEventListener('change', () => reducedMotion.matches ? pause() : player.play?.());
  });

  // Keep the above-water artwork visible immediately; reveal underwater work
  // once, on entering the viewport. Load ahead of the section without autoplay.
  document.querySelectorAll('[data-iceberg-animation]').forEach(container => {
    const player = container.querySelector('[data-iceberg-player]');
    const poster = container.querySelector('.iceberg-poster');
    const complete = container.querySelector('source').getAttribute('srcset');
    let loaded = false, ready = false, visible = false, started = false;
    let loadObserver, playObserver, timeout;
    const fallback = () => {
      clearTimeout(timeout);
      container.removeAttribute('data-ready');
      container.dataset.state = 'fallback';
      poster.src = complete;
    };
    const play = () => {
      if (!ready || !visible || started || reducedMotion.matches) return;
      started = true;
      container.dataset.state = 'playing';
      player.play();
      playObserver?.disconnect();
    };
    const load = async () => {
      if (loaded || reducedMotion.matches) return;
      loaded = true;
      loadObserver?.disconnect();
      timeout = setTimeout(fallback, 10000);
      await customElements.whenDefined('lottie-player');
      if (container.dataset.state === 'fallback') return;
      player.load(player.dataset.src);
    };
    player.addEventListener('ready', () => {
      if (container.dataset.state === 'fallback') return;
      clearTimeout(timeout);
      ready = true;
      player.stop();
      container.dataset.ready = 'true';
      container.dataset.state = 'ready';
      play();
    });
    player.addEventListener('complete', () => { container.dataset.state = 'complete'; });
    player.addEventListener('error', fallback);
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        if (ready) player.pause();
      } else if (!loaded) load();
      else if (ready && started) player.play();
      else play();
    });
    if ('IntersectionObserver' in window) {
      loadObserver = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) load(); }, { rootMargin: '400px' });
      playObserver = new IntersectionObserver(entries => {
        visible = entries.some(entry => entry.isIntersecting);
        if (visible) play();
      }, { threshold: .2 });
      loadObserver.observe(container);
      playObserver.observe(container);
    } else { visible = true; load(); }
  });
})();
