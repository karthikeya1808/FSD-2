# Experiment 1.3.1 — Secure Authentication using JWT

A React application demonstrating stateless, token-based authentication with
JSON Web Tokens (JWT): login, token generation, client-side storage, protected
routes, and token decoding/validation.

## Project Structure

```
jwt-auth-experiment/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                 # App entry point (React Router setup)
    ├── App.jsx                  # Route definitions
    ├── index.css                # Styling
    ├── utils/
    │   └── jwt.js                # signToken / decodeToken / verifyToken (HMAC-SHA256)
    ├── services/
    │   └── authService.js        # Mock "backend" — validates credentials, issues JWT
    ├── context/
    │   └── AuthContext.jsx       # Global auth state, login/logout, session restore
    └── components/
        ├── Login.jsx             # Login form UI
        ├── Dashboard.jsx         # Protected page — shows decoded token
        └── ProtectedRoute.jsx    # Route guard, redirects to /login if unauthenticated
```

## How It Works (Conceptual Flow)

1. **User logs in** with a username/password on the `Login` form.
2. `authService.loginRequest()` simulates a server: it checks credentials
   against a mock user list (stand-in for a database lookup).
3. On success, `utils/jwt.js` **signs a real JWT** (header.payload.signature)
   using HMAC-SHA256 via the browser's Web Crypto API — the token has the
   same structure a real backend (Node/Express + `jsonwebtoken`, etc.) would
   produce.
4. The token is **stored in `localStorage`** on the client.
5. On every page load, `AuthContext` reads the stored token and calls
   `verifyToken()` to check the signature and expiry — this is what makes
   the session **stateless**: no server-side session store is consulted,
   the token alone proves identity.
6. `ProtectedRoute` guards `/dashboard`: if there's no valid token, the user
   is redirected to `/login`.
7. `Dashboard` decodes and displays the token's header/payload, and shows
   `authHeader()` — the pattern you'd use to attach
   `Authorization: Bearer <token>` to real API requests.
8. **Logout** simply clears the token from `localStorage` — there's nothing
   to invalidate server-side, which is both the strength (scalability) and
   the caveat (can't force-expire a token early) of stateless JWT auth.

## Demo Accounts (mock database, see `src/services/authService.js`)

| Username | Password  | Role    |
|----------|-----------|---------|
| admin    | admin123  | admin   |
| manas    | manas123  | student |

## Run Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later (includes npm)

### Steps

1. **Unzip** the project and open a terminal in the `jwt-auth-experiment` folder.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Vite will print a local URL, typically:
   ```
   http://localhost:5173
   ```
   Open it in your browser (it should also open automatically).

5. **Log in** using one of the demo accounts above (or click a demo-account
   button to auto-fill the form).

6. You'll land on `/dashboard`, a protected route, and can see:
   - The decoded JWT header and payload
   - The raw signed token
   - A logout button (clears the token and returns you to `/login`)

7. Try visiting `/dashboard` directly in a new tab **before** logging in —
   you'll be redirected to `/login`, demonstrating the route guard.

8. Try inspecting `localStorage` in your browser DevTools
   (Application tab → Local Storage) to see the raw JWT stored under
   `jwt_token`.

### Optional: production build
```bash
npm run build
npm run preview
```

## Important Security Note

This project **mocks the backend in the browser** for teaching purposes —
the signing secret lives in client-side code, which is fine for learning JWT
mechanics but is **never safe in production**. In a real system:

- Credential checking and JWT **signing** must happen only on a trusted
  **server**, with the secret kept server-side (env variable, secrets
  manager, etc.).
- The client only ever *receives* and *stores* the token, then sends it back
  via the `Authorization: Bearer <token>` header.
- The server independently **re-verifies** the signature (and expiry) on
  every protected request — a decoded-but-unverified token must never be
  trusted for authorization.
- Prefer `httpOnly` cookies over `localStorage` for token storage where
  XSS risk is a concern, and always use short expiry + refresh tokens for
  anything beyond a classroom demo.

## Expected Outcome (per experiment brief)

- ✅ User login system implemented
- ✅ Token-based session handling achieved (JWT generated, stored, decoded)
- ✅ Stateless authentication flow demonstrated (no server-side session,
  route access controlled purely by token validity)
