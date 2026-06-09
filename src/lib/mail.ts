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

// ─────────────────────────────────────────────────────────────────────────────
// ORDER NOTIFICATION EMAILS
// ─────────────────────────────────────────────────────────────────────────────

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderEmailData {
  orderId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethod: 'cod' | 'card';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  promoCode?: string;
  discountAmount?: number;
}

function createOrderTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodemailer = require('nodemailer');
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

/** Sends a full order + customer details notification to the store admin. */
export async function sendAdminOrderNotification(order: OrderEmailData): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const senderEmail = process.env.SMTP_USER;
  if (!adminEmail || !senderEmail) {
    console.warn('[ORDER EMAIL] ADMIN_EMAIL or SMTP_USER not set — skipping admin notification.');
    return false;
  }
  const transporter = createOrderTransporter();
  if (!transporter) return false;

  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #1e1e1e;color:#d0d0d0;font-size:13px;">${item.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #1e1e1e;color:#d0d0d0;font-size:13px;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #1e1e1e;color:#d0d0d0;font-size:13px;text-align:right;">Rs. ${item.price.toLocaleString()}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #1e1e1e;color:#ffffff;font-size:13px;text-align:right;font-weight:bold;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>`).join('');

  const html = `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#0a0a0a;color:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #1e1e1e;">
  <div style="background:linear-gradient(135deg,#1a0000,#2d0000);padding:28px 32px;border-bottom:2px solid #B30000;">
    <h1 style="margin:0;font-size:22px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#D4AF37;">&#9876; SPARTAN SUPPLEMENTS</h1>
    <p style="margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#B30000;">New Order Alert — Admin Notification</p>
  </div>
  <div style="background:#111111;padding:14px 32px;border-bottom:1px solid #1e1e1e;">
    <span style="font-size:12px;color:#808080;text-transform:uppercase;letter-spacing:1px;">Order ID: </span>
    <span style="font-size:18px;font-weight:900;color:#D4AF37;letter-spacing:2px;">${order.orderId}</span>
  </div>
  <div style="padding:28px 32px;">
    <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#B30000;margin:0 0 14px;padding-bottom:8px;border-bottom:1px solid #1e1e1e;">Customer Details</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:6px 0;width:40%;color:#808080;font-size:13px;">Full Name</td><td style="padding:6px 0;color:#ffffff;font-size:13px;font-weight:600;">${order.fullName}</td></tr>
      <tr><td style="padding:6px 0;color:#808080;font-size:13px;">Email</td><td style="padding:6px 0;font-size:13px;"><a href="mailto:${order.email}" style="color:#D4AF37;">${order.email}</a></td></tr>
      <tr><td style="padding:6px 0;color:#808080;font-size:13px;">Phone</td><td style="padding:6px 0;color:#ffffff;font-size:13px;">${order.phone}</td></tr>
      <tr><td style="padding:6px 0;color:#808080;font-size:13px;">Delivery Address</td><td style="padding:6px 0;color:#ffffff;font-size:13px;">${order.address}, ${order.city}</td></tr>
      <tr><td style="padding:6px 0;color:#808080;font-size:13px;">Payment</td><td style="padding:6px 0;font-size:13px;"><span style="background:${order.paymentMethod === 'cod' ? '#B30000' : '#1a472a'};color:#fff;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card / Online'}</span></td></tr>
      ${order.notes ? `<tr><td style="padding:6px 0;color:#808080;font-size:13px;">Notes</td><td style="padding:6px 0;color:#a0a0a0;font-size:13px;font-style:italic;">${order.notes}</td></tr>` : ''}
    </table>
    <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#B30000;margin:0 0 14px;padding-bottom:8px;border-bottom:1px solid #1e1e1e;">Order Items</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #1e1e1e;border-radius:6px;overflow:hidden;">
      <thead><tr style="background:#141414;">
        <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#606060;">Product</th>
        <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;color:#606060;">Qty</th>
        <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:#606060;">Unit Price</th>
        <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:#606060;">Line Total</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div style="background:#111111;border:1px solid #1e1e1e;border-radius:6px;padding:16px 20px;">
      <div style="display:flex;justify-content:space-between;padding:5px 0;color:#808080;font-size:13px;"><span>Subtotal</span><span>Rs. ${order.subtotal.toLocaleString()}</span></div>
      ${order.discountAmount ? `<div style="display:flex;justify-content:space-between;padding:5px 0;color:#ef4444;font-size:13px;"><span>Discount (${order.promoCode})</span><span>-Rs. ${order.discountAmount.toLocaleString()}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:5px 0;color:#808080;font-size:13px;"><span>Shipping</span><span>${order.shipping === 0 ? '<span style="color:#22c55e;font-weight:700;">FREE</span>' : `Rs. ${order.shipping.toLocaleString()}`}</span></div>
      <div style="display:flex;justify-content:space-between;padding:10px 0 0;border-top:1px solid #1e1e1e;margin-top:8px;font-size:15px;font-weight:900;"><span style="color:#ffffff;">ORDER TOTAL</span><span style="color:#D4AF37;">Rs. ${order.total.toLocaleString()}</span></div>
    </div>
  </div>
  <div style="background:#050505;padding:16px 32px;border-top:1px solid #1e1e1e;text-align:center;">
    <p style="margin:0;font-size:11px;color:#404040;letter-spacing:1px;">SPARTAN SUPPLEMENTS — ADMIN SYSTEM</p>
  </div>
</div>`;

  try {
    await transporter.sendMail({
      from: `"Spartan Supplements Orders" <${senderEmail}>`,
      to: adminEmail,
      subject: `🛒 New Order #${order.orderId} — ${order.fullName} (Rs. ${order.total.toLocaleString()})`,
      html,
      text: `New Order #${order.orderId}\nCustomer: ${order.fullName} | ${order.email} | ${order.phone}\nAddress: ${order.address}, ${order.city}\nPayment: ${order.paymentMethod}\nTotal: Rs. ${order.total.toLocaleString()}`
    });
    console.log(`[ORDER EMAIL] Admin notification sent for order ${order.orderId}`);
    return true;
  } catch (err) {
    console.error('[ORDER EMAIL] Failed to send admin notification:', err);
    return false;
  }
}

/** Sends an order confirmation + itemised quotation + delivery estimate to the customer. */
export async function sendCustomerOrderConfirmation(order: OrderEmailData): Promise<boolean> {
  const senderEmail = process.env.SMTP_USER;
  if (!senderEmail) return false;
  const transporter = createOrderTransporter();
  if (!transporter) return false;

  // Calculate 2–5 working-day delivery window
  const addWorkingDays = (base: Date, days: number): Date => {
    let count = 0;
    const d = new Date(base);
    while (count < days) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) count++;
    }
    return d;
  };
  const today = new Date();
  const earliest = addWorkingDays(today, 2);
  const latest   = addWorkingDays(today, 5);
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:12px 14px;border-bottom:1px solid #1e1e1e;color:#d0d0d0;font-size:13px;">${item.name}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #1e1e1e;color:#d0d0d0;font-size:13px;text-align:center;">${item.quantity}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #1e1e1e;color:#d0d0d0;font-size:13px;text-align:right;">Rs. ${item.price.toLocaleString()}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #1e1e1e;color:#ffffff;font-size:13px;text-align:right;font-weight:700;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>`).join('');

  const html = `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#0a0a0a;color:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #1e1e1e;">
  <div style="background:linear-gradient(135deg,#1a0000,#2d0000);padding:32px;text-align:center;border-bottom:2px solid #B30000;">
    <h1 style="margin:0;font-size:26px;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:#D4AF37;">&#9876; SPARTAN SUPPLEMENTS</h1>
    <p style="margin:8px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#B30000;">Order Confirmation &amp; Quotation</p>
  </div>
  <div style="padding:28px 32px 0;">
    <p style="font-size:15px;color:#e0e0e0;margin:0 0 6px;">Hi <strong style="color:#ffffff;">${order.fullName}</strong>,</p>
    <p style="font-size:14px;color:#a0a0a0;line-height:1.7;margin:0;">Thank you for your order! We have received your request and our team is preparing your supplements. Below is your official quotation and delivery details.</p>
  </div>
  <div style="margin:24px 32px 0;background:#111111;border:1px solid #1e1e1e;border-radius:8px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <p style="margin:0;font-size:11px;color:#606060;text-transform:uppercase;letter-spacing:1px;">Order Reference</p>
      <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#D4AF37;letter-spacing:2px;">${order.orderId}</p>
    </div>
    <span style="background:#1a472a;color:#4ade80;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">&#10003; Confirmed</span>
  </div>
  <div style="padding:24px 32px;">
    <div style="background:linear-gradient(135deg,#0f1a0f,#0a1a0a);border:1px solid #1e3a1e;border-radius:8px;padding:20px;margin-bottom:24px;">
      <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4ade80;margin:0 0 12px;">Estimated Delivery Window</h2>
      <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#ffffff;">${fmt(earliest)} &mdash; ${fmt(latest)}</p>
      <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">Your order will be delivered within <strong style="color:#4ade80;">2&ndash;5 working days</strong>. Our courier will contact you before arrival at <strong style="color:#d0d0d0;">${order.address}, ${order.city}</strong>.</p>
    </div>
    <div style="background:#111111;border:1px solid #1e1e1e;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#B30000;margin:0 0 10px;">Payment Method</h2>
      <span style="background:${order.paymentMethod === 'cod' ? '#B30000' : '#1a472a'};color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card / Online Payment'}</span>
      ${order.paymentMethod === 'cod'
        ? `<p style="margin:10px 0 0;font-size:12px;color:#808080;">Please prepare <strong style="color:#ffffff;">Rs. ${order.total.toLocaleString()}</strong> in cash for our courier agent upon delivery.</p>`
        : `<p style="margin:10px 0 0;font-size:12px;color:#4ade80;font-weight:600;">&#10003; Payment received. Your order is cleared for dispatch.</p>`}
    </div>
    <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#B30000;margin:0 0 14px;padding-bottom:8px;border-bottom:1px solid #1e1e1e;">Quotation Summary</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border:1px solid #1e1e1e;border-radius:6px;overflow:hidden;">
      <thead><tr style="background:#141414;">
        <th style="padding:10px 14px;text-align:left;font-size:11px;text-transform:uppercase;color:#606060;">Product</th>
        <th style="padding:10px 14px;text-align:center;font-size:11px;text-transform:uppercase;color:#606060;">Qty</th>
        <th style="padding:10px 14px;text-align:right;font-size:11px;text-transform:uppercase;color:#606060;">Unit Price</th>
        <th style="padding:10px 14px;text-align:right;font-size:11px;text-transform:uppercase;color:#606060;">Amount</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div style="background:#111111;border:1px solid #1e1e1e;border-radius:6px;padding:16px 20px;margin-bottom:28px;">
      <div style="display:flex;justify-content:space-between;padding:5px 0;color:#808080;font-size:13px;"><span>Subtotal</span><span>Rs. ${order.subtotal.toLocaleString()}</span></div>
      ${order.discountAmount ? `<div style="display:flex;justify-content:space-between;padding:5px 0;color:#ef4444;font-size:13px;"><span>Discount (${order.promoCode})</span><span>-Rs. ${order.discountAmount.toLocaleString()}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:5px 0;color:#808080;font-size:13px;"><span>Shipping &amp; Handling</span><span>${order.shipping === 0 ? '<span style="color:#4ade80;font-weight:700;">FREE</span>' : `Rs. ${order.shipping.toLocaleString()}`}</span></div>
      <div style="display:flex;justify-content:space-between;padding:12px 0 0;border-top:1px solid #1e1e1e;margin-top:8px;font-size:16px;font-weight:900;"><span style="color:#ffffff;">TOTAL PAYABLE</span><span style="color:#D4AF37;">Rs. ${order.total.toLocaleString()}</span></div>
    </div>
    <p style="font-size:12px;color:#606060;text-align:center;line-height:1.6;margin:0;">Questions? Reply to this email anytime.<br/><strong style="color:#D4AF37;">Spartan Supplements</strong> &mdash; Forge Your Legend.</p>
  </div>
  <div style="background:#050505;padding:16px 32px;border-top:1px solid #1e1e1e;text-align:center;">
    <p style="margin:0;font-size:11px;color:#404040;letter-spacing:1px;">&#169; ${new Date().getFullYear()} SPARTAN SUPPLEMENTS &bull; ALL RIGHTS RESERVED</p>
  </div>
</div>`;

  try {
    await transporter.sendMail({
      from: `"Spartan Supplements" <${senderEmail}>`,
      to: order.email,
      subject: `✅ Order Confirmed #${order.orderId} — Your Quotation & Delivery Details`,
      html,
      text: `Order Confirmed! #${order.orderId}\n\nHi ${order.fullName},\nEstimated Delivery: ${fmt(earliest)} – ${fmt(latest)} (2–5 working days)\nAddress: ${order.address}, ${order.city}\nPayment: ${order.paymentMethod}\nTotal: Rs. ${order.total.toLocaleString()}\n\nItems:\n${order.items.map(i => `  - ${i.name} x${i.quantity} = Rs. ${(i.price * i.quantity).toLocaleString()}`).join('\n')}\n\nThank you for choosing Spartan Supplements!`
    });
    console.log(`[ORDER EMAIL] Customer confirmation sent to ${order.email} for order ${order.orderId}`);
    return true;
  } catch (err) {
    console.error('[ORDER EMAIL] Failed to send customer confirmation:', err);
    return false;
  }
}
