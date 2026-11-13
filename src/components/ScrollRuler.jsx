import { useEffect, useState, useRef } from 'react';
import './ScrollRuler.css';

const SECTIONS = [
  { id: 'projects', num: '01', code: 'PROJ', title: '01 / PROJECTS' },
  { id: 'skills', num: '02', code: 'SKIL', title: '02 / SKILLS' },
  { id: 'how-i-build', num: '03', code: 'METH', title: '03 / HOW I BUILD' },
  { id: 'about', num: '04', code: 'ABOU', title: '04 / ABOUT' },
  { id: 'contact', num: '05', code: 'CONT', title: '05 / GET IN TOUCH' },
];

export default function ScrollRuler({ activeSection }) {
  const [scrollPercent, setScrollPercent] = useState(0);
  const markerRef = useRef(null);

  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
        const pct = Math.round(progress * 100);
        setScrollPercent(pct);

        if (markerRef.current) {
          const trackHeight = window.innerHeight - 100;
          const y = progress * trackHeight;
          markerRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const currentSection = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <>
      {/* Right Edge Fixed Precision Ruler */}
      <aside className="scroll-ruler-aside" aria-hidden="true">
        {/* Rotated Vertical Section Indicator */}
        <div className="ruler-vertical-title-wrap">
          <div className="ruler-vertical-title" key={currentSection.id}>
            <span className="rv-prefix">//</span> {currentSection.title}
          </div>
        </div>

        {/* Ruler Track with millimeter ticks */}
        <div className="ruler-track">
          <div className="ruler-ticks">
            {Array.from({ length: 48 }).map((_, i) => (
              <span
                key={i}
                className={`ruler-tick ${i % 5 === 0 ? 'tick-major' : i % 2 === 0 ? 'tick-mid' : 'tick-minor'}`}
              />
            ))}
          </div>

          {/* Gliding Marker with Percentage Counter */}
          <div className="ruler-marker" ref={markerRef}>
            <span className="marker-pointer" />
            <span className="marker-pct-label">
              {scrollPercent < 10 ? `0${scrollPercent}` : scrollPercent}%
            </span>
          </div>
        </div>
      </aside>

      {/* Floating Bottom-Right Section Switcher */}
      <nav className="bottom-section-switcher" aria-label="Quick section navigation">
        <div className="bss-inner">
          <span className="bss-prefix">INDEX</span>
          <div className="bss-links">
            {SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`bss-link ${activeSection === sec.id ? 'is-active' : ''}`}
                title={sec.title}
              >
                <span className="bss-num">{sec.num}</span>
                <span className="bss-code">{sec.code}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
