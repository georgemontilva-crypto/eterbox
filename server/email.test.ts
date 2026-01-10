import { describe, it, expect } from 'vitest';
import { Resend } from 'resend';

describe('Resend Email Service', () => {
  it('should validate Resend API key', async () => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Test API key by attempting to get API keys (lightweight endpoint)
    try {
      // This will throw if API key is invalid
      const response = await resend.apiKeys.list();
      
      // If we get here, the API key is valid
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      
      console.log('✅ Resend API key is valid');
    } catch (error: any) {
      // If error is about permissions, key is still valid
      if (error.message?.includes('permission') || error.message?.includes('forbidden')) {
        console.log('✅ Resend API key is valid (permission check)');
        expect(true).toBe(true);
      } else {
        console.error('❌ Resend API key validation failed:', error.message);
        throw error;
      }
    }
  }, 10000); // 10 second timeout
});
