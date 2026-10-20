import { useCallback, useEffect, useRef, useState } from 'react';
// Vite: `?raw` imports the file as a string. For other bundlers see README.md ("Other setups").
import figureHtml from './skill-shelf.html?raw';

/** Titles and skills in the order the shelves are read, top to bottom: 5 + 5 + 4 + 5 = 19. Edit the names freely, but keep the counts. */
export const DEFAULT_TITLES = ['Languages', 'Frameworks & Libs', 'Engineering', 'Tools'];
export const DEFAULT_SKILLS = [
  ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Python', 'SQL'],
  ['React.js', 'Node.js', 'Express', 'FastAPI', 'TailwindCSS'],
  ['REST APIs', 'Data Structures & Algorithms', 'Responsive Design', 'Database Design'],
  ['Git / GitHub', 'VS Code', 'Postman', 'Docker', 'Vercel'],
];

// The figure names a group by these words in its read-out; they map to group indexes 0..3.
const FIGURE_GROUPS = ['languages', 'frameworks', 'engineering', 'tools'];
const IDLE_TEXT = 'Hover a book to slide it out';
const PALETTE = { plate: '#ece9e2', hi: '#e05d00', edge: '#57565f', mid: '#a9a69e', lo: '#d3cfc5' };
// The figure ships as a full test page. Inside the card only the drawing is wanted.
const CHROME_CSS =
  'html,body{background:transparent!important;min-height:0!important;height:100%}' +
  'body{display:block!important;padding:0!important}' +
  'main{width:100%!important;max-width:none!important;margin:0!important}' +
  '.plate{border:0!important;border-radius:0!important;padding:0!important;background:transparent!important;overflow:visible!important}' +
  '#stage{border:0!important;border-radius:0!important}#stage svg{display:block!important}' +
  '.controls,#means,#rules,#name,#read,#error{display:none!important}';

/**
 * Interactive Hairline figure for the Skills section: a book for every skill.
 * Hovering a book slides it out of its shelf and parts its neighbours; the read-out names the skill.
 *
 * @param {(pick: { group: number, skill: number } | null) => void} [onSelect]
 *   Called with the hovered (or pinned) skill: `group` 0..3 and `skill` 0-based inside that group.
 *   Called with null when the pointer leaves. Use it to light up a skill row and tag.
 * @param {string[]}   [titles]   Group titles, shown in the read-out.
 * @param {string[][]} [skills]   Skill names per group, shown in the read-out.
 * @param {string}     [className] Extra class names for the card.
 * @param {string}     [html]     Override the figure page (defaults to the bundled skill-shelf.html).
 * @param {string}     [caption]  Override the line under the read-out.
 */
export default function SkillShelfFigure({
  onSelect,
  titles = DEFAULT_TITLES,
  skills = DEFAULT_SKILLS,
  className = '',
  html = figureHtml,
  caption = 'Each shelf is a skill group; each book is a skill.',
}) {
  const frameRef = useRef(null);
  const stopRef = useRef(null);
  const latest = useRef({ onSelect, titles, skills });
  const [readout, setReadout] = useState(IDLE_TEXT);

  useEffect(() => { latest.current = { onSelect, titles, skills }; }, [onSelect, titles, skills]);

  const handleLoad = useCallback(() => {
    stopRef.current?.();
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;
    const root = doc.documentElement;
    root.dataset.theme = 'light';
    Object.entries(PALETTE).forEach(([key, value]) => root.style.setProperty(`--hairline-${key}`, value));
    const style = doc.createElement('style');
    style.textContent = CHROME_CSS;
    doc.head.appendChild(style);

    const read = doc.getElementById('read');
    if (!read) return;
    const sync = () => {
      const match = /^(\w+)\s*·\s*(\d+)$/.exec((read.textContent || '').trim());
      const group = match ? FIGURE_GROUPS.indexOf(match[1]) : -1;
      const { onSelect: pick, titles: t, skills: s } = latest.current;
      if (group < 0) {
        setReadout(IDLE_TEXT);
        pick?.(null);
        return;
      }
      const skill = Number(match[2]) - 1;
      setReadout(`${t[group]} · ${s[group]?.[skill] ?? `skill ${skill + 1}`}`);
      pick?.({ group, skill });
    };
    const observer = new doc.defaultView.MutationObserver(sync);
    observer.observe(read, { childList: true, characterData: true, subtree: true });
    sync();
    stopRef.current = () => observer.disconnect();
  }, []);

  useEffect(() => () => stopRef.current?.(), []);

  return (
    <aside className={`hairline-card skill-shelf-card ${className}`.trim()} aria-label="Interactive bookcase, one shelf per skill group">
      <iframe
        ref={frameRef}
        className="hairline-frame"
        title="Hairline bookcase with a book for every skill, one shelf per group. Hover a book to slide it out."
        srcDoc={html}
        loading="lazy"
        onLoad={handleLoad}
      />
      <p className="hairline-caption">
        <span className="hairline-readout" aria-live="polite">{readout}</span>
        <span>{caption}</span>
      </p>
    </aside>
  );
}
