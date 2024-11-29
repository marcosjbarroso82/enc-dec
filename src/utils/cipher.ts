// Simple XOR cipher implementation
export function xorCipher(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(textChar ^ keyChar);
  }
  return result;
}

export function encode(text: string, key: string): string {
  const encrypted = xorCipher(text, key);
  return btoa(encrypted);
}

export function decode(encoded: string, key: string): string {
  try {
    const decoded = atob(encoded);
    return xorCipher(decoded, key);
  } catch {
    return 'Invalid encoded message';
  }
}