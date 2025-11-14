// @ts-ignore
import * as zlib from "zlib"; // For bundlers that polyfill Node's zlib
// @ts-ignore
import * as ed25519 from "@noble/ed25519";
// @ts-ignore
import cbor from "cbor-web"; // Browser-compatible CBOR

// Seal interface
export interface Seal {
  amount: number;
  timestamp: Date;
  transactionReference: string;
  senderAccountNumber: string;
  senderName: string;
  senderBankCode: string;
  receiverAccountNumber: string;
  receiverName: string;
  receiverBankCode: string;
}

// Compact CBOR form
interface CSeal {
  x: number;
  t: number;
  r: string;
  s: string;
  n: string;
  k: string;
  d: string;
  o: string;
  l: string;
}

// Convert CSeal -> Seal
function csealToSeal(c: CSeal): Seal {
  return {
    amount: c.x / 100,
    timestamp: new Date(c.t * 1000),
    transactionReference: c.r,
    senderAccountNumber: c.s,
    senderName: c.n,
    senderBankCode: c.k,
    receiverAccountNumber: c.d,
    receiverName: c.o,
    receiverBankCode: c.l,
  };
}

/**
 * Load Ed25519 public key from PEM string (browser-friendly)
 */
export async function loadEd25519PublicKeyFromPem(
  pem: string
): Promise<Uint8Array> {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  // Last 32 bytes of SPKI PEM are raw Ed25519 public key
  return bytes.slice(-32);
}

// Self-contained unpack function
export async function unpackSeal(
  blob: Uint8Array,
  getPublicKey: () => Uint8Array
): Promise<Seal> {
  // 1. Decompress using zlib (bundler must polyfill for browser)
  let innerBytes: Uint8Array;
  try {
    innerBytes = zlib.inflateSync(blob);
  } catch {
    throw new Error("Decompression failed");
  }

  // 2. Parse envelope [msg, sig]
  const inner: any = cbor.decode(innerBytes);
  if (!Array.isArray(inner) || inner.length !== 2) {
    throw new Error("Malformed envelope");
  }

  const [msg, sig] = inner;

  // 3. Verify signature
  const isValid = await ed25519.verify(
    sig instanceof Uint8Array ? sig : new Uint8Array(sig),
    msg instanceof Uint8Array ? msg : new Uint8Array(msg),
    getPublicKey()
  );
  if (!isValid) {
    throw new Error("Signature verification failed");
  }

  // 4. Decode message -> CSeal
  const cseal: CSeal = cbor.decode(msg) as CSeal;

  // 5. Convert to Seal
  return csealToSeal(cseal);
}
