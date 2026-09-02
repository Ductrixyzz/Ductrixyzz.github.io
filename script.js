/* ==========================================================
   Đuctrixyzzz — hiệu ứng trang liên kết
   ========================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (min, max) => min + Math.random() * (max - min);

  /* ---------- năm hiện tại ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- logo: nếu chưa có assets/logo.png thì dùng bản vẽ SVG ---------- */
  const img = $('#logoImg');
  const svgLogo = $('#logoSvg');
  if (img && svgLogo) {
    const useFallback = () => {
      img.style.display = 'none';
      svgLogo.removeAttribute('hidden');
    };
    img.addEventListener('error', useFallback);
    if (img.complete && img.naturalWidth === 0) useFallback();
  }

  /* ---------- tách từng chữ của tên để hiện lần lượt ---------- */
  const nameEl = $('#name');
  if (nameEl) {
    const text = nameEl.textContent.trim();
    nameEl.textContent = '';
    nameEl.setAttribute('aria-label', text);
    [...text].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--i', i);
      s.textContent = c === ' ' ? ' ' : c;
      nameEl.appendChild(s);
    });
  }

  /* ---------- lá tre bay ---------- */
  const leafBox = $('#leaves');
  if (leafBox && !reduce) {
    const shape = 'M23 1C11 2 1 11 1 22 12 21 23 12 23 1z';
    const colors = ['#7fa768', '#94b87c', '#6d9257', '#a8c78f'];
    const count = window.innerWidth < 520 ? 10 : 18;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      const size = rand(14, 30);
      el.className = 'leaf';
      el.style.cssText = `left:${rand(-5, 100)}%;width:${size}px;height:${size}px;` +
        `color:${colors[(Math.random() * colors.length) | 0]};` +
        `--sway:${rand(-90, 90)}px;--op:${rand(.35, .8).toFixed(2)};` +
        `animation-duration:${rand(13, 26).toFixed(1)}s;animation-delay:${(-rand(0, 22)).toFixed(1)}s`;
      el.innerHTML = `<svg viewBox="0 0 24 24"><path d="${shape}"/></svg>`;
      leafBox.appendChild(el);
    }
  }

  /* ---------- hiện dần khi lướt trang ---------- */
  const revealTargets = [...$$('.card'), $('#share'), $('.foot')].filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: .18, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in'));
  }

  /* ---------- con trỏ: vệt sáng + nền dịch chuyển nhẹ ---------- */
  const root = document.documentElement;
  let raf = 0, mx = 0, my = 0, px = 0, py = 0;

  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.body.classList.add('pointer');
    window.addEventListener('pointermove', (e) => {
      px = e.clientX; py = e.clientY;
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(() => {
        root.style.setProperty('--px', px + 'px');
        root.style.setProperty('--py', py + 'px');
        root.style.setProperty('--mx', mx.toFixed(3));
        root.style.setProperty('--my', my.toFixed(3));
        raf = 0;
      });
    }, { passive: true });
  }

  /* ---------- lướt: núi trôi theo ---------- */
  if (!reduce) {
    let sRaf = 0;
    window.addEventListener('scroll', () => {
      if (sRaf) return;
      sRaf = requestAnimationFrame(() => {
        const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
        root.style.setProperty('--sy', (window.scrollY / max).toFixed(4));
        sRaf = 0;
      });
    }, { passive: true });
  }

  /* ---------- thẻ nghiêng 3D + quầng sáng theo con trỏ ---------- */
  const cards = $$('.card');
  const canTilt = !reduce && window.matchMedia('(hover: hover)').matches;

  cards.forEach((card) => {
    if (canTilt) {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((x - .5) * 9).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((.5 - y) * 7).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    }
    card.addEventListener('pointerdown', (e) => ripple(e, $('.card__in', card)));
  });

  /* ---------- gợn nước khi bấm ---------- */
  function ripple(e, host) {
    if (!host || reduce) return;
    const r = host.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.2;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.cssText = `width:${size}px;height:${size}px;` +
      `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px`;
    host.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  }

  /* ---------- thông báo nhỏ ---------- */
  const toast = $('#toast');
  let toastTimer;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- nút chia sẻ ---------- */
  const shareBtn = $('#share');
  if (shareBtn) {
    shareBtn.addEventListener('pointerdown', (e) => ripple(e, shareBtn));
    shareBtn.addEventListener('click', async () => {
      const data = { title: 'Đuctrixyzzz', text: 'Tất cả liên kết của mình đây', url: location.href };
      try {
        if (navigator.share) {
          await navigator.share(data);
          return;
        }
        await navigator.clipboard.writeText(location.href);
        say('Đã copy link trang này');
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        say('Không copy được, bạn copy trên thanh địa chỉ nhé');
      }
    });
  }

  /* ---------- bấm logo cho vui ---------- */
  const logoWrap = $('#logoWrap');
  if (logoWrap) {
    logoWrap.addEventListener('click', () => {
      if (logoWrap.classList.contains('spin')) return;
      logoWrap.classList.add('spin');
      setTimeout(() => logoWrap.classList.remove('spin'), 1150);
    });
  }

  /* ---------- đốm sáng bay lên ---------- */
  const moteBox = $('#motes');
  if (moteBox && !reduce) {
    const n = window.innerWidth < 520 ? 12 : 22;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      const s = rand(3, 9);
      el.className = 'mote';
      el.style.cssText = `left:${rand(0, 100)}%;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;` +
        `--drift:${rand(-70, 70)}px;--op:${rand(.35, .95).toFixed(2)};` +
        `animation-duration:${rand(11, 22).toFixed(1)}s;animation-delay:${(-rand(0, 20)).toFixed(1)}s`;
      moteBox.appendChild(el);
    }
  }

  /* ---------- vệt sáng nhỏ rơi theo con trỏ ---------- */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    let last = 0;
    window.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - last < 55) return;
      last = now;
      const sp = document.createElement('span');
      sp.className = 'spark';
      const k = rand(.6, 1.4);
      sp.style.cssText = `left:${e.clientX + rand(-6, 6)}px;top:${e.clientY + rand(-6, 6)}px;` +
        `width:${(7 * k).toFixed(1)}px;height:${(7 * k).toFixed(1)}px`;
      document.body.appendChild(sp);
      sp.addEventListener('animationend', () => sp.remove());
    }, { passive: true });
  }

  /* ---------- tắt màn hình chờ ---------- */
  const loader = $('#loader');
  if (loader) {
    const hide = () => {
      loader.classList.add('done');
      setTimeout(() => loader.remove(), 1000);
    };
    const wait = reduce ? 200 : 1500;
    if (document.readyState === 'complete') setTimeout(hide, wait);
    else window.addEventListener('load', () => setTimeout(hide, wait));
    setTimeout(hide, 4000); // chốt an toàn nếu font/ảnh tải chậm
  }
})();
