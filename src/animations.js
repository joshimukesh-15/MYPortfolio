import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPortfolioAnimations() {
  const cleanups = [];

  const addManagedListener = (target, type, handler, options) => {
    if (!target) return;
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 920;

  /* ---------------------------------------------------------------- */
  /* Smooth scroll                                                     */
  /* ---------------------------------------------------------------- */

  let lenis = null;

  if (!isReducedMotion) {
    try {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const tickerCallback = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      cleanups.push(() => {
        gsap.ticker.remove(tickerCallback);
        lenis.destroy();
      });
    } catch (error) {
      console.warn('Lenis init bypassed:', error);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Anchor navigation                                                 */
  /* ---------------------------------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    addManagedListener(anchor, 'click', function handleAnchorClick(event) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      if (lenis && !isReducedMotion) {
        lenis.scrollTo(target, { offset: -56, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* Respect deep links on first load */
  const initialHash = window.location.hash;
  if (initialHash && initialHash.length > 1) {
    const initialTarget = document.querySelector(initialHash);
    if (initialTarget) {
      const hashTimer = window.setTimeout(() => {
        if (lenis && !isReducedMotion) {
          lenis.scrollTo(initialTarget, { offset: -56, immediate: true });
        } else {
          initialTarget.scrollIntoView({ behavior: 'auto' });
        }
        ScrollTrigger.refresh();
      }, 250);
      cleanups.push(() => window.clearTimeout(hashTimer));
    }
  }

  /* ---------------------------------------------------------------- */
  /* Scroll-linked chrome                                              */
  /* ---------------------------------------------------------------- */

  const progressBar = document.getElementById('top-progress-bar');
  const ctx = gsap.context(() => {
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

    if (progressBar) {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          progressBar.style.width = `${self.progress * 100}%`;
        },
      });
    }

    /* Active section highlighting */
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const sections = document.querySelectorAll('main section[id]');

    const setActiveNav = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    };

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => setActiveNav(section.id),
        onEnterBack: () => setActiveNav(section.id),
      });
    });

    if (sections.length) setActiveNav(sections[0].id);

    /* -------------------------------------------------------------- */
    /* Scroll reveals                                                */
    /* -------------------------------------------------------------- */

    if (!isReducedMotion) {
      const revealItems = gsap.utils.toArray('[data-reveal]');

      revealItems.forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            once: true,
          },
          y: isTouch ? 12 : 24,
          opacity: 0,
          duration: isTouch ? 0.5 : 0.75,
          ease: 'power3.out',
        });
      });
    }

    /* -------------------------------------------------------------- */
    /* Hero wordmark: blade intro + per-letter flight dock             */
    /* -------------------------------------------------------------- */

    const wordmark = document.querySelector('.hero-wordmark');
    const hero = document.querySelector('.hero');
    const wmLetters = wordmark
      ? gsap.utils.toArray('.hero-wordmark .wm-letter')
      : [];

    /* ------------------------------------------------------------ */
    /* Letter flight: every letter of the big wordmark leaves on its */
    /* own (last letter first) and lands in the fixed corner mark.   */
    /* Driven by scroll position, like getartcraft.com.              */
    /* ------------------------------------------------------------ */
    const startDock = () => {
      const dockMark = document.querySelector('.dock-mark');
      const canDock = window.matchMedia('(min-width: 1081px)').matches;
      if (!wordmark || !dockMark || !canDock) return;

      const heroLetters = gsap.utils.toArray(
        '.hero-wordmark .wm-letter:not(.wm-letter--space)'
      );
      const dockLetters = gsap.utils.toArray('.dock-mark .dm-letter');
      if (!heroLetters.length || heroLetters.length !== dockLetters.length) return;

      const n = heroLetters.length;
      const LENGTH = 0.55; /* share of the scroll distance one letter travels */
      const stagger = n > 1 ? (1 - LENGTH) / (n - 1) : 0;
      const distance = () => Math.min(window.innerHeight * 0.62, 560);
      const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      let geo = [];

      const measure = () => {
        gsap.set(heroLetters, { clearProps: 'transform' });
        const sy = window.scrollY;
        const heroSize = parseFloat(getComputedStyle(heroLetters[0]).fontSize) || 1;
        const dockSize = parseFloat(getComputedStyle(dockLetters[0]).fontSize) || 1;
        geo = heroLetters.map((el, i) => {
          const a = el.getBoundingClientRect();
          const d = dockLetters[i].getBoundingClientRect();
          return {
            dx: d.left + d.width / 2 - (a.left + a.width / 2),
            ny: a.top + a.height / 2 + sy /* natural centre, document space */,
            ty: d.top + d.height / 2 /* target centre, viewport space */,
            s: dockSize / heroSize,
          };
        });
      };

      const update = () => {
        if (!geo.length) return;
        const sy = window.scrollY;
        const dist = distance();
        let done = true;
        for (let i = 0; i < n; i += 1) {
          const order = n - 1 - i; /* last letter departs first */
          const t = Math.min(1, Math.max(0, (sy / dist - order * stagger) / LENGTH));
          if (t < 1) done = false;
          const e = ease(t);
          const g = geo[i];
          gsap.set(heroLetters[i], {
            x: e * g.dx,
            y: e * (g.ty - (g.ny - sy)),
            scale: 1 + e * (g.s - 1),
            force3D: true,
          });
        }
        wordmark.classList.toggle('is-docked', done);
        dockMark.classList.toggle('is-on', done);
      };

      measure();
      update();
      addManagedListener(window, 'scroll', update, { passive: true });
      const onRefresh = () => {
        measure();
        update();
      };
      ScrollTrigger.addEventListener('refresh', onRefresh);
      cleanups.push(() => ScrollTrigger.removeEventListener('refresh', onRefresh));
    };

    if (wordmark && !isReducedMotion) {
      const stageBits = gsap.utils.toArray(
        '.hero-title, .hero-lede, .hero-actions, .hero-meta, .hero-inline, .hero-trust'
      );
      const bladeStart = 'inset(-20% 0 -20% 100%)';
      const bladeEnd = 'inset(-20% 0 -20% 0%)';

      if (wmLetters.length) {
        if (!isTouch) {
          gsap.set(wmLetters, { opacity: 0 });

          const runIntro = () => {
            const total = wordmark.offsetWidth;
            const firstWidth = wmLetters[0].offsetWidth;

            if (!total || !firstWidth) {
              gsap.set(wmLetters, { opacity: 1 });
              startDock();
              return;
            }

            const startShift = -(total - firstWidth) - wordmark.offsetHeight * 0.12;

            const intro = gsap.timeline({ delay: 0.12 });

            intro
              .fromTo(
                wmLetters[0],
                { x: total * 0.5 - firstWidth * 0.5, opacity: 0, clipPath: bladeStart },
                { x: 0, opacity: 1, clipPath: bladeEnd, duration: 1.15, ease: 'power3.inOut' },
                0
              )
              .fromTo(
                wmLetters.slice(1),
                { x: startShift, opacity: 0, clipPath: bladeStart },
                {
                  x: 0,
                  opacity: 1,
                  clipPath: bladeEnd,
                  duration: 1.2,
                  ease: 'power3.inOut',
                  stagger: 0.012,
                  onComplete: () => {
                    gsap.set(wmLetters, { clearProps: 'transform,opacity,clipPath' });
                    startDock();
                  },
                },
                0.02
              )
              .fromTo(
                stageBits,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.85, stagger: 0.07, ease: 'power3.out' },
                0.55
              )
              .fromTo(
                '.hero-scroll',
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: 'power2.out' },
                0.95
              );
          };

          const fontTimeout = new Promise((resolve) => window.setTimeout(resolve, 60));
          const fontsReady = document.fonts?.ready
            ? Promise.race([document.fonts.ready, fontTimeout])
            : Promise.resolve();

          fontsReady.then(() => window.requestAnimationFrame(runIntro));
        } else {
          // Mobile/touch: paint immediately for fast LCP
          gsap.set(wmLetters, { opacity: 1 });
          startDock();
        }
      }
    }

    /* -------------------------------------------------------------- */
    /* Section titles: every letter flies in, like the hero wordmark   */
    /* -------------------------------------------------------------- */
    if (!isReducedMotion) {
      const titles = gsap.utils.toArray('.section-title, .contact-title');

      const splitNode = (node) => {
        Array.from(node.childNodes).forEach((child) => {
          if (child.nodeType === 3) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                frag.appendChild(document.createTextNode(' '));
                return;
              }
              const word = document.createElement('span');
              word.className = 'fly-word';
              part.split('').forEach((char) => {
                const letter = document.createElement('span');
                letter.className = 'fly-letter';
                letter.setAttribute('aria-hidden', 'true');
                letter.textContent = char;
                word.appendChild(letter);
              });
              frag.appendChild(word);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1) {
            splitNode(child);
          }
        });
      };

      titles.forEach((title) => {
        if (!title.dataset.split) {
          title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
          splitNode(title);
          title.dataset.split = 'true';
        }

        const letters = title.querySelectorAll('.fly-letter');
        if (!letters.length) return;

        gsap.fromTo(
          letters,
          { x: 160, y: -48, rotate: 7, opacity: 0 },
          {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out',
            stagger: { each: 0.028, from: 'end' },
            scrollTrigger: {
              trigger: title,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }

    /* Fonts can shift layout — refresh once ready */
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    ScrollTrigger.refresh();
  });

  /* ---------------------------------------------------------------- */
  /* Resize handling                                                   */
  /* ---------------------------------------------------------------- */

  let resizeTimer;
  addManagedListener(
    window,
    'resize',
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    },
    { passive: true }
  );
  cleanups.push(() => window.clearTimeout(resizeTimer));

  return () => {
    ctx.revert();
    cleanups.splice(0).forEach((cleanup) => cleanup());
  };
}
