import crypto from "node:crypto"

function getKey() {
  const secret = process.env.ENCRYPTION_SECRET
  if (!secret) throw new Error("Missing ENCRYPTION_SECRET")
  const buf = Buffer.from(secret, "utf8")
  if (buf.length < 32) throw new Error("ENCRYPTION_SECRET must be at least 32 bytes")
  return buf.subarray(0, 32)
}

export function encryptString(plainText: string) {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const enc = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString("base64")}.${tag.toString("base64")}.${enc.toString("base64")}`
}

export function decryptString(payload: string) {
  const key = getKey()
  const [ivB64, tagB64, dataB64] = payload.split(".")
  if (!ivB64 || !tagB64 || !dataB64) throw new Error("Invalid encrypted payload")
  const iv = Buffer.from(ivB64, "base64")
  const tag = Buffer.from(tagB64, "base64")
  const data = Buffer.from(dataB64, "base64")
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(tag)
  const dec = Buffer.concat([decipher.update(data), decipher.final()])
  return dec.toString("utf8")
}

