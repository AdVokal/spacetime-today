const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;

async function deriveKey(userId: string): Promise<CryptoKey> {
  const secret = process.env.NEXTAUTH_SECRET!;
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    "HKDF",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new TextEncoder().encode(userId),
      info: new TextEncoder().encode("drawing-v1"),
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(plaintext: string, userId: string): Promise<{ ciphertext: string; iv: string }> {
  const key = await deriveKey(userId);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const encrypted = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded);
  return {
    ciphertext: Buffer.from(encrypted).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
  };
}

export async function decrypt(ciphertext: string, iv: string, userId: string): Promise<string> {
  const key = await deriveKey(userId);
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: Buffer.from(iv, "base64") },
    key,
    Buffer.from(ciphertext, "base64")
  );
  return new TextDecoder().decode(decrypted);
}
