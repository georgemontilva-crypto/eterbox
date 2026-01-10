import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  GenerateRegistrationOptionsOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyRegistrationResponseOpts,
  VerifyAuthenticationResponseOpts,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/server';

// WebAuthn configuration
const RP_NAME = 'EterBox Security Vault';
const RP_ID = process.env.WEBAUTHN_RP_ID || 'localhost'; // Should be 'eterbox.com' in production
const ORIGIN = process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000'; // Should be 'https://eterbox.com' in production

export interface StoredAuthenticator {
  credentialID: string;
  credentialPublicKey: string;
  counter: number;
  transports?: string[];
}

/**
 * Generate registration options for a new biometric credential
 */
export async function generateBiometricRegistrationOptions(
  userId: number,
  userEmail: string,
  userName: string,
  existingAuthenticators: StoredAuthenticator[] = []
): Promise<ReturnType<typeof generateRegistrationOptions>> {
  const opts: GenerateRegistrationOptionsOpts = {
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: userEmail,
    userDisplayName: userName,
    timeout: 60000, // 60 seconds
    attestationType: 'none',
    excludeCredentials: existingAuthenticators.map(authenticator => ({
      id: authenticator.credentialID,
      transports: authenticator.transports as AuthenticatorTransport[],
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform', // Prefer platform authenticators (Face ID, Touch ID, Windows Hello)
    },
  };

  return generateRegistrationOptions(opts);
}

/**
 * Verify biometric registration response
 */
export async function verifyBiometricRegistration(
  response: RegistrationResponseJSON,
  expectedChallenge: string
): Promise<VerifiedRegistrationResponse> {
  const opts: VerifyRegistrationResponseOpts = {
    response,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
  };

  return verifyRegistrationResponse(opts);
}

/**
 * Generate authentication options for biometric login
 */
export async function generateBiometricAuthenticationOptions(
  authenticators: StoredAuthenticator[]
): Promise<ReturnType<typeof generateAuthenticationOptions>> {
  const opts: GenerateAuthenticationOptionsOpts = {
    timeout: 60000,
    allowCredentials: authenticators.map(authenticator => ({
      id: authenticator.credentialID,
      transports: authenticator.transports as AuthenticatorTransport[],
    })),
    userVerification: 'preferred',
    rpID: RP_ID,
  };

  return generateAuthenticationOptions(opts);
}

/**
 * Verify biometric authentication response
 */
export async function verifyBiometricAuthentication(
  response: AuthenticationResponseJSON,
  expectedChallenge: string,
  authenticator: StoredAuthenticator
): Promise<VerifiedAuthenticationResponse> {
  const opts: VerifyAuthenticationResponseOpts = {
    response,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
    credential: {
      id: authenticator.credentialID,
      publicKey: Buffer.from(authenticator.credentialPublicKey, 'base64'),
      counter: authenticator.counter,
    },
  };

  return verifyAuthenticationResponse(opts);
}

/**
 * Convert authenticator to storable format
 */
export function serializeAuthenticator(
  credentialID: Uint8Array,
  credentialPublicKey: Uint8Array,
  counter: number,
  transports?: string[]
): StoredAuthenticator {
  return {
    credentialID: Buffer.from(credentialID).toString('base64'),
    credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
    counter,
    transports,
  };
}
