import { Router } from 'express';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendPasswordChangedEmail } from './email';

const router = Router();

/**
 * POST /api/auth/forgot-password
 * Request password reset - sends email with reset token
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return res.json({ 
        success: true, 
        message: 'If an account exists with this email, a password reset link has been sent.' 
      });
    }

    // Don't allow password reset for OAuth users
    if (user.loginMethod !== 'email') {
      return res.status(400).json({ 
        error: 'Password reset is not available for social login accounts.' 
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token to database
    await db.update(users)
      .set({
        resetToken,
        resetTokenExpiry,
      })
      .where(eq(users.id, user.id));

    // Send email
    try {
      await sendPasswordResetEmail(
        user.email,
        resetToken,
        user.name || 'User',
        user.language as 'en' | 'es' || 'en'
      );
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      return res.status(500).json({ 
        error: 'Failed to send password reset email. Please try again later.' 
      });
    }

    res.json({ 
      success: true, 
      message: 'If an account exists with this email, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/verify-reset-token
 * Verify if reset token is valid
 */
router.post('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Find user with this token
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    const [user] = await db.select().from(users)
      .where(eq(users.resetToken, token))
      .limit(1);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    res.json({ 
      success: true, 
      email: user.email,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error) {
    console.error('Error in verify-reset-token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with valid token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, twoFactorCode } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Find user with this token
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    const [user] = await db.select().from(users)
      .where(eq(users.resetToken, token))
      .limit(1);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // If 2FA is enabled, verify the code
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(400).json({ error: '2FA code is required' });
      }

      // Import speakeasy for 2FA verification
      const speakeasy = require('speakeasy');
      
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2,
      });

      if (!verified) {
        return res.status(400).json({ error: 'Invalid 2FA code' });
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await db.update(users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(users.id, user.id));

    // Send password changed notification email
    try {
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'Unknown';
      await sendPasswordChangedEmail(
        user.email,
        user.name || 'User',
        ipAddress,
        user.language as 'en' | 'es' || 'en'
      );
    } catch (emailError) {
      console.error('Error sending password changed email:', emailError);
      // Don't fail password reset if email fails
    }

    res.json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });
  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
