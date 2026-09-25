import { useEffect, useState } from 'react';
import { profile } from './data/profile.js';
import { useWindows } from './hooks/useWindows.js';
import { NotificationProvider } from './components/Notifications.jsx';
import MenuBar from './components/MenuBar.jsx';
import Dock from './components/Dock.jsx';
import Window from './components/Window.jsx';
import AskMe from './components/AskMe.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Terminal from './components/Terminal.jsx';
import { FileArt, FolderArt, Sparkle } from './components/Icons.jsx';

const WINDOWS = {
  askme: { title: 'Ask Me', width: 400, height: 520, icon: <Sparkle small /> },
  projects: { title: 'Projects', width: 680, height: 460 },
  contact: { title: 'Contact', width: 480, height: 520 },
  terminal: { title: `${profile.owner.name.toLowerCase()} — zsh`, width: 560, height: 340 },
};

function readTheme() { try { return localStorage.getItem('deskfolio.theme') || 'dark'; } catch { return 'dark'; } }

export default function App() {
  const w = useWindows();
  const [theme, setTheme] = useState(readTheme);
  const [pendingQ, setPendingQ] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('deskfolio.theme', theme); } catch { /* ignore */ }
  }, [theme]);

  const ask = (q) => { w.open('askme'); setPendingQ(q); };

  const onTile = (id) => {
    if (id === 'resume') return window.open(profile.resumeUrl, '_blank', 'noopener');
    if (w.isVisible(id)) return w.focus(id);
    w.open(id, w.wins[id]?.props);
  };

  const body = (id, props = {}) => {
    switch (id) {
      case 'askme': return <AskMe pendingQuestion={pendingQ} onPendingConsumed={() => setPendingQ(null)} />;
      case 'projects': return <Projects key={props.focusId || 'all'} focusId={props.focusId} onAsk={ask} />;
      case 'contact': return <Contact onClose={() => w.close('contact')} />;
      case 'terminal': return <Terminal onOpen={w.open} onAsk={ask} />;
      default: return null;
    }
  };

   // Desktop folders: pinned projects only, never in-progress ones.
  const pinned = profile.projects.filter((p) => p.pinned && p.status !== 'wip');

  return (
    <NotificationProvider>
      <div className="df-wall app-desktop">
        <MenuBar onOpen={w.open} theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />

        <nav className="app-icons" aria-label="Desktop">
          <a className="df-icon" href={profile.resumeUrl} target="_blank" rel="noreferrer"><FileArt /><span>Resume.pdf</span></a>
          {pinned.map((p) => (
            <a key={p.id} className="df-icon" href="#" onClick={(e) => { e.preventDefault(); w.open('projects', { focusId: p.id }); }}>
              <FolderArt /><span>{p.name}</span>
            </a>
          ))}
        </nav>

        <header className="df-hero app-hero">
          <p className="greet">{profile.owner.heroGreeting}</p>
          <h1 className="title">{profile.owner.heroWord}</h1>
        </header>

        {Object.entries(WINDOWS).map(([id, cfg]) => w.isOpen(id) && (
          <div key={id} className="app-win-slot" hidden={!w.isVisible(id)}>
            <Window id={id} {...cfg} z={w.wins[id].z}
                    onClose={() => w.close(id)} onMinimize={() => w.minimize(id)} onFocus={() => w.focus(id)}>
              {body(id, w.wins[id].props)}
            </Window>
          </div>
        ))}

        <Dock isOpen={w.isOpen} onTile={onTile} />
      </div>
    </NotificationProvider>
  );
}
