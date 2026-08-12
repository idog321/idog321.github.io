/* Glossary chips: hover with a mouse, or tap on touch, to see a term's definition.
   One shared bubble appended as the LAST child of <body>, so later-paints-on-top
   DOM order handles stacking and no z-index is needed anywhere.

   Deliberately does NOT use the Popover API. That worked in Chromium but is one
   more engine-specific behaviour to go wrong, and this needs to work in Safari
   first — it is what the manual is read in. Plain fixed positioning and a class
   behave identically everywhere. */
(() => {
  let bubble;
  let current;

  const ensure = () => {
    if (bubble && bubble.isConnected) return bubble;
    bubble = document.createElement('div');
    bubble.className = 'gloss-bubble';
    document.body.appendChild(bubble);
    return bubble;
  };

  const hide = () => {
    if (bubble) bubble.classList.remove('is-open');
    current = null;
  };

  const show = (chip) => {
    const def = chip.getAttribute('data-def');
    if (!def) return;
    const b = ensure();
    b.textContent = def;
    b.classList.add('is-open');
    current = chip;

    // Measure after it is visible, then clamp inside the viewport.
    const r = chip.getBoundingClientRect();
    const bw = b.offsetWidth;
    const bh = b.offsetHeight;
    const pad = 8;
    let left = r.left + r.width / 2 - bw / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - bw - pad));
    let top = r.top - bh - pad;
    if (top < pad) top = r.bottom + pad; // no room above: flip below
    b.style.left = `${Math.round(left)}px`;
    b.style.top = `${Math.round(top)}px`;
  };

  const chipFrom = (e) => {
    const t = e.target;
    return t && t.closest ? t.closest('.gloss') : null;
  };

  // Mouse: show on hover, hide when the pointer leaves both chip and bubble.
  document.addEventListener('mouseover', (e) => {
    const chip = chipFrom(e);
    if (chip) {
      show(chip);
    } else if (current && !(e.target.closest && e.target.closest('.gloss-bubble'))) {
      hide();
    }
  });

  // Touch: a tap always shows, never toggles. Toggling looked right until you
  // realise a tap fires a synthetic mouseover first, so show-then-toggle would
  // open the bubble and immediately close it again. Tapping anywhere else hides.
  document.addEventListener('click', (e) => {
    const chip = chipFrom(e);
    if (chip) {
      e.preventDefault();
      show(chip);
    } else if (current) {
      hide();
    }
  });

  document.addEventListener('focusin', (e) => {
    const chip = chipFrom(e);
    if (chip) show(chip);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') return hide();
    if (e.key === 'Enter' || e.key === ' ') {
      const chip = chipFrom(e);
      if (chip) {
        e.preventDefault();
        current === chip ? hide() : show(chip); // keyboard toggle is fine: no synthetic hover
      }
    }
  });

  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('resize', hide);
  // Starlight swaps page content on client-side nav; drop any open bubble.
  document.addEventListener('astro:before-swap', hide);
})();
