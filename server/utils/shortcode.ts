import { customAlphabet } from 'nanoid';

// Generate a short, URL-safe code
// Using alphanumeric characters (excluding similar looking ones like 0/O, 1/l/I)
const nanoid = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz', 8);

export function generateShortCode(): string {
  return nanoid();
}
