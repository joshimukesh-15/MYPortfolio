import './SectionHeader.css';

export default function SectionHeader({ num, name, meta }) {
  return (
    <div className="framed-section-header">
      {/* 4 Corner Tick Marks */}
      <span className="corner-tick tick-tl" aria-hidden="true">+</span>
      <span className="corner-tick tick-tr" aria-hidden="true">+</span>
      <span className="corner-tick tick-bl" aria-hidden="true">+</span>
      <span className="corner-tick tick-br" aria-hidden="true">+</span>

      <div className="fsh-left">
        <span className="fsh-num">{num}</span>
        <span className="fsh-sep">/</span>
        <span className="fsh-name">{name}</span>
      </div>

      <div className="fsh-meta">
        <span className="fsh-meta-dot" aria-hidden="true" />
        <span>{meta}</span>
      </div>
    </div>
  );
}
