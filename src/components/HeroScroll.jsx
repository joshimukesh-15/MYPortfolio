import { useRef } from 'react';
import ArtCraftGalaxy from './ArtCraftGalaxy.jsx';
import './HeroScroll.css';

export default function HeroScroll({ onCopyEmail, EMAIL }) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const wordmarkRef = useRef(null);
  const contentFadeRef = useRef(null);

  return (
    <div className="hero-scroll-container" id="top" ref={containerRef}>
      <div className="hero-sticky-stage" ref={stageRef}>
        {/* Exact GetArtCraft 100% WebGL-accelerated 6-Arm Archimedean Spiral Galaxy */}
        <ArtCraftGalaxy />

        {/* Center Hero Content (Identical to ArtCraft's Layout) */}
        <div className="hero-center-content">
          {/* Giant Wordmark: MUKESH JOSHI */}
          <div className="hero-wordmark-dock-wrap" id="hero-wordmark-wrap">
            <h1 className="hero-giant-wordmark" id="hero-dock-wordmark" ref={wordmarkRef}>
              MUKESH JOSHI
            </h1>
          </div>

          {/* Fade Layer: Sub-headline, editorial text, buttons, sub-links */}
          <div className="hero-fade-layer" id="hero-fade-content" ref={contentFadeRef}>
            <h2 className="hero-subheadline">
              Architecting production backends &amp; AI systems.
            </h2>

            <p className="hero-editorial-desc">
              Building layered backend architecture, multi-tenant databases, and self-correcting RAG pipelines with <b>Python, FastAPI, PostgreSQL, and React</b>.
            </p>

            {/* ArtCraft-style Twin Square Action Buttons */}
            <div className="hero-square-actions">
              <a href="/Mukesh_Joshi_Resume_1.pdf" target="_blank" rel="noopener noreferrer" className="btn-artcraft btn-artcraft-solid">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" focusable="false">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                DOWNLOAD RESUME
              </a>
              <a href="#projects" className="btn-artcraft btn-artcraft-outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
                EXPLORE PROJECTS
              </a>
            </div>

            {/* Sub-meta lines (ArtCraft pattern) */}
            <div className="hero-submeta-stack">
              <p className="submeta-status">OPEN TO INTERNSHIPS (2025–2026) · BASED IN GUJARAT, INDIA</p>
              <p className="submeta-repo">
                Looking for source code and architecture?{' '}
                <a href="https://github.com/joshimukesh-15" target="_blank" rel="noopener noreferrer" className="submeta-link">
                  See GitHub profile →
                </a>
              </p>
            </div>

            {/* Bottom Trust Line */}
            <div className="hero-trust-bar">
              <span className="trust-hex">⬡</span>
              <span className="trust-text">OPEN SOURCE ON GITHUB · FASTAPI · POSTGRESQL · REACT · CHROMADB · DOCKER</span>
            </div>
          </div>
        </div>

        {/* Right-aligned Section Stack (matching the bottom-right text list in ArtCraft) */}
        <nav className="artcraft-section-nav" aria-label="Quick section navigation">
          <a href="#projects" className="asn-item">PROJECTS</a>
          <a href="#skills" className="asn-item">SKILLS</a>
          <a href="#how-i-build" className="asn-item">PRINCIPLES</a>
          <a href="#about" className="asn-item">ABOUT</a>
          <a href="#contact" className="asn-item">CONTACT</a>
        </nav>
      </div>
    </div>
  );
}
