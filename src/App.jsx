import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPortfolioAnimations } from './animations.js';
import './styles.css';

const EMAIL = 'joshimukesh2005@gmail.com';
const heroWorkstation = `${import.meta.env.BASE_URL}figures/hero-workstation.html`;
const projectRack = `${import.meta.env.BASE_URL}figures/project-rack.html`;
const ctaBridge = `${import.meta.env.BASE_URL}figures/cta-bridge.html`;

function HairlineFigure({ source, title, className = '', initialReadout, formatReadout, onProjectOpen, showCaption = true, caption }) {
  const frameRef = useRef(null);
  const readoutRef = useRef(null);
  const observerRef = useRef(null);
  const visibilityObserverRef = useRef(null);
  const isFrameVisibleRef = useRef(true);
  const lastReadoutValRef = useRef(initialReadout);

  useEffect(() => () => {
    observerRef.current?.disconnect();
    visibilityObserverRef.current?.disconnect();
    try {
      frameRef.current?.contentWindow?.postMessage({ type: 'hairline-host-visibility', visible: false }, '*');
    } catch (_) {}
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      isFrameVisibleRef.current = entry.isIntersecting;
      try {
        frame.contentWindow?.postMessage({ type: 'hairline-host-visibility', visible: entry.isIntersecting }, '*');
      } catch (_) {}
    }, { rootMargin: '240px 0px', threshold: 0 });

    visibilityObserverRef.current = observer;
    observer.observe(frame);
    return () => {
      observer.disconnect();
      if (visibilityObserverRef.current === observer) visibilityObserverRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!onProjectOpen) return undefined;
    const handleMessage = (event) => {
      if (event.source !== frameRef.current?.contentWindow || event.data?.type !== 'hairline-project-open') return;
      onProjectOpen(event.data.project);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onProjectOpen]);

  function prepareFigure() {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    try {
      frameRef.current?.contentWindow?.postMessage({ type: 'hairline-host-visibility', visible: true }, '*');
    } catch (_) {}

    doc.documentElement.dataset.theme = 'light';
    const palette = { plate: '#ece9e2', hi: '#e05d00', edge: '#57565f', mid: '#a9a69e', lo: '#d3cfc5' };
    Object.entries(palette).forEach(([key, value]) => doc.documentElement.style.setProperty(`--hairline-${key}`, value));
    const style = doc.createElement('style');
    style.textContent = 'html,body{background:transparent!important;min-height:0!important;height:100%}body{display:block!important;padding:0!important}main{width:100%!important;max-width:none!important;margin:0!important}.plate{border:0!important;border-radius:0!important;padding:0!important;background:transparent!important;overflow:visible!important}#stage{border:0!important;border-radius:0!important}#stage svg{display:block!important}.controls,#means,#rules,#name,#read,#error{display:none!important}';
    doc.head.appendChild(style);

    const sourceReadout = doc.getElementById('read');
    if (!sourceReadout) return;
    const updateReadout = () => {
      const raw = sourceReadout.textContent.trim();
      const value = formatReadout ? formatReadout(raw) : raw;
      if (value !== lastReadoutValRef.current) {
        lastReadoutValRef.current = value;
        if (readoutRef.current) {
          readoutRef.current.textContent = value;
        }
      }
    };
    observerRef.current?.disconnect();
    observerRef.current = new doc.defaultView.MutationObserver(updateReadout);
    observerRef.current.observe(sourceReadout, { childList: true, characterData: true, subtree: true });
    updateReadout();
  }

  return (
    <>
      <iframe ref={frameRef} className={`hairline-frame ${className}`} title={title} src={source} onLoad={prepareFigure} />
      {showCaption ? (
        <p className="hairline-caption"><span ref={readoutRef} className="hairline-readout">{initialReadout}</span><span>{caption}</span></p>
      ) : null}
    </>
  );
}

let toastTimer = null;
function copyOrEmail(email) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(email).then(() => {
      const toast = document.getElementById('copy-toast');
      if (!toast) return;
      toast.textContent = `Copied ${email} ✓`;
      toast.classList.add('show');
      if (toastTimer) window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => {
        toast.classList.remove('show');
        toastTimer = null;
      }, 2600);
    }).catch(() => { window.location.href = `mailto:${email}`; });
  } else {
    window.location.href = `mailto:${email}`;
  }
}

function TopProgress() {
  return (
    <div className="top-slider-track" aria-hidden="true">
      <div className="top-slider-bar" id="top-slider-bar" />
    </div>
  );
}

function CopyToast() {
  return (
    <div id="copy-toast" role="status" aria-live="polite">Email copied to clipboard ✓</div>
  );
}

function Navigation() {
  return (
    <header className="nav" id="nav">
      <div className="nav-inner">
        <a href="#top" className="brand">
          Mukesh Joshi <span className="accent">/</span>
        </a>
        <button className="menu-btn" id="menu-toggle" aria-label="Toggle Navigation Menu" aria-controls="navlinks" aria-expanded="false">
          <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
        <nav className="nav-links" id="navlinks">
          <a href="#about" className="nav-item">About</a>
          <a href="#skills" className="nav-item">Skills</a>
          <a href="#certifications" className="nav-item">Certifications</a>
          <a href="#projects" className="nav-item">Projects</a>
          <a href="#education" className="nav-item">Education</a>
          <div className="nav-cta-wrap">
            <a href="Mukesh_Joshi_Resume_1.pdf" download="Mukesh_Joshi_Resume.pdf" className="nav-cta">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Resume
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <p className="hero-eyebrow" id="hero-eyebrow">
          <span className="signal-pulse" />
          <span>BCA (Hons) Student · Full-Stack Web Development</span>
        </p>
        <div className="hero-feature-grid">
          <div className="hero-copy">
            <div className="hero-title-wrap">
              <h1 id="hero-title">
                <span className="name-line">Mukesh Joshi</span>
                <span className="italic-line">Software Engineer.</span>
              </h1>
            </div>
            <p className="hero-lead" id="hero-lead">
              BCA (Hons) student at Ganpat University, graduating in 2028, building full-stack web applications with Python, FastAPI, PostgreSQL, and React. Seeking a software development internship or entry-level role.
            </p>
          </div>
          <figure className="hero-peg-visual" aria-label="Interactive laptop with a tilting screen and pressable keys">
            <HairlineFigure source={heroWorkstation} className="hero-peg-frame" title="Interactive laptop figure. Move over the screen to tilt it, click the screen to open or close it, and hover keys to press them." initialReadout="Move over the laptop to tilt its screen and press its keys." showCaption={false} />
          </figure>
        </div>
        <div className="hero-actions-row">
          <div className="hero-actions" id="hero-actions">
            <a href="#projects" className="btn-pill">
              Explore projects <span className="arrow">&nbsp;→</span>
            </a>
            <button className="btn-pill-secondary" onClick={() => copyOrEmail(EMAIL)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              Get in touch
            </button>
          </div>
        </div>
        <a className="hero-scroll-cue" href="#about" aria-label="Scroll to about section"><span /> Scroll to explore</a>
      </div>
    </section>
  );
}

function MetricsStrip() {
  return (
    <div className="metrics-strip">
      <div className="metrics-inner">
        <div className="metric-item">
          <div className="metric-val"><span className="metric-num" data-target="2">2</span><span className="accent">x</span></div>
          <div className="metric-lbl">Cisco Certifications</div>
        </div>
        <div className="metric-item">
          <div className="metric-val">Python <span className="accent">&amp;</span> FastAPI</div>
          <div className="metric-lbl">Backend Development</div>
        </div>
        <div className="metric-item">
          <div className="metric-val">2028</div>
          <div className="metric-lbl">BCA (Hons) Ganpat University</div>
        </div>
        <div className="metric-item">
          <div className="metric-val">Open <span className="accent">●</span></div>
          <div className="metric-lbl">Open to Internships &amp; Entry-Level Roles</div>
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section id="about">
      <div className="section-inner section-pad">
        <div className="s-head">
          <div className="s-head-left">
            <p className="s-num"><span className="signal">01</span><span className="sep">/</span><span>About</span></p>
            <div className="s-title-mask">
              <h2 className="s-title">Professional <span className="italic">summary.</span></h2>
            </div>
          </div>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p>BCA (Hons) student at Ganpat University, graduating in 2028, building full-stack web applications with <b>Python, FastAPI, PostgreSQL, and React.js</b>. Seeking a software development internship or entry-level role focused on backend and full-stack development.</p>
            <p>Developed FlowStock, a multi-tenant inventory platform with JWT authentication, role-based access control for four roles, and real-time WebSocket alerts.</p>
          </div>
          <div className="about-facts">
            <div className="fact"><div className="fact-k">Focus</div><div className="fact-v">Backend &amp; Full-Stack Development</div></div>
            <div className="fact"><div className="fact-k">Core</div><div className="fact-v">Python <span>· FastAPI · React · PostgreSQL</span></div></div>
            <div className="fact"><div className="fact-k">Education</div><div className="fact-v">BCA (Hons) <span>· Expected 2028</span></div></div>
            <div className="fact"><div className="fact-k">Location</div><div className="fact-v">Gujarat, India</div></div>
            <div className="fact"><div className="fact-k">Languages</div><div className="fact-v">English · Hindi · Gujarati</div></div>
            <div className="fact"><div className="fact-k">Seeking</div><div className="fact-v">Software Developer Internship / Entry-Level Role</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills">
      <div className="section-inner section-pad">
        <div className="s-head">
          <div className="s-head-left">
            <p className="s-num"><span className="signal">02</span><span className="sep">/</span><span>Technical skills</span></p>
            <div className="s-title-mask">
              <h2 className="s-title">The <span className="italic">toolkit.</span></h2>
            </div>
          </div>
        </div>
        <div className="skills-wrap">
          <div className="skill-row">
            <div className="skill-cat">Programming</div>
            <div className="skill-items">
              <span className="skill-tag">Python</span><span className="skill-sep">·</span>
              <span className="skill-tag">JavaScript (ES6+)</span><span className="skill-sep">·</span>
              <span className="skill-tag">SQL</span>
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-cat">Frontend</div>
            <div className="skill-items">
              <span className="skill-tag">HTML5</span><span className="skill-sep">·</span>
              <span className="skill-tag">CSS3</span><span className="skill-sep">·</span>
              <span className="skill-tag">Bootstrap</span><span className="skill-sep">·</span>
              <span className="skill-tag">Tailwind CSS</span><span className="skill-sep">·</span>
              <span className="skill-tag">React.js</span>
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-cat">Backend &amp; Database</div>
            <div className="skill-items">
              <span className="skill-tag">FastAPI</span><span className="skill-sep">·</span>
              <span className="skill-tag">PostgreSQL</span><span className="skill-sep">·</span>
              <span className="skill-tag">WebSockets</span><span className="skill-sep">·</span>
              <span className="skill-tag">JWT Authentication</span>
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-cat">Tools</div>
            <div className="skill-items">
              <span className="skill-tag">Git</span><span className="skill-sep">·</span>
              <span className="skill-tag">GitHub</span><span className="skill-sep">·</span>
              <span className="skill-tag">VS Code</span>
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-cat">Concepts</div>
            <div className="skill-items">
              <span className="skill-tag">Object-Oriented Programming</span><span className="skill-sep">·</span>
              <span className="skill-tag">Role-Based Access Control</span><span className="skill-sep">·</span>
              <span className="skill-tag">Responsive Web Design</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificationsSection() {
  return (
    <section id="certifications">
      <div className="section-inner section-pad">
        <div className="s-head">
          <div className="s-head-left">
            <p className="s-num"><span className="signal">03</span><span className="sep">/</span><span>Certifications</span></p>
            <div className="s-title-mask">
              <h2 className="s-title">Certifications <span className="italic">earned.</span></h2>
            </div>
          </div>
        </div>
        <div className="cert-list">
          <div className="cert-card">
            <div className="cert-date">April 2026</div>
            <h3 className="cert-name">Data Science Essentials with Python</h3>
            <p className="cert-org">Cisco Networking Academy</p>
            <div className="cert-footer">
              <div className="cert-badge"><span className="dot" /> Certified</div>
              <a href="https://www.credly.com/organizations/cisco/badges" target="_blank" rel="noopener noreferrer" className="cert-verify-link">
                Verify credential <span className="arrow">→</span>
              </a>
            </div>
          </div>
          <div className="cert-card">
            <div className="cert-date">February 2026</div>
            <h3 className="cert-name">Introduction to Data Science</h3>
            <p className="cert-org">Cisco Networking Academy</p>
            <div className="cert-footer">
              <div className="cert-badge"><span className="dot" /> Certified</div>
              <a href="https://www.credly.com/organizations/cisco/badges" target="_blank" rel="noopener noreferrer" className="cert-verify-link">
                Verify credential <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState('flowstock');

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [selectedProject]);

  const handleProjectOpen = (project) => {
    if (project === 'flowstock' || project === 'imperium') setSelectedProject(project);
  };
  const formatRackReadout = (value) => {
    const blade = /blade\s+(\d+)/i.exec(value);
    return blade ? `Click to open ${Number(blade[1]) > 6 ? 'FlowStock' : 'Imperium AI'}` : 'Hover the rack, click to open';
  };
  const handleProjectTabKeyDown = (event, current) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = current === 'flowstock' ? 'imperium' : 'flowstock';
    setSelectedProject(next);
    document.getElementById(`project-tab-${next}`)?.focus();
  };
  return (
    <section id="projects">
      <div className="section-inner section-pad">
        <div className="s-head">
          <div className="s-head-left">
            <p className="s-num"><span className="signal">04</span><span className="sep">/</span><span>Projects</span></p>
            <div className="s-title-mask">
              <h2 className="s-title">Featured <span className="italic">work.</span></h2>
            </div>
          </div>
        </div>
        <div className="project-card-interactive" id="project-showcase">
          <div className="project-tabs" role="tablist" aria-label="Featured projects">
            <button className="project-tab" id="project-tab-flowstock" role="tab" tabIndex={selectedProject === 'flowstock' ? 0 : -1} aria-selected={selectedProject === 'flowstock'} aria-controls="project-panel-flowstock" type="button" onClick={() => setSelectedProject('flowstock')} onKeyDown={(event) => handleProjectTabKeyDown(event, 'flowstock')}>FlowStock</button>
            <button className="project-tab" id="project-tab-imperium" role="tab" tabIndex={selectedProject === 'imperium' ? 0 : -1} aria-selected={selectedProject === 'imperium'} aria-controls="project-panel-imperium" type="button" onClick={() => setSelectedProject('imperium')} onKeyDown={(event) => handleProjectTabKeyDown(event, 'imperium')}>Imperium AI</button>
          </div>
          <div className="project-layout">
            <div className="project-panels">
              <article className="project-panel" id="project-panel-flowstock" role="tabpanel" aria-labelledby="project-tab-flowstock" hidden={selectedProject !== 'flowstock'}>
                <div className="project-top-meta">
                  <div className="project-tech-tags"><span className="tech-tag-pill">Python</span><span className="tech-tag-pill">FastAPI</span><span className="tech-tag-pill">React.js</span><span className="tech-tag-pill">PostgreSQL</span><span className="tech-tag-pill">Tailwind CSS</span></div>
                  <div className="project-status"><span className="status-dot" /> In Development</div>
                </div>
                <h3 className="project-name">FlowStock — Inventory &amp; Order Management</h3>
                <p className="project-desc">Building a full-stack application to manage inventory, sales and purchase orders, shipments, and invoices. The React.js and Tailwind CSS frontend connects to a FastAPI backend and PostgreSQL database. The backend is organized into API, service, and data-access layers.</p>
                <p className="private-note">Private repository while in development.</p>
                <div className="project-features-grid">
                  <div className="feat-item"><span className="feat-title">JWT &amp; Role-Based Access</span><span className="feat-sub">Four roles: admin, warehouse manager, sales rep, and viewer</span></div>
                  <div className="feat-item"><span className="feat-title">Multi-Tenant Data</span><span className="feat-sub">Each organization can access only its own data</span></div>
                  <div className="feat-item"><span className="feat-title">Real-Time Alerts</span><span className="feat-sub">WebSocket stock alerts and order-update notifications</span></div>
                </div>
              </article>
              <article className="project-panel" id="project-panel-imperium" role="tabpanel" aria-labelledby="project-tab-imperium" hidden={selectedProject !== 'imperium'}>
                <div className="project-top-meta">
                  <div className="project-tech-tags">
                    <span className="tech-tag-pill">React</span>
                    <span className="tech-tag-pill">Tailwind CSS</span>
                    <span className="tech-tag-pill">FastAPI</span>
                    <span className="tech-tag-pill">ChromaDB</span>
                    <span className="tech-tag-pill">LangChain</span>
                  </div>
                  <div className="project-status">
                    <span className="status-dot" /> Full Stack Architecture
                  </div>
                </div>
                <h3 className="project-name">Imperium AI — Corrective RAG Application</h3>
                <p className="project-desc">
                  A full-stack retrieval application built end to end: React front end, FastAPI backend, and a vector-search pipeline over ChromaDB. Features a polished dark-mode UI with workspace management, document indexing, and a custom Markdown-rendered conversational interface, backed by a query-correction pipeline and high-performance chunking for reliable, accurate responses.
                </p>
                <div className="project-actions">
                  <a href="https://github.com/joshimukesh-15/mobius-ai" target="_blank" rel="noopener noreferrer" className="btn-pill-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                    View Code <span className="arrow">→</span>
                  </a>
                  <a href="https://github.com/joshimukesh-15?tab=repositories" target="_blank" rel="noopener noreferrer" className="btn-pill-sm-secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    More projects
                  </a>
                </div>
                <div className="project-features-grid">
                  <div className="feat-item">
                    <span className="feat-title">Hybrid Search</span>
                    <span className="feat-sub">Dense vector retrieval + BM25 reciprocal rank fusion</span>
                  </div>
                  <div className="feat-item">
                    <span className="feat-title">Self-Correcting Pipeline</span>
                    <span className="feat-sub">Autonomous relevance gating &amp; self-correction reflection loops</span>
                  </div>
                  <div className="feat-item">
                    <span className="feat-title">Zero Hallucination</span>
                    <span className="feat-sub">Real-time RAG Triad faithfulness &amp; context alignment evaluator</span>
                  </div>
                </div>
              </article>
            </div>
            <aside className="hairline-card project-rack-card" aria-label="Interactive project rack">
              <HairlineFigure source={projectRack} className="project-rack-frame" title="Interactive server rack. Hover a blade to select a project, then click to open it." initialReadout="Hover the rack, click to open" formatReadout={formatRackReadout} onProjectOpen={handleProjectOpen} caption="The upper half opens FlowStock; the lower half opens Imperium AI." />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section id="education">
      <div className="section-inner section-pad">
        <div className="s-head">
          <div className="s-head-left">
            <p className="s-num"><span className="signal">05</span><span className="sep">/</span><span>Education</span></p>
            <div className="s-title-mask">
              <h2 className="s-title">Academic <span className="italic">foundation.</span></h2>
            </div>
          </div>
        </div>
        <div className="edu-list">
          <div className="edu-row">
            <div className="edu-year">2028</div>
            <div className="edu-deg">Bachelor of Computer Applications (BCA Hons)</div>
            <div className="edu-org">Ganpat University</div>
            <div className="edu-meta">Expected <b>2028</b></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="cta">
      <div className="cta-inner">
        <div className="cta-copy">
          <p className="cta-eyebrow"><span className="signal">✳&nbsp;</span>Get in touch</p>
          <div className="s-title-mask">
            <h2 className="cta-title">Let's build something <span className="italic">useful.</span></h2>
          </div>
          <div className="cta-actions">
            <a href={`mailto:${EMAIL}`} className="btn-pill-light">
              Email me <span className="arrow">&nbsp;→</span>
            </a>
            <button className="cta-email-btn" onClick={() => copyOrEmail(EMAIL)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              {EMAIL}
            </button>
          </div>
        </div>
        <aside className="hairline-card cta-bridge-card" aria-label="Interactive bridge call to action">
          <HairlineFigure source={ctaBridge} title="Interactive footbridge. Hover a deck section to lift it and its neighbors." initialReadout="REST" caption="A small bridge from your next idea to what we can build together." />
        </aside>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <a href="#top" className="footer-brand">
          Mukesh Joshi <span className="sub">Software Engineer</span>
        </a>
        <nav className="footer-links">
          <a href="https://www.linkedin.com/in/mukesh-joshi-433290379/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/joshimukesh-15" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={`mailto:${EMAIL}`}>Email</a>
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} Mukesh Joshi</p>
      </div>
    </footer>
  );
}

export default function App() {
  useEffect(() => initPortfolioAnimations(), []);
  return (
    <>
      <TopProgress />
      <CopyToast />
      <Navigation />
      <Hero />
      <MetricsStrip />
      <AboutSection />
      <SkillsSection />
      <CertificationsSection />
      <ProjectsSection />
      <EducationSection />
      <ContactSection />
      <Footer />
    </>
  );
}
