/**
 * A string hashing function that creates a deterministic
 * string hash using the Web Crypto API.
 *
 * @param text The text to hash
 * @returns A string hash that can be used as an ID
 */
export function stringHash(text: string): string {
  // Return a default value for empty strings
  if (text.length === 0) return 'h-0'

  // Use TextEncoder to convert the string to UTF-8 bytes
  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  // Constants for the FNV-1a hash algorithm:
  // FNV_PRIME: A prime number used to mix bits (16777619 in decimal)
  // FNV_OFFSET_BASIS: The initial hash value (2166136261 in decimal)
  const FNV_PRIME = 0x01000193
  const FNV_OFFSET_BASIS = 0x811c9dc5

  // This implements the FNV-1a hash algorithm, which:
  // 1. XORs each byte with the current hash value
  // 2. Multiplies by the FNV prime to mix bits
  // 3. Uses unsigned 32-bit integer arithmetic (>>> 0)
  const hash = [...data].reduce((h, byte) => {
    return ((h ^ byte) * FNV_PRIME) >>> 0 // Ensures 32-bit unsigned integer
  }, FNV_OFFSET_BASIS)

  // Base36 is used for alphanumeric representation (0-9, a-z)
  const BASE36 = 36

  // Use absolute value and convert to base36 string for shorter representation
  return `h-${Math.abs(hash).toString(BASE36)}`
}
