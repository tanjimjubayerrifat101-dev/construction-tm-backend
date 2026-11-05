import nodemailer from "nodemailer";
import config from "../config";

export interface TEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: TEmailOptions): Promise<void> => {
  // If SMTP is not yet configured, log for local dev instead of failing
  if (!config.smtp.host || !config.smtp.user) {
    console.warn(
      `[SMTP Warning] SMTP is not fully configured in .env. Email to: ${options.to}\nSubject: ${options.subject}`
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  await transporter.sendMail({
    from: config.smtp.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

export const createPasswordResetEmailTemplate = (
  resetUrl: string,
  userName: string
): string => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .header { background: #001833; padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; color: #f59e0b; }
        .content { padding: 30px; color: #334155; line-height: 1.6; }
        .button { display: inline-block; background-color: #f59e0b; color: #001833; text-decoration: none; padding: 14px 28px; font-weight: 700; border-radius: 8px; margin: 25px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TMYAZNA CONSTRUCTION</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We received a request to reset your password for the TMYAZNA Admin Dashboard.</p>
          <p>Please click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button" target="_blank">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #64748b; font-size: 13px;">${resetUrl}</p>
          <p>If you did not request this, please safely ignore this email. Your account remains secure.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TMYAZNA Company Limited. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};
