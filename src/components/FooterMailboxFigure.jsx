import { useCallback, useEffect, useRef, useState } from 'react';
// Vite: `?raw` imports the file as a string. For other bundlers see README.md ("Other setups").
import figureHtml from './footer-mailbox.html?raw';

const IDLE_TEXT = 'Move up to raise the flag';
const PALETTE = { plate: '#ece9e2', hi: '#e05d00', edge: '#57565f', mid: '#a9a69e', lo: '#d3cfc5' };
// The figure ships as a full test page. Inside the card only the drawing is wanted.
const CHROME_CSS =
  'html,body{background:transparent!important;min-height:0!important;height:100%}' +
  'body{display:block!important;padding:0!important}' +
  'main{width:100%!important;max-width:none!important;margin:0!important}' +
  '.plate{border:0!important;border-radius:0!important;padding:0!important;background:transparent!important;overflow:visible!important}' +
  '#stage{border:0!important;border-radius:0!important;cursor:pointer!important}#stage svg{display:block!important}' +
  '.controls,#means,#rules,#name,#read,#error{display:none!important}';

/**
 * Interactive Hairline figure for the footer: a mailbox whose flag rises, flap lifts and letter slides in
 * as the pointer moves up. Clicking it sends an email.
 *
 * @param {() => void} [onSend]   Called when the figure is clicked. If you omit it and pass `email`,
 *                                the click opens a mailto: link instead.
 * @param {string} [email]        Address for the default click behaviour.
 * @param {(flagDegrees: number | null) => void} [onChange]  Flag angle 0..90 while hovered, null at rest.
 * @param {string} [className]    Extra class names for the card.
 * @param {string} [html]         Override the figure page (defaults to the bundled footer-mailbox.html).
 * @param {string} [caption]      Override the line under the read-out.
 */
export default function FooterMailboxFigure({
  onSend,
  email,
  onChange,
  className = '',
  html = figureHtml,
  caption = 'Raise the flag, then click the mailbox to send me an email.',
}) {
  const frameRef = useRef(null);
  const stopRef = useRef(null);
  const latest = useRef({ onSend, email, onChange });
  const [readout, setReadout] = useState(IDLE_TEXT);

  useEffect(() => { latest.current = { onSend, email, onChange }; }, [onSend, email, onChange]);

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
    const stage = doc.getElementById('stage');
    if (!read) return;
    const sync = () => {
      const match = /^flag\s+(\d+)°$/.exec((read.textContent || '').trim());
      if (match) {
        setReadout(`Flag at ${match[1]}° · click to email me`);
        latest.current.onChange?.(Number(match[1]));
      } else {
        setReadout(IDLE_TEXT);
        latest.current.onChange?.(null);
      }
    };
    const observer = new doc.defaultView.MutationObserver(sync);
    observer.observe(read, { childList: true, characterData: true, subtree: true });
    const send = () => {
      const { onSend: handler, email: address } = latest.current;
      if (handler) handler();
      else if (address) window.location.href = `mailto:${address}`;
    };
    stage?.addEventListener('click', send);
    sync();
    stopRef.current = () => { observer.disconnect(); stage?.removeEventListener('click', send); };
  }, []);

  useEffect(() => () => stopRef.current?.(), []);

  return (
    <aside className={`hairline-card footer-mailbox-card ${className}`.trim()} aria-label="Interactive mailbox: click to send an email">
      <iframe
        ref={frameRef}
        className="hairline-frame"
        title="Hairline mailbox. Move up to raise its flag and slide a letter in; click to send an email."
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
