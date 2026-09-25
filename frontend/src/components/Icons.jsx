// Inline icons from the Deskfolio design system (2px stroke glyphs + filled sparkle).
export const Sparkle = ({ small }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M13 6c1 6 3 9 9 10-6 1-8 4-9 10-1-6-3-9-9-10 6-1 8-4 9-10z" />
    {!small && <path d="M24 2c.5 3 1.5 4 4.5 4.5-3 .5-4 1.5-4.5 4.5-.5-3-1.5-4-4.5-4.5 3-.5 4-1.5 4.5-4.5z" />}
  </svg>
);

export const Send = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 3 10.5l7.5 3L14 21z M21 3l-10.5 10.5" /></svg>
);

export const FolderGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
);
export const MailGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const TerminalGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 8 4 4-4 4M12 17h7" /></svg>
);
export const DocGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></svg>
);
export const CheckGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
);
export const AlertGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 2 20h20z" /><path d="M12 10v4M12 17v.5" /></svg>
);
export const Wifi = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" /><circle cx="12" cy="19" r="1" fill="currentColor" /></svg>
);
export const Moon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
);
export const Sun = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const ExternalGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
);

// Desktop-sized art
export const FolderArt = () => (
  <svg className="df-icon-art df-folder" viewBox="0 0 68 56" aria-hidden="true">
    <path className="back" d="M4 8a4 4 0 0 1 4-4h16l6 6h30a4 4 0 0 1 4 4v6H4z" />
    <rect className="front" x="4" y="14" width="60" height="38" rx="5" />
  </svg>
);
export const FileArt = () => (
  <svg className="df-icon-art df-file" viewBox="0 0 68 56" aria-hidden="true">
    <path className="page" d="M18 2h24l12 12v40H18z" />
    <path className="fold" d="M42 2v12h12z" />
    <rect className="line" x="23" y="18" width="18" height="2" />
    <rect className="line" x="23" y="23" width="26" height="2" />
    <rect className="line" x="23" y="28" width="26" height="2" />
    <rect className="line" x="23" y="33" width="20" height="2" />
    <rect x="36" y="38" width="14" height="12" rx="2" fill="#c62828" />
  </svg>
);
