import zxcvbn from 'zxcvbn';

export interface PasswordStrength {
  score: number; // 0-4 (0: too guessable, 4: very unguessable)
  feedback: {
    warning: string;
    suggestions: string[];
  };
  crackTimesDisplay: {
    onlineThrottling100PerHour: string;
    onlineNoThrottling10PerSecond: string;
    offlineSlowHashing1e4PerSecond: string;
    offlineFastHashing1e10PerSecond: string;
  };
  isStrong: boolean; // score >= 3
}

/**
 * Validate password strength using zxcvbn
 * @param password - The password to validate
 * @param userInputs - Optional array of user-specific strings (email, name, etc.)
 * @returns Password strength analysis
 */
export function validatePasswordStrength(
  password: string,
  userInputs?: string[]
): PasswordStrength {
  const result = zxcvbn(password, userInputs);
  
  return {
    score: result.score,
    feedback: {
      warning: result.feedback.warning || '',
      suggestions: result.feedback.suggestions || [],
    },
    crackTimesDisplay: {
      onlineThrottling100PerHour: String(result.crack_times_display.online_throttling_100_per_hour),
      onlineNoThrottling10PerSecond: String(result.crack_times_display.online_no_throttling_10_per_second),
      offlineSlowHashing1e4PerSecond: String(result.crack_times_display.offline_slow_hashing_1e4_per_second),
      offlineFastHashing1e10PerSecond: String(result.crack_times_display.offline_fast_hashing_1e10_per_second),
    },
    isStrong: result.score >= 3, // Require score of 3 or 4
  };
}

/**
 * Check if password meets minimum strength requirements
 * @param password - The password to check
 * @param userInputs - Optional array of user-specific strings
 * @returns true if password is strong enough (score >= 3)
 */
export function isPasswordStrong(password: string, userInputs?: string[]): boolean {
  const result = validatePasswordStrength(password, userInputs);
  return result.isStrong;
}

/**
 * Get password strength score (0-4)
 * @param password - The password to check
 * @param userInputs - Optional array of user-specific strings
 * @returns Score from 0 (weak) to 4 (strong)
 */
export function getPasswordScore(password: string, userInputs?: string[]): number {
  const result = validatePasswordStrength(password, userInputs);
  return result.score;
}
