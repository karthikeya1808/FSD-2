/**
 * jwt.js
 * ------------------------------------------------------------------
 * A small, dependency-free JWT implementation for teaching purposes.
 *
 * A real JWT has 3 parts, separated by dots:
 *   header.payload.signature
 *
 * - Header    -> algorithm + token type (base64url JSON)
 * - Payload   -> claims / user data (base64url JSON)
 * - Signature -> HMAC-SHA256(header + "." + payload, SECRET)
 *
 * This file uses the browser's built-in Web Crypto API (crypto.subtle)
 * to produce a REAL HMAC-SHA256 signature, so the token is structurally
 * and cryptographically a genuine JWT (RFC 7519 shape). The only thing
 * that makes it "mock" is that the secret lives in the frontend bundle
 * instead of a real backend - in production, signing/verifying MUST
 * happen only on a trusted server.
 * ------------------------------------------------------------------
 */

// NEVER do this in production. A secret in client-side code is not a
// secret. This exists only so the whole flow can run without a backend.
const MOCK_SECRET = "experiment-1.3.1-mock-secret-key";

// ---------- base64url helpers ----------

function base64urlEncode(str) {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return decodeURIComponent(escape(atob(base64)));
}

// ---------- HMAC-SHA256 via Web Crypto ----------

async function hmacSha256(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const bytes = new Uint8Array(signatureBuffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ---------- Public API ----------

/**
 * Create (sign) a JWT.
 * @param {object} payload - claims to embed, e.g. { sub, name, role }
 * @param {number} expiresInSeconds - token lifetime (default 15 min)
 */
export async function signToken(payload, expiresInSeconds = 15 * 60) {
  const header = { alg: "HS256", typ: "JWT" };

  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now, // issued-at
    exp: now + expiresInSeconds, // expiry
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));
  const signature = await hmacSha256(`${encodedHeader}.${encodedPayload}`, MOCK_SECRET);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Decode a JWT WITHOUT verifying the signature.
 * Useful on the client just to read claims (e.g. show username in navbar).
 * Never trust decoded-only data for authorization decisions.
 */
export function decodeToken(token) {
  try {
    const [encodedHeader, encodedPayload] = token.split(".");
    return {
      header: JSON.parse(base64urlDecode(encodedHeader)),
      payload: JSON.parse(base64urlDecode(encodedPayload)),
    };
  } catch (err) {
    return null;
  }
}

/**
 * Verify a JWT's signature AND expiry.
 * Returns { valid: boolean, payload?: object, reason?: string }
 */
export async function verifyToken(token) {
  if (!token || token.split(".").length !== 3) {
    return { valid: false, reason: "Malformed token" };
  }

  const [encodedHeader, encodedPayload, signature] = token.split(".");

  const expectedSignature = await hmacSha256(`${encodedHeader}.${encodedPayload}`, MOCK_SECRET);
  if (expectedSignature !== signature) {
    return { valid: false, reason: "Invalid signature" };
  }

  const payload = JSON.parse(base64urlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now > payload.exp) {
    return { valid: false, reason: "Token expired" };
  }

  return { valid: true, payload };
}
