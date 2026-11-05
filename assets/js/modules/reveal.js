// reveal.js — Fade-in on scroll + animated counters. Respects reduced motion.

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  if (reduceMotion()) { el.textContent = String(target); return; }

  const duration = 1400;
  const start = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = String(Math.round(target * ease(t)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  const counters = document.querySelectorAll('[data-count]');

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Stagger siblings that share a [data-reveal-group] parent
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll(':scope > [data-reveal]').forEach((el, i) => el.style.setProperty('--reveal-i', i));
  });

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );
  items.forEach((el) => io.observe(el));

  const countIO = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => countIO.observe(el));
}
