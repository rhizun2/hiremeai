import { useEffect, useRef, useState } from 'react';

// Design system: Window. Draggable by its title bar on desktop; full-screen sheet on phones.
export default function Window({ id, title, icon, z, width = 420, height = 480, initial, onClose, onMinimize, onFocus, children, labelledBy }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(() => initial || centre(width, height));
  const drag = useRef(null);

  useEffect(() => {
    const onResize = () => setPos((p) => clamp(p, width, height));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [width, height]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && ref.current?.contains(document.activeElement)) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onPointerDown = (e) => {
    if (e.target.closest('button') || window.innerWidth < 720) return;
    onFocus();
    drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    setPos(clamp({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }, width, height));
  };
  const onPointerUp = () => { drag.current = null; };

  return (
    <section
      ref={ref}
      className="df-window app-window"
      role="dialog"
      aria-label={labelledBy ? undefined : title}
      aria-labelledby={labelledBy}
      data-window={id}
      style={{ zIndex: z, left: pos.x, top: pos.y, width, height }}
      onPointerDown={onFocus}
    >
      <header className="df-titlebar app-drag" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        <span className="df-lights">
          <button className="close" aria-label={`Close ${title}`} onClick={onClose} />
          <button className="min" aria-label={`Minimise ${title}`} onClick={onMinimize} />
          <button className="max" aria-label={`Bring ${title} to front`} onClick={onFocus} />
        </span>
        {icon}{title}
      </header>
      {children}
    </section>
  );
}

function centre(w, h) {
  return clamp({ x: (window.innerWidth - w) / 2, y: Math.max(48, (window.innerHeight - h) / 2 - 30) }, w, h);
}
function clamp(p, w, h) {
  const maxX = Math.max(8, window.innerWidth - Math.min(w, 120));
  const maxY = Math.max(38, window.innerHeight - 60);
  return { x: Math.min(Math.max(p.x, 8 - w + 120), maxX), y: Math.min(Math.max(p.y, 38), maxY) };
}
