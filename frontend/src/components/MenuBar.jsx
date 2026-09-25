import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile.js';
import { Moon, Sun, Wifi } from './Icons.jsx';

const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

// Design system: MenuBar + Menu (Projects dropdown).
export default function MenuBar({ onOpen, theme, onToggleTheme }) {
  const [now, setNow] = useState(() => new Date());
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 15_000); return () => clearInterval(t); }, []);

  useEffect(() => {
    if (!menu) return;
    const first = menuRef.current?.querySelector('[role=menuitem]');
    first?.focus();
    const onDown = (e) => { if (!menuRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) setMenu(false); };
    const onKey = (e) => {
      const items = [...(menuRef.current?.querySelectorAll('[role=menuitem]') || [])];
      const i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') { setMenu(false); btnRef.current?.focus(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [menu]);

  const pick = (fn) => () => { setMenu(false); fn(); };
  const onItemKey = (fn) => (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(fn)(); } };

  return (
    <nav className="df-menubar app-menubar" aria-label="Portfolio">
      <span className="df-mark" aria-hidden="true" />
      <span className="df-brand">{profile.owner.name}'s Portfolio</span>
      <a href="#" ref={btnRef} aria-haspopup="menu" aria-expanded={menu}
         style={menu ? { background: 'rgba(255,255,255,.18)' } : undefined}
         onClick={(e) => { e.preventDefault(); setMenu((m) => !m); }}>Projects</a>
      <a href="#" onClick={(e) => { e.preventDefault(); onOpen('contact'); }}>Contact</a>
      <a href={profile.resumeUrl} target="_blank" rel="noreferrer">Resume</a>

      {menu && (
        <ul ref={menuRef} className="df-menu app-menu" role="menu" aria-label="Projects">
          {profile.projects.map((p) => (
            <li key={p.id} role="menuitem" tabIndex={-1} onClick={pick(() => onOpen('projects', { focusId: p.id }))} onKeyDown={onItemKey(() => onOpen('projects', { focusId: p.id }))}>
              Open {p.name}
            </li>
          ))}
          <hr />
          <li role="menuitem" tabIndex={-1} onClick={pick(() => onOpen('projects'))} onKeyDown={onItemKey(() => onOpen('projects'))}>View all projects</li>
          {profile.links.github && (
            <li role="menuitem" tabIndex={-1} onClick={pick(() => window.open(profile.links.github, '_blank', 'noopener'))} onKeyDown={onItemKey(() => window.open(profile.links.github, '_blank', 'noopener'))}>GitHub profile</li>
          )}
        </ul>
      )}

      <span className="df-status">
        <button className="app-theme" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} windows`}>
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <Wifi />
        <span className="app-clock">{fmt.format(now)}</span>
      </span>
    </nav>
  );
}
