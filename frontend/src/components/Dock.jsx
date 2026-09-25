import { useState } from 'react';
import { FolderGlyph, MailGlyph, TerminalGlyph, DocGlyph, Sparkle } from './Icons.jsx';

const TILES = [
  { id: 'projects', label: 'Projects', cls: 'files', Glyph: FolderGlyph },
  { id: 'resume', label: 'Resume', cls: 'gallery', Glyph: DocGlyph },
  { id: 'contact', label: 'Contact', cls: 'contact', Glyph: MailGlyph },
  { id: 'terminal', label: 'Terminal', cls: 'projects', Glyph: TerminalGlyph },
];

// Design system: Dock + Tooltip. Ask Me is always last and the only white object.
export default function Dock({ isOpen, onTile }) {
  const [tip, setTip] = useState(null);
  const tipProps = (id) => ({
    onMouseEnter: () => setTip(id), onMouseLeave: () => setTip(null),
    onFocus: () => setTip(id), onBlur: () => setTip(null),
  });

  return (
    <div className="app-dock-wrap">
      <div className="df-dock" role="toolbar" aria-label="Dock">
        {TILES.map(({ id, label, cls, Glyph }) => (
          <div key={id} className="app-tip-anchor">
            {tip === id && <span className="df-tooltip app-tip" role="tooltip" id={`tip-${id}`}>{label}</span>}
            <button className={`df-tile ${cls} ${isOpen(id) ? 'open' : ''}`} aria-label={label}
                    aria-describedby={tip === id ? `tip-${id}` : undefined}
                    onClick={() => onTile(id)} {...tipProps(id)}>
              <Glyph />
            </button>
          </div>
        ))}
        <button className={`df-askme ${isOpen('askme') ? 'open' : ''}`} onClick={() => onTile('askme')}>
          <Sparkle />Ask Me
        </button>
      </div>
    </div>
  );
}
