# Portfolio Chatbot

FastAPI backend (Groq-powered, streaming, conversation memory, JD matching) +
React/Vite frontend.

## Local setup

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # fill in GROQ_API_KEY
python build_profile.py Nikhil_Gupta_Resume_4.pdf   # one-time: generates profile.json
# review profile.json by hand, then:
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Open the Vite dev URL (usually http://localhost:5173). Chat streams token by
token; the "Match a job description" tab scores a pasted or uploaded JD.

## Deployment (Steps 9-10)

### Backend → Render or Railway
1. Push `backend/` to a GitHub repo (or the `backend` subfolder of a monorepo).
2. **Render**: New → Web Service → connect the repo.
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Railway**: New Project → Deploy from GitHub → same start command; Railway
     sets `$PORT` automatically too.
3. Add environment variables in the dashboard: `GROQ_API_KEY`, `GROQ_MODEL`
   (optional), and `ALLOWED_ORIGINS` — set this to your Vercel URL once you
   have it (step 5 below), e.g. `https://your-portfolio.vercel.app`.
4. Deploy. Confirm `GET https://your-backend-url/` returns
   `{"message": "API is running", ...}`.
5. `profile.json` ships as a file in the repo — commit it after running
   `build_profile.py` locally and reviewing it. Don't regenerate it on the
   server on every boot; that reintroduces the per-request LLM cost this
   redesign removed.

### Frontend → Vercel
1. Push `frontend/` to GitHub (or the subfolder).
2. Vercel → New Project → import the repo, set root directory to `frontend`.
3. Framework preset: Vite (auto-detected). Build command `npm run build`,
   output directory `dist` (defaults are fine).
4. Add environment variable `VITE_API_BASE_URL` = your Render/Railway backend
   URL (from step 4 above).
5. Deploy. Once you have the Vercel URL, go back to the backend's
   `ALLOWED_ORIGINS` env var and set it to that exact URL, then redeploy the
   backend — CORS will reject the frontend until you do this.

## Risks / things to verify before treating this as production

- **CORS**: the original code used `allow_origins=["*"]`. This version reads
  `ALLOWED_ORIGINS` from env and defaults to localhost only — you must set it
  explicitly in both Render/Railway once you know the Vercel URL, or the
  deployed frontend's requests will be blocked (safer failure mode than the
  wildcard, but requires this one manual step).
- **Rate limiting**: `slowapi` is wired in (20/min chat, 10/min JD match) to
  stop a single client from burning through your Groq quota. It's in-memory
  per-process — fine for a single Render/Railway instance, but won't be
  shared across multiple instances if you ever scale horizontally.
- **Conversation memory**: implemented client-side (the browser resends the
  full history each turn) rather than a server-side session store. Simpler
  and stateless-friendly for deployment, but history is lost on page refresh
  and there's no cap enforced server-side beyond the 20-turn `max_length` on
  the request model — a very long conversation will increase token cost per
  turn since the whole history is resent.
- **JD file upload**: PDF and plain text are handled; `.docx` is not (the
  original resume parser also only handled PDF). If recruiters need `.docx`,
  add `python-docx` and a small extraction helper.
- **Groq API key**: never let this be entered in the frontend or a query
  string — it stays server-side, which is what this code does. Don't check
  `.env` into git (it's covered by a standard Python `.gitignore`, but
  double-check before your first commit).
- **Streaming error handling**: once an HTTP response has started streaming,
  the server can't switch it to a 4xx/5xx — the code appends an `[error]`
  marker to the stream instead. The frontend currently just renders it as
  text; if you want a cleaner UX, detect that marker string in `ChatWindow.jsx`
  and render it as the error state instead of assistant text.
