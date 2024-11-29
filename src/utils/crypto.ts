import CryptoJS from 'crypto-js';

export interface EncryptionResult {
  success: boolean;
  data?: string;
  error?: string;
}

export function encrypt(message: string, passphrase: string): EncryptionResult {
  try {
    const encrypted = CryptoJS.AES.encrypt(message, passphrase).toString();
    return {
      success: true,
      data: encrypted
    };
  } catch (error) {
    return {
      success: false,
      error: 'Encryption failed'
    };
  }
}

export function decrypt(encryptedMessage: string, passphrase: string): EncryptionResult {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, passphrase);
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!result) {
      return {
        success: false,
        error: 'Invalid passphrase or corrupted message'
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: 'Decryption failed'
    };
  }
}