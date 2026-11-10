/* ==========================================================================
   Hagar Arafa, portfolio
   --------------------------------------------------------------------------
   Everything here is behaviour. The words live in index.html.

   Sections of this file:
   1. Setup and helpers
   2. Page-load reveal
   3. Hero contour map (the signature animation)
   4. Header, menu and section ruler
   5. Work accordion
   6. Path timeline, scroll reveals, copy-email, footer year
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- 1. Setup and helpers ---------- */
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 2. Page-load reveal ----------
     The name and intro stay hidden until the fonts are loaded, so the page
     never flashes in a fallback font. We wait at most 1.2 seconds. */
  function revealPage() {
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, 1200));
    Promise.race([fontsReady, timeout]).then(() => {
      requestAnimationFrame(() => root.classList.add('is-ready'));
    });
  }

  /* ---------- 3. Hero contour map ----------
     A topographic map drawn live. We build a smooth "height" for every
     point on a grid, then trace the lines where the height crosses fixed
     levels (an algorithm called marching squares). The height slowly
     drifts over time and bends toward the mouse. */
  function initField(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lineRGB = (getComputedStyle(canvas).getPropertyValue('--field') || '13, 101, 117').trim();
    let W = 0, H = 0, dpr = 1, cell = 14, cols = 0, rows = 0, values = new Float32Array(0);
    let running = false, last = 0, raf = 0;
    const pointer = { x: 0.72, y: 0.4, tx: 0.72, ty: 0.4, active: false };

    // Horizontal fade: faint behind the name on the left, full strength on the right
    let fade = null;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = clamp(Math.round(W / 96), 11, 18);
      cols = Math.ceil(W / cell) + 2;
      rows = Math.ceil(H / cell) + 2;
      values = new Float32Array(cols * rows);
      fade = ctx.createLinearGradient(0, 0, W, 0);
      const narrow = W < 700;
      fade.addColorStop(0, `rgba(0,0,0,${narrow ? 0.55 : 0.14})`);
      fade.addColorStop(0.5, `rgba(0,0,0,${narrow ? 0.65 : 0.7})`);
      fade.addColorStop(1, 'rgba(0,0,0,1)');
      if (!running) draw(4);
    }

    // The height at a point (x, y in 0..size units) at time t
    function height(u, v, t) {
      let h = 0;
      h += 0.55 * Math.sin(u * 3.1 + t * 0.11 + Math.sin(v * 2.3 - t * 0.07) * 1.2);
      h += 0.45 * Math.sin(v * 3.6 - t * 0.09 + Math.cos(u * 2.1 + t * 0.05) * 1.4);
      h += 0.3 * Math.sin((u + v) * 2.2 + t * 0.06);
      return h;
    }

    function fill(t) {
      const size = Math.max(W, H);
      // Two fixed "hills" give the map a clear focal point on the right
      const aspect = W / size;
      const hills = [
        [aspect * 0.8, (H / size) * 0.42, 1.25, 0.2],
        [aspect * 0.95, (H / size) * 0.86, 0.85, 0.15],
        [aspect * 0.55, (H / size) * 0.15, 0.6, 0.14],
      ];
      const px = pointer.x * aspect;
      const py = pointer.y * (H / size);
      for (let j = 0; j < rows; j++) {
        const v = (j * cell) / size;
        for (let i = 0; i < cols; i++) {
          const u = (i * cell) / size;
          let h = height(u, v, t);
          for (let k = 0; k < hills.length; k++) {
            const dx = u - hills[k][0];
            const dy = v - hills[k][1];
            h += hills[k][2] * Math.exp(-(dx * dx + dy * dy) / (hills[k][3] * hills[k][3]));
          }
          if (pointer.active) {
            const dx = u - px;
            const dy = v - py;
            h += 0.55 * Math.exp(-(dx * dx + dy * dy) / 0.02);
          }
          values[j * cols + i] = h;
        }
      }
    }

    // Trace one level and add its line segments to a path
    function trace(level, path) {
      for (let j = 0; j < rows - 1; j++) {
        const y0 = j * cell;
        for (let i = 0; i < cols - 1; i++) {
          const x0 = i * cell;
          const tl = values[j * cols + i];
          const tr = values[j * cols + i + 1];
          const br = values[(j + 1) * cols + i + 1];
          const bl = values[(j + 1) * cols + i];
          const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
          if (idx === 0 || idx === 15) continue;

          // Where the level crosses each edge of this cell
          const top = [x0 + (cell * (level - tl)) / (tr - tl), y0];
          const right = [x0 + cell, y0 + (cell * (level - tr)) / (br - tr)];
          const bottom = [x0 + (cell * (level - bl)) / (br - bl), y0 + cell];
          const left = [x0, y0 + (cell * (level - tl)) / (bl - tl)];
          const seg = (a, b) => { path.moveTo(a[0], a[1]); path.lineTo(b[0], b[1]); };

          switch (idx) {
            case 1: case 14: seg(left, bottom); break;
            case 2: case 13: seg(bottom, right); break;
            case 3: case 12: seg(left, right); break;
            case 4: case 11: seg(top, right); break;
            case 6: case 9: seg(top, bottom); break;
            case 7: case 8: seg(left, top); break;
            case 5:
            case 10: {
              // Ambiguous corner: decide using the average of the four corners
              const centreHigh = (tl + tr + br + bl) / 4 > level;
              if ((idx === 5) === centreHigh) { seg(left, top); seg(bottom, right); }
              else { seg(top, right); seg(left, bottom); }
              break;
            }
            default: break;
          }
        }
      }
    }

    function draw(t) {
      fill(t);
      ctx.clearRect(0, 0, W, H);
      const thin = new Path2D();
      const index = new Path2D();
      const start = -1.45;
      const step = 0.2;
      for (let n = 0; n < 17; n++) {
        trace(start + n * step, n % 4 === 0 ? index : thin);
      }
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = `rgba(${lineRGB}, 0.2)`;
      ctx.stroke(thin);
      ctx.strokeStyle = `rgba(${lineRGB}, 0.5)`;
      ctx.stroke(index);

      // Apply the left-to-right fade
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }

    function frame(now) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return; // about 30 frames per second is plenty
      last = now;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      draw(now / 1000);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    window.addEventListener('resize', () => { resize(); });

    if (reduceMotion) return; // one still frame is enough

    // Run only while the hero is visible and the tab is open
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries[0].isIntersecting && !document.hidden ? start() : stop();
      });
      io.observe(canvas);
    } else {
      start();
    }
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    if (finePointer) {
      const hero = canvas.parentElement;
      hero.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        pointer.tx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        pointer.ty = clamp((e.clientY - rect.top) / rect.height, 0, 1);
        pointer.active = true;
      });
      hero.addEventListener('pointerleave', () => { pointer.active = false; });
    }
  }

  /* ---------- 4. Header, menu and section ruler ---------- */
  function initChrome() {
    const bar = $('#bar');
    const menu = $('#menu');
    const menuBtn = $('.menu-btn');
    const label = $('.menu-btn__label');

    // Menu: open and close
    function setMenu(open) {
      if (!menu || !menuBtn) return;
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close' : 'Menu';
      document.body.classList.toggle('menu-open', open);
    }
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
      menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
      });
      window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
    }

    // Ruler: which section are we in, and how far down the page are we
    const ruler = $('#ruler');
    const fillEl = $('#rulerFill');
    const sections = ['top', 'about', 'work', 'toolbox', 'path', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const rulerLinks = new Map($$('[data-ruler]').map((a) => [a.dataset.ruler, a]));
    const pathList = $('#pathList');
    const pathItems = $$('.path__item');
    let currentId = '';

    function onScroll() {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (bar) bar.classList.toggle('is-stuck', y > 8);
      if (ruler) ruler.classList.toggle('is-on', y > innerHeight * 0.5);

      // Ruler progress
      const max = document.documentElement.scrollHeight - vh;
      if (fillEl) fillEl.style.setProperty('--p', max > 0 ? clamp(y / max, 0, 1).toFixed(4) : 0);

      // Active section = the one crossing the middle of the viewport
      let active = sections[0];
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= vh * 0.5) active = s;
      }
      if (active && active.id !== currentId) {
        currentId = active.id;
        rulerLinks.forEach((a, id) => (id === currentId ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
        if (ruler) ruler.classList.toggle('on-dark', active.dataset.theme === 'dark');
      }

      // Path timeline: the line draws as you read down it
      if (pathList) {
        const r = pathList.getBoundingClientRect();
        const p = clamp((vh * 0.62 - r.top) / r.height, 0, 1);
        pathList.style.setProperty('--p', p.toFixed(4));
        pathItems.forEach((item) => {
          item.classList.toggle('is-on', item.getBoundingClientRect().top < vh * 0.62);
        });
      }
    }
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); }
    }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------- 5. Work accordion ----------
     One project open at a time. The first one starts open. */
  function initRows() {
    const rows = $$('.row');
    if (!rows.length) return;
    const set = (row, open) => {
      row.classList.toggle('is-open', open);
      const btn = $('.row__head', row);
      if (btn) btn.setAttribute('aria-expanded', String(open));
    };
    rows.forEach((row) => {
      const btn = $('.row__head', row);
      if (!btn) return;
      btn.addEventListener('click', () => {
        const willOpen = !row.classList.contains('is-open');
        rows.forEach((r) => set(r, false));
        set(row, willOpen);
      });
    });
    set(rows[0], true);
  }

  /* ---------- 6. Scroll reveals, copy email, footer year ---------- */
  function initReveals() {
    const targets = $$('.section .h2, .split__note, .portrait, .prose, .rows, .schema, .path, .contact__title, .contact__lede, .contact__mail, .contact__links');
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    targets.forEach((el) => el.setAttribute('data-reveal', ''));
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((el) => io.observe(el));
    // Safety net: never leave content hidden
    setTimeout(() => targets.forEach((el) => el.classList.add('in')), 6000);
  }

  function initCopy() {
    const btn = $('#copyMail');
    const mail = $('#mail');
    if (!btn || !mail) return;
    const address = mail.textContent.trim();
    btn.addEventListener('click', async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(address);
        ok = true;
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = address;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        ta.remove();
      }
      btn.textContent = ok ? 'Copied' : 'Press Ctrl+C';
      setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
    });
  }

  // If the photo is missing, the frame shows the initials instead of a broken icon
  function initPortrait() {
    const frame = $('.arch');
    const img = frame && $('img', frame);
    if (!img) return;
    const fail = () => frame.classList.add('no-photo');
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('loading') !== 'lazy') fail();
    img.addEventListener('error', fail);
  }

  /* ---------- Start ---------- */
  function init() {
    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
    initRows();
    initChrome();
    initPortrait();
    initCopy();
    initReveals();
    initField($('#field'));
    initField($('#field2'));
    revealPage();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
