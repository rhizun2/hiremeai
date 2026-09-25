import { useCallback, useRef, useState } from 'react';

// Tracks which windows are open/minimised and their stacking order.
// Window ids: 'askme' | 'projects' | 'contact' | 'terminal'
export function useWindows() {
  const [wins, setWins] = useState({});
  const top = useRef(10);

  const focus = useCallback((id) => {
    setWins((w) => (w[id]?.z === top.current ? w : { ...w, [id]: { ...w[id], z: ++top.current } }));
  }, []);

  const open = useCallback((id, props = {}) => {
    const z = ++top.current;
    setWins((w) => ({ ...w, [id]: { ...w[id], open: true, minimized: false, z, props } }));
  }, []);

  const close = useCallback((id) => setWins((w) => ({ ...w, [id]: { ...w[id], open: false } })), []);
  const minimize = useCallback((id) => setWins((w) => ({ ...w, [id]: { ...w[id], minimized: true } })), []);

  const isOpen = (id) => !!wins[id]?.open;
  const isVisible = (id) => !!wins[id]?.open && !wins[id]?.minimized;

  return { wins, open, close, minimize, focus, isOpen, isVisible };
}
