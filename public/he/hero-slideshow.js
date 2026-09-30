(() => {
  const hero = document.querySelector('.hero');
  const slides = [...hero.querySelectorAll('.hero-slide')];
  const controls = hero.querySelector('.hero-controls');
  const playback = controls.querySelector('.hero-playback');
  const previous = controls.querySelector('.hero-previous');
  const next = controls.querySelector('.hero-next');
  const status = document.getElementById('hero-photo-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const unavailable = new Set();
  const slideInterval = 4000;
  let current = 0;
  let paused = motion.matches;
  let hovered = false;
  let focusPaused = false;
  let visible = true;
  let timer;
  let request = 0;

  function stopClock() {
    clearTimeout(timer);
    request += 1;
    hero.classList.add('is-photo-paused');
  }

  function canRotate() {
    return !paused && !motion.matches && !hovered && !focusPaused && visible && !document.hidden;
  }

  function schedule() {
    clearTimeout(timer);
    const running = canRotate() && unavailable.size < slides.length - 1;
    hero.classList.toggle('is-photo-paused', !running);
    if (!running) return;
    timer = setTimeout(() => showPhoto(adjacentPhoto(1), false), slideInterval);
  }

  function adjacentPhoto(direction) {
    for (let step = 1; step < slides.length; step += 1) {
      const index = (current + direction * step + slides.length) % slides.length;
      if (!unavailable.has(index)) return index;
    }
    return current;
  }

  function updatePlayback() {
    playback.setAttribute('aria-label', paused ? 'הפעלת מצגת התמונות' : 'השהיית מצגת התמונות');
    playback.querySelector('.hero-playback-text').textContent = paused ? 'הפעלה' : 'השהיה';
    playback.querySelector('.hero-playback-icon').textContent = paused ? '▶' : 'Ⅱ';
    // With reduced motion, photos remain available through the manual controls.
    playback.hidden = motion.matches;
  }

  async function showPhoto(index, manual) {
    stopClock();
    if (manual) { paused = true; updatePlayback(); }
    const thisRequest = request;
    const img = slides[index].querySelector('img');
    try {
      await img.decode();
    } catch {
      if (thisRequest !== request) return;
      unavailable.add(index);
      previous.disabled = next.disabled = unavailable.size >= slides.length - 1;
      if (manual) status.textContent = 'התמונה לא נטענה. בחרו תמונה אחרת.';
      schedule();
      return;
    }
    if (thisRequest !== request || (!manual && !canRotate())) return;
    slides.forEach((slide, i) => slide.classList.toggle('is-leaving', i === current && i !== index));
    current = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    if (manual) status.textContent = `תמונה ${current + 1} מתוך ${slides.length}: ${slides[current].dataset.caption}.`;
    schedule();
  }

  previous.addEventListener('click', () => showPhoto(adjacentPhoto(-1), true));
  next.addEventListener('click', () => showPhoto(adjacentPhoto(1), true));
  playback.addEventListener('click', () => {
    stopClock();
    paused = !paused;
    if (!paused) { focusPaused = false; hovered = false; }
    updatePlayback();
    schedule();
  });
  controls.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; stopClock(); } });
  controls.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovered = false; schedule(); } });
  hero.addEventListener('focusin', () => { focusPaused = true; stopClock(); });
  hero.addEventListener('focusout', () => queueMicrotask(() => {
    focusPaused = hero.contains(document.activeElement);
    schedule();
  }));
  document.addEventListener('visibilitychange', () => { stopClock(); schedule(); });
  window.addEventListener('pagehide', stopClock);
  window.addEventListener('pageshow', schedule);
  motion.addEventListener('change', () => {
    stopClock();
    if (motion.matches) paused = true;
    updatePlayback();
    schedule();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      stopClock();
      schedule();
    }, { threshold: 0 });
    observer.observe(hero);
  }
  updatePlayback();
  controls.hidden = false;
  schedule();
})();
