import nodemailer from 'nodemailer';

export async function send2FACodeEmail(code: string): Promise<boolean> {
  const targetEmail = 'lasithjayawardana4@gmail.com';
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log(`\n==================================================`);
  console.log(`[DEVELOPMENT 2FA CODE] Target: ${targetEmail}`);
  console.log(`CODE: ${code}`);
  console.log(`==================================================\n`);

  if (!user || !pass) {
    console.warn('SMTP credentials (SMTP_USER / SMTP_PASS) are not configured in .env.local. Logging 2FA code to console only.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"Spartan Armory Security" <${user}>`,
      to: targetEmail,
      subject: 'Your Spartan Armory Admin 2FA Code',
      text: `Your 6-digit verification code is: ${code}\n\nThis code will expire in 10 minutes. If you did not request this code, please ignore this email.`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #1a1a1a; background-color: #000000; color: #ffffff; border-radius: 8px;">
          <div style="text-align: center; border-bottom: 1px solid #B30000; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #D4AF37; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Spartan Armory</h2>
            <p style="color: #B30000; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Admin Security Terminal</p>
          </div>
          <p style="font-size: 14px; color: #a0a0a0; line-height: 1.5;">
            A login request was received for the Spartan Armory Admin Panel. Please use the following 6-digit verification code to complete your authentication:
          </p>
          <div style="text-align: center; margin: 30px 0; background: #0a0a0a; border: 1px solid #B30000; padding: 15px; border-radius: 6px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ffffff;">${code}</span>
          </div>
          <p style="font-size: 11px; color: #606060; text-align: center; margin-top: 25px; border-top: 1px solid #111111; padding-top: 15px;">
            This code is valid for 10 minutes. &bull; Secure System &bull; Authorized Access Only
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`2FA email successfully sent to ${targetEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send 2FA email via SMTP:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Generate reset link
  // Use header-derived origin in production if available, fallback to localhost:3000
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetLink = `${origin}/reset-password?token=${token}`;

  console.log(`\n==================================================`);
  console.log(`[PASSWORD RESET] Target: ${email}`);
  console.log(`TOKEN: ${token}`);
  console.log(`RESET LINK: ${resetLink}`);
  console.log(`==================================================\n`);

  if (!user || !pass) {
    console.warn('SMTP credentials (SMTP_USER / SMTP_PASS) are not configured in .env.local. Logging reset link to console only.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"Spartan Supplements Security" <${user}>`,
      to: email,
      subject: 'Reset Your Spartan Supplements Password',
      text: `To reset your password, please click the following link or copy and paste it into your browser:\n\n${resetLink}\n\nThis link will expire in 1 hour. If you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #1a1a1a; background-color: #000000; color: #ffffff; border-radius: 8px;">
          <div style="text-align: center; border-bottom: 1px solid #B30000; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #D4AF37; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Spartan Supplements</h2>
            <p style="color: #B30000; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Password Recovery</p>
          </div>
          <p style="font-size: 14px; color: #a0a0a0; line-height: 1.5;">
            You requested a password reset for your Spartan Supplements customer account. Click the button below to set a new password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background-color: #B30000; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 4px; border: 1px solid #D4AF37; text-transform: uppercase; letter-spacing: 1px;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 12px; color: #a0a0a0; line-height: 1.5; text-align: center;">
            Or copy and paste this link in your browser:<br/>
            <a href="${resetLink}" style="color: #D4AF37; word-break: break-all;">${resetLink}</a>
          </p>
          <p style="font-size: 11px; color: #606060; text-align: center; margin-top: 25px; border-top: 1px solid #111111; padding-top: 15px;">
            This link is valid for 1 hour. &bull; Secure Authentication &bull; Spartan Supplements
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email successfully sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email via SMTP:', error);
    return false;
  }
}

