import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { initPortfolioAnimations } from './animations.js';
import ArtCraftGalaxy, { GALAXY_TILES } from './components/ArtCraftGalaxy.jsx';
import SectionHeader from './components/SectionHeader.jsx';
import './styles.css';
import './artcraft.css';

const EMAIL = 'joshimukesh2005@gmail.com';
const GITHUB_URL = 'https://github.com/joshimukesh-15';
const LINKEDIN_URL = 'https://www.linkedin.com/in/mukesh-joshi-433290379/';
const RESUME_URL = '/Mukesh_Joshi_Resume_1.pdf';

const NAV_LINKS = [
  { href: '#toolchain', label: 'Toolchain' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#principles', label: 'Principles' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function IconArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="2" y="4" width="20" height="16" rx="1" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="9" y="9" width="12" height="12" rx="1" />
      <path d="M5 15V4a1 1 0 0 1 1-1h11" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M20.99 12.49a9 9 0 1 1-9.47-9.47c.4-.02.62.46.4.8a6 6 0 0 0 8.27 8.27c.34-.22.82 0 .8.4Z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 5h16M4 12h16M4 19h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Chrome                                                              */
/* ------------------------------------------------------------------ */

function TopProgress() {
  return (
    <div className="top-progress" aria-hidden="true">
      <span id="top-progress-bar" />
    </div>
  );
}

function CopyToast({ toastMessage }) {
  return (
    <div className={`copy-toast${toastMessage ? ' is-visible' : ''}`} role="status" aria-live="polite">
      {toastMessage || 'Email copied to clipboard'}
    </div>
  );
}

function Navigation({ theme, onToggleTheme, menuOpen, onToggleMenu }) {
  return (
    <header className="site-nav" id="site-nav">
      <div className="site-nav-bar">
        <a href="#top" className="nav-brand">
          <span className="nav-brand-mark">MJ</span>
          <span className="nav-brand-name">Mukesh Joshi</span>
        </a>

        <nav className="nav-menu" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-cell nav-link hud-label" data-nav-link>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <button
            type="button"
            className="nav-cell nav-icon"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cell nav-icon nav-icon--desktop"
            aria-label="GitHub profile"
            title="GitHub profile"
          >
            <IconGitHub />
          </a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="nav-cell nav-cta hud-label">
            <span>Résumé</span>
            <IconArrowUpRight />
          </a>
          <button
            type="button"
            className="nav-cell nav-icon nav-menu-btn"
            onClick={onToggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div className={`mobile-nav${menuOpen ? ' is-open' : ''}`} id="mobile-nav">
        {NAV_LINKS.map((link, index) => (
          <a key={link.href} href={link.href} className="mobile-nav-link" onClick={() => onToggleMenu(false)}>
            <span className="hud-label mobile-nav-num">0{index + 1}</span>
            <span>{link.label}</span>
            <IconArrowUpRight />
          </a>
        ))}
        <div className="mobile-nav-foot">
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
            <IconDownload /> Download résumé
          </a>
          <a href={`mailto:${EMAIL}`} className="btn btn--outline">
            <IconMail /> Send email
          </a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll ruler                                                        */
/* ------------------------------------------------------------------ */

const RULER_UNIT = 90.6;

function ScrollRuler() {
  const trackRef = useRef(null);
  const needleRef = useRef(null);
  const readoutRef = useRef(null);
  const [units, setUnits] = useState(80);

  useEffect(() => {
    const measure = () => {
      const next = Math.ceil(document.documentElement.scrollHeight / RULER_UNIT) + 2;
      setUnits((prev) => (prev === next ? prev : next));
    };
    measure();
    window.addEventListener('resize', measure);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (observer) observer.observe(document.body);

    let raf;
    const tick = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, y / max));
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 48;
      if (trackRef.current) trackRef.current.style.transform = `translate3d(0, ${-y}px, 0)`;
      if (needleRef.current) {
        needleRef.current.style.transform = `translate3d(0, ${progress * (window.innerHeight - navH - 96)}px, 0)`;
      }
      if (readoutRef.current) {
        readoutRef.current.textContent = `${String(Math.round(progress * 100)).padStart(3, '0')}%`;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="page-ruler" aria-hidden="true">
      <div className="pr-track" ref={trackRef} style={{ height: units * RULER_UNIT }}>
        {Array.from({ length: units }, (_, i) => (
          <span
            key={i}
            className={`pr-tick${i % 5 === 0 ? ' is-major' : ''}`}
            style={{ top: i * RULER_UNIT }}
          >
            {i % 5 === 0 ? <b>{i}</b> : null}
          </span>
        ))}
      </div>
      <div className="pr-needle" ref={needleRef}>
        <span className="pr-needle-line" />
        <span className="pr-needle-readout" ref={readoutRef}>000%</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dock chrome: corner mark, section list and edge label               */
/* ------------------------------------------------------------------ */

const DOCK_SECTIONS = [
  { id: 'toolchain', name: 'Toolchain', short: 'Toolchain' },
  { id: 'projects', name: 'The lineup', short: 'Lineup' },
  { id: 'skills', name: 'Skills', short: 'Skills' },
  { id: 'principles', name: 'Principles', short: 'Principles' },
  { id: 'about', name: 'About', short: 'About' },
  { id: 'contact', name: 'Contact', short: 'Contact' },
];

function PlainLetters({ text, cls }) {
  return text.split('').map((char, i) =>
    char === ' ' ? (
      <span key={`p-${i}`} className="fl-space" aria-hidden="true">&nbsp;</span>
    ) : (
      <span key={`${char}-${i}`} className={cls} aria-hidden="true">{char}</span>
    )
  );
}

function FlyLetters({ text, step = 32, offset = 0 }) {
  return text.split('').map((char, i) =>
    char === ' ' ? (
      <span key={`s-${i}`} className="fl-space" aria-hidden="true">&nbsp;</span>
    ) : (
      <span
        key={`${char}-${i}`}
        className="fl"
        aria-hidden="true"
        style={{ '--d': `${offset + i * step}ms` }}
      >
        {char}
      </span>
    )
  );
}

function DockChrome() {
  const [activeId, setActiveId] = useState(null);
  const prevIdRef = useRef(null);
  const railMemory = useRef(null);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let found = null;
      DOCK_SECTIONS.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) found = item.id;
      });
      setActiveId((prev) => (prev === found ? prev : found));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const active = DOCK_SECTIONS.find((item) => item.id === activeId) || null;

  useLayoutEffect(() => {
    const prevId = prevIdRef.current;
    prevIdRef.current = activeId;
    const prevMemory = railMemory.current;

    const rail = Array.from(document.querySelectorAll('.rail-label .rl'));
    const corner = Array.from(document.querySelectorAll('.dock-section .cl'));
    const centre = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    if (activeId && rail.length) {
      const cs = getComputedStyle(rail[0]);
      railMemory.current = {
        id: activeId,
        font: {
          family: cs.fontFamily,
          weight: cs.fontWeight,
          stretch: cs.fontStretch,
          size: parseFloat(cs.fontSize) || 27,
          spacing: cs.letterSpacing,
        },
        letters: rail.map((el) => ({ char: el.textContent, ...centre(el) })),
      };
    } else {
      railMemory.current = null;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 1081px)').matches;
    if (!wide || reduced) {
      rail.forEach((el) => { el.style.opacity = '1'; });
      return undefined;
    }

    const ghosts = [];
    const animations = [];
    const restore = [];
    const timers = [];

    const makeGhost = (char, font) => {
      const g = document.createElement('span');
      g.textContent = char.toUpperCase();
      g.setAttribute('aria-hidden', 'true');
      g.style.cssText =
        'position:fixed;left:0;top:0;margin:0;z-index:95;pointer-events:none;' +
        'white-space:pre;line-height:1;will-change:transform;opacity:0;' +
        `color:var(--ink-strong);font-family:${font.family};font-weight:${font.weight};` +
        `font-stretch:${font.stretch};font-size:${font.size}px;letter-spacing:${font.spacing};`;
      document.body.appendChild(g);
      ghosts.push(g);
      return g;
    };

    const fly = (ghost, from, to, o) => {
      const gw = ghost.offsetWidth;
      const gh = ghost.offsetHeight;
      const at = (p, rot, sc) =>
        `translate(${p.x - gw / 2}px, ${p.y - gh / 2}px) rotate(${rot}deg) scale(${sc})`;
      const mid = { x: (from.x + to.x) / 2 - 90, y: (from.y + to.y) / 2 };
      const animation = ghost.animate(
        [
          { transform: at(from, o.fromRot, o.fromScale), opacity: 0 },
          { opacity: 1, offset: 0.1 },
          { transform: at(mid, (o.fromRot + o.toRot) / 2 + o.jitter, 1), offset: 0.5 },
          { transform: at(to, o.toRot, o.toScale), opacity: 1 },
        ],
        {
          duration: o.duration,
          delay: o.delay,
          easing: 'cubic-bezier(0.33, 0, 0.2, 1)',
          fill: 'both',
        }
      );
      animation.onfinish = () => {
        ghost.remove();
        if (o.done) o.done();
      };
      animations.push(animation);
    };

    /* 1 + 2: new section */
    if (activeId && rail.length) {
      const font = railMemory.current.font;
      const listLetters = Array.from(
        document.querySelectorAll(`.side-nav a[data-sec="${activeId}"] .sl`)
      );

      if (listLetters.length === rail.length) {
        const n = rail.length;
        const listSize = parseFloat(getComputedStyle(listLetters[0]).fontSize) || font.size;
        rail.forEach((el) => { el.style.opacity = '0'; restore.push(el); });

        rail.forEach((el, i) => {
          const delay = (n - 1 - i) * 55; /* last letter leads */
          fly(makeGhost(el.textContent, font), centre(listLetters[i]), centre(el), {
            delay,
            duration: 1100,
            fromRot: 0,
            toRot: -90,
            fromScale: listSize / font.size,
            toScale: 1,
            jitter: (i % 2 ? 1 : -1) * 32,
            done: () => { el.style.opacity = '1'; },
          });
        });

        /* the end of the name lifts off the rail into the corner */
        const offset = n - corner.length;
        corner.forEach((letter, j) => {
          const idx = Math.min(n - 1, Math.max(0, offset + j));
          const source = rail[idx];
          const a = centre(source);
          const b = letter.getBoundingClientRect();
          const dx = a.x - (b.left + b.width / 2);
          const dy = a.y - (b.top + b.height / 2);
          const delay = (n - 1 - idx) * 55 + 950 + (corner.length - 1 - j) * 70;
          const spin = j % 2 === 0 ? -1 : 1;

          animations.push(
            letter.animate(
              [
                { transform: `translate(${dx}px, ${dy}px) rotate(${spin * 70}deg) scale(0.55)`, opacity: 0 },
                { opacity: 1, offset: 0.12 },
                {
                  transform: `translate(${dx * 0.45 - 70}px, ${dy * 0.45}px) rotate(${-spin * 28}deg) scale(0.92)`,
                  offset: 0.55,
                },
                { transform: 'translate(0px, 0px) rotate(0deg) scale(1)', opacity: 1 },
              ],
              { duration: 1150, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
            )
          );
          animations.push(
            source.animate(
              [{ opacity: 1 }, { opacity: 0, offset: 0.02 }, { opacity: 0, offset: 0.8 }, { opacity: 1 }],
              { duration: 1900, delay, fill: 'forwards' }
            )
          );
        });
      } else {
        rail.forEach((el) => { el.style.opacity = '1'; });
      }
    }

    /* 3: previous section's letters fall back into the list */
    if (prevId && prevMemory && prevMemory.id === prevId) {
      const targets = Array.from(
        document.querySelectorAll(`.side-nav a[data-sec="${prevId}"] .sl`)
      );
      if (targets.length === prevMemory.letters.length) {
        const listSize = parseFloat(getComputedStyle(targets[0]).fontSize) || prevMemory.font.size;
        targets.forEach((el) => { el.style.opacity = '0'; restore.push(el); });

        prevMemory.letters.forEach((L, i) => {
          fly(makeGhost(L.char, prevMemory.font), { x: L.x, y: L.y }, centre(targets[i]), {
            delay: i * 45,
            duration: 1000,
            fromRot: -90,
            toRot: 0,
            fromScale: 1,
            toScale: listSize / prevMemory.font.size,
            jitter: (i % 2 ? -1 : 1) * 32,
            done: () => { targets[i].style.opacity = '1'; },
          });
        });
      }
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      animations.forEach((animation) => animation.cancel());
      ghosts.forEach((g) => g.remove());
      restore.forEach((el) => { el.style.opacity = '1'; });
    };
  }, [activeId]);

  return (
    <>
      <a href="#top" className="dock-mark" aria-label="Mukesh Joshi, back to top">
        <span className="dock-mark-word" aria-hidden="true">
          {WORDMARK.split('').map((char, index) =>
            char === ' ' ? (
              <span key={`ds-${index}`} className="dm-space">&nbsp;</span>
            ) : (
              <span key={`d-${char}-${index}`} className="dm-letter">{char}</span>
            )
          )}
        </span>
        <span className={`dock-section${active ? ' is-visible' : ''}`} aria-hidden="true">
          {active ? (
            <span key={active.id} className="fl-run">
              <PlainLetters text={active.short} cls="cl" />
            </span>
          ) : null}
        </span>
      </a>

      <nav className="side-nav" aria-label="Sections">
        {DOCK_SECTIONS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-sec={item.id}
            className={item.id === activeId ? 'is-active' : undefined}
            aria-label={item.name}
          >
            <PlainLetters text={item.name} cls="sl" />
          </a>
        ))}
      </nav>

      <span className={`rail-label${active ? ' is-visible' : ''}`} aria-hidden="true">
        {active ? (
          <span key={active.id} className="fl-run">
            <PlainLetters text={active.name} cls="rl" />
          </span>
        ) : null}
      </span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const WORDMARK = 'MUKESH JOSHI';

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-galaxy" aria-hidden="true">
        <ArtCraftGalaxy />
      </div>
      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-stage">
        <div className="hero-center">
          <p className="hero-badge hud-label">
            <i aria-hidden="true" />
            Open to 2026 internships
          </p>

          <h1 className="hero-wordmark" aria-label="Mukesh Joshi">
            {WORDMARK.split('').map((char, index) =>
              char === ' ' ? (
                <span key={`space-${index}`} className="wm-letter wm-letter--space" aria-hidden="true">
                  &nbsp;
                </span>
              ) : (
                <span key={`${char}-${index}`} className="wm-letter" aria-hidden="true">
                  {char}
                </span>
              )
            )}
          </h1>

          <h2 className="hero-title display">
            Production systems. <em>Built the hard way.</em>
          </h2>

          <p className="hero-lede">
            I build layered FastAPI backends, multi-tenant PostgreSQL platforms, and
            self-correcting RAG pipelines — paired with considered React interfaces.
          </p>

          <div className="hero-actions">
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
              <IconDownload />
              Download résumé
            </a>
            <a href="#projects" className="btn btn--outline">
              Explore projects
              <IconArrowRight />
            </a>
          </div>

          <p className="hero-meta hud-label">
            Gujarat, India · IST / UTC+5:30 · Remote or hybrid
          </p>

          <p className="hero-inline">
            Looking for case studies and source?{' '}
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              See the GitHub profile <IconArrowUpRight />
            </a>
          </p>

          <div className="hero-trust hud-label">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <IconGitHub />
              Open source on GitHub
            </a>
            <span>Python</span>
            <span>FastAPI</span>
            <span>PostgreSQL</span>
            <span>React</span>
            <span>ChromaDB</span>
            <span>Docker</span>
          </div>
        </div>

        <a href="#projects" className="hero-scroll hud-label">
          Scroll
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Metrics                                                             */
/* ------------------------------------------------------------------ */

const METRICS = [
  { value: 'Python & FastAPI', label: 'Layered backend architecture' },
  { value: 'Hybrid RAG', label: 'ChromaDB & BM25 search' },
  { value: '4-Tier', label: 'Multi-tenant RBAC & JWT' },
  { value: 'Open', label: 'Internships & entry-level roles' },
];

function MetricsStrip() {
  return (
    <div className="metrics-strip">
      {METRICS.map((metric, index) => (
        <div className="metric" key={metric.label}>
          <span className="hud-label metric-index">0{index + 1}</span>
          <span className="metric-value display">{metric.value}</span>
          <span className="metric-label">{metric.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

const PROJECTS = [
  {
    index: '01',
    category: 'Retrieval & generation',
    name: 'Glint',
    status: 'Continuous Intelligence & CRAG',
    summary:
      'Production-grade Corrective RAG platform engineered for high-precision enterprise document intelligence, hybrid semantic-BM25 search with Reciprocal Rank Fusion, autonomous self-correction reflection loops, and real-time RAG Triad evaluation.',
    tech: ['React 18', 'FastAPI', 'ChromaDB', 'Rank-BM25', 'Gemini LLM', 'Tailwind CSS'],
    link: 'https://github.com/joshimukesh-15/glint',
    linkLabel: 'View code',
  },
  {
    index: '02',
    category: 'Inventory & orders',
    name: 'FlowStock',
    status: 'Active development',
    summary:
      'Full-stack SaaS platform managing inventory lifecycles, sales and purchase orders, shipments, and invoicing. A strict three-tier backend (API routers, domain services, PostgreSQL data access) paired with a responsive React and Tailwind dashboard.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'React.js', 'WebSockets'],
    link: GITHUB_URL,
    linkLabel: 'View profile',
  },
];

function ProjectCard({ project }) {
  return (
    <article className="project-card" data-reveal>
      <div className="project-copy">
        <div className="project-topline">
          <span className="hud-label project-index">{project.index}</span>
          <span className="hud-label project-category">{project.category}</span>
        </div>

        <div className="project-title-row">
          <h3 className="project-name display">{project.name}</h3>
          <span className="project-status hud-label">
            <i aria-hidden="true" />
            {project.status}
          </span>
        </div>

        <p className="project-summary">{project.summary}</p>

        <ul className="project-tech">
          {project.tech.map((item) => (
            <li key={item} className="hud-label">{item}</li>
          ))}
        </ul>

        <div className="project-actions">
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-link">
            {project.linkLabel}
            <IconArrowUpRight />
          </a>
          <a href={`${GITHUB_URL}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="text-link text-link--muted">
            All repositories
            <IconArrowUpRight />
          </a>
        </div>
      </div>
    </article>
  );
}

function ToolchainSection() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).then(done).catch(() => {});
    }
  };

  return (
    <section id="toolchain" className="section">
      <div className="wrap">
        <SectionHeader num="01" name="Toolchain" meta="Eight tools · Open source · Production tested" />

        <div className="tool-split">
          <div className="tool-copy" data-reveal>
            <h2 className="display section-title">
              Eight tools. <em>One craft.</em>
            </h2>
            <p className="section-lede">
              Python and FastAPI on the backend, PostgreSQL and ChromaDB underneath, React on
              the front, Docker packaging every build. The same stack runs both builds
              below, written from the schema up and open source on GitHub.
            </p>
            <div className="section-actions">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
                <IconGitHub />
                Browse on GitHub
              </a>
              <a href={`mailto:${EMAIL}`} className="btn btn--outline">
                <IconMail />
                Get in touch
              </a>
            </div>
          </div>

          <div className="tool-strip" data-reveal>
            {GALAXY_TILES.map((tile) => (
              <a
                key={tile.id}
                className="tool-chip"
                href="#projects"
                style={{
                  '--tile-a': tile.colors[0],
                  '--tile-b': tile.colors[1],
                  '--tile-shadow': tile.shadowColor,
                }}
              >
                <span className="tool-icon" aria-hidden="true">{tile.name.charAt(0)}</span>
                <span className="tool-name">{tile.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="share-row hud-label" data-reveal>
          <span>Share</span>
          <button type="button" onClick={copyLink}>{copied ? 'Copied' : 'Copy link'}</button>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://mukeshjoshi.vercel.app/')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href={`https://x.com/intent/post?url=${encodeURIComponent('https://mukeshjoshi.vercel.app/')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </a>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="section">
      <div className="wrap">
        <SectionHeader num="02" name="The lineup" meta="RAG systems & production architecture" />

        <div className="section-head" data-reveal>
          <h2 className="display section-title">
            Two builds. <em>One craft.</em>
          </h2>
          <p className="section-lede">
            Retrieval pipelines, tenant isolation, live sockets — written from the schema up.
            Open source on GitHub, free to read, fork, and build on.
          </p>
        </div>

        <div className="section-actions" data-reveal>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
            <IconGitHub />
            Browse on GitHub
          </a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
            <IconDownload />
            Download résumé
          </a>
        </div>

        <p className="lineup-lead hud-label" data-reveal>Pick a build to explore</p>

        <div className="project-lineup">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

const SKILL_DOMAINS = [
  {
    id: 'backend',
    category: 'Backend & data architecture',
    meta: 'Layered domain services & multi-tenancy',
    skills: ['Python 3.12+', 'FastAPI', 'PostgreSQL', 'RESTful APIs', 'WebSockets', 'JWT & 4-tier RBAC', 'SQLAlchemy / Alembic', 'Pydantic v2'],
    highlight: 'Clean API router, domain service, and repository separation with strict schema migrations.',
  },
  {
    id: 'ai',
    category: 'AI & retrieval systems',
    meta: 'Vector pipelines & reasoning loops',
    skills: ['LangChain', 'ChromaDB', 'Corrective RAG (CRAG)', 'Hybrid search (BM25 + vector)', 'Query reflection', 'Context chunking', 'Faithfulness evaluation'],
    highlight: 'Autonomous relevance gating and hallucination guards that keep answers grounded.',
  },
  {
    id: 'languages',
    category: 'Languages & concurrency',
    meta: 'System & concurrent programming',
    skills: ['Python (asyncio)', 'JavaScript (ES6+)', 'SQL (PostgreSQL / relational)', 'TypeScript', 'HTML5 & modern CSS'],
    highlight: 'Strict typing, asynchronous concurrency, and optimized relational data modelling.',
  },
  {
    id: 'frontend-tools',
    category: 'Frontend & infrastructure',
    meta: 'Reactive interfaces & containerization',
    skills: ['React.js', 'Tailwind CSS', 'Docker', 'Git & GitHub', 'VS Code', 'Linux CLI', 'Postman API testing'],
    highlight: 'Responsive component-driven UI with considered motion and containerized deployment.',
  },
];

const SKILL_FILTERS = [
  { id: 'all', label: 'All domains' },
  { id: 'backend', label: 'Backend & data' },
  { id: 'ai', label: 'AI & retrieval' },
  { id: 'languages', label: 'Languages' },
  { id: 'frontend-tools', label: 'Infra & tools' },
];

function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredDomains = activeCategory === 'all'
    ? SKILL_DOMAINS
    : SKILL_DOMAINS.filter((domain) => domain.id === activeCategory);

  return (
    <section id="skills" className="section section--tint">
      <div className="wrap">
        <SectionHeader num="03" name="Skills" meta="Engineering matrix & core toolkit" />

        <div className="section-head" data-reveal>
          <h2 className="display section-title">
            Pick a domain. <em>See the toolkit.</em>
          </h2>
          <p className="section-lede">
            Four disciplines, one working method: define the schema, guard the edge,
            retrieve before answering, then ship small and observe.
          </p>
        </div>

        <div className="filter-bar" role="tablist" aria-label="Skill domains" data-reveal>
          {SKILL_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === filter.id}
              className={`filter-cell hud-label${activeCategory === filter.id ? ' is-active' : ''}`}
              onClick={() => setActiveCategory(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="skill-grid">
          {filteredDomains.map((domain) => (
            <article className="skill-card" key={domain.id} data-reveal>
              <div className="skill-card-top">
                <span className="hud-label skill-meta">{domain.meta}</span>
                <span className="skill-dot" aria-hidden="true" />
              </div>
              <h3 className="skill-title display">{domain.category}</h3>
              <p className="skill-highlight">{domain.highlight}</p>
              <ul className="skill-tags">
                {domain.skills.map((skill) => (
                  <li key={skill} className="hud-label">{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Principles                                                          */
/* ------------------------------------------------------------------ */

const BUILD_PRINCIPLES = [
  { n: '01', title: 'Layer cleanly', body: 'API routers, domain services, and data-access objects stay in separate files — no logic bleeds across layers.' },
  { n: '02', title: 'Schema first', body: 'Every feature starts with the database schema and migration, not the endpoint, so the data model drives the API.' },
  { n: '03', title: 'Contracts over docs', body: "FastAPI's OpenAPI output is the source of truth; frontend types are generated from it, not written by hand." },
  { n: '04', title: 'Guard the edge', body: 'Auth, tenant scoping, and rate-limiting run as middleware before any handler sees the request.' },
  { n: '05', title: 'Retrieve, then reflect', body: 'RAG pipelines grade their own retrieved chunks before answering — bad context triggers a corrective loop, not a hallucination.' },
  { n: '06', title: 'Ship small, observe', body: 'Each feature lands with a log statement, a Postman test, and a clear rollback path before the next one starts.' },
];

function PrinciplesSection() {
  return (
    <section id="principles" className="section">
      <div className="wrap">
        <SectionHeader num="04" name="Principles" meta="Shared by every build" />

        <div className="section-head" data-reveal>
          <h2 className="display section-title">
            Built the <em>hard way.</em>
          </h2>
          <p className="section-lede">
            Every project is held to the same rules. They cost a little more up front
            and save considerably more later.
          </p>
        </div>

        <ol className="principle-list">
          {BUILD_PRINCIPLES.map((principle) => (
            <li className="principle-row" key={principle.n} data-reveal>
              <span className="hud-label principle-index">{principle.n}</span>
              <h3 className="principle-title display">{principle.title}</h3>
              <p className="principle-body">{principle.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

const ABOUT_FACTS = [
  { key: 'Focus', value: 'Backend, full-stack & AI systems' },
  { key: 'Core stack', value: 'Python · FastAPI · React · PostgreSQL' },
  { key: 'Education', value: 'BCA (Hons) · Ganpat University (2028)' },
  { key: 'Location', value: 'Gujarat, India' },
  { key: 'Languages', value: 'English · Hindi · Gujarati' },
  { key: 'Status', value: 'Open to software engineering internships' },
];

function AboutSection() {
  return (
    <section id="about" className="section section--tint">
      <div className="wrap">
        <SectionHeader num="05" name="About" meta="Engineering profile & background" />

        <div className="about-grid">
          <div className="about-copy" data-reveal>
            <h2 className="display section-title about-title">
              Beyond <em>basic CRUD.</em>
            </h2>
            <p>
              I build production-style backends and full-stack applications with clean
              API, service, and data-access separation in <b>FastAPI</b>, relational
              schema design in <b>PostgreSQL</b>, and interactive interfaces in <b>React</b>.
            </p>
            <p>
              Recently I engineered <b>Glint</b> — a production-grade Corrective RAG platform
              combining dense vector embeddings with Rank-BM25 hybrid search, self-correction reflection loops, and real-time RAG Triad evaluation — and I am actively
              developing <b>FlowStock</b>, a multi-tenant inventory system with real-time
              WebSocket alerts.
            </p>
            <div className="about-links">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-link">
                <IconGitHub /> GitHub
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-link">
                <IconLinkedIn /> LinkedIn
              </a>
            </div>
          </div>

          <dl className="fact-table" data-reveal>
            {ABOUT_FACTS.map((fact) => (
              <div className="fact-row" key={fact.key}>
                <dt className="hud-label">{fact.key}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Background                                                          */
/* ------------------------------------------------------------------ */

function BackgroundSection() {
  return (
    <section id="background" className="section">
      <div className="wrap">
        <SectionHeader num="06" name="Background" meta="Credentials & academic timeline" />

        <div className="background-grid">
          <div className="background-col" data-reveal>
            <h3 className="background-heading hud-label">Certifications</h3>
            <div className="cert-card">
              <span className="hud-label cert-date">April 2026</span>
              <h4 className="cert-name display">Data Science Essentials with Python</h4>
              <p className="cert-org">Cisco Networking Academy</p>
              <div className="cert-foot">
                <span className="hud-label cert-badge"><i aria-hidden="true" /> Certified</span>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-link text-link--muted">
                  Verify <IconArrowUpRight />
                </a>
              </div>
            </div>
            <div className="cert-card">
              <span className="hud-label cert-date">February 2026</span>
              <h4 className="cert-name display">Introduction to Data Science</h4>
              <p className="cert-org">Cisco Networking Academy</p>
              <div className="cert-foot">
                <span className="hud-label cert-badge"><i aria-hidden="true" /> Certified</span>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-link text-link--muted">
                  Verify <IconArrowUpRight />
                </a>
              </div>
            </div>
          </div>

          <div className="background-col" data-reveal>
            <h3 className="background-heading hud-label">Education</h3>
            <div className="edu-card">
              <div className="edu-top">
                <span className="hud-label edu-year">2024 — 2028</span>
                <span className="hud-label edu-status">In progress</span>
              </div>
              <h4 className="edu-degree display">Bachelor of Computer Applications</h4>
              <p className="edu-org">Ganpat University · BCA (Hons)</p>
              <p className="edu-copy">
                Coursework across data structures, relational databases, operating systems,
                and applied data science, with a focus on production backend engineering.
              </p>
            </div>

            <div className="background-note">
              <span className="hud-label">Currently</span>
              <p>Building FlowStock and preparing for 2026 software engineering internships.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

function ContactSection({ onCopyEmail }) {
  return (
    <section id="contact" className="section section--contact">
      <div className="wrap">
        <SectionHeader num="07" name="Contact" meta="Dispatch & direct inquiry" />

        <div className="contact-panel" data-reveal>
          <div className="contact-main">
            <h2 className="display contact-title">
              Let&apos;s build something <em>useful.</em>
            </h2>
            <p className="contact-lede">
              Currently open to backend, full-stack, and AI engineering internships for
              2025–2026. Whether you have a project inquiry or an open role, my inbox is open.
            </p>
            <div className="contact-actions">
              <a href={`mailto:${EMAIL}`} className="btn btn--solid">
                <IconMail />
                Send email
              </a>
              <button type="button" className="btn btn--outline" onClick={() => onCopyEmail(EMAIL)}>
                <IconCopy />
                Copy address
              </button>
            </div>
            <a href={`mailto:${EMAIL}`} className="contact-email">{EMAIL}</a>
          </div>

          <dl className="dispatch-table">
            <div className="dispatch-row">
              <dt className="hud-label">Status</dt>
              <dd className="is-live"><i aria-hidden="true" /> Available for internships</dd>
            </div>
            <div className="dispatch-row">
              <dt className="hud-label">Response SLA</dt>
              <dd>Under 12 hours</dd>
            </div>
            <div className="dispatch-row">
              <dt className="hud-label">Location</dt>
              <dd>Gujarat, India · IST / UTC+5:30</dd>
            </div>
            <div className="dispatch-row">
              <dt className="hud-label">Direct email</dt>
              <dd>{EMAIL}</dd>
            </div>
            <div className="dispatch-row">
              <dt className="hud-label">Preferred roles</dt>
              <dd>Backend · Full-stack · AI engineering</dd>
            </div>
            <div className="dispatch-row">
              <dt className="hud-label">Work type</dt>
              <dd>Internship · Remote or hybrid</dd>
            </div>
            <div className="dispatch-row dispatch-row--links">
              <dt className="hud-label">Elsewhere</dt>
              <dd>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn <IconArrowUpRight /></a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub <IconArrowUpRight /></a>
              </dd>
            </div>
          </dl>
        </div>

        <p className="contact-foot hud-label">
          Open source · Free to fork · Built with React, FastAPI and too much coffee
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand-col">
          <a href="#top" className="footer-brand display">Mukesh Joshi</a>
          <p className="footer-tagline">
            Full-stack engineer building layered backends and grounded AI systems.
          </p>
          <a href={`mailto:${EMAIL}`} className="footer-mail">{EMAIL}</a>
        </div>

        <nav className="footer-col" aria-label="Sections">
          <span className="hud-label footer-col-title">Sections</span>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="footer-link">{link.label}</a>
          ))}
        </nav>

        <div className="footer-col">
          <span className="hud-label footer-col-title">Elsewhere</span>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="footer-link">Résumé</a>
          <a href={`mailto:${EMAIL}`} className="footer-link">Email</a>
        </div>

        <div className="footer-col">
          <span className="hud-label footer-col-title">Details</span>
          <span className="footer-meta">Gujarat, India</span>
          <span className="footer-meta">IST / UTC+5:30</span>
          <span className="footer-meta">Open to internships</span>
          <span className="footer-meta">© {new Date().getFullYear()}</span>
        </div>
      </div>

      <div className="footer-base">
        <span className="hud-label">© {new Date().getFullYear()} Mukesh Joshi</span>
        <span className="hud-label">Engineered for performance &amp; precision</span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('mukesh-portfolio-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (_) {
      return 'light';
    }
  });
  const toastTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('mukesh-portfolio-theme', theme);
    } catch (_) {}
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#121316' : '#f2f1ee');
    }
  }, [theme]);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add('theme-anim');
    window.setTimeout(() => root.classList.remove('theme-anim'), 450);
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    let cleanup;
    const rafId = requestAnimationFrame(() => {
      cleanup = initPortfolioAnimations();
    });
    return () => {
      cancelAnimationFrame(rafId);
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  const handleCopyEmail = (email) => {
    const done = () => {
      setToastMessage(`Copied ${email}`);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => {
        setToastMessage('');
        toastTimerRef.current = null;
      }, 2600);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email).then(done).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    } else {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <>
      <TopProgress />
      <ScrollRuler />
      <DockChrome />
      <CopyToast toastMessage={toastMessage} />
      <Navigation
        theme={theme}
        onToggleTheme={toggleTheme}
        menuOpen={menuOpen}
        onToggleMenu={(force) => {
          setMenuOpen((prev) => (typeof force === 'boolean' ? force : !prev));
        }}
      />

      <main id="main">
        <Hero />
        <MetricsStrip />
        <ToolchainSection />
        <ProjectsSection />
        <SkillsSection />
        <PrinciplesSection />
        <AboutSection />
        <BackgroundSection />
        <ContactSection onCopyEmail={handleCopyEmail} />
      </main>

      <Footer />
    </>
  );
}
