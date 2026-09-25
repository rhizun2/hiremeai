import { useState } from 'react';
import { profile } from '../data/profile.js';
import { useNotify } from './Notifications.jsx';
import Dialog from './Dialog.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const empty = { name: '', email: '', reason: 'Full-time role', message: '' };

// Design system: Form (TextField + Checkbox + Buttons) in a Window.
// main.py has no email endpoint, so Send opens the visitor's mail app (mailto:) —
// nothing is sent through your backend and no API key is involved.
export default function Contact({ onClose }) {
  const [v, setV] = useState(empty);
  const [touched, setTouched] = useState({});
  const [confirm, setConfirm] = useState(false);
  const notify = useNotify();
  const to = profile.links.email;

  const errors = {
    name: !v.name.trim() && 'Tell me your name.',
    email: !EMAIL_RE.test(v.email) && 'Enter a full email address.',
    message: v.message.trim().length < 10 && 'A line or two about what you need.',
  };
  const valid = !errors.name && !errors.email && !errors.message;
  const dirty = Object.keys(empty).some((k) => v[k] !== empty[k] && k !== 'reason');

  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const blur = (k) => () => setTouched({ ...touched, [k]: true });

  function submit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!valid) return;
    if (!to) {
      notify({ title: 'Email not set up yet', text: 'Add links.email in profile.js.', kind: 'warn' });
      return;
    }
    const subject = `[Portfolio] ${v.reason} — ${v.name}`;
    const body = `${v.message}\n\n— ${v.name} (${v.email})`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    notify({ title: 'Opening your email app', text: 'Hit send there to reach me.', kind: 'ok' });
    setV(empty); setTouched({});
  }

  const field = (k, label, input) => {
    const err = touched[k] && errors[k];
    return (
      <div className={`df-field ${err ? 'invalid' : ''}`}>
        <label htmlFor={`c-${k}`}>{label} <span className="req" aria-hidden="true">*</span></label>
        {input({ id: `c-${k}`, className: 'df-control', value: v[k], onChange: set(k), onBlur: blur(k), 'aria-invalid': !!err, 'aria-describedby': err ? `c-${k}-h` : undefined, required: true })}
        {err && <span className="help" id={`c-${k}-h`}>{err}</span>}
      </div>
    );
  };

  return (
    <div className="df-window-body">
      <form className="df-form" onSubmit={submit} noValidate>
        <div className="row">
          {field('name', 'Name', (p) => <input {...p} placeholder="Jane Recruiter" autoComplete="name" />)}
          {field('email', 'Email', (p) => <input {...p} type="email" placeholder="jane@company.com" autoComplete="email" />)}
        </div>
        <div className="df-field">
          <label htmlFor="c-reason">Reason</label>
          <select id="c-reason" className="df-control" value={v.reason} onChange={set('reason')}>
            <option>Full-time role</option><option>Contract / freelance</option><option>Collaboration</option><option>Just saying hi</option>
          </select>
        </div>
        {field('message', 'Message', (p) => <textarea {...p} placeholder="Tell me about the role…" maxLength={2000} />)}
        <div className="actions">
          {(profile.links.linkedin || profile.links.github) && (
            <span className="app-links">
              {profile.links.linkedin && <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {profile.links.github && <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>}
            </span>
          )}
          <button type="button" className="df-btn" onClick={() => (dirty ? setConfirm(true) : onClose())}>Cancel</button>
          <button className="df-btn primary">Send message</button>
        </div>
      </form>
      {confirm && (
        <Dialog title="Discard this message?" text="What you've typed will be lost." confirmLabel="Discard" danger
                onCancel={() => setConfirm(false)} onConfirm={() => { setV(empty); setConfirm(false); onClose(); }} />
      )}
    </div>
  );
}
