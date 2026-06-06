'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { send2FACodeEmail } from '@/lib/mail';

// Helper to hash password using PBKDF2
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Generate signed session cookie
function generateSessionCookie(email: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not configured');

  const expiry = Date.now() + 8 * 60 * 60 * 1000; // 8 hours session
  const payload = JSON.stringify({ email, expiry });
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

// Validate session cookie
export async function verifySession(): Promise<string | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('spartan_admin_session')?.value;
    if (!session) return null;

    const [base64Payload, signature] = session.split('.');
    if (!base64Payload || !signature) return null;

    const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf8');
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(payloadStr);
    if (payload.expiry < Date.now()) {
      return null; // Expired
    }

    return payload.email;
  } catch (e) {
    return null;
  }
}

export async function loginAdmin(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const db = await getDb();
    const adminsCol = db.collection('admins');

    // Auto-seed checking
    const count = await adminsCol.countDocuments();
    if (count === 0) {
      // Seed default admin
      const defaultEmail = 'lasith.jayawardana@spartan.supplements';
      const defaultPw = 'LAs+GEa20045';
      const salt = generateSalt();
      const passwordHash = hashPassword(defaultPw, salt);
      
      await adminsCol.insertOne({
        email: defaultEmail,
        passwordHash,
        salt,
        createdAt: new Date()
      });
    }

    // Authenticate user
    const normalizedEmail = email.toLowerCase().trim();
    const admin = await adminsCol.findOne({ email: normalizedEmail });

    if (!admin) {
      return { success: false, error: 'Invalid email or password' };
    }

    const computedHash = hashPassword(password, admin.salt);
    if (computedHash !== admin.passwordHash) {
      return { success: false, error: 'Invalid email or password' };
    }

    // 2FA Generation Phase
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Upsert the 2FA code in database
    const twoFactorCol = db.collection('two_factor_codes');
    await twoFactorCol.updateOne(
      { email: normalizedEmail },
      { $set: { code, expiresAt } },
      { upsert: true }
    );

    // Dispatch the 2FA email
    await send2FACodeEmail(code);

    return { success: true, requires2FA: true, email: normalizedEmail };
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'Database connection failed. Please ensure the cluster is accessible and your network/IP is whitelisted.' 
    };
  }
}

export async function verify2FACodeAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const code = formData.get('code') as string;

    if (!email || !code) {
      return { success: false, error: 'Verification code is missing' };
    }

    const db = await getDb();
    const twoFactorCol = db.collection('two_factor_codes');

    const normalizedEmail = email.toLowerCase().trim();
    const enteredCode = code.trim();

    // Query 2FA code from DB
    const record = await twoFactorCol.findOne({ email: normalizedEmail });

    if (!record) {
      return { success: false, error: 'No active verification code found. Please log in again.' };
    }

    if (record.code !== enteredCode) {
      return { success: false, error: 'Incorrect verification code. Please check your email.' };
    }

    if (new Date() > record.expiresAt) {
      return { success: false, error: 'Verification code has expired. Please log in again.' };
    }

    // Success: Clear 2FA record
    await twoFactorCol.deleteOne({ _id: record._id });

    // Set signed cookie session
    const token = generateSessionCookie(normalizedEmail);
    const cookieStore = await cookies();
    cookieStore.set('spartan_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/'
    });

    return { success: true, authenticated: true };
  } catch (error: any) {
    console.error('2FA Verification error:', error);
    return { success: false, error: 'System connection error during verification. Please try again.' };
  }
}

export async function logoutAdmin() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('spartan_admin_session');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to sign out' };
  }
}
