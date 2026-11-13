import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPortfolioAnimations() {
  const cleanups = [];
  function addManagedListener(target, type, handler, options) {
    if (!target) return;
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  }

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 860;

  // 1. Initialize Lenis Smooth Scroll
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

      const tickerCallback = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      cleanups.push(() => {
        gsap.ticker.remove(tickerCallback);
        lenis.destroy();
      });
    } catch (e) {
      console.warn('Lenis init bypassed:', e);
    }
  }

  // Mobile Menu Toggle & State Helper
  const menuBtn = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('navlinks');

  function setMobileMenuOpen(isOpen) {
    if (!menuBtn || !navLinks) return;
    navLinks.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  }

  if (menuBtn && navLinks) {
    addManagedListener(menuBtn, 'click', () => {
      setMobileMenuOpen(!navLinks.classList.contains('open'));
    });

    addManagedListener(navLinks, 'click', (event) => {
      if (event.target.closest('a, button')) setMobileMenuOpen(false);
    });

    addManagedListener(document, 'keydown', (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    });

    addManagedListener(window, 'resize', () => {
      if (window.innerWidth > 860) setMobileMenuOpen(false);
    }, { passive: true });
  }

  // Smooth Anchor Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    addManagedListener(anchor, 'click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        setMobileMenuOpen(false);
        if (lenis && !isReducedMotion) {
          lenis.scrollTo(target, { offset: -20, duration: 1.1 });
        } else {
          target.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
        }
      }
    });
  });

  // GSAP Context
  const ctx = gsap.context(() => {
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });

    // Top Progress Bar via ScrollTrigger
    const topSliderBar = document.getElementById('top-slider-bar');
    if (topSliderBar) {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          topSliderBar.style.width = `${self.progress * 100}%`;
        },
      });
    }

    // Navbar Scrolled State
    const navEl = document.getElementById('nav');
    if (navEl) {
      ScrollTrigger.create({
        start: 'top -30',
        end: 'max',
        onToggle: (self) => navEl.classList.toggle('scrolled', self.isActive),
      });
    }

    // -----------------------------------------------------------------
    // HERO SCROLL-DRIVEN ORBIT & FLIP DOCKING SCRUB
    // -----------------------------------------------------------------
    const heroTrack = document.getElementById('top');
    const wordmarkEl = document.getElementById('hero-dock-wordmark');
    const dockTargetEl = document.getElementById('nav-dock-target');
    const fadeContentEl = document.getElementById('hero-fade-content');
    const bottomCueEl = document.getElementById('hero-bottom-cue');

    if (heroTrack && wordmarkEl && !isReducedMotion) {
      let deltaX = 0;
      let deltaY = 0;
      let targetScale = 0.22;

      function updateDockCoordinates() {
        if (!dockTargetEl || !wordmarkEl) return;
        const targetRect = dockTargetEl.getBoundingClientRect();
        const currentRect = wordmarkEl.getBoundingClientRect();
        deltaX = (targetRect.left + targetRect.width / 2) - (currentRect.left + currentRect.width / 2);
        deltaY = (targetRect.top + targetRect.height / 2) - (currentRect.top + currentRect.height / 2);
        targetScale = Math.max(0.18, Math.min(0.32, (targetRect.height * 1.5) / (currentRect.height || 1)));
      }

      updateDockCoordinates();
      addManagedListener(window, 'resize', updateDockCoordinates, { passive: true });

      ScrollTrigger.create({
        trigger: heroTrack,
        start: 'top top',
        end: '+=100%',
        pin: '.hero-sticky-stage',
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // 1. Wordmark FLIP docking
          const currentScale = 1 - p * (1 - targetScale);
          const curX = deltaX * p;
          const curY = deltaY * p;
          wordmarkEl.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(${currentScale})`;

          // 2. Center content fade & slight translation
          if (fadeContentEl) {
            const fadeOpacity = Math.max(0, 1 - p * 2.1);
            fadeContentEl.style.opacity = fadeOpacity;
            fadeContentEl.style.transform = `translate3d(0, ${-p * 45}px, 0)`;
            fadeContentEl.style.pointerEvents = p > 0.4 ? 'none' : 'auto';
          }

          if (bottomCueEl) {
            bottomCueEl.style.opacity = Math.max(0, 1 - p * 3);
          }
        },
      });
    }

    // Active Section Tracking + Navigation Indicator + Custom Event dispatch
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a.nav-item');
    const navLinksContainer = document.getElementById('navlinks');
    let navIndicator = null;
    let lastActiveLink = null;

    if (navLinksContainer && !isTouch) {
      navIndicator = document.createElement('div');
      navIndicator.className = 'nav-slide-indicator';
      navLinksContainer.appendChild(navIndicator);
      cleanups.push(() => navIndicator.remove());
      gsap.set(navIndicator, { opacity: 0, width: 0, left: 0, top: 0 });
    }

    function moveNavIndicator(link, shouldAnimate) {
      if (!navIndicator || !navLinksContainer) return;
      requestAnimationFrame(() => {
        if (!link || !navLinksContainer || !navIndicator) return;
        const lr = link.getBoundingClientRect();
        const cr = navLinksContainer.getBoundingClientRect();
        const props = {
          left: lr.left - cr.left,
          width: lr.width,
          top: lr.bottom - cr.top,
          opacity: 1,
        };

        if (shouldAnimate) {
          gsap.to(navIndicator, {
            ...props,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true,
          });
        } else {
          gsap.set(navIndicator, props);
        }
      });
    }

    function updateActiveNav(id) {
      navItems.forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
          moveNavIndicator(link, Boolean(lastActiveLink));
          lastActiveLink = link;
        } else {
          link.classList.remove('active');
        }
      });

      // Dispatch event for ScrollRuler and other components
      window.dispatchEvent(new CustomEvent('portfolio-section-change', { detail: { id } }));
    }

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => updateActiveNav(section.id),
        onEnterBack: () => updateActiveNav(section.id),
      });
    });

    addManagedListener(window, 'resize', () => {
      if (lastActiveLink && navIndicator) {
        moveNavIndicator(lastActiveLink, false);
      }
    }, { passive: true });

    if (isReducedMotion) return;

    // Metrics Rollup Counter Animation
    ScrollTrigger.create({
      trigger: '.metrics-strip',
      start: 'top 88%',
      once: true,
      onEnter: () => {
        document.querySelectorAll('.metric-num').forEach((el) => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const startVal = target > 100 ? target - 26 : 0;
          const obj = { val: startVal };
          gsap.to(obj, {
            val: target,
            duration: isTouch ? 0.9 : 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(obj.val);
            },
          });
        });
      },
    });

    // Principles grid cards entrance
    document.querySelectorAll('.principle-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        y: isTouch ? 10 : 20,
        opacity: 0,
        duration: isTouch ? 0.4 : 0.6,
        delay: isTouch ? 0 : (index % 3) * 0.08,
        ease: 'power2.out',
      });
    });

    // About Section
    const aboutFacts = document.querySelectorAll('.about-facts .fact');
    if (aboutFacts.length > 0) {
      gsap.from(aboutFacts, {
        scrollTrigger: {
          trigger: '.about-facts',
          start: 'top 85%',
          once: true,
        },
        x: isTouch ? 0 : 16,
        opacity: 0,
        stagger: isTouch ? 0.025 : 0.06,
        duration: isTouch ? 0.4 : 0.6,
        ease: 'power2.out',
      });
    }

    const aboutText = document.querySelectorAll('.about-text p');
    if (aboutText.length > 0) {
      gsap.from(aboutText, {
        scrollTrigger: {
          trigger: '.about-text',
          start: 'top 85%',
          once: true,
        },
        y: isTouch ? 12 : 20,
        opacity: 0,
        stagger: isTouch ? 0.06 : 0.12,
        duration: isTouch ? 0.5 : 0.75,
        ease: 'power3.out',
      });
    }

    // Skills Rows — tag stagger
    document.querySelectorAll('.skill-row').forEach((row) => {
      const tags = row.querySelectorAll('.skill-tag');
      gsap.from(tags, {
        scrollTrigger: {
          trigger: row,
          start: 'top 90%',
          once: true,
        },
        y: isTouch ? 5 : 10,
        opacity: 0,
        duration: isTouch ? 0.3 : 0.4,
        stagger: isTouch ? 0.01 : 0.03,
        ease: 'power2.out',
      });
    });

    // Certification Cards
    document.querySelectorAll('.cert-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        },
        y: isTouch ? 12 : 25,
        opacity: 0,
        duration: isTouch ? 0.5 : 0.8,
        delay: isTouch ? 0 : index * 0.1,
        ease: 'power3.out',
      });
    });

    // Project Showcase Card
    const projectCardEl = document.getElementById('project-showcase');
    if (projectCardEl) {
      gsap.from(projectCardEl, {
        scrollTrigger: {
          trigger: projectCardEl,
          start: 'top 85%',
          once: true,
        },
        y: isTouch ? 12 : 25,
        opacity: 0,
        duration: isTouch ? 0.55 : 0.85,
        ease: 'power3.out',
      });
    }

    // Education Row
    document.querySelectorAll('.edu-row').forEach((row) => {
      gsap.from(row, {
        scrollTrigger: {
          trigger: row,
          start: 'top 88%',
          once: true,
        },
        y: isTouch ? 8 : 16,
        opacity: 0,
        duration: isTouch ? 0.45 : 0.7,
        ease: 'power2.out',
      });
    });

    ScrollTrigger.refresh();
  });

  return () => {
    ctx.revert();
    cleanups.splice(0).forEach((cleanup) => cleanup());
  };
}
