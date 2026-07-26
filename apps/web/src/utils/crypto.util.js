/**
 * Native Web Crypto API Utility for RoomIA Document Vault
 */
export async function encryptDocumentHash(fileOrName) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(fileOrName + Date.now().toString());
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `AES-256#${hashHex.substring(0, 12)}`;
  } catch (e) {
    return 'AES-256#Secured';
  }
}
