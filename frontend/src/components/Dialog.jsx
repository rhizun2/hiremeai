import { useEffect, useRef } from 'react';
import { Sparkle } from './Icons.jsx';

// Design system: Dialog. Modal confirm over a scrim; Esc = cancel; focus returns to the trigger.
export default function Dialog({ title, text, confirmLabel, danger, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    cancelRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onCancel(); } };
    window.addEventListener('keydown', onKey, true);
    return () => { window.removeEventListener('keydown', onKey, true); prev?.focus?.(); };
  }, [onCancel]);

  return (
    <div className="df-scrim app-scrim" onPointerDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="df-dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t" aria-describedby="dlg-d">
        <div className="glyph"><Sparkle /></div>
        <h2 id="dlg-t">{title}</h2>
        <p id="dlg-d">{text}</p>
        <div className="actions">
          <button ref={cancelRef} className="df-btn" onClick={onCancel}>Cancel</button>
          <button className={`df-btn ${danger ? 'danger' : 'primary'}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
