import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSupportTicketConfirmationTemplate, sendSupportTicketConfirmation } from './email';

describe('Support Ticket Email System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSupportTicketConfirmationTemplate', () => {
    it('should generate English template with correct content', () => {
      const template = getSupportTicketConfirmationTemplate(
        'John Doe',
        12345,
        'Cannot login to account',
        'en'
      );

      expect(template).toContain('Hello');
      expect(template).toContain('12345');
      expect(template).toContain('Cannot login');
      expect(template).toContain('Confirmation');
      expect(template).toContain('Thank you');
    });

    it('should generate Spanish template with correct content', () => {
      const template = getSupportTicketConfirmationTemplate(
        'Juan García',
        54321,
        'No puedo acceder a mi cuenta',
        'es'
      );

      expect(template).toContain('Hola');
      expect(template).toContain('54321');
      expect(template).toContain('No puedo acceder');
      expect(template).toContain('Confirmación');
      expect(template).toContain('Gracias');
    });

    it('should include HTML structure with proper styling', () => {
      const template = getSupportTicketConfirmationTemplate(
        'Test User',
        999,
        'Test Subject',
        'en'
      );

      expect(template).toContain('DOCTYPE');
      expect(template).toContain('html');
      expect(template).toContain('style');
      expect(template).toContain('table');
    });

    it('should include ticket information in a styled box', () => {
      const template = getSupportTicketConfirmationTemplate(
        'Test User',
        888,
        'Test Issue',
        'en'
      );

      expect(template).toContain('Ticket');
      expect(template).toContain('888');
      expect(template).toContain('Test Issue');
      expect(template).toContain('style');
    });



    it('should use correct language for all text elements', () => {
      const enTemplate = getSupportTicketConfirmationTemplate(
        'User',
        1,
        'Subject',
        'en'
      );
      const esTemplate = getSupportTicketConfirmationTemplate(
        'Usuario',
        1,
        'Asunto',
        'es'
      );

      expect(enTemplate.includes('Thank')).toBe(true);
      expect(esTemplate.includes('Gracias')).toBe(true);

      expect(enTemplate.includes('support')).toBe(true);
      expect(esTemplate.includes('soporte')).toBe(true);

      expect(enTemplate.includes('24')).toBe(true);
      expect(esTemplate.includes('24')).toBe(true);
    });
        it('should include support response time information', () => {
      const template = getSupportTicketConfirmationTemplate(
        'Test',
        1,
        'Test',
        'en'
      );

      expect(template.includes('24')).toBe(true);
      expect(template.includes('hours')).toBe(true);
    });    it('should have proper email structure with header and footer', () => {
      const template = getSupportTicketConfirmationTemplate(
        'Test',
        1,
        'Test',
        'en'
      );

      expect(template.includes('📋')).toBe(true);
      expect(template.includes('EterBox')).toBe(true);
      expect(template.includes('html')).toBe(true);
    });
  });

  describe('sendSupportTicketConfirmation', () => {
    it('should be a function', () => {
      expect(typeof sendSupportTicketConfirmation).toBe('function');
    });



    it('should be available in both languages', () => {
      const enTemplate = getSupportTicketConfirmationTemplate(
        'Test',
        1,
        'Test',
        'en'
      );
      const esTemplate = getSupportTicketConfirmationTemplate(
        'Test',
        1,
        'Test',
        'es'
      );

      expect(enTemplate).toBeDefined();
      expect(esTemplate).toBeDefined();
      expect(enTemplate.length > 500).toBe(true);
      expect(esTemplate.length > 500).toBe(true);
    });
  });

  describe('Support Ticket Email Validation', () => {
    it('should properly format ticket ID in template', () => {
      const ticketId = 123456;
      const template = getSupportTicketConfirmationTemplate(
        'User',
        ticketId,
        'Subject',
        'en'
      );

      expect(template).toContain(`#${ticketId}`);
      expect(template).toContain('Ticket');
    });



    it('should include footer text in both languages', () => {
      const enTemplate = getSupportTicketConfirmationTemplate(
        'User',
        1,
        'Subject',
        'en'
      );
      const esTemplate = getSupportTicketConfirmationTemplate(
        'User',
        1,
        'Subject',
        'es'
      );

      expect(enTemplate.length > 100).toBe(true);
      expect(esTemplate.length > 100).toBe(true);
      expect(enTemplate.includes('EterBox')).toBe(true);
      expect(esTemplate.includes('EterBox')).toBe(true);
    });

    it('should have responsive design meta tags', () => {
      const template = getSupportTicketConfirmationTemplate(
        'User',
        1,
        'Subject',
        'en'
      );

      expect(template.includes('viewport')).toBe(true);
      expect(template.includes('width')).toBe(true);
      expect(template.includes('UTF-8')).toBe(true);
    });

    it('should use dark theme colors consistent with EterBox branding', () => {
      const template = getSupportTicketConfirmationTemplate(
        'User',
        1,
        'Subject',
        'en'
      );

      expect(template.includes('0a0a0a')).toBe(true); // Dark
      expect(template.includes('3b82f6')).toBe(true); // Blue
      expect(template.includes('e5e5e5')).toBe(true); // Light
    });
  });
});
