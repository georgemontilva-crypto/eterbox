import { describe, it, expect } from 'vitest';
import { Resend } from 'resend';

describe('Resend Email Service', () => {
  it('should have valid RESEND_API_KEY configured', async () => {
    const apiKey = process.env.RESEND_API_KEY;
    
    // Check that API key exists
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe('');
    
    // Check that API key has correct format (starts with re_)
    expect(apiKey?.startsWith('re_')).toBe(true);
    
    // Validate API key length (Resend keys are typically 40+ characters)
    expect(apiKey!.length).toBeGreaterThan(30);
  });

  it('should be able to initialize Resend client', () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(() => new Resend(apiKey)).not.toThrow();
  });
});
