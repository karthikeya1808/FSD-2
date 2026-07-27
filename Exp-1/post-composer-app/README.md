# Wire Desk — Post Composer
### Unit 1 · Experiment 1 — Post Composer with Platform Validation & Draft Management

A React (Vite) frontend module for composing social media posts with
platform-specific character limits, live validation, platform selection,
and full draft CRUD (save / retrieve / edit / delete), plus a simulated
backend publish call.

---

## 1. What's inside

```
post-composer-app/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                 # React entry point
    ├── App.jsx / App.css        # Layout: masthead + composer + draft list
    ├── index.css                # Design tokens (color, type, spacing)
    │
    ├── config/
    │   └── platforms.js         # STRATEGY PATTERN: one config object per
    │                             # platform (Twitter/X, LinkedIn, Instagram)
    │                             # holding char limits, hashtag/media caps
    │
    ├── utils/
    │   └── validation.js        # Pure functions: validatePost(),
    │                             # validatePostForPlatforms(), hashtag/mention
    │                             # extraction — the validation "engine"
    │
    ├── hooks/
    │   ├── useLocalStorage.js   # Generic persistence hook
    │   ├── useDrafts.js         # FACTORY PATTERN (createDraft) + CRUD ops
    │   └── usePostValidation.js # Live validation across selected platforms
    │
    ├── services/
    │   └── postService.js       # Simulated backend publish() with fake
    │                             # latency + randomized failure
    │
    └── components/
        ├── PostComposer.jsx     # Controlled form: textarea, platforms,
        │                         # media stepper, save/publish actions
        ├── PlatformSelector.jsx # Multi-select platform chips
        ├── CharacterCounter.jsx # Live per-platform char budget readout
        ├── DraftList.jsx        # "The wire" — list of saved drafts
        ├── DraftItem.jsx        # Single draft card (edit/delete)
        └── Toast.jsx            # Save/publish feedback notification
```

### Concepts demonstrated
- **Controlled components** — every input (textarea, platform chips, media
  stepper) is driven entirely by React state in `PostComposer.jsx`.
- **Custom hooks** — `useDrafts`, `usePostValidation`, `useLocalStorage`
  extract reusable logic out of components.
- **Strategy pattern** — `config/platforms.js` centralizes all
  platform-specific rules so validation code never branches on
  `if (platform === '...')`.
- **Factory pattern** — `createDraft()` inside `useDrafts.js` is the single
  place draft objects are constructed, guaranteeing a consistent shape.
- **Simulated backend interaction** — `services/postService.js` mimics a
  real API call (latency + occasional failure) without needing a server.

---

## 2. Prerequisites

- **Node.js 18+** (Node 20 LTS recommended)
- **npm 9+** (ships with Node)

Check your versions:
```bash
node -v
npm -v
```

---

## 3. Setup & run

1. Unzip the project and move into the folder:
   ```bash
   unzip post-composer-app.zip
   cd post-composer-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open the printed URL — by default:
   ```
   http://localhost:5173
   ```

The app hot-reloads as you edit files under `src/`.

---

## 4. Other scripts

| Command           | What it does                                      |
|--------------------|----------------------------------------------------|
| `npm run dev`       | Start the local dev server with hot reload         |
| `npm run build`     | Produce an optimized production build in `dist/`   |
| `npm run preview`   | Serve the `dist/` build locally to sanity-check it |

---

## 5. Using the app

1. **Write your post** in the message box.
2. **Pick one or more platforms** (X/Twitter, LinkedIn, Instagram) — each
   has its own character limit, hashtag ceiling, and media rules.
3. Watch the **live character counters** per selected platform; the bar
   turns amber near the limit and red once you exceed it.
4. Adjust the **attachment stepper** to simulate staged media (Instagram
   requires at least one attachment).
5. Click **Save Draft** to file the post under "The Wire" (persisted to
   `localStorage`, so drafts survive a page refresh).
6. Click **Edit** on any draft to load it back into the composer, or
   **Delete** to remove it.
7. Click **Publish** (enabled only once the post is valid for every
   selected platform) to simulate sending it to the backend. This has a
   short delay and occasionally simulates a failure so you can see both
   the success and error toast states.

---

## 6. Data persistence note

This experiment is **frontend-only**. Drafts are stored in the browser's
`localStorage` under the key `wire-desk:drafts`, and "publishing" is
simulated in `services/postService.js` rather than hitting a real server.
To connect this to a real backend later, replace the internals of
`publishPost()` (and optionally swap `useLocalStorage` for API calls) —
no other component needs to change, since all persistence and network
logic is already isolated behind those two modules.

---

## 7. Troubleshooting

- **Port 5173 already in use** — run `npm run dev -- --port 5174` (or any
  free port).
- **Blank page / module errors** — delete `node_modules` and the
  `package-lock.json`, then re-run `npm install`.
- **Drafts not saving** — check that your browser allows `localStorage`
  for `localhost` (private/incognito windows sometimes block it).
