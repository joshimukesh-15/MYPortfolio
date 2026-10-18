import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPortfolioAnimations() {
  const cleanups = [];
  function addManagedListener(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  }

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 860;

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
        target.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // Safe word-split utility with DocumentFragment to prevent layout thrashing
  function splitIntoWords(el) {
    if (!el) return [];
    const existing = el.querySelectorAll('span');
    if (existing.length > 0) return existing;
    const originalText = el.textContent;
    const words = originalText.split(/\s+/).filter(Boolean);
    const frag = document.createDocumentFragment();
    words.forEach((word, i) => {
      const s = document.createElement('span');
      s.textContent = word;
      s.style.display = 'inline-block';
      frag.appendChild(s);
      if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
    });
    el.textContent = '';
    el.appendChild(frag);
    cleanups.push(() => {
      el.textContent = originalText;
    });
    return el.querySelectorAll('span');
  }

  // Wrap all GSAP animations & ScrollTriggers inside gsap.context()
  const ctx = gsap.context(() => {
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });

    // Top Progress Bar via ScrollTrigger
    const topSliderBar = document.getElementById('top-slider-bar');
    if (topSliderBar) {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          topSliderBar.style.width = `${self.progress * 100}%`;
        }
      });
    }

    if (isReducedMotion) return;

    // Navbar Scroll Transition
    const navEl = document.getElementById('nav');
    if (navEl) {
      ScrollTrigger.create({
        start: 'top -30',
        end: 'max',
        onToggle: (self) => navEl.classList.toggle('scrolled', self.isActive)
      });
    }

    // Active Section Tracking + Sliding Nav Indicator
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
          opacity: 1
        };

        if (shouldAnimate) {
          gsap.to(navIndicator, {
            ...props,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true
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
    }

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => updateActiveNav(section.id),
        onEnterBack: () => updateActiveNav(section.id)
      });
    });

    addManagedListener(window, 'resize', () => {
      if (lastActiveLink && navIndicator) {
        moveNavIndicator(lastActiveLink, false);
      }
    }, { passive: true });

    // Hero Entrance Timeline (Optimized for instant FCP/LCP)
    const nameWords = splitIntoWords(document.querySelector('#hero-title .name-line'));
    const italicWords = splitIntoWords(document.querySelector('#hero-title .italic-line'));

    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTL
      .from('.nav-inner', {
        y: -10,
        opacity: isTouch ? 0.85 : 0,
        duration: isTouch ? 0.3 : 0.5
      }, 0)
      .from('#hero-eyebrow', {
        y: 8,
        opacity: isTouch ? 0.85 : 0,
        duration: isTouch ? 0.25 : 0.45
      }, 0.02)
      .from('#hero-lead', {
        y: 8,
        opacity: isTouch ? 0.85 : 0,
        duration: isTouch ? 0.3 : 0.5
      }, isTouch ? 0.06 : 0.15)
      .from('#hero-actions', {
        y: 8,
        opacity: isTouch ? 0.85 : 0,
        duration: isTouch ? 0.25 : 0.45
      }, isTouch ? 0.08 : 0.2)
      .from('.metrics-strip', {
        opacity: isTouch ? 0.85 : 0,
        y: 8,
        duration: isTouch ? 0.3 : 0.5
      }, isTouch ? 0.1 : 0.25);

    // Section Titles Reveal
    document.querySelectorAll('.s-title, .cta-title').forEach((title) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 88%',
          once: true
        },
        y: isTouch ? 16 : 35,
        opacity: 0,
        duration: isTouch ? 0.55 : 0.9,
        ease: 'power3.out'
      });
    });

    // Section Head Numbers
    document.querySelectorAll('.s-num, .cta-eyebrow').forEach((num) => {
      const numSignal = num.querySelector('.signal');
      const targetNum = numSignal ? parseInt(numSignal.textContent, 10) : NaN;

      gsap.from(num, {
        scrollTrigger: {
          trigger: num,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            if (numSignal && !isNaN(targetNum)) {
              const counter = { val: 0 };
              gsap.to(counter, {
                val: targetNum,
                duration: 0.4,
                ease: 'power2.out',
                onUpdate: () => {
                  const rounded = Math.round(counter.val);
                  numSignal.textContent = (rounded < 10 ? '0' : '') + rounded;
                }
              });
            }
          }
        },
        x: isTouch ? 0 : -12,
        opacity: 0,
        duration: isTouch ? 0.45 : 0.7,
        ease: 'power2.out'
      });
    });

    // Section Dividers Entrance
    document.querySelectorAll('.skills-wrap, .cert-list, .edu-list').forEach((div) => {
      gsap.from(div, {
        scrollTrigger: {
          trigger: div,
          start: 'top 92%',
          once: true
        },
        opacity: 0,
        y: isTouch ? 8 : 15,
        duration: isTouch ? 0.5 : 0.8,
        ease: 'power2.out'
      });
    });

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
            }
          });
        });
      }
    });

    // About Section
    const aboutFacts = document.querySelectorAll('.about-facts .fact');
    if (aboutFacts.length > 0) {
      gsap.from(aboutFacts, {
        scrollTrigger: {
          trigger: '.about-facts',
          start: 'top 85%',
          once: true
        },
        x: isTouch ? 0 : 16,
        opacity: 0,
        stagger: isTouch ? 0.025 : 0.06,
        duration: isTouch ? 0.4 : 0.6,
        ease: 'power2.out'
      });
    }

    const aboutText = document.querySelectorAll('.about-text p');
    if (aboutText.length > 0) {
      gsap.from(aboutText, {
        scrollTrigger: {
          trigger: '.about-text',
          start: 'top 85%',
          once: true
        },
        y: isTouch ? 12 : 20,
        opacity: 0,
        stagger: isTouch ? 0.06 : 0.12,
        duration: isTouch ? 0.5 : 0.75,
        ease: 'power3.out'
      });
    }

    // Skills Rows — tag stagger
    document.querySelectorAll('.skill-row').forEach((row) => {
      const tags = row.querySelectorAll('.skill-tag');
      gsap.from(tags, {
        scrollTrigger: {
          trigger: row,
          start: 'top 90%',
          once: true
        },
        y: isTouch ? 5 : 10,
        opacity: 0,
        duration: isTouch ? 0.3 : 0.4,
        stagger: isTouch ? 0.01 : 0.03,
        ease: 'power2.out'
      });
    });

    // Certification Cards
    document.querySelectorAll('.cert-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true
        },
        y: isTouch ? 12 : 25,
        opacity: 0,
        duration: isTouch ? 0.5 : 0.8,
        delay: isTouch ? 0 : index * 0.1,
        ease: 'power3.out'
      });
    });

    // Project Showcase Card
    const projectCardEl = document.getElementById('project-showcase');
    if (projectCardEl) {
      gsap.from(projectCardEl, {
        scrollTrigger: {
          trigger: projectCardEl,
          start: 'top 85%',
          once: true
        },
        y: isTouch ? 12 : 25,
        opacity: 0,
        duration: isTouch ? 0.55 : 0.85,
        ease: 'power3.out'
      });
    }

    // Education Row
    document.querySelectorAll('.edu-row').forEach((row) => {
      gsap.from(row, {
        scrollTrigger: {
          trigger: row,
          start: 'top 88%',
          once: true
        },
        y: isTouch ? 8 : 16,
        opacity: 0,
        duration: isTouch ? 0.45 : 0.7,
        ease: 'power2.out'
      });
    });

    // CTA Actions
    const ctaActions = document.querySelector('.cta-actions');
    if (ctaActions) {
      gsap.from(ctaActions, {
        scrollTrigger: {
          trigger: '.cta-actions',
          start: 'top 90%',
          once: true
        },
        y: isTouch ? 10 : 20,
        opacity: 0,
        duration: isTouch ? 0.5 : 0.8,
        ease: 'power3.out'
      });
    }

    // Footer Links Stagger
    const footerAnchors = document.querySelectorAll('.footer-links a');
    if (footerAnchors.length > 0) {
      gsap.from(footerAnchors, {
        scrollTrigger: {
          trigger: '.footer-links',
          start: 'top 92%',
          once: true
        },
        y: isTouch ? 5 : 10,
        opacity: 0,
        stagger: isTouch ? 0.01 : 0.03,
        duration: isTouch ? 0.3 : 0.4,
        ease: 'power2.out'
      });
    }

    ScrollTrigger.refresh();
  });

  return () => {
    ctx.revert();
    cleanups.splice(0).forEach((cleanup) => cleanup());
  };
}
