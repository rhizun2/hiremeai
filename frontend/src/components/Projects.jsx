import { useMemo, useState } from 'react';
import { profile } from '../data/profile.js';
import { ExternalGlyph, FolderGlyph } from './Icons.jsx';

const STATUS = { live: ['success', '✓ Live'], wip: ['warning', 'In progress'], archived: ['', 'Archived'] };

// Design system: FinderWindow = sidebar categories + SegmentedControl + project cards (Tags).
export default function Projects({ focusId, onAsk }) {
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(focusId || null);

  const list = useMemo(() => profile.projects.filter((p) =>
    (category === 'all' || p.category === category) && (status === 'all' || p.status === status)
  ), [category, status]);

  const current = selected && profile.projects.find((p) => p.id === selected);

  return (
    <div className="df-finder app-finder">
      <aside aria-label="Categories">
        <h3>Favourites</h3>
        {profile.categories.map((c) => (
          <a key={c.id} href="#" aria-current={category === c.id && !current ? 'page' : undefined}
             onClick={(e) => { e.preventDefault(); setCategory(c.id); setSelected(null); }}>
            <FolderGlyph />{c.label}
          </a>
        ))}
      </aside>
      <main>
        {current ? (
          <ProjectDetail p={current} onBack={() => setSelected(null)} onAsk={onAsk} />
        ) : (
          <>
            <div className="app-finder-bar">
              <div className="df-segmented" role="tablist" aria-label="Status">
                {[['all', 'All'], ['live', 'Live'], ['wip', 'In progress'], ['archived', 'Archived']].map(([id, label]) => (
                  <button key={id} role="tab" aria-selected={status === id} onClick={() => setStatus(id)}>{label}</button>
                ))}
              </div>
              <span className="app-count">{list.length} item{list.length === 1 ? '' : 's'}</span>
            </div>
            {list.length === 0 && <p className="app-empty">Nothing here yet.</p>}
            {list.map((p) => (
              <article key={p.id} className="df-project app-card" tabIndex={0} role="button"
                       onClick={() => setSelected(p.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSelected(p.id))}>
                <div className="thumb" style={p.image ? { background: `center/cover url(${p.image})` } : undefined} />
                <div>
                  <h4>{p.name}</h4>
                  <p>{p.summary}</p>
                  <Tags p={p} />
                </div>
              </article>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

function Tags({ p }) {
  const [cls, label] = STATUS[p.status] || STATUS.archived;
  return (
    <div className="df-tags">
      {p.tags.map((t) => <span key={t} className="df-tag">{t}</span>)}
      <span className={`df-tag ${cls}`}>{label}</span>
    </div>
  );
}

function ProjectDetail({ p, onBack, onAsk }) {
  return (
    <div className="app-detail">
      <button className="df-btn ghost sm" onClick={onBack}>‹ All projects</button>
      <div className="app-detail-hero" style={p.image ? { background: `center/cover url(${p.image})` } : undefined} />
      <h2 className="app-detail-title">{p.name}</h2>
      <p>{p.summary}</p>
      <Tags p={p} />
      <div className="app-detail-actions">
        {p.repo && <a className="df-btn" href={p.repo} target="_blank" rel="noreferrer"><ExternalGlyph />Code on GitHub</a>}
        {p.demo && <a className="df-btn" href={p.demo} target="_blank" rel="noreferrer"><ExternalGlyph />Live demo</a>}
        <button className="df-btn primary" onClick={() => onAsk(`Tell me about the ${p.name} project.`)}>Ask about this project</button>
      </div>
    </div>
  );
}
