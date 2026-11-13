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
    /* Hero wordmark: blade intro + scroll dock                       */
    /* -------------------------------------------------------------- */

    const wordmark = document.querySelector('.hero-wordmark');
    const hero = document.querySelector('.hero');
    const dockAnchor = document.querySelector('[data-wordmark-anchor]');
    const wmLetters = wordmark
      ? gsap.utils.toArray('.hero-wordmark .wm-letter')
      : [];

    if (wordmark && !isReducedMotion) {
      const stageBits = gsap.utils.toArray(
        '.hero-title, .hero-lede, .hero-actions, .hero-meta, .hero-inline, .hero-trust'
      );
      const bladeStart = 'inset(-20% 0 -20% 100%)';
      const bladeEnd = 'inset(-20% 0 -20% 0%)';

      if (wmLetters.length) {
        gsap.set(wmLetters, { opacity: 0 });

        const runIntro = () => {
          const total = wordmark.offsetWidth;
          const firstWidth = wmLetters[0].offsetWidth;

          if (!total || !firstWidth) {
            gsap.set(wmLetters, { opacity: 1 });
            return;
          }

          const startShift = -(total - firstWidth) - wordmark.offsetHeight * 0.12;

          const intro = gsap.timeline({ delay: 0.12 });

          intro
            .fromTo(
              wmLetters[0],
              { x: total * 0.5 - firstWidth * 0.5, opacity: 0, clipPath: bladeStart },
              {
                x: 0,
                opacity: 1,
                clipPath: bladeEnd,
                duration: 1.15,
                ease: 'power3.inOut',
              },
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

        const fontsReady = document.fonts?.ready ?? Promise.resolve();
        fontsReady
          .then(() => window.requestAnimationFrame(runIntro))
          .catch(() => window.requestAnimationFrame(runIntro));
      }

      /* Dock the wordmark to the top-right rail while scrolling */
      const canDock = window.matchMedia('(min-width: 1081px)').matches;

      if (canDock && dockAnchor && hero) {
        const dockDistance = () => Math.min(window.innerHeight * 0.62, 620);

        const dock = () => {
          const metrics = () => {
            const w = wordmark.getBoundingClientRect();
            const a = dockAnchor.getBoundingClientRect();
            const scale = Math.min(0.32, Math.max(0.18, a.height / Math.max(1, w.height)));
            const layoutCenterX = w.left + w.width / 2;
            const layoutCenterDocY = w.top + w.height / 2 + window.scrollY;

            return {
              x: a.right - (w.width * scale) / 2 - layoutCenterX,
              y: a.top + a.height / 2 - layoutCenterDocY + dockDistance(),
              scale,
            };
          };

          gsap.to(wordmark, {
            x: () => metrics().x,
            y: () => metrics().y,
            scale: () => metrics().scale,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 0,
              end: () => `+=${dockDistance()}`,
              scrub: 0.55,
              invalidateOnRefresh: true,
              onRefreshInit: () => gsap.set(wordmark, { clearProps: 'transform' }),
            },
          });

          gsap.fromTo(
            stageBits,
            { opacity: 1, y: 0 },
            {
              opacity: 0,
              y: -36,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: hero,
                start: 0,
                end: () => `+=${Math.min(window.innerHeight * 0.45, 460)}`,
                scrub: 0.4,
              },
            }
          );
        };

        dock();
      }
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
