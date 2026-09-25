// Talks to the FastAPI backend (main.py) — POST /chat {question} -> {answer}.
// The browser always calls /api/* on its own origin; Vite (dev) or Vercel (prod)
// forwards it to the backend, so the backend needs no CORS setup.
const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const TIMEOUT_MS = 90_000; // backend parses the PDF + makes 2 LLM calls per question; cold starts add ~30-50s

export class ChatError extends Error {
  constructor(message, kind) {
    super(message);
    this.kind = kind; // 'timeout' | 'network' | 'server'
  }
}

export async function askCandidate(question, { onSlow } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const slowTimer = onSlow ? setTimeout(onSlow, 8_000) : null;

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });
    if (!res.ok) throw new ChatError(`Server responded ${res.status}`, 'server');
    const data = await res.json();
    if (typeof data?.answer !== 'string') throw new ChatError('Unexpected response', 'server');
    return data.answer;
  } catch (err) {
    if (err instanceof ChatError) throw err;
    if (err.name === 'AbortError') throw new ChatError('Timed out', 'timeout');
    throw new ChatError('Network error', 'network');
  } finally {
    clearTimeout(timer);
    if (slowTimer) clearTimeout(slowTimer);
  }
}
