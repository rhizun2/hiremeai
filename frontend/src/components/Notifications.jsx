import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertGlyph, CheckGlyph, MailGlyph } from './Icons.jsx';

const Ctx = createContext(() => {});
export const useNotify = () => useContext(Ctx);

// Top-right banners (design system: Notification). Auto-dismiss after 5s, pause on hover.
export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    setItems((xs) => xs.filter((x) => x.id !== id));
  }, []);

  const arm = useCallback((id, ms = 5000) => {
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => dismiss(id), ms);
  }, [dismiss]);

  const notify = useCallback(({ title, text = '', kind = 'info', sticky = false }) => {
    const id = Math.random().toString(36).slice(2);
    setItems((xs) => [{ id, title, text, kind, sticky }, ...xs].slice(0, 4));
    if (!sticky) arm(id);
    return id;
  }, [arm]);

  notify.dismiss = dismiss;

  return (
    <Ctx.Provider value={notify}>
      {children}
      <div className="app-notices" aria-live="polite">
        {items.map((n) => (
          <div key={n.id} className="df-notice" role="status"
               onMouseEnter={() => clearTimeout(timers.current[n.id])}
               onMouseLeave={() => !n.sticky && arm(n.id, 2500)}
               onClick={() => dismiss(n.id)}>
            <span className={`icon ${n.kind === 'ok' ? 'ok' : ''} ${n.kind === 'warn' ? 'warn' : ''}`}>
              {n.kind === 'ok' ? <CheckGlyph /> : n.kind === 'warn' ? <AlertGlyph /> : <MailGlyph />}
            </span>
            <div><strong>{n.title}</strong>{n.text && <span className="text">{n.text}</span>}</div>
            <span className="meta">now</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
