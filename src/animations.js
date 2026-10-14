import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPortfolioAnimations() {
  const cleanups = [];
  function addManagedListener(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  }

  'use strict';

  // Dynamic Year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 820;

  // ----------------------------------------------------
  // TOP UI SLIDER PROGRESS LINE
  // ----------------------------------------------------
  var topSliderBar = document.getElementById('top-slider-bar');
  function updateTopSlider() {
    var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0 && topSliderBar) {
      var progress = Math.min(100, Math.max(0, (winScroll / height) * 100));
      topSliderBar.style.width = progress + '%';
    }
  }
  addManagedListener(window, 'scroll', updateTopSlider, { passive: true });

  // Smooth Anchor Navigation
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    addManagedListener(anchor, 'click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navLinks = document.getElementById('navlinks');
        if (navLinks) navLinks.classList.remove('open');
        
        target.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // Mobile Menu Toggle
  var menuBtn = document.getElementById('menu-toggle');
  var navLinks = document.getElementById('navlinks');
  if (menuBtn && navLinks) {
    addManagedListener(menuBtn, 'click', function () {
      navLinks.classList.toggle('open');
    });
  }

  // ----------------------------------------------------
  // 4. GSAP TIMELINES, SCROLL REVEALS & METRICS ROLLUP
  // ----------------------------------------------------
  if (typeof gsap !== 'undefined' && !isReducedMotion) {

    // Navbar Scroll Transition
    var navEl = document.getElementById('nav');
    if (navEl && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        start: 'top -30',
        end: 99999,
        onUpdate: function (self) {
          if (self.progress > 0) {
            navEl.classList.add('scrolled');
          } else {
            navEl.classList.remove('scrolled');
          }
        }
      });
    }

    // Active Section Tracking + Sliding Nav Indicator
    if (typeof ScrollTrigger !== 'undefined') {
      var sections = document.querySelectorAll('section[id]');
      var navItems = document.querySelectorAll('.nav-links a.nav-item');
      var navLinksContainer = document.getElementById('navlinks');
      var navIndicator = null;
      var lastActiveLink = null;

      if (navLinksContainer && !isTouch) {
        navIndicator = document.createElement('div');
        navIndicator.className = 'nav-slide-indicator';
        navLinksContainer.appendChild(navIndicator);
        cleanups.push(function () { navIndicator.remove(); });
        gsap.set(navIndicator, { opacity: 0, width: 0, left: 0, top: 0 });
      }

      sections.forEach(function (section) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: function () { updateActiveNav(section.id); },
          onEnterBack: function () { updateActiveNav(section.id); }
        });
      });

      function moveNavIndicator(link, shouldAnimate) {
        if (!navIndicator || !navLinksContainer) return;
        var lr = link.getBoundingClientRect();
        var cr = navLinksContainer.getBoundingClientRect();
        var toLeft = lr.left - cr.left;
        var toWidth = lr.width;
        var toTop = lr.bottom - cr.top;

        if (shouldAnimate) {
          gsap.to(navIndicator, {
            left: toLeft,
            width: toWidth,
            top: toTop,
            opacity: 1,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true
          });
        } else {
          gsap.set(navIndicator, { left: toLeft, width: toWidth, top: toTop, opacity: 1 });
        }
      }

      function updateActiveNav(id) {
        navItems.forEach(function (link) {
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
            moveNavIndicator(link, !!lastActiveLink);
            lastActiveLink = link;
          } else {
            link.classList.remove('active');
          }
        });
      }

      addManagedListener(window, 'resize', function() {
        if (lastActiveLink && navIndicator) {
          moveNavIndicator(lastActiveLink, false);
        }
      }, { passive: true });
    }

    // Word-split utility for hero heading stagger
    function splitIntoWords(el) {
      var text = el.textContent;
      var words = text.split(/\s+/);
      el.textContent = '';
      words.forEach(function(word, i) {
        var s = document.createElement('span');
        s.textContent = word;
        s.style.display = 'inline-block';
        el.appendChild(s);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
      return el.querySelectorAll('span');
    }

    var nameLineEl = document.querySelector('#hero-title .name-line');
    var italicLineEl = document.querySelector('#hero-title .italic-line');
    var nameWords = nameLineEl ? splitIntoWords(nameLineEl) : [];
    var italicWords = italicLineEl ? splitIntoWords(italicLineEl) : [];

    // Hero Entrance Timeline
    var heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.0 } });

    heroTL
      .from('.nav-inner', {
        y: -20,
        opacity: 0,
        duration: 0.8
      })
      .from('#hero-eyebrow', {
        y: 15,
        opacity: 0,
        duration: 0.7
      }, '-=0.4')
      .from(nameWords, {
        y: 24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out'
      }, '-=0.5')
      .from(italicWords, {
        y: 24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out'
      }, '-=0.4')
      .from('#hero-lead', {
        y: 20,
        opacity: 0,
        duration: 0.8
      }, '-=0.6')
      .from('#hero-actions', {
        y: 15,
        opacity: 0,
        duration: 0.7
      }, '-=0.6')
      .from('.metrics-strip', {
        opacity: 0,
        y: 20,
        duration: 0.8
      }, '-=0.4');

    // Section Titles Reveal
    if (typeof ScrollTrigger !== 'undefined') {
      var sectionTitles = document.querySelectorAll('.s-title, .cta-title');
      sectionTitles.forEach(function (title) {
        gsap.from(title, {
          scrollTrigger: {
            trigger: title,
            start: 'top 88%',
            once: true
          },
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out'
        });
      });

      // Section Head Numbers
      var sectionNums = document.querySelectorAll('.s-num, .cta-eyebrow');
      sectionNums.forEach(function (num) {
        var numSignal = num.querySelector('.signal');
        var targetNum = numSignal ? parseInt(numSignal.textContent, 10) : NaN;

        gsap.from(num, {
          scrollTrigger: {
            trigger: num,
            start: 'top 90%',
            once: true,
            onEnter: function() {
              if (numSignal && !isNaN(targetNum)) {
                var counter = { val: 0 };
                gsap.to(counter, {
                  val: targetNum,
                  duration: 0.4,
                  ease: 'power2.out',
                  onUpdate: function() {
                    var rounded = Math.round(counter.val);
                    numSignal.textContent = (rounded < 10 ? '0' : '') + rounded;
                  }
                });
              }
            }
          },
          x: -12,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out'
        });
      });

      // Section Dividers Entrance
      var sectionDividers = document.querySelectorAll('.skills-wrap, .cert-list, .edu-list');
      sectionDividers.forEach(function (div) {
        gsap.from(div, {
          scrollTrigger: {
            trigger: div,
            start: 'top 92%',
            once: true
          },
          opacity: 0,
          y: 15,
          duration: 0.8,
          ease: 'power2.out'
        });
      });

      // Metrics Rollup Counter Animation
      ScrollTrigger.create({
        trigger: '.metrics-strip',
        start: 'top 88%',
        once: true,
        onEnter: function () {
          document.querySelectorAll('.metric-num').forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            var startVal = target > 100 ? target - 26 : 0;
            var obj = { val: startVal };
            gsap.to(obj, {
              val: target,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: function () {
                el.textContent = Math.round(obj.val);
              }
            });
          });
        }
      });

      // About Section
      var aboutFacts = document.querySelectorAll('.about-facts .fact');
      if (aboutFacts.length > 0) {
        gsap.from(aboutFacts, {
          scrollTrigger: {
            trigger: '.about-facts',
            start: 'top 85%',
            once: true
          },
          x: 16,
          opacity: 0,
          stagger: 0.06,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      var aboutText = document.querySelectorAll('.about-text p');
      if (aboutText.length > 0) {
        gsap.from(aboutText, {
          scrollTrigger: {
            trigger: '.about-text',
            start: 'top 85%',
            once: true
          },
          y: 20,
          opacity: 0,
          stagger: 0.12,
          duration: 0.75,
          ease: 'power3.out'
        });
      }

      // Skills Rows — tag stagger
      var skillRows = document.querySelectorAll('.skill-row');
      skillRows.forEach(function (row) {
        var tags = row.querySelectorAll('.skill-tag');
        gsap.from(tags, {
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
            once: true
          },
          y: 10,
          opacity: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: 'power2.out'
        });
      });

      // Certification Cards
      var certCards = document.querySelectorAll('.cert-card');
      certCards.forEach(function (card, index) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true
          },
          y: 25,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out'
        });
      });

      // Project Showcase Card
      var projectCardEl = document.getElementById('project-showcase');
      if (projectCardEl) {
        gsap.from(projectCardEl, {
          scrollTrigger: {
            trigger: projectCardEl,
            start: 'top 85%',
            once: true
          },
          y: 25,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out'
        });
      }

      // Education Row
      var eduRows = document.querySelectorAll('.edu-row');
      eduRows.forEach(function (row) {
        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: 'top 88%',
            once: true
          },
          y: 16,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out'
        });
      });

      // CTA Actions
      var ctaActions = document.querySelector('.cta-actions');
      if (ctaActions) {
        gsap.from(ctaActions, {
          scrollTrigger: {
            trigger: '.cta-actions',
            start: 'top 90%',
            once: true
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
      }

      // Footer Links Stagger
      var footerAnchors = document.querySelectorAll('.footer-links a');
      if (footerAnchors.length > 0) {
        gsap.from(footerAnchors, {
          scrollTrigger: {
            trigger: '.footer-links',
            start: 'top 92%',
            once: true
          },
          y: 10,
          opacity: 0,
          stagger: 0.03,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    }
  }


  return () => {
    cleanups.splice(0).forEach((cleanup) => cleanup());
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf('*');
  };
}
