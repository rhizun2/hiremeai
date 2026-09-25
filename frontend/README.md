# Deskfolio — frontend

A desktop-style portfolio (React + Vite) built on the Deskfolio design system. It talks to your existing FastAPI backend (`main.py`, **unchanged**) through `POST /chat`.

## What's in it

| Feature | Where |
|---|---|
| Wallpaper, menu bar with live clock, light/dark window toggle | `App.jsx`, `MenuBar.jsx` |
| Desktop icons: Resume.pdf + a folder per pinned project | `App.jsx` |
| Projects menu (menu bar dropdown, keyboard-navigable) | `MenuBar.jsx` |
| Dock with tooltips: Projects · Resume · Contact · Terminal · **Ask Me** | `Dock.jsx` |
| Draggable windows (close / minimise / focus), full-screen on phones | `Window.jsx` |
| **Ask Me** chat → your backend, starter questions, typing dots, safe markdown, "waking up" notice, clear-chat dialog, history kept for the tab session | `AskMe.jsx`, `api.js` |
| Projects window: categories, status filter, cards, detail view with GitHub/demo links and "Ask about this project" | `Projects.jsx` |
| Contact form with validation (opens the visitor's mail app — no backend needed) | `Contact.jsx` |
| Terminal: `help`, `whoami`, `skills`, `projects`, `open <id>`, `resume`, `contact`, `ask <q>` | `Terminal.jsx` |
| Notifications (top-right) | `Notifications.jsx` |

## 1. Run it locally

1. Start your backend as usual (port 8000), with `my_resume.pdf` next to `main.py`:
   `uvicorn main:app --port 8000`
2. In this folder:
   ```bash
   npm install
   npm run dev
   ```
3. Open http://localhost:5173. Vite forwards `/api/chat` → `http://127.0.0.1:8000/chat`, so **no CORS change is needed in main.py**.
   (Backend on another port? `BACKEND_URL=http://127.0.0.1:9000 npm run dev`.)

## 2. Put in your content

1. Edit **`src/data/profile.js`** — name, links, email, projects, skills, starter questions. This is the only file to touch when your resume changes.
2. Copy your resume to **`public/resume.pdf`** (the desktop icon, dock tile, menu link and terminal all open it).
3. Optional: add `image: '/projects/<id>.jpg'` to a project and drop the image in `public/projects/`.

## 3. Deploy

1. Deploy the backend (Render/Railway) and note its URL, e.g. `https://deskfolio-api.onrender.com`.
2. In **`vercel.json`**, replace `YOUR-BACKEND.onrender.com` with that host.
3. Import this folder into Vercel (framework: Vite). Vercel forwards `/api/*` to the backend, so the browser never makes a cross-origin call and the Groq key stays on the server.

## Notes on the current backend (not changed)

- Every `/chat` call re-reads the PDF and makes **two** Groq calls (parse + answer), so replies take several seconds and cost double. The UI allows up to 90 s and shows a "waking up" notice after 8 s.
- The backend is stateless: each question is answered on its own (no memory of earlier messages).
- `/chat` is public with no rate limit — anyone can spend your Groq quota. Adding a limit needs a backend change.
