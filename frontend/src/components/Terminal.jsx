import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile.js';

// A small "about me" terminal. Every answer comes from profile.js; `ask` forwards to the Ask Me chat.
export default function Terminal({ onOpen, onAsk }) {
  const user = profile.owner.name.toLowerCase().replace(/\s+/g, '');
  const [lines, setLines] = useState([
    { out: `Last login: ${new Date().toDateString()} on ttys000` },
    { out: "Type 'help' to see what I can do." },
  ]);
  const [cmd, setCmd] = useState('');
  const [hist, setHist] = useState([]);
  const [hi, setHi] = useState(-1);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [lines]);

  const commands = {
    help: () => ['whoami     who I am', 'skills     my core stack', 'projects   list projects (open <id> to view)', 'resume     open my resume', 'contact    get in touch', 'ask <q>    ask my AI assistant', 'clear      clear the screen'],
    whoami: () => [`${profile.owner.fullName} — ${profile.owner.title}`, profile.owner.location],
    skills: () => [profile.skills.join(' · ')],
    projects: () => profile.projects.map((p) => `${p.id.padEnd(14)} ${p.name}  [${p.status}]`),
    open: (arg) => {
      const p = profile.projects.find((x) => x.id === arg);
      if (!p) return [`open: no such project '${arg || ''}' — try 'projects'`];
      onOpen('projects', { focusId: p.id });
      return [`Opening ${p.name}…`];
    },
    resume: () => { window.open(profile.resumeUrl, '_blank', 'noopener'); return ['Opening resume.pdf…']; },
    contact: () => { onOpen('contact'); return ['Opening Contact…']; },
    ask: (arg) => {
      if (!arg) return ['usage: ask <your question>'];
      onAsk(arg);
      return ['Sent to Ask Me →'];
    },
    sudo: () => ['Nice try. 🙂'],
  };

  function run(e) {
    e.preventDefault();
    const input = cmd.trim();
    setCmd(''); setHi(-1);
    if (!input) return setLines((l) => [...l, { cmd: '' }]);
    setHist((h) => [input, ...h].slice(0, 30));
    const [name, ...rest] = input.split(/\s+/);
    if (name === 'clear') return setLines([]);
    const fn = commands[name.toLowerCase()];
    const out = fn ? fn(rest.join(' ')) : [`zsh: command not found: ${name}`];
    setLines((l) => [...l, { cmd: input }, ...out.map((o) => ({ out: o }))]);
  }

  function onKey(e) {
    if (e.key === 'ArrowUp' && hist.length) { e.preventDefault(); const i = Math.min(hi + 1, hist.length - 1); setHi(i); setCmd(hist[i]); }
    if (e.key === 'ArrowDown') { e.preventDefault(); const i = hi - 1; setHi(i); setCmd(i < 0 ? '' : hist[i]); }
  }

  const prompt = <span className="app-prompt">{user}@deskfolio ~ %</span>;
  return (
    <div className="app-terminal" onClick={() => inputRef.current?.focus()}>
      {lines.map((l, i) => (
        <div key={i}>{l.cmd !== undefined ? <>{prompt} {l.cmd}</> : l.out}</div>
      ))}
      <form onSubmit={run} className="app-terminal-line">
        {prompt}
        <input ref={inputRef} value={cmd} onChange={(e) => setCmd(e.target.value)} onKeyDown={onKey}
               aria-label="Terminal command" autoComplete="off" spellCheck={false} autoFocus />
      </form>
      <div ref={endRef} />
    </div>
  );
}
