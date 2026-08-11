/**
 * authService.js
 * ------------------------------------------------------------------
 * Simulates a backend authentication API.
 *
 * In a real system this whole file would instead be a `fetch('/api/login')`
 * call to a Node/Express (or any) server that:
 *   1. Looks up the user in a database
 *   2. Verifies the password (hashed, e.g. bcrypt)
 *   3. Signs a JWT with a server-only secret
 *   4. Returns the token to the client
 *
 * Here we mock steps 1-3 locally so the experiment can run standalone,
 * while still using a real HS256 signing routine (see utils/jwt.js).
 * ------------------------------------------------------------------
 */

import { signToken } from "../utils/jwt";

// Static / mock "user database"
const MOCK_USERS = [
  { id: 1, username: "admin", password: "admin123", name: "Admin User", role: "admin" },
  { id: 2, username: "manas", password: "manas123", name: "Manas Doshi", role: "student" },
];

// Simulates network latency like a real API call
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Attempt to log in with a username/password.
 * Returns { success, token?, user?, message? }
 */
export async function loginRequest(username, password) {
  await delay(600); // pretend this is a network round-trip

  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return { success: false, message: "Invalid username or password." };
  }

  const token = await signToken({
    sub: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  });

  return {
    success: true,
    token,
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
  };
}
