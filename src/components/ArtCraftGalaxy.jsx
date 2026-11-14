import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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

// Helper to draw clean vector icons on offscreen canvas
function drawTileIcon(ctx, id) {
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (id) {
    case 'python': {
      // Python logo shapes
      ctx.beginPath();
      ctx.arc(-14, -14, 18, Math.PI, 1.8 * Math.PI);
      ctx.arc(14, 14, 18, 0, 0.8 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-8, -18, 4, 0, Math.PI * 2);
      ctx.arc(8, 18, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'fastapi': {
      // Lightning bolt
      ctx.beginPath();
      ctx.moveTo(4, -36);
      ctx.lineTo(-24, 6);
      ctx.lineTo(0, 6);
      ctx.lineTo(-4, 36);
      ctx.lineTo(24, -6);
      ctx.lineTo(0, -6);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'react': {
      // React atom
      ctx.lineWidth = 4.5;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 36, 14, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'postgresql': {
      // Database cylinders
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, -22, 28, 11, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, 28, 11, 0, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 22, 28, 11, 0, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-28, -22);
      ctx.lineTo(-28, 22);
      ctx.moveTo(28, -22);
      ctx.lineTo(28, 22);
      ctx.stroke();
      break;
    }
    case 'docker': {
      // Container blocks riding on a whale hull
      ctx.lineWidth = 5;
      ctx.strokeRect(-30, -8, 14, 13);
      ctx.strokeRect(-14, -8, 14, 13);
      ctx.strokeRect(2, -8, 14, 13);
      ctx.strokeRect(-14, -23, 14, 13);
      ctx.strokeRect(2, -23, 14, 13);
      ctx.beginPath();
      ctx.moveTo(-36, 9);
      ctx.lineTo(30, 9);
      ctx.quadraticCurveTo(36, 3, 38, -2);
      ctx.bezierCurveTo(30, 36, -26, 36, -36, 9);
      ctx.stroke();
      break;
    }
    case 'chromadb': {
      // 3D Isometric cube
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -32);
      ctx.lineTo(28, -16);
      ctx.lineTo(28, 16);
      ctx.lineTo(0, 32);
      ctx.lineTo(-28, 16);
      ctx.lineTo(-28, -16);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 32);
      ctx.moveTo(0, 0);
      ctx.lineTo(28, -16);
      ctx.moveTo(0, 0);
      ctx.lineTo(-28, -16);
      ctx.stroke();
      break;
    }
    case 'glint':
    case 'imperium': {
      // Glint 4-pointed sparkle star ✨
      ctx.lineWidth = 4;
      ctx.beginPath();
      const rOuter = 30;
      const rInner = 8;
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? rOuter : rInner;
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Top-right companion sparkle
      ctx.beginPath();
      const sx = 18;
      const sy = -18;
      const srOuter = 10;
      const srInner = 3;
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? srOuter : srInner;
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        const x = sx + Math.cos(angle) * radius;
        const y = sy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'flowstock': {
      // 4-grid inventory modules
      ctx.lineWidth = 5;
      ctx.strokeRect(-26, -26, 20, 20);
      ctx.strokeRect(6, -26, 20, 20);
      ctx.strokeRect(-26, 6, 20, 20);
      ctx.strokeRect(6, 6, 20, 20);
      break;
    }
    default:
      break;
  }
}

// Generate offscreen canvas texture for squircle card
function createCardTexture(tile) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Outer ambient shadow
  ctx.save();
  ctx.shadowColor = tile.shadowColor;
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;

  const pad = 24;
  const w = size - pad * 2;
  const h = size - pad * 2;
  const radius = 56; // Apple-like squircle radius

  ctx.beginPath();
  ctx.roundRect(pad, pad, w, h, radius);

  const grad = ctx.createLinearGradient(pad, pad, pad + w, pad + h);
  grad.addColorStop(0, tile.colors[0]);
  grad.addColorStop(1, tile.colors[1]);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Subtle translucent inner border
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pad, pad, w, h, radius);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Draw centered vector icon
  ctx.save();
  ctx.translate(size / 2, size / 2);
  drawTileIcon(ctx, tile.id);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// Exact Archimedean spiral ribbon shaders from GetArtCraft
const RIBBON_VERTEX_SHADER = `
  attribute vec2 aN;
  attribute float aSide;
  attribute float aT;
  attribute float aArm;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uWidth;
  uniform float uCount;
  uniform float uBaseW;
  uniform float uPulseW;
  varying float vG;
  varying float vSide;
  varying float vArm;

  void main() {
    float d = fract(aT * uCount - uTime * uSpeed + aArm * 0.618);
    float s = d - 0.5;
    float sig = uWidth * (s < 0.0 ? 1.7 : 0.55);
    float g = exp(-0.5 * (s / sig) * (s / sig));
    g *= smoothstep(0.04, 0.14, aT);
    vG = g;
    vSide = aSide;
    vArm = aArm;

    float w = uBaseW + uPulseW * g;
    vec3 pos = position + vec3(aN * (aSide * w * 0.5), 0.0);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
  }
`;

const RIBBON_FRAGMENT_SHADER = `
  precision highp float;
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform vec3 uPulseColor;
  uniform float uPulseAlpha;
  uniform float uHue;
  varying float vG;
  varying float vSide;
  varying float vArm;

  vec3 hueRotate(vec3 color, float a) {
    const mat3 toYIQ = mat3(
      0.299, 0.587, 0.114,
      0.596, -0.274, -0.322,
      0.211, -0.523, 0.312);
    const mat3 toRGB = mat3(
      1.0, 0.956, 0.621,
      1.0, -0.272, -0.647,
      1.0, -1.106, 1.703);
    vec3 yiq = color * toYIQ;
    float h = atan(yiq.z, yiq.y) + a;
    float c = length(yiq.yz);
    return clamp(vec3(yiq.x, c * cos(h), c * sin(h)) * toRGB, 0.0, 1.0);
  }

  void main() {
    float edge = 1.0 - smoothstep(0.45, 1.0, abs(vSide));
    float g = clamp(vG, 0.0, 1.0);
    vec3 baseCol = hueRotate(uColor, vArm * uHue * 6.28318);
    vec3 pulseCol = hueRotate(uPulseColor, vArm * uHue * 6.28318);
    vec3 col = mix(baseCol, pulseCol, g);
    gl_FragColor = vec4(col, (uAlpha + uPulseAlpha * vG) * edge);
  }
`;

export default function ArtCraftGalaxy() {
  const mountRef = useRef(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let disposed = false;
    let animId;
    let cleanupFn = null;

    const startGalaxy = () => {
      if (disposed) return;
      const container = mountRef.current;
      if (!container) return;

      let width = container.clientWidth || window.innerWidth;
      let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera & WebGLRenderer
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2, width / 2, height / 2, -height / 2, 0.1, 1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'auto';
    container.appendChild(renderer.domElement);

    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // 2. Galaxy Math Parameters (GetArtCraft exact tunables)
    const arms = width < 768 ? 3 : 6;
    const turns = 1.05; // 1.05 revolutions per arm
    const thetaMax = turns * Math.PI * 2;
    const rMax = Math.max(360, Math.min(840, Math.hypot(width, height) * 0.44));
    const b = rMax / thetaMax;
    const thetaBirth = 0.08 * thetaMax;
    const thetaExit = (Math.hypot(width, height) / 2 + 120) / b;

    // Theme color detection
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const baseLineColor = isDark ? new THREE.Color(0.74, 0.52, 0.98) : new THREE.Color(0.18, 0.45, 0.94);
    const pulseAccentColor = isDark ? new THREE.Color(0.22, 0.74, 0.97) : new THREE.Color(0.145, 0.388, 0.922);

    // 3. Ribbon ShaderMaterial
    const ribbonMaterial = new THREE.ShaderMaterial({
      vertexShader: RIBBON_VERTEX_SHADER,
      fragmentShader: RIBBON_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.22 },
        uWidth: { value: 0.05 },
        uCount: { value: 3.0 },
        uBaseW: { value: 1.7 },
        uPulseW: { value: 5.0 },
        uColor: { value: baseLineColor },
        uAlpha: { value: isDark ? 0.4 : 0.5 },
        uPulseColor: { value: pulseAccentColor },
        uPulseAlpha: { value: isDark ? 1 : 0.95 },
        uHue: { value: 0.9 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // 4. Construct Archimedean Spiral Ribbon Mesh (200 segments per arm)
    const ribbonGeom = new THREE.BufferGeometry();
    const positions = [];
    const normals = [];
    const sides = [];
    const tVals = [];
    const armIdx = [];
    const indices = [];

    const tickPositions = [];

    for (let e = 0; e < arms; e++) {
      const baseAngle = (e * Math.PI * 2) / arms;
      const vertexOffset = (positions.length / 3);

      for (let n = 0; n <= 200; n++) {
        const u = 0.3 * thetaBirth + (n / 200) * (thetaExit - 0.3 * thetaBirth);
        const r = b * u;
        const theta = u + baseAngle;
        const px = r * Math.cos(theta);
        const py = r * Math.sin(theta);

        // Tangent & Normal
        const gx = b * Math.cos(theta) - r * Math.sin(theta);
        const gy = b * Math.sin(theta) + r * Math.cos(theta);
        const len = Math.hypot(gx, gy) || 1;
        const nx = -gy / len;
        const ny = gx / len;

        for (const side of [-1, 1]) {
          positions.push(px, py, -2);
          normals.push(nx, ny);
          sides.push(side);
          tVals.push(n / 200);
          armIdx.push(e);
        }

        if (n < 200) {
          const idx = vertexOffset + 2 * n;
          indices.push(idx, idx + 1, idx + 2, idx + 1, idx + 3, idx + 2);
        }

        // Perpendicular tick hashes along arms
        if (n > 20 && n % 14 === 0) {
          const tickLen = 6;
          tickPositions.push(px - nx * tickLen, py - ny * tickLen, -1);
          tickPositions.push(px + nx * tickLen, py + ny * tickLen, -1);
        }
      }
    }

    ribbonGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    ribbonGeom.setAttribute('aN', new THREE.Float32BufferAttribute(normals, 2));
    ribbonGeom.setAttribute('aSide', new THREE.Float32BufferAttribute(sides, 1));
    ribbonGeom.setAttribute('aT', new THREE.Float32BufferAttribute(tVals, 1));
    ribbonGeom.setAttribute('aArm', new THREE.Float32BufferAttribute(armIdx, 1));
    ribbonGeom.setIndex(indices);

    const ribbonMesh = new THREE.Mesh(ribbonGeom, ribbonMaterial);
    galaxyGroup.add(ribbonMesh);

    // 5. Perpendicular tick lines along arms
    const tickGeom = new THREE.BufferGeometry();
    tickGeom.setAttribute('position', new THREE.Float32BufferAttribute(tickPositions, 3));
    const tickMat = new THREE.LineBasicMaterial({
      color: isDark ? 0xffffff : 0x121214,
      transparent: true,
      opacity: 0.2,
    });
    const tickLines = new THREE.LineSegments(tickGeom, tickMat);
    galaxyGroup.add(tickLines);

    // 6. Concentric dashed rings & vernier tick marks
    const ringsGroup = new THREE.Group();
    const ringFractions = [0.28, 0.48, 0.70, 0.92];
    ringFractions.forEach((frac, idx) => {
      const radius = rMax * frac;
      const circleSegments = 96;
      const circlePoints = [];
      for (let i = 0; i <= circleSegments; i++) {
        const theta = (i * Math.PI * 2) / circleSegments;
        circlePoints.push(new THREE.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), -3));
      }
      const circleGeom = new THREE.BufferGeometry().setFromPoints(circlePoints);
      const circleMat = new THREE.LineDashedMaterial({
        color: isDark ? 0xffffff : 0x121214,
        transparent: true,
        opacity: idx === 1 || idx === 2 ? 0.12 : 0.07,
        dashSize: 6,
        gapSize: 6,
      });
      const circleLine = new THREE.Line(circleGeom, circleMat);
      circleLine.computeLineDistances();
      ringsGroup.add(circleLine);
    });
    galaxyGroup.add(ringsGroup);

    // 7. 3D Textured Squircle Cards
    const cardMeshes = [];
    const cardSize = width < 768 ? 60 : 84;
    const cardGeom = new THREE.PlaneGeometry(cardSize, cardSize);

    GALAXY_TILES.forEach((tile, i) => {
      const texture = createCardTexture(tile);
      const cardMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      const cardMesh = new THREE.Mesh(cardGeom, cardMat);
      cardMesh.userData = { tile, index: i };
      galaxyGroup.add(cardMesh);
      cardMeshes.push(cardMesh);
    });

    // 8. Animation & Physics Loop (Exact GetArtCraft idle + scroll speed)
    let animId;
    let lastTime = performance.now();
    let idleProgress = 0;
    let spin = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const idleSpeedCyclesPerMin = 0.57; // GetArtCraft exact speed
    const scrollScrub = 0.2 / 1000;    // GetArtCraft exact scrub
    const spinDegPerMin = 15;          // GetArtCraft exact rotation

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    function onPointerMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }

    function onPointerLeave() {
      mouse.x = -999;
      mouse.y = -999;
      setHoveredTile(null);
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);

    function render(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!prefersReducedMotion) {
        idleProgress += dt * (idleSpeedCyclesPerMin / 60);
        spin += dt * THREE.MathUtils.degToRad(spinDegPerMin) / 60;
        ribbonMaterial.uniforms.uTime.value += dt;
      }

      const scrollY = window.scrollY || 0;
      const G = idleProgress + scrollY * scrollScrub;

      // Galaxy base rotation
      galaxyGroup.rotation.z = spin;

      // Position cards along Archimedean arms and keep them UPRIGHT
      for (let i = 0; i < cardMeshes.length; i++) {
        const mesh = cardMeshes[i];
        const armIndex = i % arms;
        const armBaseAngle = (armIndex * Math.PI * 2) / arms;

        // Slot progression along arm
        const slotOffset = (Math.floor(i / arms) * 0.48 + 0.18);
        const o = ((slotOffset + G) % 1 + 1) % 1; // positive fract
        const thetaArm = thetaBirth + o * (thetaExit - thetaBirth);
        const r = b * thetaArm;
        const angle = thetaArm + armBaseAngle;

        const px = r * Math.cos(angle);
        const py = r * Math.sin(angle);

        mesh.position.set(px, py, 1);
        // CRITICAL: Counter-rotate by -spin so card stays perfectly upright!
        mesh.rotation.set(0, 0, -spin);
      }

      // Check card hovers via Raycaster
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        renderer.domElement.style.cursor = 'pointer';
        setHoveredTile(hit.userData.tile);
        hit.scale.lerp(new THREE.Vector3(1.15, 1.15, 1), 0.2);
      } else {
        renderer.domElement.style.cursor = 'default';
        setHoveredTile(null);
      }

      // Reset scales for unhovered cards
      cardMeshes.forEach((mesh) => {
        if (!intersects.some((hit) => hit.object === mesh)) {
          mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2);
        }
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    // Resize Handler
    function onResize() {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', onResize);

    // Theme Change Handler
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      ribbonMaterial.uniforms.uColor.value.set(dark ? 0xbd85fa : 0x2e73f0);
      ribbonMaterial.uniforms.uAlpha.value = dark ? 0.4 : 0.5;
      ribbonMaterial.uniforms.uPulseColor.value.set(dark ? 0x38bdf8 : 0x2563eb);
      tickMat.color.set(dark ? 0xffffff : 0x121214);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    cleanupFn = () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      observer.disconnect();
      renderer.dispose();
      ribbonGeom.dispose();
      ribbonMaterial.dispose();
      tickGeom.dispose();
      tickMat.dispose();
      cardMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.map?.dispose();
        mesh.material.dispose();
      });
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
    };

    // Defer WebGL initialization by 40ms so initial HTML, CSS, fonts, and LCP paint first without main-thread blocking
    const timer = window.setTimeout(startGalaxy, 40);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      if (cleanupFn) cleanupFn();
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
