import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPortfolioAnimations } from './animations.js';
import HeroScroll from './components/HeroScroll.jsx';
import ScrollRuler from './components/ScrollRuler.jsx';
import SectionHeader from './components/SectionHeader.jsx';
import './styles.css';

const EMAIL = 'joshimukesh2005@gmail.com';
const GITHUB_URL = 'https://github.com/joshimukesh-15';
const LINKEDIN_URL = 'https://www.linkedin.com/in/mukesh-joshi-433290379/';

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

function Navigation({ theme, onToggleTheme }) {
  return (
    <header className="nav" id="nav">
      <div className="nav-inner">
        {/* Brand with dock target for the scroll-driven giant wordmark */}
        <a href="#top" className="brand" id="nav-dock-target">
          Mukesh Joshi <span className="accent">/</span>
        </a>

        {/* Theme Mode Toggle Button */}
        <button
          className="theme-toggle-btn"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title="Toggle light / dark theme"
        >
          {theme === 'dark' ? '[ ☾ DARK ]' : '[ ☼ LIGHT ]'}
        </button>

        <button className="menu-btn" id="menu-toggle" aria-label="Toggle Navigation Menu" aria-controls="navlinks" aria-expanded="false">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>

        <nav className="nav-links" id="navlinks">
          <a href="#projects" className="nav-item">Projects</a>
          <a href="#skills" className="nav-item">Skills</a>
          <a href="#how-i-build" className="nav-item">How I build</a>
          <a href="#about" className="nav-item">About</a>
          <a href="#contact" className="nav-item">Contact</a>
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

function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState('imperium');

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [selectedProject]);

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
        <SectionHeader num="01" name="PROJECTS" meta="RAG SYSTEMS & PRODUCTION ARCHITECTURE" />

        <div className="project-card-interactive" id="project-showcase">
          <div className="project-tabs" role="tablist" aria-label="Featured projects">
            <button
              className={`project-tab ${selectedProject === 'imperium' ? 'is-active' : ''}`}
              id="project-tab-imperium"
              role="tab"
              tabIndex={selectedProject === 'imperium' ? 0 : -1}
              aria-selected={selectedProject === 'imperium'}
              aria-controls="project-panel-imperium"
              type="button"
              onClick={() => setSelectedProject('imperium')}
              onKeyDown={(event) => handleProjectTabKeyDown(event, 'imperium')}
            >
              [ 01 / IMPERIUM AI ]
            </button>
            <button
              className={`project-tab ${selectedProject === 'flowstock' ? 'is-active' : ''}`}
              id="project-tab-flowstock"
              role="tab"
              tabIndex={selectedProject === 'flowstock' ? 0 : -1}
              aria-selected={selectedProject === 'flowstock'}
              aria-controls="project-panel-flowstock"
              type="button"
              onClick={() => setSelectedProject('flowstock')}
              onKeyDown={(event) => handleProjectTabKeyDown(event, 'flowstock')}
            >
              [ 02 / FLOWSTOCK SAAS ]
            </button>
          </div>

          <div className="project-layout">
            <div className="project-panels">
              {/* PANEL 1: IMPERIUM AI */}
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
                  <a href="https://github.com/joshimukesh-15/mobius-ai" target="_blank" rel="noopener noreferrer" className="btn-artcraft btn-artcraft-solid">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                    View Code <span className="arrow">→</span>
                  </a>
                  <a href={`${GITHUB_URL}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="btn-artcraft btn-artcraft-outline">
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

              {/* PANEL 2: FLOWSTOCK */}
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
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-artcraft btn-artcraft-solid">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                    GitHub Profile <span className="arrow">→</span>
                  </a>
                  <a href={`${GITHUB_URL}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="btn-artcraft btn-artcraft-outline">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    All Repositories
                  </a>
                </div>
                <div className="project-features-grid">
                  <div className="feat-item"><span className="feat-title">JWT &amp; 4-Tier RBAC</span><span className="feat-sub">Granular permissions for Admin, Warehouse Manager, Sales, and Viewer</span></div>
                  <div className="feat-item"><span className="feat-title">Multi-Tenant Isolation</span><span className="feat-sub">Strict organization-scoped queries and tenant data boundaries</span></div>
                  <div className="feat-item"><span className="feat-title">Real-Time Alerts</span><span className="feat-sub">Live WebSocket low-stock triggers and order status broadcasts</span></div>
                </div>
              </article>
            </div>

            {/* SLEEK NATIVE ARCHITECTURE & SPEC CARD (Zero iframes, 100% responsive) */}
            <aside className="project-spec-card" aria-label="Interactive architecture specification">
              <div className="spec-card-header">
                <span className="spec-card-badge">SYSTEM ARCHITECTURE</span>
                <span className="spec-card-code">{selectedProject === 'imperium' ? 'PIPELINE // RAG-v2' : 'SCHEMA // SAAS-v1'}</span>
              </div>

              {selectedProject === 'imperium' ? (
                <div className="spec-pipeline-flow">
                  <div className="flow-step">
                    <span className="flow-num">01</span>
                    <div className="flow-body">
                      <span className="flow-title">Document Parsing &amp; Chunking</span>
                      <span className="flow-meta">Recursive character splitter · 512 token chunks · 10% overlap</span>
                    </div>
                  </div>
                  <div className="flow-step">
                    <span className="flow-num">02</span>
                    <div className="flow-body">
                      <span className="flow-title">Hybrid Vector + BM25 Fusion</span>
                      <span className="flow-meta">ChromaDB dense embeddings + reciprocal rank BM25 keyword match</span>
                    </div>
                  </div>
                  <div className="flow-step">
                    <span className="flow-num">03</span>
                    <div className="flow-body">
                      <span className="flow-title">Autonomous Query Reflection</span>
                      <span className="flow-meta">Context relevance gating · Re-query loop on ambiguity</span>
                    </div>
                  </div>
                  <div className="flow-step">
                    <span className="flow-num">04</span>
                    <div className="flow-body">
                      <span className="flow-title">Grounded Generation &amp; Triad Check</span>
                      <span className="flow-meta">Faithfulness validation against source chunks before stream</span>
                    </div>
                  </div>

                  <div className="spec-metrics-row">
                    <div className="spec-stat">
                      <span className="stat-label">RETRIEVAL P95</span>
                      <span className="stat-val">&lt; 120ms</span>
                    </div>
                    <div className="spec-stat">
                      <span className="stat-label">FAITHFULNESS</span>
                      <span className="stat-val">98.4%</span>
                    </div>
                    <div className="spec-stat">
                      <span className="stat-label">CONTEXT RECALL</span>
                      <span className="stat-val">94.8%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="spec-pipeline-flow">
                  <div className="flow-step">
                    <span className="flow-num">01</span>
                    <div className="flow-body">
                      <span className="flow-title">Edge Authentication &amp; Tenant Guard</span>
                      <span className="flow-meta">JWT validation middleware · Org tenancy resolution</span>
                    </div>
                  </div>
                  <div className="flow-step">
                    <span className="flow-num">02</span>
                    <div className="flow-body">
                      <span className="flow-title">4-Tier RBAC Permission Evaluation</span>
                      <span className="flow-meta">Admin · Warehouse Manager · Sales Rep · Viewer</span>
                    </div>
                  </div>
                  <div className="flow-step">
                    <span className="flow-num">03</span>
                    <div className="flow-body">
                      <span className="flow-title">PostgreSQL Isolation &amp; DAO Layer</span>
                      <span className="flow-meta">Scoped tenant schemas · Atomic inventory decrement transactions</span>
                    </div>
                  </div>
                  <div className="flow-step">
                    <span className="flow-num">04</span>
                    <div className="flow-body">
                      <span className="flow-title">Live WebSocket Broadcast</span>
                      <span className="flow-meta">Threshold-triggered low-stock push events to active dashboards</span>
                    </div>
                  </div>

                  <div className="spec-metrics-row">
                    <div className="spec-stat">
                      <span className="stat-label">QUERY P99</span>
                      <span className="stat-val">&lt; 45ms</span>
                    </div>
                    <div className="spec-stat">
                      <span className="stat-label">USER ROLES</span>
                      <span className="stat-val">4 Tiers</span>
                    </div>
                    <div className="spec-stat">
                      <span className="stat-label">ISOLATION</span>
                      <span className="stat-val">Tenant Scoped</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="spec-card-footer">
                <span className="footer-status-pill">● PRODUCTION READY</span>
                <span className="footer-meta">FASTAPI · POSTGRESQL · REACT</span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

const SKILL_DOMAINS = [
  {
    id: 'backend',
    category: 'Backend & Data Architecture',
    meta: 'LAYERED DOMAIN SERVICES & MULTI-TENANCY',
    skills: ['Python 3.12+', 'FastAPI', 'PostgreSQL', 'RESTful APIs', 'WebSockets', 'JWT & 4-Tier RBAC', 'SQLAlchemy / Alembic', 'Pydantic v2'],
    highlight: 'Clean API router, domain service, and repository layer separation with strict schema migrations.'
  },
  {
    id: 'ai',
    category: 'AI & Retrieval Systems',
    meta: 'VECTOR PIPELINES & REASONING LOOPS',
    skills: ['LangChain', 'ChromaDB', 'Corrective RAG (CRAG)', 'Hybrid Search (BM25 + Vector)', 'Query Reflection', 'Context Chunking', 'Faithfulness Evaluation'],
    highlight: 'Autonomous relevance gating and hallucination guards ensuring grounded answers.'
  },
  {
    id: 'languages',
    category: 'Languages & Concurrency',
    meta: 'SYSTEM & CONCURRENT PROGRAMMING',
    skills: ['Python (Asyncio)', 'JavaScript (ES6+)', 'SQL (PostgreSQL / Relational)', 'TypeScript', 'HTML5 & Modern CSS'],
    highlight: 'Strict typing, asynchronous concurrency, and optimized relational data modeling.'
  },
  {
    id: 'frontend-tools',
    category: 'Frontend & Infrastructure',
    meta: 'REACTIVE INTERFACES & CONTAINERIZATION',
    skills: ['React.js', 'Tailwind CSS', 'Docker', 'Git & GitHub', 'VS Code', 'Linux CLI', 'Postman API Testing'],
    highlight: 'Responsive component-driven UI with smooth GSAP animations and containerized deployment.'
  },
];

function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredDomains = activeCategory === 'all'
    ? SKILL_DOMAINS
    : SKILL_DOMAINS.filter((d) => d.id === activeCategory);

  return (
    <section id="skills">
      <div className="section-inner section-pad">
        <SectionHeader num="02" name="SKILLS" meta="ENGINEERING MATRIX & CORE TOOLKIT" />

        {/* Category Filter Pills */}
        <div className="skills-filter-bar">
          <button
            className={`filter-pill ${activeCategory === 'all' ? 'is-active' : ''}`}
            type="button"
            onClick={() => setActiveCategory('all')}
          >
            [ ALL DOMAINS ]
          </button>
          <button
            className={`filter-pill ${activeCategory === 'backend' ? 'is-active' : ''}`}
            type="button"
            onClick={() => setActiveCategory('backend')}
          >
            [ BACKEND &amp; DATA ]
          </button>
          <button
            className={`filter-pill ${activeCategory === 'ai' ? 'is-active' : ''}`}
            type="button"
            onClick={() => setActiveCategory('ai')}
          >
            [ AI &amp; RETRIEVAL ]
          </button>
          <button
            className={`filter-pill ${activeCategory === 'languages' ? 'is-active' : ''}`}
            type="button"
            onClick={() => setActiveCategory('languages')}
          >
            [ LANGUAGES ]
          </button>
          <button
            className={`filter-pill ${activeCategory === 'frontend-tools' ? 'is-active' : ''}`}
            type="button"
            onClick={() => setActiveCategory('frontend-tools')}
          >
            [ INFRA &amp; TOOLS ]
          </button>
        </div>

        {/* Skills Bento Matrix */}
        <div className="skills-bento-grid">
          {filteredDomains.map((domain) => (
            <article className="skill-bento-card" key={domain.id}>
              <div className="bento-card-top">
                <span className="bento-meta-code">{domain.meta}</span>
                <span className="bento-status-dot" />
              </div>
              <h3 className="bento-title">{domain.category}</h3>
              <p className="bento-highlight">{domain.highlight}</p>
              <div className="bento-tag-wrap">
                {domain.skills.map((skill) => (
                  <span className="bento-skill-pill" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const BUILD_PRINCIPLES = [
  { n: '01', title: 'Layer cleanly', body: 'API routers, domain services, and data-access objects stay in separate files — no logic bleeds across layers.' },
  { n: '02', title: 'Schema first', body: 'Every feature starts with the database schema and migration, not the endpoint, so the data model drives the API.' },
  { n: '03', title: 'Contracts over docs', body: 'FastAPI\'s OpenAPI output is the source of truth; frontend types are generated from it, not written by hand.' },
  { n: '04', title: 'Guard the edge', body: 'Auth, tenant scoping, and rate-limiting run as middleware before any handler sees the request.' },
  { n: '05', title: 'Retrieve, then reflect', body: 'RAG pipelines grade their own retrieved chunks before answering — bad context triggers a corrective loop, not a hallucination.' },
  { n: '06', title: 'Ship small, observe', body: 'Each feature lands with a log statement, a Postman test, and a clear rollback path before the next one starts.' },
];

function HowIBuildSection() {
  return (
    <section id="how-i-build">
      <div className="section-inner section-pad">
        <SectionHeader num="03" name="HOW I BUILD" meta="ENGINEERING PRINCIPLES & DISCIPLINE" />

        <div className="principles-grid">
          {BUILD_PRINCIPLES.map((p) => (
            <div className="principle-card" key={p.n}>
              <span className="principle-num">{p.n}</span>
              <h3 className="principle-title">{p.title}</h3>
              <p className="principle-body">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about">
      <div className="section-inner section-pad">
        <SectionHeader num="04" name="ABOUT" meta="ENGINEERING PROFILE & BACKGROUND" />

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

function CertificationsSection() {
  return (
    <section id="certifications">
      <div className="section-inner section-pad">
        <SectionHeader num="04B" name="CERTIFICATIONS" meta="CREDENTIALS & INDUSTRY FOUNDATIONS" />

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
        <SectionHeader num="04C" name="EDUCATION" meta="ACADEMIC BACKGROUND & TIMELINE" />

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
    <section className="cta" id="contact">
      <div className="cta-inner">
        <div className="cta-copy">
          <SectionHeader num="05" name="GET IN TOUCH" meta="DISPATCH & DIRECT INQUIRY" />
          <div className="s-title-mask">
            <h2 className="cta-title">Let&apos;s build something <span className="italic">useful.</span></h2>
          </div>
          <p className="cta-desc">
            Currently open to backend, full-stack, and AI engineering internships (2025–2026). Whether you have a project inquiry or an open role, my inbox is open.
          </p>
          <div className="cta-actions">
            <a href={`mailto:${EMAIL}`} className="btn-artcraft btn-artcraft-solid">
              SEND EMAIL <span className="arrow">&nbsp;→</span>
            </a>
            <button type="button" className="btn-artcraft btn-artcraft-outline" onClick={() => onCopyEmail(EMAIL)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              COPY EMAIL ADDRESS
            </button>
          </div>
        </div>

        {/* NATIVE DISPATCH TERMINAL CARD (Zero iframes) */}
        <aside className="contact-dispatch-card" aria-label="Direct contact details">
          <div className="dispatch-header">
            <span className="dispatch-badge">DISPATCH STATUS</span>
            <span className="dispatch-live-dot" />
          </div>
          <div className="dispatch-body">
            <div className="dispatch-row">
              <span className="dispatch-label">STATUS</span>
              <span className="dispatch-val status-avail">Available for Internships</span>
            </div>
            <div className="dispatch-row">
              <span className="dispatch-label">RESPONSE SLA</span>
              <span className="dispatch-val">&lt; 12 Hours</span>
            </div>
            <div className="dispatch-row">
              <span className="dispatch-label">LOCATION</span>
              <span className="dispatch-val">Gujarat, India (IST / UTC+5:30)</span>
            </div>
            <div className="dispatch-row">
              <span className="dispatch-label">DIRECT EMAIL</span>
              <span className="dispatch-val highlight">{EMAIL}</span>
            </div>
          </div>
          <div className="dispatch-links">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="dispatch-link-btn">
              LinkedIn Profile →
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="dispatch-link-btn">
              GitHub Repositories →
            </a>
          </div>
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
          MUKESH JOSHI <span className="sub">SOFTWARE ENGINEER</span>
        </a>
        <nav className="footer-links">
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href={`mailto:${EMAIL}`}>EMAIL</a>
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} MUKESH JOSHI · CRAFTED WITH REACT &amp; GSAP</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('mukesh-portfolio-theme') || 'light';
    } catch (_) {
      return 'light';
    }
  });
  const [activeSection, setActiveSection] = useState('projects');
  const toastTimerRef = useRef(null);

  // Sync data-theme attribute and meta theme-color
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('mukesh-portfolio-theme', theme);
    } catch (_) {}
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0b0b0c' : '#f8f6f0');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Listen for custom section change event from ScrollTrigger
  useEffect(() => {
    const handleSectionChange = (e) => {
      if (e.detail?.id) {
        setActiveSection(e.detail.id);
      }
    };
    window.addEventListener('portfolio-section-change', handleSectionChange);
    return () => window.removeEventListener('portfolio-section-change', handleSectionChange);
  }, []);

  // Initialize Portfolio Animations (GSAP + Lenis + ScrollTrigger)
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
      <Navigation theme={theme} onToggleTheme={toggleTheme} />
      <main id="main">
        {/* Scroll-Driven Hero Section (ArtCraft Style with orbital squircle tiles & single continuous spiral) */}
        <HeroScroll onCopyEmail={handleCopyEmail} EMAIL={EMAIL} />

        <MetricsStrip />
        <ProjectsSection />
        <SkillsSection />
        <HowIBuildSection />
        <AboutSection />
        <CertificationsSection />
        <EducationSection />
        <ContactSection onCopyEmail={handleCopyEmail} />
      </main>

      {/* Right Edge Precision Ruler + Section Switcher */}
      <ScrollRuler activeSection={activeSection} />

      <Footer />
    </>
  );
}
