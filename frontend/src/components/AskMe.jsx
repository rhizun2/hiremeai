import { useEffect, useRef, useState } from 'react';
import { askCandidate } from '../api.js';
import { profile } from '../data/profile.js';
import { useNotify } from './Notifications.jsx';
import Markdown from './Markdown.jsx';
import Dialog from './Dialog.jsx';
import { Send } from './Icons.jsx';

const STORE = 'deskfolio.chat';
const MAX_LEN = 500;

const load = () => { try { return JSON.parse(sessionStorage.getItem(STORE)) || []; } catch { return []; } };
const save = (m) => { try { sessionStorage.setItem(STORE, JSON.stringify(m)); } catch { /* private mode */ } };

// Design system: AskMeChat = SuggestionChip (empty state) | ChatBubble thread + ChatInput.
export default function AskMe({ pendingQuestion, onPendingConsumed }) {
  const [messages, setMessages] = useState(load);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const notify = useNotify();
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { save(messages); endRef.current?.scrollIntoView({ block: 'end' }); }, [messages, busy]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  async function send(text) {
    const q = text.trim().slice(0, MAX_LEN);
    if (!q || busy) return;
    setDraft('');
    setMessages((m) => [...m, { role: 'me', text: q }]);
    setBusy(true);
    let slowId = null;
    try {
      const answer = await askCandidate(q, {
        onSlow: () => { slowId = notify({ title: 'Waking up the assistant…', text: 'First reply can take up to a minute.', kind: 'info', sticky: true }); },
      });
      setMessages((m) => [...m, { role: 'bot', text: answer }]);
    } catch (err) {
      const text = err.kind === 'timeout'
        ? "Sorry — that took too long. Please try again in a moment."
        : "Sorry — I couldn't reach my brain just now. Please try again.";
      setMessages((m) => [...m, { role: 'bot', text, error: true }]);
      notify({ title: 'Assistant unavailable', text: 'The request failed — try again shortly.', kind: 'warn' });
    } finally {
      if (slowId) notify.dismiss(slowId);
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  // A question sent from elsewhere (e.g. the terminal's `ask` command)
  useEffect(() => {
    if (pendingQuestion) { send(pendingQuestion); onPendingConsumed?.(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuestion]);

  return (
    <>
      <div className="df-window-body app-chat-body" aria-live="polite">
        {messages.length === 0 ? (
          <>
            <p className="df-hello">👋 Ask me anything!</p>
            <div className="df-chips">
              {profile.starterQuestions.map((q) => (
                <button key={q} className="df-chip" onClick={() => send(q)} disabled={busy}>{q}</button>
              ))}
            </div>
          </>
        ) : (
          <div className="df-thread">
            {messages.map((m, i) => (
              <div key={i} className={`df-bubble ${m.role} app-md ${m.error ? 'app-error' : ''}`}>
                {m.role === 'bot' ? <Markdown text={m.text} /> : m.text}
              </div>
            ))}
            {busy && <div className="df-bubble bot typing" aria-label="Typing"><i /><i /><i /></div>}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form className="df-composer app-composer" onSubmit={(e) => { e.preventDefault(); send(draft); }}>
        {messages.length > 0 && (
          <button type="button" className="df-btn ghost sm app-clear" onClick={() => setConfirmClear(true)} disabled={busy}>Clear chat</button>
        )}
        <label className="df-input">
          <input ref={inputRef} value={draft} maxLength={MAX_LEN} onChange={(e) => setDraft(e.target.value)}
                 placeholder={busy ? 'Thinking…' : 'Type a message...'} aria-label="Message" disabled={busy} />
          <button className="df-send" aria-label="Send" disabled={busy || !draft.trim()}><Send /></button>
        </label>
      </form>
      {confirmClear && (
        <Dialog title="Clear this conversation?" text="Ask Me will forget this chat. You can't undo this."
                confirmLabel="Clear chat" danger
                onCancel={() => setConfirmClear(false)}
                onConfirm={() => { setMessages([]); setConfirmClear(false); }} />
      )}
    </>
  );
}
