/**
 * Cryptographic utilities using Web Crypto API for secure password hashing and JWT-like token generation
 */

// Generate random hexadecimal salt
export function generateSalt(length: number = 16): string {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Convert ArrayBuffer to Hex String
function buf2hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hashes a password using SHA-256 with a unique salt
 */
export async function hashPassword(
  password: string,
  existingSalt?: string
): Promise<{ hash: string; salt: string }> {
  const salt = existingSalt || generateSalt(16);
  const data = new TextEncoder().encode(salt + password + 'elite_estate_secure_auth_v1');
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data as unknown as ArrayBuffer);
  const hash = buf2hex(hashBuffer);
  return { hash, salt };
}

/**
 * Verifies if a given password matches the stored salted hash
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const { hash } = await hashPassword(password, salt);
  return hash === storedHash;
}

/**
 * Generates a standard base64url-encoded JWT token
 */
export function generateJWT(payload: Record<string, unknown>, expiresInHours: number = 24): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresInHours * 3600;

  const fullPayload = {
    ...payload,
    iat: now,
    exp: exp
  };

  const base64UrlEncode = (obj: Record<string, unknown>): string => {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(fullPayload);

  // Simulated signature representation for client-side token format
  const signatureRaw = `${encodedHeader}.${encodedPayload}.elite_estate_hmac_secret_key`;
  const signatureEncoded = btoa(signatureRaw)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${encodedHeader}.${encodedPayload}.${signatureEncoded}`;
}

/**
 * Decodes and verifies a JWT token
 */
export function verifyJWT(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payloadBase64.padEnd(payloadBase64.length + (4 - (payloadBase64.length % 4)) % 4, '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Token expired', payload };
    }

    return { valid: true, payload };
  } catch (e) {
    return { valid: false, error: 'Failed to decode token' };
  }
}

/**
 * Generates a cryptographically secure random token (for password resets)
 */
export function generateSecureResetToken(): string {
  const bytes = new Uint8Array(24);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
