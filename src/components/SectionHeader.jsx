export default function SectionHeader({ num, name, meta }) {
  return (
    <div className="section-hud">
      <span className="hud-label section-hud-num">{num}</span>
      <span className="section-hud-slash" aria-hidden="true">/</span>
      <span className="hud-label section-hud-name">{name}</span>
      <span className="section-hud-rule" aria-hidden="true" />
      {meta ? <span className="hud-label section-hud-meta">{meta}</span> : null}
    </div>
  );
}
