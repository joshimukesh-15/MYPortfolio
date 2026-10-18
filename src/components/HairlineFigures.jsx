import { useState } from 'react';
import './HairlineFigures.css';

export function BookshelfFigure({ groups, activeSkill, onSelect }) {
  const [pinnedSkill, setPinnedSkill] = useState(null);
  const [localSkill, setLocalSkill] = useState(null);
  const selected = activeSkill ?? localSkill;
  const highlighted = pinnedSkill ?? selected;
  const selectedGroup = highlighted ? groups[highlighted.group] : null;
  const selectedName = selectedGroup?.skills[highlighted.skillIndex];

  function updateSelection(group, skillIndex) {
    const next = { group, skillIndex };
    setLocalSkill(next);
    onSelect?.(next);
  }

  function clearSelection() {
    if (pinnedSkill) return;
    setLocalSkill(null);
    onSelect?.(null);
  }

  function togglePin(group, skillIndex) {
    const isPinned = pinnedSkill?.group === group && pinnedSkill?.skillIndex === skillIndex;
    if (isPinned) {
      setPinnedSkill(null);
      setLocalSkill(null);
      onSelect?.(null);
      return;
    }
    const next = { group, skillIndex };
    setPinnedSkill(next);
    setLocalSkill(next);
    onSelect?.(next);
  }

  return (
    <figure className="hairline-figure bookshelf-figure" onPointerLeave={clearSelection}>
      <div className="bookshelf-scene" role="region" aria-label="Interactive bookshelf showing the skills below">
        <div className="bookshelf-top" />
        <div className="bookshelf-side bookshelf-side-left" />
        <div className="bookshelf-side bookshelf-side-right" />
        <div className="bookshelf-back" />
        <div className="bookshelf-interior">
          {groups.map((group, groupIndex) => (
            <div className="bookshelf-bay" key={group.name}>
              <div className="bookshelf-books" role="group" aria-label={`${group.name}: ${group.skills.length} skills`}>
                {group.skills.map((skill, skillIndex) => {
                  const isActive = highlighted?.group === groupIndex && highlighted?.skillIndex === skillIndex;
                  return (
                    <span
                      className={`shelf-book book-${(skillIndex + groupIndex) % 5}${isActive ? ' is-active' : ''}`}
                      key={skill}
                      title={`${group.name} · ${skill}`}
                      onPointerEnter={() => updateSelection(groupIndex, skillIndex)}
                      onPointerLeave={clearSelection}
                      onClick={() => togglePin(groupIndex, skillIndex)}
                    >
                      <span className="book-band" aria-hidden="true" />
                      <span className="book-mark" aria-hidden="true" />
                    </span>
                  );
                })}
              </div>
              <div className={`bookshelf-shelf${highlighted?.group === groupIndex ? ' shelf-active' : ''}`}>
                <span>{group.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bookshelf-plinth" />
      </div>
      <figcaption className="bookshelf-caption" aria-live="polite">
        <span>{selectedName ? `${selectedGroup.name} · ${selectedName}` : 'Hover a book to explore skills'}</span>
        <span>{pinnedSkill ? 'Click again to release' : 'Click a book to pin'}</span>
      </figcaption>
    </figure>
  );
}

export function MailboxFigure({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <figure className={`hairline-figure mailbox-figure ${className}${isOpen ? ' is-open' : ''}`}>
      <button
        className="mailbox-button"
        type="button"
        aria-label={isOpen ? 'Mailbox open. Click to close it.' : 'Open the mailbox'}
        aria-pressed={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="mailbox-ground" aria-hidden="true" />
        <span className="mailbox-post" aria-hidden="true" />
        <span className="mailbox-body" aria-hidden="true">
          <span className="mailbox-door" />
          <span className="mailbox-slot" />
          <span className="mailbox-letter" />
          <span className="mailbox-knob" />
        </span>
        <span className="mailbox-flag-stem" aria-hidden="true" />
        <span className="mailbox-flag" aria-hidden="true" />
      </button>
      <figcaption className="mailbox-card-caption">
        <span>{isOpen ? 'FLAG UP' : 'REST'}</span>
        <span>{isOpen ? 'You’ve got a signal' : 'A small note is always welcome.'}</span>
      </figcaption>
    </figure>
  );
}
