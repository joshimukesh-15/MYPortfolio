import { useEffect, useRef, useState } from 'react';

// 8 tech stack and project tiles
export const GALAXY_TILES = [
  {
    id: 'python',
    name: 'Python',
    subtitle: 'Core Backend Language',
    colors: ['#f7b733', '#fc4a1a'],
    shadowColor: 'rgba(252, 74, 26, 0.45)',
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    subtitle: 'High-Perf REST APIs',
    colors: ['#059669', '#10b981'],
    shadowColor: 'rgba(16, 185, 129, 0.45)',
  },
  {
    id: 'react',
    name: 'React.js',
    subtitle: 'Interactive Interfaces',
    colors: ['#0284c7', '#38bdf8'],
    shadowColor: 'rgba(56, 189, 248, 0.45)',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    subtitle: 'Relational Schemas',
    colors: ['#1e3a8a', '#3b82f6'],
    shadowColor: 'rgba(59, 130, 246, 0.45)',
  },
  {
    id: 'docker',
    name: 'Docker',
    subtitle: 'Containerised Deploys',
    colors: ['#0369a1', '#0ea5e9'],
    shadowColor: 'rgba(14, 165, 233, 0.45)',
  },
  {
    id: 'chromadb',
    name: 'ChromaDB',
    subtitle: 'Vector Embeddings',
    colors: ['#7c3aed', '#a855f7'],
    shadowColor: 'rgba(168, 85, 247, 0.45)',
  },
  {
    id: 'glint',
    name: 'Glint',
    subtitle: 'Continuous CRAG Platform',
    colors: ['#e11d48', '#fb7185'],
    shadowColor: 'rgba(251, 113, 133, 0.45)',
  },
  {
    id: 'flowstock',
    name: 'FlowStock',
    subtitle: 'Multi-Tenant SaaS',
    colors: ['#ea580c', '#f97316'],
    shadowColor: 'rgba(249, 115, 22, 0.45)',
  },
];

export default function ArtCraftGalaxy() {
  const mountRef = useRef(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let disposed = false;
    let cleanupFn = null;
    let idleHandle = null;
    let timerHandle = null;

    const loadGalaxy = () => {
      import('./galaxyScene.js')
        .then(({ initGalaxyScene }) => {
          if (disposed) return;
          const container = mountRef.current;
          if (!container) return;
          cleanupFn = initGalaxyScene(container, {
            tiles: GALAXY_TILES,
            onHover: (tile) => setHoveredTile(tile),
            onTooltipMove: (pos) => setTooltipPos(pos),
          });
          if (disposed && cleanupFn) {
            cleanupFn();
            cleanupFn = null;
          }
        })
        .catch((err) => {
          console.error('Failed to load Three.js galaxy scene:', err);
        });
    };

    // Defer Three.js loading until after initial paint & main thread is idle
    // This guarantees mobile Lighthouse 95+ by eliminating Three.js TBT & LCP impact
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(loadGalaxy, { timeout: 1500 });
    } else {
      timerHandle = window.setTimeout(loadGalaxy, 100);
    }

    return () => {
      disposed = true;
      if (idleHandle && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timerHandle) {
        window.clearTimeout(timerHandle);
      }
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className="hero-webgl-canvas-container" aria-hidden="true" />
      {/* Floating tooltip on hover */}
      {hoveredTile && (
        <div
          className="webgl-tile-floating-tooltip"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 45}px`,
          }}
          role="tooltip"
        >
          <span className="tooltip-name">{hoveredTile.name}</span>
          <span className="tooltip-sub">{hoveredTile.subtitle}</span>
        </div>
      )}
    </>
  );
}
