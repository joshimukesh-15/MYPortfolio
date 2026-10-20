import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPortfolioAnimations } from './animations.js';
import SkillShelfFigure from './components/SkillShelfFigure.jsx';
import FooterMailboxFigure from './components/FooterMailboxFigure.jsx';
import './styles.css';

const EMAIL = 'joshimukesh2005@gmail.com';
const GITHUB_URL = 'https://github.com/joshimukesh-15';
const LINKEDIN_URL = 'https://www.linkedin.com/in/mukesh-joshi-433290379/';

const heroWorkstation = `${import.meta.env.BASE_URL}figures/hero-workstation.html`;
const projectRack = `${import.meta.env.BASE_URL}figures/project-rack.html`;

function HairlineFigure({ source, title, className = '', initialReadout, formatReadout, onProjectOpen, showCaption = true, caption, loading = 'lazy' }) {
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
      frameRef.current?.contentWindow?.postMessage({ type: 'hairline-host-visibility', visible: false }, window.location.origin);
    } catch (_) {}
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      isFrameVisibleRef.current = entry.isIntersecting;
      try {
        frame.contentWindow?.postMessage({ type: 'hairline-host-visibility', visible: entry.isIntersecting }, window.location.origin);
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
      frameRef.current?.contentWindow?.postMessage({ type: 'hairline-host-visibility', visible: isFrameVisibleRef.current }, window.location.origin);
    } catch (_) {}

    doc.documentElement.dataset.theme = 'light';
    const palette = { plate: '#ece9e2', hi: '#e05d00', edge: '#57565f', mid: '#a9a69e', lo: '#d3cfc5' };
    Object.entries(palette).forEach(([key, value]) => doc.documentElement.style.setProperty(`--hairline-${key}`, value));

    if (!doc.getElementById('hairline-override-styles')) {
      const style = doc.createElement('style');
      style.id = 'hairline-override-styles';
      style.textContent = 'html,body{background:transparent!important;min-height:0!important;height:100%}body{display:block!important;padding:0!important}main{width:100%!important;max-width:none!important;margin:0!important}.plate{border:0!important;border-radius:0!important;padding:0!important;background:transparent!important;overflow:visible!important}#stage{border:0!important;border-radius:0!important}#stage svg{display:block!important}.controls,#means,#rules,#name,#read,#error{display:none!important}';
      doc.head.appendChild(style);
    }

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
      <iframe ref={frameRef} className={`hairline-frame ${className}`} title={title} src={source} onLoad={prepareFigure} loading={loading} />
      {showCaption ? (
        <p className="hairline-caption"><span ref={readoutRef} className="hairline-readout">{initialReadout}</span><span>{caption}</span></p>
      ) : null}
    </>
  );
}

function TopProgress() {
  return (
    <div className="top-slider-track" aria-hidden="true">
      <div className="top-slider-bar" id="top-slider-bar" />
    </div>
  );
}

function CopyToast({ toastMessage }) {
  return (
    <div id="copy-toast" className={toastMessage ? 'show' : ''} role="status" aria-live="polite">
      {toastMessage || 'Email copied to clipboard ✓'}
    </div>
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
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
        <nav className="nav-links" id="navlinks">
          <a href="#about" className="nav-item">About</a>
          <a href="#projects" className="nav-item">Projects</a>
          <a href="#skills" className="nav-item">Skills</a>
          <a href="#certifications" className="nav-item">Certifications</a>
          <a href="#education" className="nav-item">Education</a>
          <div className="nav-cta-wrap">
            <a href="/Mukesh_Joshi_Resume_1.pdf" target="_blank" rel="noopener noreferrer" className="nav-cta">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              &nbsp;Resume
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onCopyEmail }) {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <p className="hero-eyebrow" id="hero-eyebrow">
          <span className="signal-pulse" />
          <span>Full-Stack &amp; AI Engineer · Open to Internships</span>
        </p>
        <div className="hero-feature-grid">
          <div className="hero-copy">
            <div className="hero-title-wrap">
              <h1 id="hero-title">
                <span className="name-line"><span>Mukesh</span> <span>Joshi</span></span>
                <span className="italic-line"><span>Software</span> <span>Engineer.</span></span>
              </h1>
            </div>
            <p className="hero-lead" id="hero-lead">
              Architecting backend systems, multi-tenant web applications, and self-correcting RAG pipelines with <b>Python, FastAPI, PostgreSQL, and React</b>.
            </p>
          </div>
          <figure className="hero-peg-visual" aria-label="Interactive laptop with a tilting screen and pressable keys">
            <HairlineFigure source={heroWorkstation} className="hero-peg-frame" title="Interactive laptop figure. Move over the screen to tilt it, click the screen to open or close it, and hover keys to press them." initialReadout="Move over the laptop to tilt its screen and press its keys." showCaption={false} loading="lazy" />
          </figure>
        </div>
        <div className="hero-actions-row">
          <div className="hero-actions" id="hero-actions">
            <a href="#projects" className="btn-pill">
              Explore projects <span className="arrow">&nbsp;→</span>
            </a>
            <button type="button" className="btn-pill-secondary" onClick={() => onCopyEmail(EMAIL)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              Get in touch
            </button>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-pill-secondary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
              GitHub
            </a>
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
          <div className="metric-val">Python <span className="accent">&amp;</span> FastAPI</div>
          <div className="metric-lbl">Layered Backend Architecture</div>
        </div>
        <div className="metric-item">
          <div className="metric-val">Hybrid <span className="accent">RAG</span></div>
          <div className="metric-lbl">ChromaDB &amp; BM25 Search</div>
        </div>
        <div className="metric-item">
          <div className="metric-val"><span className="metric-num" data-target="4">4</span><span className="accent">-Tier</span></div>
          <div className="metric-lbl">Multi-Tenant RBAC &amp; JWT</div>
        </div>
        <div className="metric-item">
          <div className="metric-val">Open <span className="accent">●</span></div>
          <div className="metric-lbl">Internships &amp; Entry-Level Roles</div>
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
              <h2 className="s-title">Engineering <span className="italic">focus.</span></h2>
            </div>
          </div>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p>
              I specialize in building production-style backends and full-stack web applications that go beyond basic CRUD. My engineering workflow focuses on clean API, service, and data-access layer separation in <b>FastAPI</b>, relational schema design in <b>PostgreSQL</b>, and interactive interfaces in <b>React.js</b>.
            </p>
            <p>
              Recently, I engineered <b>Imperium AI</b>—a self-correcting RAG platform combining dense vector embeddings with BM25 hybrid search—and I am actively developing <b>FlowStock</b>, a multi-tenant inventory and order management system with real-time WebSocket alerts.
            </p>
          </div>
          <div className="about-facts">
            <div className="fact"><div className="fact-k">Focus</div><div className="fact-v">Backend, Full-Stack &amp; AI Systems</div></div>
            <div className="fact"><div className="fact-k">Core Stack</div><div className="fact-v">Python <span>· FastAPI · React · PostgreSQL</span></div></div>
            <div className="fact"><div className="fact-k">Education</div><div className="fact-v">BCA (Hons) <span>· Ganpat University (2028)</span></div></div>
            <div className="fact"><div className="fact-k">Location</div><div className="fact-v">Gujarat, India</div></div>
            <div className="fact"><div className="fact-k">Languages</div><div className="fact-v">English · Hindi · Gujarati</div></div>
            <div className="fact"><div className="fact-k">Status</div><div className="fact-v">Open to Software Engineering Internships</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState('imperium');

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
    const next = current === 'imperium' ? 'flowstock' : 'imperium';
    setSelectedProject(next);
    document.getElementById(`project-tab-${next}`)?.focus();
  };

  return (
    <section id="projects">
      <div className="section-inner section-pad">
        <div className="s-head">
          <div className="s-head-left">
            <p className="s-num"><span className="signal">02</span><span className="sep">/</span><span>Projects</span></p>
            <div className="s-title-mask">
              <h2 className="s-title">Featured <span className="italic">work.</span></h2>
            </div>
          </div>
        </div>
        <div className="project-card-interactive" id="project-showcase">
          <div className="project-tabs" role="tablist" aria-label="Featured projects">
            <button className="project-tab" id="project-tab-imperium" role="tab" tabIndex={selectedProject === 'imperium' ? 0 : -1} aria-selected={selectedProject === 'imperium'} aria-controls="project-panel-imperium" type="button" onClick={() => setSelectedProject('imperium')} onKeyDown={(event) => handleProjectTabKeyDown(event, 'imperium')}>Imperium AI</button>
            <button className="project-tab" id="project-tab-flowstock" role="tab" tabIndex={selectedProject === 'flowstock' ? 0 : -1} aria-selected={selectedProject === 'flowstock'} aria-controls="project-panel-flowstock" type="button" onClick={() => setSelectedProject('flowstock')} onKeyDown={(event) => handleProjectTabKeyDown(event, 'flowstock')}>FlowStock</button>
          </div>
          <div className="project-layout">
            <div className="project-panels">
              <article className="project-panel" id="project-panel-imperium" role="tabpanel" aria-labelledby="project-tab-imperium" hidden={selectedProject !== 'imperium'}>
                <div className="project-top-meta">
                  <div className="project-tech-tags">
                    <span className="tech-tag-pill">React.js</span>
                    <span className="tech-tag-pill">FastAPI</span>
                    <span className="tech-tag-pill">ChromaDB</span>
                    <span className="tech-tag-pill">LangChain</span>
                    <span className="tech-tag-pill">Tailwind CSS</span>
                  </div>
                  <div className="project-status">
                    <span className="status-dot" /> Full-Stack RAG System
                  </div>
                </div>
                <h3 className="project-name">Imperium AI — Corrective RAG Application</h3>
                <p className="project-desc">
                  End-to-end retrieval-augmented generation application combining a React frontend, FastAPI backend, and ChromaDB vector pipeline. Features workspace management, document indexing, and a Markdown-rendered conversational interface backed by autonomous query correction and high-precision chunking.
                </p>
                <div className="project-actions">
                  <a href="https://github.com/joshimukesh-15/mobius-ai" target="_blank" rel="noopener noreferrer" className="btn-pill-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                    View Code <span className="arrow">→</span>
                  </a>
                  <a href={`${GITHUB_URL}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="btn-pill-sm-secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    All Repositories
                  </a>
                </div>
                <div className="project-features-grid">
                  <div className="feat-item">
                    <span className="feat-title">Hybrid Search</span>
                    <span className="feat-sub">Dense vector retrieval + BM25 reciprocal rank fusion</span>
                  </div>
                  <div className="feat-item">
                    <span className="feat-title">Self-Correcting Pipeline</span>
                    <span className="feat-sub">Autonomous relevance gating &amp; query reflection loops</span>
                  </div>
                  <div className="feat-item">
                    <span className="feat-title">Hallucination Guard</span>
                    <span className="feat-sub">Real-time RAG Triad faithfulness &amp; context alignment checks</span>
                  </div>
                </div>
              </article>

              <article className="project-panel" id="project-panel-flowstock" role="tabpanel" aria-labelledby="project-tab-flowstock" hidden={selectedProject !== 'flowstock'}>
                <div className="project-top-meta">
                  <div className="project-tech-tags">
                    <span className="tech-tag-pill">Python</span>
                    <span className="tech-tag-pill">FastAPI</span>
                    <span className="tech-tag-pill">PostgreSQL</span>
                    <span className="tech-tag-pill">React.js</span>
                    <span className="tech-tag-pill">WebSockets</span>
                  </div>
                  <div className="project-status"><span className="status-dot" /> Active Development</div>
                </div>
                <h3 className="project-name">FlowStock — Multi-Tenant Inventory Platform</h3>
                <p className="project-desc">
                  Full-stack SaaS platform engineered to manage inventory lifecycles, sales and purchase orders, shipments, and invoicing. Built with a strict three-tier backend architecture (API routers, domain services, and PostgreSQL data-access layers) paired with a responsive React and Tailwind CSS dashboard.
                </p>
                <div className="project-actions">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-pill-sm-secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                    GitHub Profile <span className="arrow">→</span>
                  </a>
                </div>
                <div className="project-features-grid">
                  <div className="feat-item"><span className="feat-title">JWT &amp; 4-Tier RBAC</span><span className="feat-sub">Granular permissions for Admin, Warehouse Manager, Sales, and Viewer</span></div>
                  <div className="feat-item"><span className="feat-title">Multi-Tenant Isolation</span><span className="feat-sub">Strict organization-scoped queries and tenant data boundaries</span></div>
                  <div className="feat-item"><span className="feat-title">Real-Time Alerts</span><span className="feat-sub">Live WebSocket low-stock triggers and order status broadcasts</span></div>
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


// Skill groups: 4 groups with counts 5, 5, 4, 5 to match the SkillShelfFigure bookcase layout.
const SKILL_TITLES = ['Languages', 'Backend & Data', 'AI & Retrieval', 'Tools'];
const SKILL_GROUPS = [
  ['Python', 'JavaScript (ES6+)', 'SQL', 'HTML5 & CSS3', 'TypeScript'],
  ['FastAPI', 'PostgreSQL', 'RESTful APIs', 'WebSockets', 'JWT & RBAC'],
  ['LangChain', 'ChromaDB', 'Corrective RAG', 'Hybrid Search (BM25 + Vector)'],
  ['React.js', 'Tailwind CSS', 'Git & GitHub', 'Docker', 'VS Code'],
];

function SkillsSection() {
  const [pick, setPick] = useState(null); // { group, skill } while hovered, else null

  return (
    <section id="skills">
      <div className="section-inner section-pad">
        <div className="s-head">
          <div className="s-head-left">
            <p className="s-num"><span className="signal">03</span><span className="sep">/</span><span>Technical skills</span></p>
            <div className="s-title-mask">
              <h2 className="s-title">The <span className="italic">toolkit.</span></h2>
            </div>
          </div>
        </div>
        <div className="skills-layout">
          <div className="skills-wrap">
            {SKILL_GROUPS.map((skills, groupIndex) => (
              <div className={`skill-row${pick?.group === groupIndex ? ' is-active' : ''}`} key={SKILL_TITLES[groupIndex]}>
                <div className="skill-cat">{SKILL_TITLES[groupIndex]}</div>
                <div className="skill-items">
                  {skills.map((skill, skillIndex) => (
                    <span
                      className={`skill-tag${pick?.group === groupIndex && pick.skill === skillIndex ? ' is-lit' : ''}`}
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <SkillShelfFigure
            titles={SKILL_TITLES}
            skills={SKILL_GROUPS}
            onSelect={setPick}
          />
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
            <p className="s-num"><span className="signal">04</span><span className="sep">/</span><span>Certifications</span></p>
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
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="cert-verify-link">
                View on LinkedIn <span className="arrow">→</span>
              </a>
            </div>
          </div>
          <div className="cert-card">
            <div className="cert-date">February 2026</div>
            <h3 className="cert-name">Introduction to Data Science</h3>
            <p className="cert-org">Cisco Networking Academy</p>
            <div className="cert-footer">
              <div className="cert-badge"><span className="dot" /> Certified</div>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="cert-verify-link">
                View on LinkedIn <span className="arrow">→</span>
              </a>
            </div>
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

function ContactSection({ onCopyEmail }) {
  return (
    <section className="cta">
      <div className="cta-inner">
        <div className="cta-copy">
          <p className="cta-eyebrow"><span className="signal">✳&nbsp;</span>Get in touch</p>
          <div className="s-title-mask">
            <h2 className="cta-title">Let&apos;s build something <span className="italic">useful.</span></h2>
          </div>
          <div className="cta-actions">
            <a href={`mailto:${EMAIL}`} className="btn-pill-light">
              Email me <span className="arrow">&nbsp;→</span>
            </a>
            <button type="button" className="cta-email-btn" onClick={() => onCopyEmail(EMAIL)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              {EMAIL}
            </button>
          </div>
        </div>
        <aside className="cta-mailbox-wrap" aria-label="Interactive mailbox">
          <FooterMailboxFigure email={EMAIL} />
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
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={`mailto:${EMAIL}`}>Email</a>
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} Mukesh Joshi</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef(null);

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

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  const handleCopyEmail = (email) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        setToastMessage(`Copied ${email} ✓`);
        if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = window.setTimeout(() => {
          setToastMessage('');
          toastTimerRef.current = null;
        }, 2600);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    } else {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <>
      <TopProgress />
      <CopyToast toastMessage={toastMessage} />
      <Navigation />
      <main id="main">
        <Hero onCopyEmail={handleCopyEmail} />
        <MetricsStrip />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <CertificationsSection />
        <EducationSection />
        <ContactSection onCopyEmail={handleCopyEmail} />
      </main>
      <Footer />
    </>
  );
}
