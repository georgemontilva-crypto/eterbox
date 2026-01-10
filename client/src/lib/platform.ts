/**
 * Platform detection utility for biometric authentication
 */

export type BiometricType = 'faceId' | 'touchId' | 'fingerprint' | 'biometric';
export type Platform = 'ios' | 'android' | 'desktop';

/**
 * Detect the current platform
 */
export function detectPlatform(): Platform {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios';
  }
  
  // Android detection
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  
  return 'desktop';
}

/**
 * Get the biometric type name based on platform
 */
export function getBiometricTypeName(platform: Platform): string {
  switch (platform) {
    case 'ios':
      return 'Face ID';
    case 'android':
      return 'Fingerprint';
    case 'desktop':
      return 'Biometric';
    default:
      return 'Biometric';
  }
}

/**
 * Get the biometric description based on platform
 */
export function getBiometricDescription(platform: Platform): string {
  switch (platform) {
    case 'ios':
      return 'Use Face ID to securely access your account';
    case 'android':
      return 'Use your fingerprint to securely access your account';
    case 'desktop':
      return 'Use your fingerprint or Face ID to securely access your account';
    default:
      return 'Use biometric authentication to securely access your account';
  }
}

/**
 * Check if the device likely supports biometric authentication
 */
export async function checkBiometricSupport(): Promise<boolean> {
  // Check if WebAuthn is available
  if (!window.PublicKeyCredential) {
    return false;
  }
  
  try {
    // Check if platform authenticator is available
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (error) {
    console.error('[Platform] Error checking biometric support:', error);
    return false;
  }
}
